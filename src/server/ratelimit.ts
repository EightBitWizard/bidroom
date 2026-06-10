/**
 * Rate limiters for the auth endpoints. In-memory (per-isolate) for local development and
 * tests; KV-backed (durable across isolates) for production, keyed by email and IP. Ported
 * from moola (ADR 0003): the production limiter must be KV-backed, never in-memory only.
 * `now` is injectable for tests.
 */
export interface RateLimiter {
  /** Returns true if the call is allowed (under the limit), false if it should be rejected. */
  check(key: string): Promise<boolean>;
}

export class InMemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private max: number,
    private windowMs: number,
    private now: () => number = () => Date.now(),
  ) {}

  async check(key: string): Promise<boolean> {
    const now = this.now();
    const cutoff = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > cutoff);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

/** The minimal Cloudflare KV surface the limiter needs (mockable in tests). */
export interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

/**
 * KV-backed fixed-window limiter: counts per (key, window index) with a TTL of two windows.
 * Approximate by design - the read-modify-write is not atomic across isolates (KV has no
 * compare-and-swap) and a fixed window admits up to 2x max around a window boundary; both
 * are acceptable for abuse limiting, and it is durable across isolates, unlike the in-memory
 * limiter. Wired with the RATE_LIMIT_KV binding at provisioning (docs/OPERATOR_TODO.md).
 */
export class KVRateLimiter implements RateLimiter {
  constructor(
    private kv: KVLike,
    private max: number,
    private windowMs: number,
    private now: () => number = () => Date.now(),
  ) {}

  async check(key: string): Promise<boolean> {
    const windowIndex = Math.floor(this.now() / this.windowMs);
    const bucket = `rl:${key}:${windowIndex}`;
    const current = Number((await this.kv.get(bucket)) ?? "0");
    if (!Number.isFinite(current) || current >= this.max) return false;
    await this.kv.put(bucket, String(current + 1), {
      expirationTtl: Math.max(60, Math.ceil((this.windowMs / 1000) * 2)),
    });
    return true;
  }
}
