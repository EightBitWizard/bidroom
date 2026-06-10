import { beforeEach, describe, expect, it } from "vitest";
import { CapturingEmailSender } from "@/server/email";
import { InMemoryRateLimiter } from "@/server/ratelimit";
import { bumpSessionVersion } from "@/server/repositories/accounts";
import { createTestDb } from "@/server/repositories/testdb";
import type { Db } from "@/server/db/client";
import {
  isValidEmail,
  requestMagicLink,
  resolveSession,
  verifyMagicLink,
  type AuthDeps,
} from "./service";

const SECRET = "x".repeat(40);

function makeDeps(db: Db, overrides: Partial<AuthDeps> = {}) {
  const email = new CapturingEmailSender();
  const deps: AuthDeps = {
    db,
    email,
    rateLimiter: new InMemoryRateLimiter(5, 60_000, () => 0),
    sessionSecret: SECRET,
    baseUrl: "https://app.bidroom.example",
    now: () => new Date("2026-06-10T12:00:00.000Z"),
    ...overrides,
  };
  return { deps, email };
}

function tokenFromUrl(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

describe("auth service", () => {
  let db: Db;
  beforeEach(() => {
    db = createTestDb();
  });

  it("validates email shape and length", () => {
    expect(isValidEmail("a@b.ch")).toBe(true);
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail(`${"a".repeat(250)}@b.ch`)).toBe(false);
  });

  it("issues a magic link and emails it (same response regardless of account existence)", async () => {
    const { deps, email } = makeDeps(db);
    expect(await requestMagicLink(deps, "Lina@x.ch", "en")).toEqual({ ok: true });
    expect(email.sent).toHaveLength(1);
    expect(email.sent[0]?.email).toBe("lina@x.ch");
    expect(email.sent[0]?.url).toContain("/api/auth/callback?token=");
  });

  it("rejects an invalid email and a rate-limited request", async () => {
    const { deps } = makeDeps(db, {
      rateLimiter: new InMemoryRateLimiter(1, 60_000, () => 0),
    });
    expect(await requestMagicLink(deps, "bad", "en")).toEqual({
      ok: false,
      reason: "invalid-email",
    });
    expect(await requestMagicLink(deps, "a@x.ch", "en")).toEqual({ ok: true });
    expect(await requestMagicLink(deps, "a@x.ch", "en")).toEqual({
      ok: false,
      reason: "rate-limited",
    });
  });

  it("verifies a token once and returns a session that resolves to the account", async () => {
    const { deps, email } = makeDeps(db);
    await requestMagicLink(deps, "a@x.ch", "en");
    const token = tokenFromUrl(email.sent[0]!.url);

    const session = await verifyMagicLink(deps, token);
    expect(session).toBeTruthy();
    const resolved = await resolveSession(deps, session);
    expect(resolved).toBeTruthy();

    // Single-use: the same token cannot be redeemed again.
    expect(await verifyMagicLink(deps, token)).toBeNull();
  });

  it("revokes a session when the account's session_version is bumped", async () => {
    const { deps, email } = makeDeps(db);
    await requestMagicLink(deps, "a@x.ch", "en");
    const session = await verifyMagicLink(deps, tokenFromUrl(email.sent[0]!.url));
    const resolved = await resolveSession(deps, session);
    expect(resolved).toBeTruthy();

    await bumpSessionVersion(deps.db, resolved!.accountId);
    // The still-signed cookie no longer matches the stored version, so it grants nothing.
    expect(await resolveSession(deps, session)).toBeNull();
  });

  it("resolves no session for an absent or invalid token", async () => {
    const { deps } = makeDeps(db);
    expect(await resolveSession(deps, null)).toBeNull();
    expect(await resolveSession(deps, "garbage.token")).toBeNull();
  });
});
