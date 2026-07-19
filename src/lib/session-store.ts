import { EventEmitter } from "node:events";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { generateNextScene } from "@/lib/ai";
import { derivePulse } from "@/lib/class-pulse";
import { createDemoSession, getJourneyTemplate } from "@/lib/demo-data";
import { evaluateSafety } from "@/lib/safety";
import type {
  ClassroomSession,
  Participant,
  SessionAction,
  StudentResponse,
} from "@/lib/types";

interface StoreState {
  sessions: Map<string, ClassroomSession>;
  emitters: Map<string, EventEmitter>;
}

declare global {
  var __liveLessonStore: StoreState | undefined;
}

const state: StoreState =
  globalThis.__liveLessonStore ??
  {
    sessions: new Map<string, ClassroomSession>(),
    emitters: new Map<string, EventEmitter>(),
  };

globalThis.__liveLessonStore = state;

const runtimeDirectory = join(process.cwd(), ".runtime");
const remoteCacheNamespace = "class-trek-sessions";
const remoteCacheTtlSeconds = 60 * 60 * 24 * 30;

function normalizeSession(session: ClassroomSession): ClassroomSession {
  return {
    ...session,
    journeyId: session.journeyId ?? "mars",
    journeyHistory: session.journeyHistory ?? [],
  };
}

function sessionPath(code: string): string {
  return join(runtimeDirectory, `session-${code.toUpperCase()}.json`);
}

async function readCheckpoint(code: string): Promise<ClassroomSession | null> {
  if (process.env.VERCEL) {
    try {
      const { getCache } = await import("@vercel/functions");
      const cache = getCache({ namespace: remoteCacheNamespace });
      const checkpoint = await cache.get(`session:${code.toUpperCase()}`);
      return checkpoint
        ? normalizeSession(checkpoint as ClassroomSession)
        : null;
    } catch (error) {
      console.warn("Remote session checkpoint read failed", {
        error: error instanceof Error ? error.message : "unknown-error",
      });
      return null;
    }
  }

  try {
    return normalizeSession(
      JSON.parse(readFileSync(sessionPath(code), "utf8")) as ClassroomSession,
    );
  } catch {
    return null;
  }
}

async function writeCheckpoint(session: ClassroomSession): Promise<void> {
  if (process.env.VERCEL) {
    const { getCache } = await import("@vercel/functions");
    const cache = getCache({ namespace: remoteCacheNamespace });
    await cache.set(`session:${session.code.toUpperCase()}`, session, {
      ttl: remoteCacheTtlSeconds,
      tags: [`session:${session.code.toUpperCase()}`],
      name: "classroom-session",
    });
    return;
  }

  mkdirSync(runtimeDirectory, { recursive: true });
  const target = sessionPath(session.code);
  const temporary = `${target}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(session), { encoding: "utf8" });
  renameSync(temporary, target);
}

function emitterFor(code: string): EventEmitter {
  const normalized = code.toUpperCase();
  let emitter = state.emitters.get(normalized);
  if (!emitter) {
    emitter = new EventEmitter();
    emitter.setMaxListeners(100);
    state.emitters.set(normalized, emitter);
  }
  return emitter;
}

export async function getSession(
  code: string,
): Promise<ClassroomSession | null> {
  const normalized = code.toUpperCase();
  const checkpoint = await readCheckpoint(normalized);
  const cached = state.sessions.get(normalized);
  if (checkpoint && (!cached || checkpoint.version >= cached.version)) {
    state.sessions.set(normalized, checkpoint);
    return checkpoint;
  }
  if (cached) return cached;
  if (normalized === "MARS24") {
    const demo = createDemoSession();
    state.sessions.set(normalized, demo);
    await writeCheckpoint(demo);
    return demo;
  }
  return null;
}

async function publish(
  session: ClassroomSession,
): Promise<ClassroomSession> {
  session.version += 1;
  session.updatedAt = new Date().toISOString();
  session.pulse = derivePulse(session.participants, session.responses);
  await writeCheckpoint(session);
  emitterFor(session.code).emit("update", structuredClone(session));
  return session;
}

function upsertParticipant(
  participants: Participant[],
  id: string,
  alias: string,
  avatar: string,
): void {
  const existing = participants.find((participant) => participant.id === id);
  if (existing) {
    existing.connected = true;
    existing.lastSeenAt = new Date().toISOString();
    existing.alias = alias;
    return;
  }

  participants.push({
    id,
    alias: alias.slice(0, 20),
    avatar: avatar.slice(0, 2),
    reaction: null,
    connected: true,
    lastSeenAt: new Date().toISOString(),
  });
}

export async function applyAction(
  code: string,
  action: SessionAction,
): Promise<ClassroomSession> {
  const session = await getSession(code);
  if (!session) throw new Error("Session not found");

  switch (action.type) {
    case "join":
      upsertParticipant(
        session.participants,
        action.participantId,
        action.alias,
        action.avatar,
      );
      return publish(session);
    case "heartbeat": {
      const participant = session.participants.find(
        (candidate) => candidate.id === action.participantId,
      );
      if (participant) {
        participant.connected = true;
        participant.lastSeenAt = new Date().toISOString();
      }
      return publish(session);
    }
    case "reaction": {
      const participant = session.participants.find(
        (candidate) => candidate.id === action.participantId,
      );
      if (!participant) throw new Error("Join the session first");
      participant.reaction = action.reaction;
      session.status = "collecting";
      return publish(session);
    }
    case "respond": {
      const participant = session.participants.find(
        (candidate) => candidate.id === action.participantId,
      );
      if (!participant) throw new Error("Join the session first");
      const decision = await evaluateSafety(action.text);
      const response: StudentResponse = {
        id: crypto.randomUUID(),
        participantId: participant.id,
        alias: participant.alias,
        text: action.text.slice(0, 320),
        choice: action.choice?.slice(0, 80) ?? null,
        createdAt: new Date().toISOString(),
        safety: decision.status,
        public: false,
      };
      session.responses.push(response);
      if (decision.status === "blocked") session.blockedCount += 1;
      session.status = "collecting";
      return publish(session);
    }
    case "set_status":
      session.status = action.status;
      return publish(session);
    case "generate_suggestion":
      session.status = "teacher_review";
      await publish(session);
      session.pendingSuggestion = await generateNextScene(
        structuredClone(session),
      );
      return publish(session);
    case "approve_suggestion":
      if (!session.pendingSuggestion) throw new Error("No suggestion to approve");
      if (action.expectedVersion !== session.version) {
        throw new Error("The lesson changed. Review the latest suggestion.");
      }
      session.currentScene = session.pendingSuggestion;
      session.pendingSuggestion = null;
      session.sceneIndex += 1;
      session.status = "live";
      session.responses = [];
      session.participants.forEach((participant) => {
        participant.reaction = null;
      });
      return publish(session);
    case "dismiss_suggestion":
      session.pendingSuggestion = null;
      session.status = "collecting";
      return publish(session);
    case "approve_response": {
      const response = session.responses.find(
        (candidate) => candidate.id === action.responseId,
      );
      if (!response) throw new Error("Response not found");
      if (response.safety === "blocked") {
        throw new Error("Blocked content cannot be approved");
      }
      response.safety = "safe";
      return publish(session);
    }
    case "publish_response": {
      const response = session.responses.find(
        (candidate) => candidate.id === action.responseId,
      );
      if (!response) throw new Error("Response not found");
      if (response.safety !== "safe") {
        throw new Error("Only safe responses can be shown to the class");
      }
      response.public = !response.public;
      return publish(session);
    }
    case "select_journey": {
      const journey = getJourneyTemplate(action.journeyId);
      if (!journey) throw new Error("Journey not found");

      const savedCurrent = {
        id: `${session.journeyId}-${Date.now()}`,
        journeyId: session.journeyId,
        title: session.title,
        subject: session.subject,
        learningGoal: session.learningGoal,
        sceneIndex: session.sceneIndex,
        currentScene: structuredClone(session.currentScene),
        sources: structuredClone(session.sources),
        savedAt: new Date().toISOString(),
      };
      const history = [
        savedCurrent,
        ...session.journeyHistory.filter(
          (item) => item.journeyId !== session.journeyId,
        ),
      ].slice(0, 4);
      const next = createDemoSession(journey.id, history);
      next.version = session.version;
      next.participants = session.participants.map((participant) => ({
        ...participant,
        reaction: null,
      }));
      next.responses = [];
      next.pulse = derivePulse(next.participants, next.responses);
      state.sessions.set(next.code, next);
      return publish(next);
    }
    case "resume_journey": {
      const saved = session.journeyHistory.find(
        (item) => item.id === action.historyId,
      );
      if (!saved) throw new Error("Saved journey not found");

      session.journeyHistory = session.journeyHistory.filter(
        (item) => item.id !== saved.id,
      );
      session.journeyId = saved.journeyId;
      session.title = saved.title;
      session.subject = saved.subject;
      session.learningGoal = saved.learningGoal;
      session.sceneIndex = saved.sceneIndex;
      session.currentScene = structuredClone(saved.currentScene);
      session.sources = structuredClone(saved.sources);
      session.responses = [];
      session.pendingSuggestion = null;
      session.status = "ready";
      session.participants.forEach((participant) => {
        participant.reaction = null;
      });
      return publish(session);
    }
    case "reset_demo": {
      const reset = createDemoSession("mars", session.journeyHistory);
      reset.version = session.version;
      state.sessions.set(reset.code, reset);
      return publish(reset);
    }
  }
}

export function subscribe(
  code: string,
  listener: (session: ClassroomSession) => void,
): () => void {
  const emitter = emitterFor(code);
  emitter.on("update", listener);
  return () => emitter.off("update", listener);
}
