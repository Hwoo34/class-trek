export type SessionStatus =
  | "ready"
  | "live"
  | "collecting"
  | "teacher_review"
  | "paused"
  | "complete";

export type Reaction = "understand" | "unsure" | "question";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  excerpt: string;
}

export interface Scene {
  id: string;
  eyebrow: string;
  title: string;
  narration: string;
  visual: "mars" | "ice" | "energy" | "ocean" | "rainforest";
  sourceIds: string[];
  prompt: string;
  choices: string[];
}

export interface Participant {
  id: string;
  alias: string;
  avatar: string;
  reaction: Reaction | null;
  connected: boolean;
  lastSeenAt: string;
}

export interface StudentResponse {
  id: string;
  participantId: string;
  alias: string;
  text: string;
  choice: string | null;
  createdAt: string;
  safety: "safe" | "review" | "blocked";
  public: boolean;
}

export interface PulseCluster {
  label: string;
  count: number;
  tone: "cyan" | "amber" | "violet";
}

export interface ClassPulse {
  responseCount: number;
  understand: number;
  unsure: number;
  question: number;
  clusters: PulseCluster[];
}

export interface SuggestedScene extends Scene {
  teacherSummary: string;
  reason: string;
  safetyNote: string;
  generatedBy: "gpt-5.6" | "lm-studio" | "fallback";
}

export interface JourneyHistoryItem {
  id: string;
  journeyId: string;
  title: string;
  subject: string;
  learningGoal: string;
  sceneIndex: number;
  currentScene: Scene;
  sources: Source[];
  savedAt: string;
}

export interface ClassroomSession {
  code: string;
  journeyId: string;
  title: string;
  subject: string;
  gradeBand: string;
  learningGoal: string;
  status: SessionStatus;
  version: number;
  currentScene: Scene;
  sceneIndex: number;
  sources: Source[];
  participants: Participant[];
  responses: StudentResponse[];
  pulse: ClassPulse;
  pendingSuggestion: SuggestedScene | null;
  journeyHistory: JourneyHistoryItem[];
  blockedCount: number;
  updatedAt: string;
}

export type SessionAction =
  | { type: "join"; participantId: string; alias: string; avatar: string }
  | { type: "heartbeat"; participantId: string }
  | { type: "reaction"; participantId: string; reaction: Reaction }
  | {
      type: "respond";
      participantId: string;
      text: string;
      choice?: string | null;
    }
  | { type: "set_status"; status: SessionStatus }
  | { type: "generate_suggestion" }
  | { type: "approve_suggestion"; expectedVersion: number }
  | { type: "dismiss_suggestion" }
  | { type: "approve_response"; responseId: string }
  | { type: "publish_response"; responseId: string }
  | {
      type: "select_journey";
      journeyId: string;
      customTitle?: string;
      customLearningGoal?: string;
    }
  | { type: "resume_journey"; historyId: string }
  | { type: "reset_demo" };
