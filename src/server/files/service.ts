import type { WorkspaceContext } from "@/server/authz/context";
import { sha256HexBytes } from "@/server/crypto";
import type { Db } from "@/server/db/client";
import { getDossier } from "@/server/repositories/dossiers";
import {
  deleteFileRow,
  getFile,
  listFiles,
  registerFile,
  updateFileStatus,
} from "@/server/repositories/files";
import type { UploadedFile } from "@/server/repositories/types";
import type { Scanner } from "@/server/scan";
import { storageKey, type Storage } from "@/server/storage";

/**
 * File-upload business logic (WP-012), pure of HTTP so the security gate is unit-tested. The scan
 * is fail-closed (R-SCAN-04): a file's bytes are stored in R2 only after an explicit clean scan; a
 * dirty result or a scanner error leaves the file `failed` and stores nothing. Type and size are
 * checked from the bytes, not the client-supplied mime.
 */

export const MAX_FILE_BYTES = 50 * 1024 * 1024;

export type UploadResult = { ok: true; file: UploadedFile } | { ok: false; reason: "not-found" };

interface UploadInput {
  dossierId: string;
  filename: string;
  bytes: ArrayBuffer;
}

export async function uploadFileToDossier(
  db: Db,
  storage: Storage,
  scanner: Scanner,
  ctx: WorkspaceContext,
  input: UploadInput,
  nowIso: string,
): Promise<UploadResult> {
  // Tenant check: the dossier must belong to the context workspace.
  const dossier = await getDossier(db, ctx, input.dossierId);
  if (!dossier) return { ok: false, reason: "not-found" };

  const size = input.bytes.byteLength;
  const base = {
    dossierId: input.dossierId,
    workspaceId: ctx.workspaceId,
    filename: input.filename,
    createdBy: ctx.accountId,
  };

  // Oversize: register the outcome, store nothing (TND-005).
  if (size > MAX_FILE_BYTES) {
    const file = await registerFile(
      db,
      { ...base, mime: null, size, sha256: null, scanStatus: "pending", status: "too_large" },
      nowIso,
    );
    return { ok: true, file };
  }

  // Type sniffing from the bytes (not the client mime). Only PDF and DOCX are supported (TND-004).
  const sniffed = sniffType(input.bytes, input.filename);
  if (!sniffed) {
    const file = await registerFile(
      db,
      { ...base, mime: null, size, sha256: null, scanStatus: "pending", status: "unsupported" },
      nowIso,
    );
    return { ok: true, file };
  }

  const sha256 = await sha256HexBytes(input.bytes);
  // Register fail-closed: status starts `failed` and is promoted to `stored` only after a clean
  // scan, so a crash mid-scan leaves the file failed and unstored.
  const file = await registerFile(
    db,
    { ...base, mime: sniffed, size, sha256, scanStatus: "pending", status: "failed" },
    nowIso,
  );

  let clean: boolean;
  try {
    ({ clean } = await scanner.scan(input.bytes));
  } catch {
    await updateFileStatus(db, file.id, "error", "failed");
    return { ok: true, file: { ...file, scanStatus: "error", status: "failed" } };
  }
  if (!clean) {
    await updateFileStatus(db, file.id, "infected", "failed");
    return { ok: true, file: { ...file, scanStatus: "infected", status: "failed" } };
  }

  await storage.put(storageKey(ctx.workspaceId, input.dossierId, file.id), input.bytes);
  await updateFileStatus(db, file.id, "clean", "stored");
  return { ok: true, file: { ...file, scanStatus: "clean", status: "stored" } };
}

export async function listDossierFiles(
  db: Db,
  ctx: WorkspaceContext,
  dossierId: string,
): Promise<UploadedFile[]> {
  return listFiles(db, ctx, dossierId);
}

export async function deleteDossierFile(
  db: Db,
  storage: Storage,
  ctx: WorkspaceContext,
  fileId: string,
): Promise<boolean> {
  const file = await getFile(db, ctx, fileId);
  if (!file) return false;
  await storage.delete(storageKey(file.workspaceId, file.dossierId, file.id));
  await deleteFileRow(db, file.id);
  return true;
}

/** Detect the document type from magic bytes: PDF (%PDF) or DOCX (ZIP magic + .docx), else null. */
export function sniffType(bytes: ArrayBuffer, filename: string): "pdf" | "docx" | null {
  const head = new Uint8Array(bytes.slice(0, 4));
  // %PDF
  if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46) return "pdf";
  // PK\x03\x04 (ZIP container) plus the .docx extension; deeper validation happens at parse time.
  const isZip = head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04;
  if (isZip && filename.toLowerCase().endsWith(".docx")) return "docx";
  return null;
}
