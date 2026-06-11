import { beforeEach, describe, expect, it } from "vitest";
import type { WorkspaceContext } from "@/server/authz/context";
import type { Db } from "@/server/db/client";
import { createDossierFromUrl } from "@/server/dossiers/service";
import { FixtureSimapClient, SAMPLE_NOTICE_URL } from "@/server/integrations/simap/client";
import { findOrCreateAccountByEmail } from "@/server/repositories/accounts";
import { createTestDb } from "@/server/repositories/testdb";
import type { Scanner } from "@/server/scan";
import { StubScanner } from "@/server/scan";
import { MemoryStorage, storageKey } from "@/server/storage";
import { createWorkspaceForAccount } from "@/server/workspaces/service";
import {
  deleteDossierFile,
  listDossierFiles,
  MAX_FILE_BYTES,
  uploadFileToDossier,
} from "./service";

const T0 = "2026-06-11T12:00:00.000Z";
const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

function buf(s: string): ArrayBuffer {
  const u = new TextEncoder().encode(s);
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

const PDF = buf("%PDF-1.4\nhello tender\n%%EOF");

describe("file upload service", () => {
  let db: Db;
  let storage: MemoryStorage;
  let scanner: StubScanner;
  let ctx: WorkspaceContext;
  let dossierId: string;

  beforeEach(async () => {
    db = createTestDb();
    storage = new MemoryStorage();
    scanner = new StubScanner();
    const account = await findOrCreateAccountByEmail(db, "owner@a.ch", T0);
    const ws = await createWorkspaceForAccount(db, {
      accountId: account.id,
      name: "Acme",
      workingLanguage: "en",
      nowIso: T0,
    });
    ctx = { accountId: account.id, workspaceId: ws.id, role: "owner" };
    const created = await createDossierFromUrl(
      db,
      ctx,
      new FixtureSimapClient(),
      SAMPLE_NOTICE_URL,
      T0,
    );
    if (!created.ok) throw new Error("setup failed");
    dossierId = created.dossier.id;
  });

  it("stores a clean PDF after a passing scan", async () => {
    const result = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctx,
      { dossierId, filename: "tender.pdf", bytes: PDF },
      T0,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.file.status).toBe("stored");
    expect(result.file.scanStatus).toBe("clean");
    expect(storage.has(storageKey(ctx.workspaceId, dossierId, result.file.id))).toBe(true);
  });

  it("blocks an infected file fail-closed and never stores it (R-SCAN-04)", async () => {
    // A PDF-typed file whose content carries the EICAR test signature.
    const infected = buf("%PDF-1.4\n" + EICAR + "\n%%EOF");
    const result = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctx,
      { dossierId, filename: "evil.pdf", bytes: infected },
      T0,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.file.status).toBe("failed");
    expect(result.file.scanStatus).toBe("infected");
    expect(storage.has(storageKey(ctx.workspaceId, dossierId, result.file.id))).toBe(false);
  });

  it("fails closed when the scanner errors", async () => {
    const throwing: Scanner = {
      async scan() {
        throw new Error("scanner down");
      },
    };
    const result = await uploadFileToDossier(
      db,
      storage,
      throwing,
      ctx,
      { dossierId, filename: "tender.pdf", bytes: PDF },
      T0,
    );
    expect(result.ok && result.file.status).toBe("failed");
    if (result.ok) expect(result.file.scanStatus).toBe("error");
  });

  it("flags an unsupported type and stores nothing", async () => {
    const result = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctx,
      { dossierId, filename: "drawing.dwg", bytes: buf("not a pdf") },
      T0,
    );
    expect(result.ok && result.file.status).toBe("unsupported");
  });

  it("flags an oversize file and stores nothing", async () => {
    const big = new ArrayBuffer(MAX_FILE_BYTES + 1);
    const result = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctx,
      { dossierId, filename: "huge.pdf", bytes: big },
      T0,
    );
    expect(result.ok && result.file.status).toBe("too_large");
  });

  it("does not allow uploading to another workspace's dossier (404)", async () => {
    const other = await findOrCreateAccountByEmail(db, "b@b.ch", T0);
    const wsB = await createWorkspaceForAccount(db, {
      accountId: other.id,
      name: "B",
      workingLanguage: "en",
      nowIso: T0,
    });
    const ctxB: WorkspaceContext = { accountId: other.id, workspaceId: wsB.id, role: "owner" };
    const result = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctxB,
      { dossierId, filename: "tender.pdf", bytes: PDF },
      T0,
    );
    expect(result).toEqual({ ok: false, reason: "not-found" });
  });

  it("lists and deletes a stored file", async () => {
    const created = await uploadFileToDossier(
      db,
      storage,
      scanner,
      ctx,
      { dossierId, filename: "tender.pdf", bytes: PDF },
      T0,
    );
    if (!created.ok) throw new Error("upload failed");
    expect(await listDossierFiles(db, ctx, dossierId)).toHaveLength(1);

    const key = storageKey(ctx.workspaceId, dossierId, created.file.id);
    expect(await deleteDossierFile(db, storage, ctx, created.file.id)).toBe(true);
    expect(await listDossierFiles(db, ctx, dossierId)).toHaveLength(0);
    expect(storage.has(key)).toBe(false);
  });
});
