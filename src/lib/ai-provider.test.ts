import { describe, expect, it } from "vitest";
import { resolveAiProvider } from "@/lib/ai-provider";

describe("AI provider selection", () => {
  it("never spends API credits by default in tests", () => {
    expect(
      resolveAiProvider({
        NODE_ENV: "test",
        OPENAI_API_KEY: "present-but-must-not-be-used",
      }),
    ).toBe("fallback");
  });

  it("uses LM Studio only when explicitly selected", () => {
    expect(
      resolveAiProvider({
        AI_PROVIDER: "lmstudio",
        NODE_ENV: "test",
        OPENAI_API_KEY: "present-but-must-not-be-used",
      }),
    ).toBe("lmstudio");
  });

  it("selects OpenAI in the running app when a key is available", () => {
    expect(
      resolveAiProvider({
        NODE_ENV: "production",
        OPENAI_API_KEY: "configured",
      }),
    ).toBe("openai");
  });

  it("falls back safely when no provider is configured", () => {
    expect(resolveAiProvider({ NODE_ENV: "production" })).toBe("fallback");
  });
});
