/**
 * Cross-site request hardening for state-changing routes, on top of the session cookie's
 * SameSite=Lax. Browsers send an Origin header on cross-site requests and Sec-Fetch-Site
 * metadata on all requests; non-browser clients typically send neither. Policy: reject when
 * an Origin is present and does not match the request's own host, or when Sec-Fetch-Site is
 * present and is neither same-origin nor none (direct navigation). Absent headers pass, so
 * curl and tests are unaffected. Defense in depth, ported from moola (ADR 0003).
 */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    try {
      const requestHost = new URL(request.url).host;
      if (new URL(origin).host !== requestHost) return false;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  if (site !== null && site !== "same-origin" && site !== "none") return false;
  return true;
}

/** Standard 403 for cross-site requests to state-changing routes. */
export function crossOrigin(): Response {
  return Response.json({ error: "cross_origin" }, { status: 403 });
}
