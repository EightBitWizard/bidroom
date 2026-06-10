import { beforeEach, describe, expect, it } from "vitest";
import { AuthzError } from "@/server/authz";
import type { Db } from "@/server/db/client";
import { findOrCreateAccountByEmail } from "@/server/repositories/accounts";
import { getMembership } from "@/server/repositories/workspaces";
import { createTestDb } from "@/server/repositories/testdb";
import {
  acceptInvitationForAccount,
  createWorkspaceForAccount,
  inviteToWorkspace,
  listWorkspaces,
} from "./service";

const T0 = "2026-06-10T12:00:00.000Z";
const SOON = "2026-06-10T13:00:00.000Z";

describe("workspace service authorization", () => {
  let db: Db;
  beforeEach(() => {
    db = createTestDb();
  });

  async function setup() {
    const owner = await findOrCreateAccountByEmail(db, "owner@x.ch", T0);
    const outsider = await findOrCreateAccountByEmail(db, "outsider@x.ch", T0);
    const ws = await createWorkspaceForAccount(db, {
      accountId: owner.id,
      name: "Acme",
      workingLanguage: "en",
      nowIso: T0,
    });
    return { owner, outsider, ws };
  }

  it("creates a workspace and lists it for the owner", async () => {
    const { owner, ws } = await setup();
    const list = await listWorkspaces(db, owner.id);
    expect(list.map((w) => w.id)).toContain(ws.id);
  });

  it("lets an owner invite", async () => {
    const { owner, ws } = await setup();
    const invite = await inviteToWorkspace(db, {
      accountId: owner.id,
      workspaceId: ws.id,
      email: "new@x.ch",
      role: "member",
      tokenHash: "h1",
      expiresAt: SOON,
      nowIso: T0,
    });
    expect(invite.workspaceId).toBe(ws.id);
  });

  it("denies a non-member with not_found (does not reveal the workspace)", async () => {
    const { outsider, ws } = await setup();
    await expect(
      inviteToWorkspace(db, {
        accountId: outsider.id,
        workspaceId: ws.id,
        email: "new@x.ch",
        role: "member",
        tokenHash: "h1",
        expiresAt: SOON,
        nowIso: T0,
      }),
    ).rejects.toMatchObject({ kind: "not_found" });
  });

  it("denies a non-owner member with forbidden", async () => {
    const { owner, ws } = await setup();
    const member = await findOrCreateAccountByEmail(db, "member@x.ch", T0);
    // Invite and accept as a plain member.
    await inviteToWorkspace(db, {
      accountId: owner.id,
      workspaceId: ws.id,
      email: "member@x.ch",
      role: "member",
      tokenHash: "h-member",
      expiresAt: SOON,
      nowIso: T0,
    });
    await acceptInvitationForAccount(db, {
      tokenHash: "h-member",
      accountId: member.id,
      nowIso: T0,
    });
    expect(await getMembership(db, ws.id, member.id)).not.toBeNull();

    // A member cannot invite.
    await expect(
      inviteToWorkspace(db, {
        accountId: member.id,
        workspaceId: ws.id,
        email: "another@x.ch",
        role: "member",
        tokenHash: "h2",
        expiresAt: SOON,
        nowIso: T0,
      }),
    ).rejects.toMatchObject({ kind: "forbidden" });
  });

  it("throws AuthzError (not a generic error) so routes can map status codes", async () => {
    const { outsider, ws } = await setup();
    await expect(
      inviteToWorkspace(db, {
        accountId: outsider.id,
        workspaceId: ws.id,
        email: "new@x.ch",
        role: "member",
        tokenHash: "h1",
        expiresAt: SOON,
        nowIso: T0,
      }),
    ).rejects.toBeInstanceOf(AuthzError);
  });

  it("accepts an invitation bound to the account email and grants the row's role", async () => {
    const { owner, ws } = await setup();
    const invitee = await findOrCreateAccountByEmail(db, "invitee@x.ch", T0);
    await inviteToWorkspace(db, {
      accountId: owner.id,
      workspaceId: ws.id,
      email: "invitee@x.ch",
      role: "member",
      tokenHash: "h-inv",
      expiresAt: SOON,
      nowIso: T0,
    });
    const result = await acceptInvitationForAccount(db, {
      tokenHash: "h-inv",
      accountId: invitee.id,
      nowIso: T0,
    });
    expect(result).toEqual({ ok: true, workspaceId: ws.id, role: "member" });
  });
});
