import { beforeEach, describe, expect, it } from "vitest";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { FixtureSimapClient, SAMPLE_NOTICE_URL } from "@/server/integrations/simap/client";
import { findOrCreateAccountByEmail } from "@/server/repositories/accounts";
import { createTestDb } from "@/server/repositories/testdb";
import { createWorkspaceForAccount } from "@/server/workspaces/service";
import { createDossierFromUrl, getDossierDetail, listWorkspaceDossiers } from "./service";

const T0 = "2026-06-11T12:00:00.000Z";

describe("dossier service", () => {
  let db: Db;
  let simap: FixtureSimapClient;
  beforeEach(() => {
    db = createTestDb();
    simap = new FixtureSimapClient();
  });

  async function workspace(email: string): Promise<WorkspaceContext> {
    const account = await findOrCreateAccountByEmail(db, email, T0);
    const ws = await createWorkspaceForAccount(db, {
      accountId: account.id,
      name: "Acme",
      workingLanguage: "en",
      nowIso: T0,
    });
    return { accountId: account.id, workspaceId: ws.id, role: "owner" };
  }

  it("creates a dossier from a SIMAP URL and stores the notice verbatim", async () => {
    const ctx = await workspace("owner@a.ch");
    const result = await createDossierFromUrl(db, ctx, simap, SAMPLE_NOTICE_URL, T0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reused).toBe(false);

    const detail = await getDossierDetail(db, ctx, result.dossier.id);
    expect(detail?.source.title).toBe("Beschaffung von Cloud-Infrastruktur und Betriebsleistungen");
    expect(detail?.dossier.title).toBe(
      "Beschaffung von Cloud-Infrastruktur und Betriebsleistungen",
    );
    // raw_source is the verbatim API JSON.
    expect(JSON.parse(detail!.source.rawSource).projectId).toBe("289123");
  });

  it("rejects a non-SIMAP URL (TND-002)", async () => {
    const ctx = await workspace("owner@a.ch");
    expect(await createDossierFromUrl(db, ctx, simap, "https://evil.example/1/2", T0)).toEqual({
      ok: false,
      reason: "invalid-url",
    });
  });

  it("reuses an existing dossier for a duplicate notice in the same workspace", async () => {
    const ctx = await workspace("owner@a.ch");
    const first = await createDossierFromUrl(db, ctx, simap, SAMPLE_NOTICE_URL, T0);
    const second = await createDossierFromUrl(db, ctx, simap, SAMPLE_NOTICE_URL, T0);
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) return;
    expect(second.reused).toBe(true);
    expect(second.dossier.id).toBe(first.dossier.id);
    expect(await listWorkspaceDossiers(db, ctx)).toHaveLength(1);
  });

  it("shares one source item across workspaces but gives each its own dossier", async () => {
    const ctxA = await workspace("a@a.ch");
    const ctxB = await workspace("b@b.ch");
    const a = await createDossierFromUrl(db, ctxA, simap, SAMPLE_NOTICE_URL, T0);
    const b = await createDossierFromUrl(db, ctxB, simap, SAMPLE_NOTICE_URL, T0);
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.dossier.id).not.toBe(b.dossier.id);
    expect(a.dossier.sourceItemId).toBe(b.dossier.sourceItemId);
  });

  it("does not expose a dossier to another workspace (foreign-workspace 404 pattern)", async () => {
    const ctxA = await workspace("a@a.ch");
    const ctxB = await workspace("b@b.ch");
    const created = await createDossierFromUrl(db, ctxA, simap, SAMPLE_NOTICE_URL, T0);
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    // Workspace B cannot read or list workspace A's dossier.
    expect(await getDossierDetail(db, ctxB, created.dossier.id)).toBeNull();
    expect(await listWorkspaceDossiers(db, ctxB)).toHaveLength(0);
  });
});
