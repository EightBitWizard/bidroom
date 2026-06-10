import { defineConfig } from "drizzle-kit";

// Drizzle migration generation (ADR 0002). The schema is the single source of truth;
// `pnpm db:generate` emits forward-only SQL migrations into src/server/db/migrations,
// which `wrangler d1 migrations apply` runs against D1. Tests apply the same generated
// SQL against an in-memory better-sqlite3 database.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
});
