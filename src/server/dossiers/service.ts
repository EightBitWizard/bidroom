import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import type { SimapClient } from "@/server/integrations/simap/client";
import {
  createDossier,
  findDossierBySource,
  getDossierWithSource,
  listDossiers,
} from "@/server/repositories/dossiers";
import { createSourceItem, findByNotice } from "@/server/repositories/tenderSources";
import type { Dossier, TenderSourceItem } from "@/server/repositories/types";

/**
 * Dossier business logic (WP-011), pure of the HTTP layer so the tenant authorization is
 * unit-tested. Creating a dossier fetches the official SIMAP notice, stores it verbatim, and
 * (within the workspace) reuses an existing dossier for the same notice rather than duplicating.
 */

export type CreateDossierResult =
  | { ok: true; dossier: Dossier; reused: boolean }
  | { ok: false; reason: "invalid-url" | "not-found" | "fetch-error" };

export async function createDossierFromUrl(
  db: Db,
  ctx: WorkspaceContext,
  simap: SimapClient,
  url: string,
  nowIso: string,
): Promise<CreateDossierResult> {
  const fetched = await simap.fetchNotice(url);
  if (!fetched.ok) return { ok: false, reason: fetched.reason };
  const notice = fetched.notice;

  // Get-or-create the official source item (shared across workspaces, stored verbatim).
  let source: TenderSourceItem | null = await findByNotice(
    db,
    notice.projectId,
    notice.publicationId,
  );
  if (!source) {
    source = await createSourceItem(
      db,
      {
        projectId: notice.projectId,
        publicationId: notice.publicationId,
        url: notice.url,
        authority: notice.authority,
        title: notice.title,
        procedureType: notice.procedureType,
        publicationDate: notice.publicationDate,
        raw: notice.raw,
      },
      nowIso,
    );
  }

  // Within this workspace, reuse an existing dossier for the same notice (duplicate detection).
  const existing = await findDossierBySource(db, ctx, source.id);
  if (existing) return { ok: true, dossier: existing, reused: true };

  const title = notice.title ?? `SIMAP notice ${notice.publicationId}`;
  const dossier = await createDossier(db, ctx, { sourceItemId: source.id, title, nowIso });
  return { ok: true, dossier, reused: false };
}

export async function listWorkspaceDossiers(db: Db, ctx: WorkspaceContext): Promise<Dossier[]> {
  return listDossiers(db, ctx);
}

export async function getDossierDetail(
  db: Db,
  ctx: WorkspaceContext,
  dossierId: string,
): Promise<{ dossier: Dossier; source: TenderSourceItem } | null> {
  return getDossierWithSource(db, ctx, dossierId);
}
