import { notConfigured, requireAccountId } from "@/server/context";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";
import { createWorkspaceForAccount, listWorkspaces } from "@/server/workspaces/service";
import { isLocale } from "@/i18n/config";

/** GET /api/workspaces -> the signed-in account's workspaces. */
export async function GET(request: Request): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const accountId = await requireAccountId(ctx, request);
  if (!accountId) return Response.json({ error: "unauthorized" }, { status: 401 });
  const workspaces = await listWorkspaces(ctx.db, accountId);
  return Response.json({ workspaces }, { headers: { "cache-control": "private, no-store" } });
}

/** POST /api/workspaces  { name, workingLanguage? } -> create a workspace (creator is owner). */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const accountId = await requireAccountId(ctx, request);
  if (!accountId) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: { name?: unknown; workingLanguage?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "name_required" }, { status: 400 });
  const workingLanguage =
    typeof body.workingLanguage === "string" && isLocale(body.workingLanguage)
      ? body.workingLanguage
      : "en";

  const ws = await createWorkspaceForAccount(ctx.db, {
    accountId,
    name,
    workingLanguage,
    nowIso: new Date().toISOString(),
  });
  return Response.json({ id: ws.id, name: ws.name });
}
