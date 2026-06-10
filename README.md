# Bidroom

Supplier-side software for Swiss companies bidding on public tenders via SIMAP. Paste a SIMAP notice URL, upload the tender documents, and get a source-linked qualification brief: likely blockers, deadlines, award criteria, required evidence, a checklist tied to a reusable evidence library, and a recorded Bid/Pass/Hold decision, exportable as PDF.

Bidroom is decision support, not legal advice. It does not discover tenders, draft proposals, or submit bids. This is not an official publication; the data published on the www.simap.ch platform are authoritative.

## Status

Documentation phase. No code yet; Phase 0 (walking skeleton) has not started. See `docs/PROGRESS.md` for the current build status and `docs/OPERATOR_TODO.md` for founder action items.

## Documentation map

| Document | Purpose |
| --- | --- |
| `docs/bidroom_market_analysis.md` | Market analysis and business plan: wedge, competition, pricing, validation plan |
| `docs/bidroom_user_stories_and_requirements.md` | PRD v0.9: personas, epics, user stories, requirement IDs, MVP definition |
| `docs/technical_architecture_and_implementation_plan.md` | Tech plan v1.0: stack, architecture, cost model, work packages WP-001 to WP-037, phases |
| `docs/PROGRESS.md` | Running build status and resume-here notes |
| `docs/OPERATOR_TODO.md` | Manual actions and decisions only the founder can take |
| `docs/adr/` | Architecture decision records |
| `CLAUDE.md` | Working rules for AI coding agents |

## Planned stack (tech plan Section 7)

TypeScript monorepo (pnpm workspaces): Next.js App Router plus a Node worker, Docker Compose with Caddy on one Hetzner VPS; Supabase Postgres and Storage (EU); Drizzle ORM; pg-boss; Better Auth; Zod; Tailwind plus shadcn/ui; Claude API (Sonnet extraction, Haiku triage) with citation verification; Mistral OCR; Stripe; Resend; Plausible; Sentry; Vitest plus Playwright.

## Planned commands (available once Phase 0 lands)

```bash
pnpm setup        # install, start local supabase, migrate, seed
pnpm dev          # web app
pnpm worker:dev   # worker
pnpm test         # unit plus integration
pnpm test:e2e     # playwright
pnpm test:eval    # extraction evaluation set
pnpm lint && pnpm typecheck && pnpm build
```
