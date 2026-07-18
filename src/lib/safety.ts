import OpenAI from "openai";
import { shouldUseOpenAIModeration } from "@/lib/ai-provider";

export interface SafetyDecision {
  status: "safe" | "review" | "blocked";
  categories: string[];
  explanation: string;
}

const blockedPatterns: Array<[RegExp, string]> = [
  [/\b(?:how to|steps to|instructions for)\b.{0,35}\b(?:kill|hurt|attack)\b/i, "violence-instructions"],
  [/\b(?:buy|sell|make|cook)\b.{0,25}\b(?:meth|cocaine|heroin)\b/i, "illegal-drugs"],
  [/\b(?:nude|porn|explicit sex)\b/i, "sexual-content"],
  [/\b(?:suicide method|how to self harm)\b/i, "self-harm-instructions"],
];

const reviewPatterns: Array<[RegExp, string]> = [
  [/\b(?:guns?|weapon|murder|blood|drug|suicide|self-harm)\b/i, "sensitive-topic"],
  [/\b(?:address|phone number|email|full name)\b/i, "personal-information"],
  [/\b(?:idiot|stupid|hate you|loser)\b/i, "bullying"],
];

export function localSafetyCheck(text: string): SafetyDecision {
  const normalized = text.trim();
  if (!normalized) {
    return {
      status: "safe",
      categories: [],
      explanation: "Empty content is not published.",
    };
  }

  const blocked = blockedPatterns
    .filter(([pattern]) => pattern.test(normalized))
    .map(([, category]) => category);
  if (blocked.length > 0) {
    return {
      status: "blocked",
      categories: blocked,
      explanation: "The response requests or contains age-inappropriate harmful content.",
    };
  }

  const review = reviewPatterns
    .filter(([pattern]) => pattern.test(normalized))
    .map(([, category]) => category);
  if (review.length > 0) {
    return {
      status: "review",
      categories: review,
      explanation: "A teacher should review this sensitive response before class display.",
    };
  }

  return {
    status: "safe",
    categories: [],
    explanation: "No local K–12 guardrail was triggered.",
  };
}

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey && shouldUseOpenAIModeration()
    ? new OpenAI({ apiKey, maxRetries: 0, timeout: 10_000 })
    : null;
}

export async function evaluateSafety(text: string): Promise<SafetyDecision> {
  const local = localSafetyCheck(text);
  if (local.status !== "safe") return local;

  const client = getOpenAI();
  if (!client) return local;

  try {
    const result = await client.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });
    const moderation = result.results[0];
    if (!moderation?.flagged) return local;

    const categories = Object.entries(moderation.categories)
      .filter(([, value]) => value)
      .map(([key]) => key);
    return {
      status: "blocked",
      categories,
      explanation: "OpenAI moderation flagged this content before classroom use.",
    };
  } catch {
    return {
      status: "review",
      categories: ["moderation-unavailable"],
      explanation: "Automatic moderation was unavailable, so teacher review is required.",
    };
  }
}
