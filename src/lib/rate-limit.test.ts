import { describe, expect, it } from "vitest";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

describe("request rate limits", () => {
  it("rejects activity above the configured local window", async () => {
    const key = `test:${crypto.randomUUID()}`;

    await expect(enforceRateLimit(key, 2, 60)).resolves.toBeUndefined();
    await expect(enforceRateLimit(key, 2, 60)).resolves.toBeUndefined();
    await expect(enforceRateLimit(key, 2, 60)).rejects.toBeInstanceOf(
      RateLimitError,
    );
  });
});
