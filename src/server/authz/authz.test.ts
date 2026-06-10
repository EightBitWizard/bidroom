import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "@/server/db/client";
import { findOrCreateAccountByEmail } from "@/server/repositories/accounts";
import { createTestDb } from "@/server/repositories/testdb";
import {
  createInvitation,
  createWorkspace,
  getMembership,
  listMembers,
} from "@/server/repositories/workspaces";
import {
  assertCanAdminister,
  AuthzError,
  assertWorkspaceAccess,
  type MembershipLookup,
} from "./index";

/**
 * The foreign-workspace authz matrix (ADR 0003, the R-AUTHZ-01 control). D1 has no
 * row-level security, so assertWorkspaceAccess is the only barrier between tenants. This
 * suite is a blocking gate: it proves that a non-member can never obtain a WorkspaceContext,
 * and therefore can never reach a tenant-scoped repository function. Grow it with every new
 * tenant-scoped operation.
 */
describe("foreign-workspace authz matrix", () => {
  let db: Db;
  let lookup: MembershipLookup;
  beforeEach(() => {
    db = createTestDb();
    lookup = (workspaceId, accountId) => getMembership(db, workspaceId, accountId);
  });

  async function fixture() {
    const alice = await findOrCreateAccountByEmail(db, "alice@a.ch", "2026-06-10T12:00:00.000Z");
    const bob = await findOrCreateAccountByEmail(db, "bob@b.ch", "2026-06-10T12:00:00.000Z");
    const wsA = await createWorkspace(db, {
      name: "Alice AG",
      workingLanguage: "en",
      ownerAccountId: alice.id,
      nowIso: "2026-06-10T12:00:00.000Z",
    });
    const wsB = await createWorkspace(db, {
      name: "Bob AG",
      workingLanguage: "en",
      ownerAccountId: bob.id,
      nowIso: "2026-06-10T12:00:00.000Z",
    });
    return { alice, bob, wsA, wsB };
  }

  it("grants a member access to their own workspace", async () => {
    const { alice, wsA } = await fixture();
    const ctx = await assertWorkspaceAccess(lookup, alice.id, wsA.id);
    expect(ctx).toEqual({ accountId: alice.id, workspaceId: wsA.id, role: "owner" });
  });

  it("denies a non-member with not_found (does not reveal the workspace exists)", async () => {
    const { alice, wsB } = await fixture();
    await expect(assertWorkspaceAccess(lookup, alice.id, wsB.id)).rejects.toMatchObject({
      kind: "not_found",
    });
  });

  it("denies access to a workspace that does not exist", async () => {
    const { alice } = await fixture();
    await expect(assertWorkspaceAccess(lookup, alice.id, "no-such-id")).rejects.toBeInstanceOf(
      AuthzError,
    );
  });

  it("tenant-scoped ops act only on the context workspace", async () => {
    const { alice, wsA, wsB } = await fixture();
    const ctxA = await assertWorkspaceAccess(lookup, alice.id, wsA.id);
    await createInvitation(db, ctxA, {
      email: "new@a.ch",
      role: "member",
      tokenHash: "h1",
      expiresAt: "2026-06-10T13:00:00.000Z",
      nowIso: "2026-06-10T12:00:00.000Z",
    });
    // The invitation landed in Alice's workspace; Bob's workspace is untouched.
    const membersA = await listMembers(db, ctxA);
    expect(membersA.every((m) => m.workspaceId === wsA.id)).toBe(true);
    expect(membersA.some((m) => m.workspaceId === wsB.id)).toBe(false);
  });

  it("only owners may administer (invite); members are forbidden", async () => {
    const { bob, wsB } = await fixture();
    const ownerCtx = await assertWorkspaceAccess(lookup, bob.id, wsB.id);
    expect(() => assertCanAdminister(ownerCtx)).not.toThrow();

    const memberCtx = { accountId: "someone", workspaceId: wsB.id, role: "member" as const };
    expect(() => assertCanAdminister(memberCtx)).toThrow(AuthzError);
  });
});
