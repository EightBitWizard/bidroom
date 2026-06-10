import { and, eq, isNull } from "drizzle-orm";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { invitations, memberships, workspaces } from "@/server/db/schema";
import type { Role } from "@/shared/roles";
import type { Invitation, Membership, Workspace, WorkspaceWithRole } from "./types";

/**
 * Workspace repository: the multi-tenant surface (ADR 0003). Tenant-scoped reads and writes
 * take a verified WorkspaceContext and only ever touch `ctx.workspaceId`, so a foreign
 * workspace cannot be addressed. The context is produced by assertWorkspaceAccess, which
 * verifies membership; see authz/index.ts and the foreign-workspace authz matrix test.
 */

export async function createWorkspace(
  db: Db,
  input: { name: string; workingLanguage: string; ownerAccountId: string; nowIso: string },
): Promise<Workspace> {
  const id = crypto.randomUUID();
  const inserted = await db
    .insert(workspaces)
    .values({
      id,
      name: input.name,
      workingLanguage: input.workingLanguage,
      createdBy: input.ownerAccountId,
      createdAt: input.nowIso,
    })
    .returning();
  await db.insert(memberships).values({
    workspaceId: id,
    accountId: input.ownerAccountId,
    role: "owner",
    invitedBy: null,
    createdAt: input.nowIso,
  });
  return inserted[0]!;
}

/** Workspaces the account belongs to, with the account's role in each. Account-scoped. */
export async function listWorkspacesForAccount(
  db: Db,
  accountId: string,
): Promise<WorkspaceWithRole[]> {
  const rows = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      workingLanguage: workspaces.workingLanguage,
      createdBy: workspaces.createdBy,
      createdAt: workspaces.createdAt,
      role: memberships.role,
    })
    .from(workspaces)
    .innerJoin(memberships, eq(memberships.workspaceId, workspaces.id))
    .where(eq(memberships.accountId, accountId));
  return rows.map((r) => ({ ...r, role: r.role as Role }));
}

/** The account's membership in a workspace, or null. Used by the authz module. */
export async function getMembership(
  db: Db,
  workspaceId: string,
  accountId: string,
): Promise<Membership | null> {
  const rows = await db
    .select()
    .from(memberships)
    .where(and(eq(memberships.workspaceId, workspaceId), eq(memberships.accountId, accountId)))
    .limit(1);
  const row = rows[0];
  return row ? { ...row, role: row.role as Role } : null;
}

/** Members of the context's workspace. Tenant-scoped: only ever reads ctx.workspaceId. */
export async function listMembers(db: Db, ctx: WorkspaceContext): Promise<Membership[]> {
  const rows = await db
    .select()
    .from(memberships)
    .where(eq(memberships.workspaceId, ctx.workspaceId));
  return rows.map((r) => ({ ...r, role: r.role as Role }));
}

/**
 * Create an invitation into the context's workspace. Tenant-scoped: the workspace is taken
 * from ctx, never from caller input. The caller (route) must enforce that ctx.role may
 * administer the workspace; the role granted is stored on the row and looked up at accept
 * time, never trusted from the invitee.
 */
export async function createInvitation(
  db: Db,
  ctx: WorkspaceContext,
  input: { email: string; role: Role; tokenHash: string; expiresAt: string; nowIso: string },
): Promise<Invitation> {
  const inserted = await db
    .insert(invitations)
    .values({
      id: crypto.randomUUID(),
      workspaceId: ctx.workspaceId,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      invitedBy: ctx.accountId,
      createdAt: input.nowIso,
    })
    .returning();
  const row = inserted[0]!;
  return { ...row, role: row.role as Role };
}

export type AcceptInvitationResult =
  | { ok: true; workspaceId: string; role: Role }
  | { ok: false; reason: "invalid" | "used" | "expired" | "email_mismatch" };

/**
 * Accept an invitation. Email-bound (the session account's email must match the invited
 * email), atomic single-use (a guarded UPDATE consumes it), and the granted role comes from
 * the invitation row, never from the invitee. This is the R-INVITE-02 control.
 */
export async function acceptInvitation(
  db: Db,
  input: { tokenHash: string; accountId: string; accountEmail: string; nowIso: string },
): Promise<AcceptInvitationResult> {
  const rows = await db
    .select()
    .from(invitations)
    .where(eq(invitations.tokenHash, input.tokenHash))
    .limit(1);
  const invite = rows[0];
  if (!invite) return { ok: false, reason: "invalid" };
  if (invite.acceptedAt) return { ok: false, reason: "used" };
  if (invite.expiresAt <= input.nowIso) return { ok: false, reason: "expired" };
  if (invite.email.toLowerCase() !== input.accountEmail.trim().toLowerCase()) {
    return { ok: false, reason: "email_mismatch" };
  }

  // Atomic single-use consume: only the first accept wins, even under a race.
  const consumed = await db
    .update(invitations)
    .set({ acceptedAt: input.nowIso })
    .where(and(eq(invitations.tokenHash, input.tokenHash), isNull(invitations.acceptedAt)))
    .returning({ id: invitations.id });
  if (!consumed[0]) return { ok: false, reason: "used" };

  const role = invite.role as Role;
  await db
    .insert(memberships)
    .values({
      workspaceId: invite.workspaceId,
      accountId: input.accountId,
      role,
      invitedBy: invite.invitedBy,
      createdAt: input.nowIso,
    })
    .onConflictDoNothing();
  return { ok: true, workspaceId: invite.workspaceId, role };
}
