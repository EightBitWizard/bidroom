import { authzErrorResponse } from "@/server/authz/http";
import { notConfigured, requireAccountId } from "@/server/context";
import { sha256Hex, randomToken } from "@/server/crypto";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";
import { inviteToWorkspace } from "@/server/workspaces/service";
import { isRole } from "@/shared/roles";

const INVITE_TTL_DAYS = 7;

/**
 * POST /api/workspaces/:id/invites  { email, role } -> create an email-bound, single-use
 * invitation into the workspace. Owner-only and tenant-scoped (the service obtains a verified
 * WorkspaceContext first; a non-member gets 404, a non-owner 403). The token is generated and
 * hashed here; only the hash is stored. Sending the invitation email is wired in a later work
 * package; for now the invitation row is created (R-INVITE-02).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();
  const accountId = await requireAccountId(ctx, request);
  if (!accountId) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id: workspaceId } = await params;
  let body: { email?: unknown; role?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" && isRole(body.role) ? body.role : null;
  if (!email || !role) return Response.json({ error: "invalid_input" }, { status: 400 });

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000).toISOString();

  try {
    await inviteToWorkspace(ctx.db, {
      accountId,
      workspaceId,
      email,
      role,
      tokenHash,
      expiresAt,
      nowIso: new Date().toISOString(),
    });
  } catch (error) {
    return authzErrorResponse(error);
  }
  return Response.json({ ok: true });
}
