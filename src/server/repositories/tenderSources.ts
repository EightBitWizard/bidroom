import { and, eq } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { tenderSourceItems } from "@/server/db/schema";
import type { TenderSourceItem } from "./types";

/**
 * Tender-source repository (WP-011). Official SIMAP notice references, system-owned and shared
 * across workspaces (not tenant-scoped). `raw_source` is stored verbatim and never edited
 * (LEG-002); the display fields are derived for convenience.
 */

export interface SourceItemInput {
  projectId: string;
  publicationId: string;
  url: string;
  authority: string | null;
  title: string | null;
  procedureType: string | null;
  publicationDate: string | null;
  raw: string;
}

export async function findByNotice(
  db: Db,
  projectId: string,
  publicationId: string,
): Promise<TenderSourceItem | null> {
  const rows = await db
    .select()
    .from(tenderSourceItems)
    .where(
      and(
        eq(tenderSourceItems.simapProjectId, projectId),
        eq(tenderSourceItems.simapPublicationId, publicationId),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function createSourceItem(
  db: Db,
  input: SourceItemInput,
  nowIso: string,
): Promise<TenderSourceItem> {
  const inserted = await db
    .insert(tenderSourceItems)
    .values({
      id: crypto.randomUUID(),
      simapProjectId: input.projectId,
      simapPublicationId: input.publicationId,
      simapUrl: input.url,
      authority: input.authority,
      title: input.title,
      procedureType: input.procedureType,
      publicationDate: input.publicationDate,
      rawSource: input.raw,
      fetchedAt: nowIso,
    })
    .returning();
  return inserted[0]!;
}
