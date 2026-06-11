import { notConfigured, resolveWorkspaceContext } from "@/server/context";
import { createDossierFromUrl, listWorkspaceDossiers } from "@/server/dossiers/service";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";

/** GET /api/workspaces/:id/dossiers -> the workspace's dossiers. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  const dossiers = await listWorkspaceDossiers(ctx.db, wctx);
  return Response.json({ dossiers }, { headers: { "cache-control": "private, no-store" } });
}

/** POST /api/workspaces/:id/dossiers  { url } -> create a dossier from a SIMAP notice URL. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  let body: { url?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const url = typeof body.url === "string" ? body.url : "";
  if (!url) return Response.json({ error: "url_required" }, { status: 400 });

  const result = await createDossierFromUrl(ctx.db, wctx, ctx.simap, url, new Date().toISOString());
  if (!result.ok) {
    const status = result.reason === "invalid-url" ? 400 : 502;
    return Response.json({ error: result.reason }, { status });
  }
  return Response.json({
    id: result.dossier.id,
    title: result.dossier.title,
    reused: result.reused,
  });
}
