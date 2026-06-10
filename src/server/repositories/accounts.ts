import { and, desc, eq, gt, inArray, isNotNull, isNull, lte, or } from "drizzle-orm";
import type { Db } from "@/server/db/client";
import { accounts, authTokens } from "@/server/db/schema";
import type { Account } from "./types";

/**
 * Account-scoped repository: accounts and the hashed single-use magic-link tokens. Ports
 * moola's hardened account model (session_version revocation, token housekeeping). These
 * functions are not workspace-scoped, so they do not take a WorkspaceContext.
 */

export async function findOrCreateAccountByEmail(
  db: Db,
  email: string,
  nowIso: string,
): Promise<Account> {
  const normalized = email.trim().toLowerCase();
  const existing = await db.select().from(accounts).where(eq(accounts.email, normalized)).limit(1);
  if (existing[0]) return existing[0];
  const inserted = await db
    .insert(accounts)
    .values({ id: crypto.randomUUID(), email: normalized, createdAt: nowIso })
    .returning();
  // The insert always returns the new row.
  return inserted[0]!;
}

export async function getAccount(db: Db, id: string): Promise<Account | null> {
  const rows = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function deleteAccount(db: Db, id: string): Promise<void> {
  await db.delete(accounts).where(eq(accounts.id, id));
}

/** Revoke every outstanding session for the account by bumping its session_version. */
export async function bumpSessionVersion(db: Db, id: string): Promise<void> {
  const account = await getAccount(db, id);
  if (!account) return;
  await db
    .update(accounts)
    .set({ sessionVersion: account.sessionVersion + 1 })
    .where(eq(accounts.id, id));
}

export async function createAuthToken(
  db: Db,
  tokenHash: string,
  accountId: string,
  expiresAt: string,
): Promise<void> {
  await db.insert(authTokens).values({ tokenHash, accountId, expiresAt });
}

/**
 * Consume a magic-link token atomically: a single guarded UPDATE marks it used only if it
 * is unused and unexpired, returning the account id. Replay-safe regardless of driver.
 */
export async function consumeAuthToken(
  db: Db,
  tokenHash: string,
  nowIso: string,
): Promise<string | null> {
  const rows = await db
    .update(authTokens)
    .set({ usedAt: nowIso })
    .where(
      and(
        eq(authTokens.tokenHash, tokenHash),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, nowIso),
      ),
    )
    .returning({ accountId: authTokens.accountId });
  return rows[0]?.accountId ?? null;
}

/**
 * Housekeeping on every issuance (moola pattern): drop used and expired rows, then cap the
 * account's outstanding tokens to the `keep` newest by expiry.
 */
export async function pruneAuthTokens(
  db: Db,
  accountId: string,
  keep: number,
  nowIso: string,
): Promise<void> {
  // Drop the account's used and expired tokens.
  await db
    .delete(authTokens)
    .where(
      and(
        eq(authTokens.accountId, accountId),
        or(isNotNull(authTokens.usedAt), lte(authTokens.expiresAt, nowIso)),
      ),
    );
  // Cap the account's outstanding tokens to the `keep` newest by expiry.
  const remaining = await db
    .select({ tokenHash: authTokens.tokenHash })
    .from(authTokens)
    .where(eq(authTokens.accountId, accountId))
    .orderBy(desc(authTokens.expiresAt));
  const excess = remaining.slice(keep).map((r) => r.tokenHash);
  if (excess.length > 0) {
    await db.delete(authTokens).where(inArray(authTokens.tokenHash, excess));
  }
}
