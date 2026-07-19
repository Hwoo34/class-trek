import { z } from "zod";
import type { SessionAction } from "@/lib/types";

const shortText = z.string().trim().min(1).max(80);
const participantId = z.string().trim().min(1).max(100);

const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    participantId,
    alias: z.string().trim().min(1).max(20),
    avatar: z.string().trim().min(1).max(2),
  }),
  z.object({ type: z.literal("heartbeat"), participantId }),
  z.object({
    type: z.literal("reaction"),
    participantId,
    reaction: z.enum(["understand", "unsure", "question"]),
  }),
  z.object({
    type: z.literal("respond"),
    participantId,
    text: z.string().trim().min(1).max(320),
    choice: shortText.nullish(),
  }),
  z.object({
    type: z.literal("set_status"),
    status: z.enum([
      "ready",
      "live",
      "collecting",
      "teacher_review",
      "paused",
      "complete",
    ]),
  }),
  z.object({ type: z.literal("generate_suggestion") }),
  z.object({
    type: z.literal("approve_suggestion"),
    expectedVersion: z.number().int().positive(),
  }),
  z.object({ type: z.literal("dismiss_suggestion") }),
  z.object({ type: z.literal("approve_response"), responseId: shortText }),
  z.object({ type: z.literal("publish_response"), responseId: shortText }),
  z.object({ type: z.literal("select_journey"), journeyId: shortText }),
  z.object({ type: z.literal("resume_journey"), historyId: shortText }),
  z.object({ type: z.literal("reset_demo") }),
]);

export const teacherActionTypes = new Set<SessionAction["type"]>([
  "set_status",
  "generate_suggestion",
  "approve_suggestion",
  "dismiss_suggestion",
  "approve_response",
  "publish_response",
  "select_journey",
  "resume_journey",
  "reset_demo",
]);

export function parseSessionAction(value: unknown): SessionAction {
  return actionSchema.parse(value) as SessionAction;
}
