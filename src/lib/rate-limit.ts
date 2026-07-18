import { createHash } from "node:crypto";

interface RateBucket {
  count: number;
  resetAt: number;
}

interface LocalRateLimitState {
  buckets: Map<string, RateBucket>;
}

declare global {
  var __classTrekRateLimits: LocalRateLimitState | undefined;
}

const localState: LocalRateLimitState =
  globalThis.__classTrekRateLimits ?? { buckets: new Map() };
globalThis.__classTrekRateLimits = localState;

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please wait before trying again.");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function requestFingerprint(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(address).digest("hex").slice(0, 20);
}

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const storageKey = `${key}:${windowStart}`;
  const resetAt = windowStart + windowMs;

  let bucket: RateBucket | null = null;

  if (process.env.VERCEL) {
    const { getCache } = await import("@vercel/functions");
    const cache = getCache({ namespace: "class-trek-rate-limits" });
    bucket = (await cache.get(storageKey)) as RateBucket | null;
    const next = { count: (bucket?.count ?? 0) + 1, resetAt };
    await cache.set(storageKey, next, {
      ttl: windowSeconds + 30,
      tags: ["class-trek-rate-limit"],
      name: "request-rate-limit",
    });
    bucket = next;
  } else {
    bucket = localState.buckets.get(storageKey) ?? { count: 0, resetAt };
    bucket.count += 1;
    localState.buckets.set(storageKey, bucket);

    if (localState.buckets.size > 500) {
      for (const [candidateKey, candidate] of localState.buckets) {
        if (candidate.resetAt <= now) localState.buckets.delete(candidateKey);
      }
    }
  }

  if (bucket.count > limit) {
    throw new RateLimitError(
      Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    );
  }
}
