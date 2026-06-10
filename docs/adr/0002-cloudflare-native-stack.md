# 0002 - Cloudflare-native stack, aligned with moola

- Status: accepted
- Date: 2026-06-10

## Context

The tech plan v1.0 recommended a Hetzner VPS (Docker Compose, Caddy) running a Next.js app plus a
long-running Node worker, with all state in Supabase (Postgres, Storage, pg-boss queue tables).
That recommendation was written against an older constraint set: serverless platforms could not
run Bidroom's multi-minute document pipeline (malware scan, parsing, OCR, several LLM passes,
Chromium PDF rendering).

Two things changed the picture. First, the platform constraints fell: Cloudflare Containers went
GA in April 2026 on the USD 5/month Workers Paid plan, Cloudflare Workflows provide durable
multi-step execution with built-in retries, and both D1 and R2 support a hard `jurisdiction=eu`
setting that guarantees data is stored and processed in the EU (a guarantee, unlike location
hints). Second, the founder runs his other product, moola, entirely on Cloudflare (Next.js via
OpenNext on Workers, D1, wrangler) and wants both projects on the same platform and conventions
wherever Bidroom does not genuinely need something different, to reduce solo-founder overhead.

## Decisions

1. Hosting: Next.js on Cloudflare Workers via OpenNext (same as moola). No VPS, no Docker
   Compose, no Caddy. Deploys via GitHub Actions and wrangler after the quality gate and e2e.
2. Repository shape: a single Next.js app with bounded `src/` folders enforced by ESLint boundary
   rules (moola ADR 0001 pattern), not a pnpm-workspaces monorepo. The pipeline Worker is a
   second wrangler config in the same repo (`src/pipeline/`); the parsing/scanning Container
   image lives in `container/`.
3. Database: Cloudflare D1 (SQLite) created with `jurisdiction=eu`. Drizzle ORM is kept despite
   moola using raw SQL: Bidroom has roughly 16 evolving entities versus moola's handful of
   tables, and typed schema plus generated migrations earn their place. D1 has no interactive
   transactions; multi-statement writes use `batch()`. Repository-only access is unchanged.
4. File storage: R2 bucket with `jurisdiction=eu`, private, presigned URLs.
5. Pipeline: Cloudflare Workflows replace pg-boss for `processDossier` (durable steps, retries,
   per-file fan-out). Queues handle simple async work (email); Cron Triggers handle retention
   cleanup and reminders.
6. Heavy compute: one Cloudflare Container (Node image) runs PDF/DOCX parsing and ClamAV,
   invoked from Workflow steps. Workers' 128 MB memory limit makes in-Worker parsing of 50 MB
   uploads unsafe; the Container runs full Node.
7. PDF export: Cloudflare Browser Rendering API replaces Playwright Chromium in a worker
   process. The print-route template approach is unchanged.
8. Auth: Bidroom ports moola's auth pattern instead of adopting Better Auth (founder decision).
   Magic-link only, no passwords stored, signed httpOnly session cookies (HMAC-SHA256),
   store-interface architecture on D1, rate-limited endpoints. Workspace invitations are signed
   single-use tokens on the same primitives. PRD US-002 explicitly allows a magic-link flow.
9. Internationalization: moola's typed dictionary pattern (`messages/*.json`), English first,
   German next. next-intl is not used.
10. Client state: Zustand where client state is needed (same as moola); processing-status
    polling is a small hook. TanStack Query is not used.
11. Error tracking: no Sentry at MVP (same as moola). Structured allowlist logs via Workers Logs
    plus the admin failure queue (WP-024), which groups pipeline failures by category in our own
    database. This also removes a US subprocessor from the privacy story. Revisit if pilot
    debugging proves painful.
12. Kept as planned (justified divergence or unchanged): shadcn/ui on Tailwind v4 (copied-in
    code that accelerates an accessible, dense B2B UI), Stripe, Resend, Plausible, Claude API
    plus Mistral OCR behind interfaces, Vitest plus Playwright, pnpm, the citation-verification
    design, and the repositories-only data-access rule.
13. Script and CI conventions follow moola: `pnpm gate` (lint, typecheck, test, check:format,
    check:copy, build), `cf:build`, `cf:preview`, `cf:deploy`, `cf-typegen`; the copy check
    blocks em dashes and prohibited phrases.
14. Backups: D1 Time Travel (30-day point-in-time restore) plus a scheduled D1 export to R2; the
    monthly restore drill stays.

## Consequences

- Vendor concentration: Cloudflare (a US company) now hosts compute, database, files, queue, and
  PDF rendering. Mitigations: `jurisdiction=eu` on D1 and R2 guarantees EU data residency,
  Cloudflare offers a GDPR-grade DPA, the database is standard SQLite and storage is
  S3-compatible (escape paths exist), and the prior Hetzner plus Supabase design remains
  documented in the tech plan Section 8 as the fallback if platform limits bite.
- SQLite constraints: no interactive transactions (use `batch()` and idempotent steps), 10 GB
  per-database cap. Both are acceptable at the target scale (hundreds of workspaces).
- The pipeline is split across Workflows, Queues, and a Container instead of one worker process.
  This is the main new design risk and replaces the old single-VPS reliability risk (tech plan
  R-11).
- We own auth security. Mitigations: the pattern is proven in moola and already
  founder-reviewed, no passwords exist to leak or stuff, and the mandatory auth test suite and
  rate limits from the tech plan Section 12 are unchanged.
- Fixed infrastructure cost drops (Workers Paid USD 5/month plus usage instead of VPS plus
  Supabase Pro); variable LLM/OCR cost is unaffected and remains the dominant cost.
- The two projects now share platform, deploy story, auth pattern, i18n pattern, and gate
  conventions, so knowledge and snippets transfer directly between moola and Bidroom.
