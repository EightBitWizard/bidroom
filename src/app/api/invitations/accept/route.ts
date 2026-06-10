import { notConfigured, requireAccountId } from "@/server/context";
import { sha256Hex } from "@/server/crypto";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";
import { acceptInvitationForAccount } from "@/server/workspaces/service";

/**
 * POST /api/invitations/accept  { token } -> accept an invitation as the signed-in account.
 * Email-bound and single-use in the repository (R-INVITE-02); the granted role comes from the
 * invitation row, never from the request.
 */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const accountId = await requireAccountId(ctx, request);
  if (!accountId) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: { token?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token : "";
  if (!token) return Response.json({ error: "invalid_input" }, { status: 400 });

  const tokenHash = await sha256Hex(token);
  const result = await acceptInvitationForAccount(ctx.db, {
    tokenHash,
    accountId,
    nowIso: new Date().toISOString(),
  });
  if (!result.ok) return Response.json({ error: result.reason }, { status: 400 });
  return Response.json({ ok: true, workspaceId: result.workspaceId });
}
