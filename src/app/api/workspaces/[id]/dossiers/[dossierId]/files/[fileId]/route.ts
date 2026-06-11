import { notConfigured, resolveWorkspaceContext } from "@/server/context";
import { deleteDossierFile } from "@/server/files/service";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";

/**
 * DELETE /api/workspaces/:id/dossiers/:dossierId/files/:fileId -> remove the R2 object and the
 * registry row. Tenant-scoped: a file outside the workspace returns 404.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> },
): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id, fileId } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  const deleted = await deleteDossierFile(ctx.db, ctx.storage, wctx, fileId);
  if (!deleted) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ ok: true });
}
