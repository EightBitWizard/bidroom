import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/server/db/client";
import {
  bumpSessionVersion,
  consumeAuthToken,
  createAuthToken,
  deleteAccount,
  findOrCreateAccountByEmail,
  getAccount,
  pruneAuthTokens,
} from "./accounts";
import { createTestDb } from "./testdb";

const T0 = "2026-06-10T12:00:00.000Z";
const LATER = "2026-06-10T12:30:00.000Z";

describe("accounts repository", () => {
  let db: Db;
  beforeEach(() => {
    db = createTestDb();
  });

  it("creates an account once and returns the same row by email", async () => {
    const a = await findOrCreateAccountByEmail(db, "Lina@Company.CH", T0);
    expect(a.email).toBe("lina@company.ch");
    expect(a.sessionVersion).toBe(1);
    const b = await findOrCreateAccountByEmail(db, "lina@company.ch", LATER);
    expect(b.id).toBe(a.id);
  });

  it("bumps session_version to revoke sessions", async () => {
    const a = await findOrCreateAccountByEmail(db, "a@x.ch", T0);
    await bumpSessionVersion(db, a.id);
    const reloaded = await getAccount(db, a.id);
    expect(reloaded?.sessionVersion).toBe(2);
  });

  it("consumes a token once (single-use, replay-safe)", async () => {
    const a = await findOrCreateAccountByEmail(db, "a@x.ch", T0);
    await createAuthToken(db, "hash-1", a.id, LATER);
    expect(await consumeAuthToken(db, "hash-1", T0)).toBe(a.id);
    expect(await consumeAuthToken(db, "hash-1", T0)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const a = await findOrCreateAccountByEmail(db, "a@x.ch", T0);
    await createAuthToken(db, "hash-exp", a.id, T0);
    expect(await consumeAuthToken(db, "hash-exp", LATER)).toBeNull();
  });

  it("prunes used and expired tokens and caps to the newest", async () => {
    const a = await findOrCreateAccountByEmail(db, "a@x.ch", T0);
    await createAuthToken(db, "expired", a.id, "2026-06-10T11:00:00.000Z");
    await createAuthToken(db, "keep-1", a.id, "2026-06-10T13:00:00.000Z");
    await createAuthToken(db, "keep-2", a.id, "2026-06-10T14:00:00.000Z");
    await createAuthToken(db, "keep-3", a.id, "2026-06-10T15:00:00.000Z");
    await pruneAuthTokens(db, a.id, 2, T0);
    // expired dropped; only the 2 newest remain consumable.
    expect(await consumeAuthToken(db, "expired", T0)).toBeNull();
    expect(await consumeAuthToken(db, "keep-1", T0)).toBeNull();
    expect(await consumeAuthToken(db, "keep-3", T0)).toBe(a.id);
    expect(await consumeAuthToken(db, "keep-2", T0)).toBe(a.id);
  });

  it("deletes an account and cascades its tokens", async () => {
    const a = await findOrCreateAccountByEmail(db, "a@x.ch", T0);
    await createAuthToken(db, "hash-1", a.id, LATER);
    await deleteAccount(db, a.id);
    expect(await getAccount(db, a.id)).toBeNull();
    expect(await consumeAuthToken(db, "hash-1", T0)).toBeNull();
  });
});
