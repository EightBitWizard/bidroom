import { describe, expect, it } from "vitest";
import { requestMagicLink, resolveSession, verifyMagicLink, type AuthDeps } from "./auth/service";
import { CapturingEmailSender } from "./email";
import { InMemoryRateLimiter } from "./ratelimit";
import { createTestDb } from "./repositories/testdb";
import { createWorkspaceForAccount, listWorkspaces } from "./workspaces/service";

/**
 * End-to-end of the Phase 0 backend chain against a real (in-memory) SQLite database, the
 * same code that runs on D1: request a magic link, confirm it, resolve the session, create a
 * workspace, and see it listed. This is the authoritative "sign up to workspace" flow; the
 * Playwright suite covers the UI shell separately.
 */
describe("sign up to workspace flow", () => {
  it("signs in via magic link and lands in a created workspace", async () => {
    const db = createTestDb();
    const email = new CapturingEmailSender();
    const deps: AuthDeps = {
      db,
      email,
      rateLimiter: new InMemoryRateLimiter(5, 60_000, () => 0),
      sessionSecret: "x".repeat(40),
      baseUrl: "https://app.bidroom.example",
      now: () => new Date("2026-06-10T12:00:00.000Z"),
    };

    // 1. Request the link.
    expect(await requestMagicLink(deps, "founder@acme.ch", "en")).toEqual({ ok: true });
    const token = new URL(email.sent[0]!.url).searchParams.get("token")!;

    // 2. Confirm it -> a signed session.
    const session = await verifyMagicLink(deps, token);
    expect(session).toBeTruthy();

    // 3. Resolve the session -> the account.
    const resolved = await resolveSession(deps, session);
    expect(resolved).toBeTruthy();
    const accountId = resolved!.accountId;

    // 4. Create a workspace; the creator is the owner.
    const ws = await createWorkspaceForAccount(db, {
      accountId,
      name: "Acme Consulting AG",
      workingLanguage: "en",
      nowIso: "2026-06-10T12:00:00.000Z",
    });

    // 5. The workspace is listed for the account, with the owner role.
    const list = await listWorkspaces(db, accountId);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: ws.id, name: "Acme Consulting AG", role: "owner" });
  });
});
