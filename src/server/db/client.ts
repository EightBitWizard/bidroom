import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Create the Drizzle client over a Cloudflare D1 binding. The param type is derived from
 * drizzle itself, so no `@cloudflare/workers-types` global is required for typecheck. The
 * integration tests build the same `Db` type over an in-memory better-sqlite3 database
 * (see repositories/testdb.ts); the repository code is identical for both.
 */
export function createDb(d1: Parameters<typeof drizzle>[0]) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;
