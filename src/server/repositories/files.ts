import { and, desc, eq } from "drizzle-orm";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { uploadedFiles } from "@/server/db/schema";
import type { UploadedFile } from "./types";

/**
 * Uploaded-file registry (WP-012). Tenant-scoped: reads are bound to both the dossier and
 * `ctx.workspaceId`, so a file in another workspace's dossier never matches.
 */

export interface RegisterFileInput {
  dossierId: string;
  workspaceId: string;
  filename: string;
  mime: string | null;
  size: number;
  sha256: string | null;
  scanStatus: string;
  status: string;
  createdBy: string;
}

export async function registerFile(
  db: Db,
  input: RegisterFileInput,
  nowIso: string,
): Promise<UploadedFile> {
  const inserted = await db
    .insert(uploadedFiles)
    .values({
      id: crypto.randomUUID(),
      dossierId: input.dossierId,
      workspaceId: input.workspaceId,
      filename: input.filename,
      mime: input.mime,
      size: input.size,
      sha256: input.sha256,
      category: "tender",
      scanStatus: input.scanStatus,
      status: input.status,
      createdBy: input.createdBy,
      createdAt: nowIso,
    })
    .returning();
  return inserted[0]!;
}

export async function updateFileStatus(
  db: Db,
  fileId: string,
  scanStatus: string,
  status: string,
): Promise<void> {
  await db.update(uploadedFiles).set({ scanStatus, status }).where(eq(uploadedFiles.id, fileId));
}

export async function listFiles(
  db: Db,
  ctx: WorkspaceContext,
  dossierId: string,
): Promise<UploadedFile[]> {
  return db
    .select()
    .from(uploadedFiles)
    .where(
      and(eq(uploadedFiles.dossierId, dossierId), eq(uploadedFiles.workspaceId, ctx.workspaceId)),
    )
    .orderBy(desc(uploadedFiles.createdAt));
}

export async function getFile(
  db: Db,
  ctx: WorkspaceContext,
  fileId: string,
): Promise<UploadedFile | null> {
  const rows = await db
    .select()
    .from(uploadedFiles)
    .where(and(eq(uploadedFiles.id, fileId), eq(uploadedFiles.workspaceId, ctx.workspaceId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function deleteFileRow(db: Db, fileId: string): Promise<void> {
  await db.delete(uploadedFiles).where(eq(uploadedFiles.id, fileId));
}
