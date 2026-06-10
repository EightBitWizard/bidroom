import type { Membership } from "@/server/repositories/types";
import type { WorkspaceContext } from "./context";

export type { WorkspaceContext } from "./context";

export type AuthzErrorKind = "not_found" | "forbidden";

/**
 * Raised when a workspace access check fails. Routes map "not_found" to 404 (so a foreign
 * account cannot even learn that a workspace exists) and "forbidden" to 403 (a member whose
 * role is insufficient for the action).
 */
export class AuthzError extends Error {
  constructor(public readonly kind: AuthzErrorKind) {
    super(`authz_${kind}`);
    this.name = "AuthzError";
  }
}

/** Looks up a single membership; satisfied by repositories.getMembership bound to a db. */
export type MembershipLookup = (
  workspaceId: string,
  accountId: string,
) => Promise<Membership | null>;

/**
 * Verify that an account is a member of a workspace and return the access context. Throws
 * AuthzError("not_found") for a non-member, so callers reveal nothing about a workspace the
 * account cannot see. This is the only sanctioned way to obtain a WorkspaceContext.
 */
export async function assertWorkspaceAccess(
  lookup: MembershipLookup,
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceContext> {
  const membership = await lookup(workspaceId, accountId);
  if (!membership) throw new AuthzError("not_found");
  return { accountId, workspaceId, role: membership.role };
}

/** Require that the context's role may administer the workspace, else AuthzError("forbidden"). */
export function assertCanAdminister(ctx: WorkspaceContext): void {
  if (ctx.role !== "owner") throw new AuthzError("forbidden");
}
