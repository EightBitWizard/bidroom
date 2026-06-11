import { notConfigured, resolveWorkspaceContext } from "@/server/context";
import { getDossierDetail } from "@/server/dossiers/service";
import { resolveServerContext } from "@/server/runtime";

/**
 * GET /api/workspaces/:id/dossiers/:dossierId -> the dossier with its official source item.
 * Tenant-scoped: a dossier id from another workspace returns 404 (the workspace context and the
 * repository both bind to ctx.workspaceId).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; dossierId: string }> },
): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id, dossierId } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  const detail = await getDossierDetail(ctx.db, wctx, dossierId);
  if (!detail) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(
    {
      dossier: detail.dossier,
      source: {
        title: detail.source.title,
        authority: detail.source.authority,
        procedureType: detail.source.procedureType,
        publicationDate: detail.source.publicationDate,
        simapUrl: detail.source.simapUrl,
      },
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
