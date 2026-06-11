import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import {
  getProfile,
  type ProfileInput,
  upsertProfile,
} from "@/server/repositories/companyProfiles";
import type { CompanyProfile } from "@/server/repositories/types";

/**
 * Company-profile business logic (WP-010), pure of the HTTP layer. Tenant-scoped through the
 * repository, which binds every read and write to the context workspace.
 */

export async function getWorkspaceProfile(
  db: Db,
  ctx: WorkspaceContext,
): Promise<CompanyProfile | null> {
  return getProfile(db, ctx);
}

export async function saveWorkspaceProfile(
  db: Db,
  ctx: WorkspaceContext,
  input: ProfileInput,
  nowIso: string,
): Promise<CompanyProfile> {
  return upsertProfile(db, ctx, input, nowIso);
}
