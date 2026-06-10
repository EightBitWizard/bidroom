import { notConfigured, requireAccountId } from "@/server/context";
import { clearSessionCookie } from "@/server/cookies";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { bumpSessionVersion } from "@/server/repositories/accounts";
import { resolveServerContext } from "@/server/runtime";

/**
 * POST /api/auth/logout -> revokes ALL of the account's sessions by bumping the stored
 * session version (a stolen cookie dies too; magic-link relogin is cheap), then clears the
 * cookie. Clearing alone would leave the signed cookie valid (ADR 0003).
 */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();

  const accountId = await requireAccountId(ctx, request);
  if (accountId) await bumpSessionVersion(ctx.db, accountId);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json", "set-cookie": clearSessionCookie() },
  });
}
