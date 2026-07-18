import OpenAI from "openai";

export type AiProvider = "openai" | "lmstudio" | "fallback";

interface ProviderEnvironment {
  AI_PROVIDER?: string;
  LM_STUDIO_API_KEY?: string;
  LM_STUDIO_BASE_URL?: string;
  LM_STUDIO_MODEL?: string;
  NODE_ENV?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

export interface GenerationProvider {
  client: OpenAI;
  model: string;
  provider: Exclude<AiProvider, "fallback">;
}

export function resolveAiProvider(
  environment: ProviderEnvironment = process.env,
): AiProvider {
  const configured = environment.AI_PROVIDER?.toLowerCase();
  if (
    configured === "openai" ||
    configured === "lmstudio" ||
    configured === "fallback"
  ) {
    return configured;
  }

  // Unit tests must never spend API credits because a developer happens to
  // have a key in their shell or .env.local.
  if (environment.NODE_ENV === "test") return "fallback";
  return environment.OPENAI_API_KEY ? "openai" : "fallback";
}

export function getGenerationProvider(): GenerationProvider | null {
  const provider = resolveAiProvider();

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        maxRetries: 0,
        timeout: 20_000,
      }),
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-terra",
      provider,
    };
  }

  if (provider === "lmstudio") {
    return {
      client: new OpenAI({
        apiKey: process.env.LM_STUDIO_API_KEY ?? "lm-studio",
        baseURL:
          process.env.LM_STUDIO_BASE_URL ?? "http://127.0.0.1:1234/v1",
        maxRetries: 0,
        timeout: 90_000,
      }),
      model: process.env.LM_STUDIO_MODEL ?? "google/gemma-4-e4b",
      provider,
    };
  }

  return null;
}

export function shouldUseOpenAIModeration(): boolean {
  const configured = process.env.MODERATION_PROVIDER?.toLowerCase();
  if (configured === "local") return false;
  if (configured === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return resolveAiProvider() === "openai" && Boolean(process.env.OPENAI_API_KEY);
}
