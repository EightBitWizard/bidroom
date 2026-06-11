import { beforeEach, describe, expect, it } from "vitest";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { findOrCreateAccountByEmail } from "@/server/repositories/accounts";
import { createTestDb } from "@/server/repositories/testdb";
import { createWorkspaceForAccount } from "@/server/workspaces/service";
import { getWorkspaceProfile, saveWorkspaceProfile } from "./service";

const T0 = "2026-06-11T12:00:00.000Z";
const T1 = "2026-06-11T13:00:00.000Z";

const SAMPLE = {
  capabilityTags: ["cloud", "cybersecurity"],
  regions: ["CH"],
  languages: ["de", "en"],
  certifications: ["ISO 27001"],
  exclusions: ["construction"],
};

describe("company profile service", () => {
  let db: Db;
  beforeEach(() => {
    db = createTestDb();
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

  it("starts with no profile", async () => {
    const ctx = await workspace("a@a.ch");
    expect(await getWorkspaceProfile(db, ctx)).toBeNull();
  });

  it("saves and reads the profile with its list fields", async () => {
    const ctx = await workspace("a@a.ch");
    const saved = await saveWorkspaceProfile(db, ctx, SAMPLE, T0);
    expect(saved.profileVersion).toBe(1);
    const read = await getWorkspaceProfile(db, ctx);
    expect(read?.capabilityTags).toEqual(["cloud", "cybersecurity"]);
    expect(read?.languages).toEqual(["de", "en"]);
  });

  it("bumps profile_version on each save", async () => {
    const ctx = await workspace("a@a.ch");
    await saveWorkspaceProfile(db, ctx, SAMPLE, T0);
    const updated = await saveWorkspaceProfile(db, ctx, { ...SAMPLE, regions: ["CH", "EU"] }, T1);
    expect(updated.profileVersion).toBe(2);
    expect(updated.regions).toEqual(["CH", "EU"]);
  });

  it("is tenant-scoped: one workspace cannot read another's profile", async () => {
    const ctxA = await workspace("a@a.ch");
    const ctxB = await workspace("b@b.ch");
    await saveWorkspaceProfile(db, ctxA, SAMPLE, T0);
    expect(await getWorkspaceProfile(db, ctxB)).toBeNull();
  });
});
