import { notConfigured, resolveWorkspaceContext } from "@/server/context";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { getWorkspaceProfile, saveWorkspaceProfile } from "@/server/profile/service";
import { resolveServerContext } from "@/server/runtime";

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/** GET /api/workspaces/:id/profile -> the workspace's company profile (or null). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  const profile = await getWorkspaceProfile(ctx.db, wctx);
  return Response.json({ profile }, { headers: { "cache-control": "private, no-store" } });
}

/** PUT /api/workspaces/:id/profile  { capabilityTags, regions, languages, certifications, exclusions }. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const { id } = await params;
  const wctx = await resolveWorkspaceContext(ctx, request, id);
  if (wctx instanceof Response) return wctx;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const profile = await saveWorkspaceProfile(
    ctx.db,
    wctx,
    {
      capabilityTags: stringArray(body.capabilityTags),
      regions: stringArray(body.regions),
      languages: stringArray(body.languages),
      certifications: stringArray(body.certifications),
      exclusions: stringArray(body.exclusions),
    },
    new Date().toISOString(),
  );
  return Response.json({ profile });
}
