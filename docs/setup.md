# Local setup

Bidroom is a single Next.js app on Cloudflare (Workers via OpenNext, D1, R2, KV), aligned with the
moola project (ADR 0002). This page gets a fresh machine to a running local stack.

## Prerequisites

- Node 22 (`.nvmrc`); `nvm use` if you use nvm.
- pnpm 10.30 via Corepack: `corepack enable`.

## Install

```bash
pnpm install
```

This builds the native `better-sqlite3` binding used by the integration tests (allowed via
`pnpm.onlyBuiltDependencies` in `package.json`).

## Environment

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars` is read by the Workers runtime during local development and is gitignored. The defaults
make local sign-in work: a 32+ character `SESSION_SECRET` and `DEV_EMAIL_CONSOLE=true`, which prints
the magic-link URL to the terminal instead of sending an email. See `.env.example` for the full
variable list (LLM, OCR, email, Stripe arrive in later work packages).

## Run

```bash
pnpm dev          # Next.js dev server with the Cloudflare bindings simulated locally
```

`next dev` mirrors the Workers runtime via `initOpenNextCloudflareForDev()`, so the local D1, R2, and
KV bindings declared in `wrangler.jsonc` are available without provisioning anything in the cloud.

## Database (local)

The Drizzle schema lives in `src/server/db/schema.ts`. Generate migrations from it and apply them to
the local D1:

```bash
pnpm db:generate                          # emit SQL into src/server/db/migrations
pnpm exec wrangler d1 migrations apply bidroom --local
```

## Quality gate and tests

```bash
pnpm gate         # lint (+ boundaries), typecheck, test, format check, copy check, build
pnpm test         # unit + integration (vitest)
pnpm test:e2e     # Playwright (builds and serves on port 3100)
```

The gate must pass before every commit. The integration tests run the real Drizzle repositories and
the generated migrations against an in-memory SQLite (`better-sqlite3`); production uses the D1
binding.
