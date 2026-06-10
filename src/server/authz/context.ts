import type { Role } from "@/shared/roles";

/**
 * A verified workspace access context. Produced only by assertWorkspaceAccess after a
 * membership check, and required (non-optional) by every tenant-scoped repository function.
 * It is the single barrier between tenants, since D1 has no row-level security (ADR 0003).
 * Defined here, separate from the authz logic, so repositories can import the type without a
 * runtime cycle.
 */
export interface WorkspaceContext {
  accountId: string;
  workspaceId: string;
  role: Role;
}
