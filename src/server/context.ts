import { assertWorkspaceAccess, type WorkspaceContext } from "./authz";
import { authzErrorResponse } from "./authz/http";
import { type AuthDeps, resolveSession } from "./auth/service";
import { readSessionCookie } from "./cookies";
import { createDb, type Db } from "./db/client";
import { ConsoleEmailSender, type EmailSender, NoopEmailSender } from "./email";
import { FixtureSimapClient, HttpSimapClient, type SimapClient } from "./integrations/simap/client";
import { getMembership } from "./repositories/workspaces";
import { InMemoryRateLimiter, KVRateLimiter, type KVLike, type RateLimiter } from "./ratelimit";
import { type Scanner, StubScanner } from "./scan";
import { MemoryStorage, R2Storage, type R2Like, type Storage } from "./storage";

/**
 * Resolves the server runtime from the Cloudflare environment. Pure of the Worker runtime
 * (runtime.ts wraps it) so it is unit-tested. Unlike moola, the Bidroom backend is the
 * product from day one: it activates whenever a D1 binding and a sufficiently long session
 * secret are present (no billing flag), and returns null otherwise so routes respond 503.
 */
export interface ServerContext {
  db: Db;
  email: EmailSender;
  /** Per-email/key limiter for issuance. */
  rateLimiter: RateLimiter;
  /** Per-IP limiter for unauthenticated endpoints (request-link, callback consume). */
  ipRateLimiter: RateLimiter;
  sessionSecret: string;
  baseUrl: string;
  /** SIMAP notice client; the fixture client in dev/test, the live client otherwise. */
  simap: SimapClient;
  /** Object storage for uploaded documents (R2 in production, in-memory otherwise). */
  storage: Storage;
  /** Malware scanner for uploads; the Container in production, the EICAR stub otherwise. */
  scanner: Scanner;
}

export interface CloudflareEnv {
  DB?: unknown;
  /** KV namespace for the durable rate limiter (ADR 0003); absent in dev/test. */
  RATE_LIMIT_KV?: KVLike;
  SESSION_SECRET?: string;
  APP_BASE_URL?: string;
  /** When "true", log magic links to the console (local dev only; never in production). */
  DEV_EMAIL_CONSOLE?: string;
  /** When "true", resolve SIMAP notices from recorded fixtures instead of the live API. */
  SIMAP_USE_FIXTURES?: string;
  /** R2 bucket for uploaded documents (`jurisdiction=eu`); absent in dev/test. */
  DOCS?: R2Like;
}

const MIN_SECRET_LENGTH = 32;
const WINDOW_MS = 15 * 60 * 1000;
const PER_EMAIL_MAX = 5;
const PER_IP_MAX = 12;

// In-memory fallback limiters are module-level so they persist across requests within an
// isolate. Production binds RATE_LIMIT_KV and uses the durable KV limiter instead.
const memRateLimiter = new InMemoryRateLimiter(PER_EMAIL_MAX, WINDOW_MS);
const memIpRateLimiter = new InMemoryRateLimiter(PER_IP_MAX, WINDOW_MS);

function buildLimiters(kv: KVLike | undefined): {
  rateLimiter: RateLimiter;
  ipRateLimiter: RateLimiter;
} {
  if (kv) {
    return {
      rateLimiter: new KVRateLimiter(kv, PER_EMAIL_MAX, WINDOW_MS),
      ipRateLimiter: new KVRateLimiter(kv, PER_IP_MAX, WINDOW_MS),
    };
  }
  return { rateLimiter: memRateLimiter, ipRateLimiter: memIpRateLimiter };
}

export function buildContext(env: CloudflareEnv | undefined): ServerContext | null {
  if (!env?.DB || !env.SESSION_SECRET || env.SESSION_SECRET.length < MIN_SECRET_LENGTH) {
    return null;
  }
  const { rateLimiter, ipRateLimiter } = buildLimiters(env.RATE_LIMIT_KV);
  return {
    db: createDb(env.DB as Parameters<typeof createDb>[0]),
    email: env.DEV_EMAIL_CONSOLE === "true" ? new ConsoleEmailSender() : new NoopEmailSender(),
    rateLimiter,
    ipRateLimiter,
    sessionSecret: env.SESSION_SECRET,
    baseUrl: env.APP_BASE_URL ?? "https://app.bidroom.example",
    simap: env.SIMAP_USE_FIXTURES === "true" ? new FixtureSimapClient() : new HttpSimapClient(),
    storage: env.DOCS ? new R2Storage(env.DOCS) : new MemoryStorage(),
    // The ContainerScanner is wired when the parsing Container is provisioned (ADR 0005);
    // until then the EICAR stub exercises the fail-closed gate.
    scanner: new StubScanner(),
  };
}

/** Build the auth-service dependencies from a resolved context. */
export function authDeps(ctx: ServerContext): AuthDeps {
  return {
    db: ctx.db,
    email: ctx.email,
    rateLimiter: ctx.rateLimiter,
    sessionSecret: ctx.sessionSecret,
    baseUrl: ctx.baseUrl,
    now: () => new Date(),
  };
}

/** Standard 503 when the backend is not configured. */
export function notConfigured(): Response {
  return Response.json({ error: "not_configured" }, { status: 503 });
}

/** Resolve the signed-in account id from the request's session cookie, or null. */
export async function requireAccountId(
  ctx: ServerContext,
  request: Request,
): Promise<string | null> {
  const session = await resolveSession(
    { db: ctx.db, sessionSecret: ctx.sessionSecret, now: () => new Date() },
    readSessionCookie(request),
  );
  return session?.accountId ?? null;
}

/**
 * Resolve a verified WorkspaceContext for a workspace-nested route, or an error Response: 401 if
 * not signed in, 404 if not a member (a foreign workspace is not revealed), 403 if the role is
 * insufficient. This is the single auth+authz entry point every tenant-scoped route uses.
 */
export async function resolveWorkspaceContext(
  ctx: ServerContext,
  request: Request,
  workspaceId: string,
): Promise<WorkspaceContext | Response> {
  const accountId = await requireAccountId(ctx, request);
  if (!accountId) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return await assertWorkspaceAccess(
      (w, a) => getMembership(ctx.db, w, a),
      accountId,
      workspaceId,
    );
  } catch (error) {
    return authzErrorResponse(error);
  }
}
