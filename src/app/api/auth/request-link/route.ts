import { requestMagicLink } from "@/server/auth/service";
import { authDeps, notConfigured } from "@/server/context";
import { resolveServerContext } from "@/server/runtime";

/** POST /api/auth/request-link  { email, locale } -> emails a magic link. */
export async function POST(request: Request): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();

  // Per-IP throttle FIRST (before parsing or any account work): the per-email key alone is
  // attacker-controlled (vary the email, flood account creation). An absent header (local
  // dev) falls into one shared "unknown" bucket; production on Cloudflare always sets it.
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!(await ctx.ipRateLimiter.check(`magic-link-ip:${ip}`))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { email?: unknown; locale?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email : "";
  const locale = typeof body.locale === "string" ? body.locale : "en";

  const result = await requestMagicLink(authDeps(ctx), email, locale);
  if (!result.ok && result.reason === "invalid-email") {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!result.ok && result.reason === "rate-limited") {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }
  // Always the same response whether or not the email already had an account.
  return Response.json({ ok: true });
}
