import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { Db } from "@/server/db/client";
import * as schema from "@/server/db/schema";

const MIGRATIONS_DIR = join(process.cwd(), "src/server/db/migrations");

/**
 * Build a Drizzle client over a fresh in-memory SQLite, with the real generated migrations
 * applied. The production code uses drizzle-orm/d1; this uses drizzle-orm/better-sqlite3 over
 * the identical schema and migration SQL, so the repository code under test is the same one
 * that runs against D1. The cast bridges the two drivers (the query-builder surface and
 * awaited results are identical at runtime).
 */
export function createTestDb(): Db {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  applyMigrations(sqlite);
  return drizzle(sqlite, { schema }) as unknown as Db;
}

function applyMigrations(sqlite: Database.Database): void {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      const trimmed = statement.trim();
      if (trimmed) sqlite.exec(trimmed);
    }
  }
}
