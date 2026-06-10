import type { Db } from "@/server/db/client";
import {
  consumeAuthToken,
  createAuthToken,
  findOrCreateAccountByEmail,
  getAccount,
  pruneAuthTokens,
} from "@/server/repositories/accounts";
import { randomToken, sha256Hex, signSession, verifySession } from "../crypto";
import type { EmailSender } from "../email";
import type { RateLimiter } from "../ratelimit";

/**
 * Magic-link auth business logic, pure of the HTTP layer so it is unit-tested against an
 * in-memory database (better-sqlite3), email sender, and rate limiter. The route handlers
 * are thin wrappers that resolve these dependencies and call into here. Ported from moola's
 * hardened pattern (ADR 0003); the per-IP throttle and the interstitial live in the routes.
 */
export interface AuthDeps {
  db: Db;
  email: EmailSender;
  rateLimiter: RateLimiter;
  /** Secret for signing session cookies. */
  sessionSecret: string;
  /** Absolute origin used to build the magic link (never from request headers). */
  baseUrl: string;
  now: () => Date;
  tokenTtlMinutes?: number;
  sessionTtlDays?: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return trimmed.length <= 254 && EMAIL_RE.test(trimmed);
}

export type RequestLinkResult =
  | { ok: true }
  | { ok: false; reason: "invalid-email" | "rate-limited" };

/**
 * Issue a magic link: validate and rate-limit by email, find-or-create the account, prune
 * the account's tokens and store only the new token hash with a short TTL, and email the
 * link. Always behaves the same whether or not the email already has an account (no account
 * enumeration). The per-IP throttle runs earlier, in the route, before any account work.
 */
export async function requestMagicLink(
  deps: AuthDeps,
  rawEmail: string,
  locale: string,
): Promise<RequestLinkResult> {
  if (!isValidEmail(rawEmail)) return { ok: false, reason: "invalid-email" };
  const email = rawEmail.trim().toLowerCase();
  if (!(await deps.rateLimiter.check(`magic-link:${email}`))) {
    return { ok: false, reason: "rate-limited" };
  }

  const nowIso = deps.now().toISOString();
  const account = await findOrCreateAccountByEmail(deps.db, email, nowIso);
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const ttlMinutes = deps.tokenTtlMinutes ?? 15;
  const expiresAt = new Date(deps.now().getTime() + ttlMinutes * 60_000).toISOString();
  // Housekeeping on every issuance: drop used/expired rows and cap to the 2 newest before
  // inserting the new one (at most 3 outstanding per account).
  await pruneAuthTokens(deps.db, account.id, 2, nowIso);
  await createAuthToken(deps.db, tokenHash, account.id, expiresAt);

  const url = `${deps.baseUrl}/api/auth/callback?token=${encodeURIComponent(token)}`;
  await deps.email.sendMagicLink({ email, url, locale });
  return { ok: true };
}

/**
 * Verify a magic-link token (single-use, unexpired) and return a signed session cookie
 * value, or null if the token is invalid/used/expired or the account is gone. The session
 * embeds the account's current session_version so a later bump revokes it.
 */
export async function verifyMagicLink(deps: AuthDeps, token: string): Promise<string | null> {
  const tokenHash = await sha256Hex(token);
  const nowIso = deps.now().toISOString();
  const accountId = await consumeAuthToken(deps.db, tokenHash, nowIso);
  if (!accountId) return null;
  const account = await getAccount(deps.db, accountId);
  if (!account) return null;
  const sessionTtlDays = deps.sessionTtlDays ?? 30;
  const exp = Math.floor(deps.now().getTime() / 1000) + sessionTtlDays * 86_400;
  return signSession({ sub: accountId, exp, ver: account.sessionVersion }, deps.sessionSecret);
}

/**
 * Resolve the account for a (possibly absent) session token. Returns null unless the session
 * is valid, the account still exists, and the embedded session_version matches the stored
 * one, so a stale or revoked cookie grants nothing. Entitlement/plan resolution is layered
 * on in Phase 2.
 */
export async function resolveSession(
  deps: Pick<AuthDeps, "db" | "sessionSecret" | "now">,
  sessionToken: string | null,
): Promise<{ accountId: string } | null> {
  if (!sessionToken) return null;
  const payload = await verifySession(
    sessionToken,
    deps.sessionSecret,
    Math.floor(deps.now().getTime() / 1000),
  );
  if (!payload) return null;
  const account = await getAccount(deps.db, payload.sub);
  if (!account) return null;
  if (payload.ver !== account.sessionVersion) return null;
  return { accountId: payload.sub };
}
