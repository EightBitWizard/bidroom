import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// The Drizzle client and the SQLite drivers may be imported only by the repository
// and db layers. Everything else reaches the database through a repository function
// that takes a verified WorkspaceContext (ADR 0003, the tenant-isolation control).
const DB_IMPORT_RESTRICTION = {
  paths: [
    {
      name: "better-sqlite3",
      message: "Only src/server/repositories and src/server/db touch the database driver.",
    },
  ],
  patterns: [
    {
      group: ["drizzle-orm", "drizzle-orm/*"],
      message: "Only src/server/repositories and src/server/db may import the Drizzle client.",
    },
  ],
};

const config = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
      "src/server/db/migrations/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Baseline: nothing under src/ imports the database driver directly.
    // The repository and db layers re-enable it below (last matching block wins).
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-restricted-imports": ["error", DB_IMPORT_RESTRICTION],
    },
  },
  {
    // The only place allowed to import the Drizzle client and the driver.
    files: ["src/server/repositories/**/*.ts", "src/server/db/**/*.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    // Architecture invariant: domain logic stays pure and UI/DB/framework-independent.
    // It imports only src/shared. Fully unit-testable (CLAUDE.md, ADR 0002).
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "The domain must stay UI-independent." },
            { name: "react-dom", message: "The domain must stay UI-independent." },
            { name: "next", message: "The domain must stay UI-independent." },
            { name: "zustand", message: "The domain must not depend on UI state." },
            { name: "better-sqlite3", message: "The domain must not touch the database." },
          ],
          patterns: [
            {
              group: ["drizzle-orm", "drizzle-orm/*"],
              message: "The domain must not touch the database.",
            },
            {
              group: ["@/server/*", "@/app/*", "@/components/*", "next/*"],
              message: "The domain may import only @/shared.",
            },
          ],
        },
      ],
    },
  },
  {
    // Presentational components contain no business logic and never import server-only
    // modules; data arrives via server components, route handlers, or server actions.
    files: ["src/components/**/*.ts", "src/components/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "better-sqlite3", message: "Components must not touch the database." }],
          patterns: [
            {
              group: ["drizzle-orm", "drizzle-orm/*"],
              message: "Components must not touch the database.",
            },
            { group: ["@/server/*"], message: "Components must not import server-only modules." },
          ],
        },
      ],
    },
  },
];

export default config;
