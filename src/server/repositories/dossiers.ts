import { and, desc, eq } from "drizzle-orm";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { dossiers, tenderSourceItems } from "@/server/db/schema";
import type { Dossier, TenderSourceItem } from "./types";

/**
 * Dossier repository (WP-011). Tenant-scoped: every read and write is bound to
 * `ctx.workspaceId`, so a dossier id from another workspace simply does not match and reads
 * return null (the R-AUTHZ-01 control, surfaced as 404 by the route).
 */

export async function createDossier(
  db: Db,
  ctx: WorkspaceContext,
  input: { sourceItemId: string; title: string; nowIso: string },
): Promise<Dossier> {
  const inserted = await db
    .insert(dossiers)
    .values({
      id: crypto.randomUUID(),
      workspaceId: ctx.workspaceId,
      sourceItemId: input.sourceItemId,
      title: input.title,
      status: "draft",
      createdBy: ctx.accountId,
      createdAt: input.nowIso,
    })
    .returning();
  return inserted[0]!;
}

export async function listDossiers(db: Db, ctx: WorkspaceContext): Promise<Dossier[]> {
  return db
    .select()
    .from(dossiers)
    .where(eq(dossiers.workspaceId, ctx.workspaceId))
    .orderBy(desc(dossiers.createdAt));
}

export async function getDossier(
  db: Db,
  ctx: WorkspaceContext,
  dossierId: string,
): Promise<Dossier | null> {
  const rows = await db
    .select()
    .from(dossiers)
    .where(and(eq(dossiers.id, dossierId), eq(dossiers.workspaceId, ctx.workspaceId)))
    .limit(1);
  return rows[0] ?? null;
}

/** Find an existing dossier in this workspace for the given source item (duplicate detection). */
export async function findDossierBySource(
  db: Db,
  ctx: WorkspaceContext,
  sourceItemId: string,
): Promise<Dossier | null> {
  const rows = await db
    .select()
    .from(dossiers)
    .where(and(eq(dossiers.workspaceId, ctx.workspaceId), eq(dossiers.sourceItemId, sourceItemId)))
    .limit(1);
  return rows[0] ?? null;
}

/** A dossier together with its official source item, tenant-scoped. */
export async function getDossierWithSource(
  db: Db,
  ctx: WorkspaceContext,
  dossierId: string,
): Promise<{ dossier: Dossier; source: TenderSourceItem } | null> {
  const dossier = await getDossier(db, ctx, dossierId);
  if (!dossier) return null;
  const rows = await db
    .select()
    .from(tenderSourceItems)
    .where(eq(tenderSourceItems.id, dossier.sourceItemId))
    .limit(1);
  const source = rows[0];
  if (!source) return null;
  return { dossier, source };
}
