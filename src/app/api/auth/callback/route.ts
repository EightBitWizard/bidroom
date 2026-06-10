import { verifyMagicLink } from "@/server/auth/service";
import { authDeps, notConfigured } from "@/server/context";
import { sessionCookie } from "@/server/cookies";
import { crossOrigin, isSameOriginRequest } from "@/server/http";
import { resolveServerContext } from "@/server/runtime";
import { isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

const SESSION_TTL_DAYS = 30;

/** base64url tokens only; anything else is rejected before rendering or consuming. */
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/;

/**
 * GET /api/auth/callback?token=...&locale=en -> an interstitial confirm page.
 *
 * The GET deliberately does NOT consume the token: email security scanners and client
 * prefetchers follow links, and a consuming GET would burn the single-use token before the
 * user clicks (and could even set the cookie in the scanner's session). The page renders one
 * localized form whose POST consumes the token. Referrer-Policy: no-referrer keeps the token
 * out of outbound referrers; the token never appears in logs (ADR 0003).
 */
export async function GET(request: Request): Promise<Response> {
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const localeParam = url.searchParams.get("locale") ?? "en";
  const locale = isLocale(localeParam) ? localeParam : "en";
  const t = getMessages(locale).auth;

  if (!TOKEN_RE.test(token)) {
    return Response.redirect(new URL(`/${locale}/app?login=invalid`, url.origin), 302);
  }

  // The token is base64url by construction (TOKEN_RE), so it needs no HTML escaping; the
  // regex gate above is the injection barrier.
  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${t.confirmTitle} - Bidroom</title>
<style>
body{font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f8fafc;color:#0f172a}
main{max-width:24rem;padding:2rem;text-align:center}
button{font-size:1rem;padding:.6rem 1.6rem;border-radius:.5rem;border:1px solid #1d4ed8;background:#1d4ed8;color:#fff;cursor:pointer}
p{color:#64748b;font-size:.9rem}
</style>
</head>
<body>
<main>
<h1>${t.confirmTitle}</h1>
<p>${t.confirmIntro}</p>
<form method="post" action="/api/auth/callback">
<input type="hidden" name="token" value="${token}">
<input type="hidden" name="locale" value="${locale}">
<button type="submit">${t.confirmButton}</button>
</form>
</main>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "referrer-policy": "no-referrer",
      "cache-control": "no-store",
      // The confirm page must never be frameable (clickjacking the confirm button).
      "x-frame-options": "DENY",
      "content-security-policy": "frame-ancestors 'none'",
    },
  });
}

/**
 * POST /api/auth/callback (token, locale) -> consumes the token, sets the session.
 *
 * Same-origin only: the legitimate POST comes from the interstitial page above. A cross-site
 * auto-submitted form carrying the ATTACKER's own fresh token would otherwise silently log
 * the victim into the attacker's account (login CSRF). Headerless non-browser clients still
 * pass (they cannot set a victim's cookies).
 */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOriginRequest(request)) return crossOrigin();
  const ctx = resolveServerContext();
  if (!ctx) return notConfigured();

  const url = new URL(request.url);
  let token = "";
  let localeParam = "en";
  try {
    const form = await request.formData();
    token = String(form.get("token") ?? "");
    localeParam = String(form.get("locale") ?? "en");
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const locale = isLocale(localeParam) ? localeParam : "en";

  // Per-IP throttle as defense in depth (256-bit single-use tokens already make guessing
  // infeasible).
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!(await ctx.ipRateLimiter.check(`callback-ip:${ip}`))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const session = TOKEN_RE.test(token) ? await verifyMagicLink(authDeps(ctx), token) : null;
  if (!session) {
    return Response.redirect(new URL(`/${locale}/app?login=invalid`, url.origin), 302);
  }
  return new Response(null, {
    status: 302,
    headers: {
      location: new URL(`/${locale}/app?login=ok`, url.origin).toString(),
      "set-cookie": sessionCookie(session, SESSION_TTL_DAYS * 86_400),
      "referrer-policy": "no-referrer",
    },
  });
}
