import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter, KVRateLimiter, type KVLike } from "./ratelimit";

function mapKv(): KVLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    async get(key) {
      return data.get(key) ?? null;
    },
    async put(key, value) {
      data.set(key, value);
    },
  };
}

describe("InMemoryRateLimiter", () => {
  it("allows up to max within the window then rejects", async () => {
    let now = 0;
    const rl = new InMemoryRateLimiter(2, 1000, () => now);
    expect(await rl.check("k")).toBe(true);
    expect(await rl.check("k")).toBe(true);
    expect(await rl.check("k")).toBe(false);
    now = 1001;
    expect(await rl.check("k")).toBe(true);
  });

  it("keys are independent", async () => {
    const rl = new InMemoryRateLimiter(1, 1000, () => 0);
    expect(await rl.check("a")).toBe(true);
    expect(await rl.check("b")).toBe(true);
    expect(await rl.check("a")).toBe(false);
  });
});

describe("KVRateLimiter", () => {
  it("counts per fixed window and rejects over max", async () => {
    let now = 0;
    const kv = mapKv();
    const rl = new KVRateLimiter(kv, 2, 1000, () => now);
    expect(await rl.check("k")).toBe(true);
    expect(await rl.check("k")).toBe(true);
    expect(await rl.check("k")).toBe(false);
    // Next window resets the count.
    now = 1000;
    expect(await rl.check("k")).toBe(true);
  });

  it("is durable across instances sharing the same KV", async () => {
    const kv = mapKv();
    const a = new KVRateLimiter(kv, 1, 1000, () => 0);
    const b = new KVRateLimiter(kv, 1, 1000, () => 0);
    expect(await a.check("k")).toBe(true);
    // A different instance (simulating another isolate) sees the durable count.
    expect(await b.check("k")).toBe(false);
  });
});
