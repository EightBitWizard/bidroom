import { beforeEach, describe, expect, it } from "vitest";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { findOrCreateAccountByEmail } from "./accounts";
import {
  acceptInvitation,
  createInvitation,
  createWorkspace,
  getMembership,
  listMembers,
  listWorkspacesForAccount,
} from "./workspaces";
import { createTestDb } from "./testdb";

const T0 = "2026-06-10T12:00:00.000Z";
const SOON = "2026-06-10T13:00:00.000Z";

describe("workspaces repository", () => {
  let db: Db;
  beforeEach(() => {
    db = createTestDb();
  });

  it("creates a workspace with the creator as owner", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const ws = await createWorkspace(db, {
      name: "Acme AG",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    expect(ws.name).toBe("Acme AG");
    const membership = await getMembership(db, ws.id, owner.id);
    expect(membership?.role).toBe("owner");
    const list = await listWorkspacesForAccount(db, owner.id);
    expect(list).toHaveLength(1);
    expect(list[0]?.role).toBe("owner");
  });

  it("accepts an email-bound invitation and grants the row's role", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const invitee = await findOrCreateAccountByEmail(db, "member@x.ch", T0);
    const ws = await createWorkspace(db, {
      name: "Acme",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    const ctx: WorkspaceContext = { accountId: owner.id, workspaceId: ws.id, role: "owner" };
    await createInvitation(db, ctx, {
      email: "member@x.ch",
      role: "member",
      tokenHash: "inv-hash",
      expiresAt: SOON,
      nowIso: T0,
    });

    const result = await acceptInvitation(db, {
      tokenHash: "inv-hash",
      accountId: invitee.id,
      accountEmail: "member@x.ch",
      nowIso: T0,
    });
    expect(result).toEqual({ ok: true, workspaceId: ws.id, role: "member" });
    const membership = await getMembership(db, ws.id, invitee.id);
    expect(membership?.role).toBe("member");
  });

  it("rejects an invitation accepted by a different email (email-bound)", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const intruder = await findOrCreateAccountByEmail(db, "intruder@x.ch", T0);
    const ws = await createWorkspace(db, {
      name: "Acme",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    const ctx: WorkspaceContext = { accountId: owner.id, workspaceId: ws.id, role: "owner" };
    await createInvitation(db, ctx, {
      email: "member@x.ch",
      role: "member",
      tokenHash: "inv-hash",
      expiresAt: SOON,
      nowIso: T0,
    });

    const result = await acceptInvitation(db, {
      tokenHash: "inv-hash",
      accountId: intruder.id,
      accountEmail: "intruder@x.ch",
      nowIso: T0,
    });
    expect(result).toEqual({ ok: false, reason: "email_mismatch" });
    expect(await getMembership(db, ws.id, intruder.id)).toBeNull();
  });

  it("consumes an invitation only once (single-use)", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const invitee = await findOrCreateAccountByEmail(db, "member@x.ch", T0);
    const ws = await createWorkspace(db, {
      name: "Acme",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    const ctx: WorkspaceContext = { accountId: owner.id, workspaceId: ws.id, role: "owner" };
    await createInvitation(db, ctx, {
      email: "member@x.ch",
      role: "member",
      tokenHash: "inv-hash",
      expiresAt: SOON,
      nowIso: T0,
    });
    const first = await acceptInvitation(db, {
      tokenHash: "inv-hash",
      accountId: invitee.id,
      accountEmail: "member@x.ch",
      nowIso: T0,
    });
    expect(first.ok).toBe(true);
    const second = await acceptInvitation(db, {
      tokenHash: "inv-hash",
      accountId: invitee.id,
      accountEmail: "member@x.ch",
      nowIso: T0,
    });
    expect(second).toEqual({ ok: false, reason: "used" });
  });

  it("rejects an expired invitation without consuming it", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const invitee = await findOrCreateAccountByEmail(db, "member@x.ch", T0);
    const ws = await createWorkspace(db, {
      name: "Acme",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    const ctx: WorkspaceContext = { accountId: owner.id, workspaceId: ws.id, role: "owner" };
    await createInvitation(db, ctx, {
      email: "member@x.ch",
      role: "member",
      tokenHash: "inv-hash",
      expiresAt: T0,
      nowIso: T0,
    });
    const result = await acceptInvitation(db, {
      tokenHash: "inv-hash",
      accountId: invitee.id,
      accountEmail: "member@x.ch",
      nowIso: SOON,
    });
    expect(result).toEqual({ ok: false, reason: "expired" });
  });

  it("scopes listMembers to the context workspace", async () => {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const ws1 = await createWorkspace(db, {
      name: "One",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    await createWorkspace(db, {
      name: "Two",
      workingLanguage: "en",
      ownerAccountId: owner.id,
      nowIso: T0,
    });
    const ctx: WorkspaceContext = { accountId: owner.id, workspaceId: ws1.id, role: "owner" };
    const members = await listMembers(db, ctx);
    expect(members).toHaveLength(1);
    expect(members[0]?.workspaceId).toBe(ws1.id);
  });
});
