import { eq } from "drizzle-orm";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { companyProfiles } from "@/server/db/schema";
import type { CompanyProfile } from "./types";

/**
 * Company-profile repository (WP-010). One profile per workspace, tenant-scoped: every read and
 * write is bound to `ctx.workspaceId`. The list columns are JSON; null reads coalesce to [].
 */

export interface ProfileInput {
  capabilityTags: string[];
  regions: string[];
  languages: string[];
  certifications: string[];
  exclusions: string[];
}

export async function getProfile(db: Db, ctx: WorkspaceContext): Promise<CompanyProfile | null> {
  const rows = await db
    .select()
    .from(companyProfiles)
    .where(eq(companyProfiles.workspaceId, ctx.workspaceId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    capabilityTags: row.capabilityTags ?? [],
    regions: row.regions ?? [],
    languages: row.languages ?? [],
    certifications: row.certifications ?? [],
    exclusions: row.exclusions ?? [],
    profileVersion: row.profileVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Create or update the workspace's profile, bumping profile_version on each save. */
export async function upsertProfile(
  db: Db,
  ctx: WorkspaceContext,
  input: ProfileInput,
  nowIso: string,
): Promise<CompanyProfile> {
  const existing = await getProfile(db, ctx);
  if (existing) {
    await db
      .update(companyProfiles)
      .set({ ...input, profileVersion: existing.profileVersion + 1, updatedAt: nowIso })
      .where(eq(companyProfiles.workspaceId, ctx.workspaceId));
  } else {
    await db.insert(companyProfiles).values({
      id: crypto.randomUUID(),
      workspaceId: ctx.workspaceId,
      ...input,
      profileVersion: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }
  const saved = await getProfile(db, ctx);
  return saved!;
}
