import { notConfigured, resolveWorkspaceContext } from "@/server/context";
import { listDossierFiles, uploadFileToDossier } from "@/server/files/service";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import type { UploadedFile } from "@/server/repositories/types";
import { resolveServerContext } from "@/server/runtime";

function publicFile(f: UploadedFile) {
  return {
    id: f.id,
    filename: f.filename,
    size: f.size,
    status: f.status,
    scanStatus: f.scanStatus,
    createdAt: f.createdAt,
  };
}

/** GET /api/workspaces/:id/dossiers/:dossierId/files -> the dossier's uploaded files. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; dossierId: string }> },
): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id, dossierId } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  const files = await listDossierFiles(ctx.db, wctx, dossierId);
  return Response.json(
    { files: files.map(publicFile) },
    { headers: { "cache-control": "private, no-store" } },
  );
}

/**
 * POST /api/workspaces/:id/dossiers/:dossierId/files (multipart, field `file`) -> scan and store.
 * The upload is fail-closed: the bytes are stored only after a clean scan; oversize, unsupported,
 * infected, and scanner-error outcomes are returned with an explicit file status (TND-005).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; dossierId: string }> },
): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id, dossierId } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  let file: File;
  try {
    const form = await request.formData();
    const value = form.get("file");
    if (!(value instanceof File)) return Response.json({ error: "file_required" }, { status: 400 });
    file = value;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const result = await uploadFileToDossier(
    ctx.db,
    ctx.storage,
    ctx.scanner,
    wctx,
    { dossierId, filename: file.name, bytes },
    new Date().toISOString(),
  );
  if (!result.ok) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ file: publicFile(result.file) });
}
