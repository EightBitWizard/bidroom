import { assertCanAdminister, assertWorkspaceAccess } from "@/server/authz";
import type { Db } from "@/server/db/client";
import { getAccount } from "@/server/repositories/accounts";
import {
  acceptInvitation,
  createInvitation,
  createWorkspace,
  getMembership,
  listWorkspacesForAccount,
  type AcceptInvitationResult,
} from "@/server/repositories/workspaces";
import type { Invitation, Workspace, WorkspaceWithRole } from "@/server/repositories/types";
import type { Role } from "@/shared/roles";

/**
 * Workspace business logic, pure of the HTTP layer so the multi-tenant authorization is
 * unit-tested without the Worker runtime. The routes are thin wrappers. Every workspace
 * action obtains a verified WorkspaceContext via assertWorkspaceAccess first (ADR 0003).
 */

function lookup(db: Db) {
  return (workspaceId: string, accountId: string) => getMembership(db, workspaceId, accountId);
}

export async function createWorkspaceForAccount(
  db: Db,
  input: { accountId: string; name: string; workingLanguage: string; nowIso: string },
): Promise<Workspace> {
  return createWorkspace(db, {
    name: input.name,
    workingLanguage: input.workingLanguage,
    ownerAccountId: input.accountId,
    nowIso: input.nowIso,
  });
}

export async function listWorkspaces(db: Db, accountId: string): Promise<WorkspaceWithRole[]> {
  return listWorkspacesForAccount(db, accountId);
}

/**
 * Create an invitation. Requires that the actor is a member of the workspace (else
 * AuthzError "not_found") and an owner (else AuthzError "forbidden"). The granted role is
 * stored on the row and looked up server-side at accept time, never trusted from the invitee.
 */
export async function inviteToWorkspace(
  db: Db,
  input: {
    accountId: string;
    workspaceId: string;
    email: string;
    role: Role;
    tokenHash: string;
    expiresAt: string;
    nowIso: string;
  },
): Promise<Invitation> {
  const ctx = await assertWorkspaceAccess(lookup(db), input.accountId, input.workspaceId);
  assertCanAdminister(ctx);
  return createInvitation(db, ctx, {
    email: input.email,
    role: input.role,
    tokenHash: input.tokenHash,
    expiresAt: input.expiresAt,
    nowIso: input.nowIso,
  });
}

/**
 * Accept an invitation as the signed-in account. Email-bound: the account's email must match
 * the invited email (enforced in the repository). Returns the repository result.
 */
export async function acceptInvitationForAccount(
  db: Db,
  input: { tokenHash: string; accountId: string; nowIso: string },
): Promise<AcceptInvitationResult> {
  const account = await getAccount(db, input.accountId);
  if (!account) return { ok: false, reason: "invalid" };
  return acceptInvitation(db, {
    tokenHash: input.tokenHash,
    accountId: input.accountId,
    accountEmail: account.email,
    nowIso: input.nowIso,
  });
}
