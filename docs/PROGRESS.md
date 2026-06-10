# Build progress

A running record of what is built versus pending, kept up to date as work lands. For the full
target picture see `technical_architecture_and_implementation_plan.md` (work packages and phases)
and `bidroom_user_stories_and_requirements.md`; this file is the short status overview.

Last updated: 2026-06-10 (rename to Bidroom, agent rules, workflow docs)

## Resume here (next session)

Done: the three founding documents are complete (market analysis, PRD v0.9, tech plan v1.0). The
product was renamed from its earlier working name to Bidroom across all docs (ADR 0001).
CLAUDE.md, README.md, PROGRESS.md, OPERATOR_TODO.md, and docs/adr/ are set up.

Next: Phase 0, the walking skeleton (tech plan Section 24, two-week timebox):

- WP-001 monorepo and CI scaffold (pnpm workspaces, Next.js app, worker stub, shared/domain/server
  packages, eslint boundaries, Vitest, Playwright, GitHub Actions)
- WP-002 infrastructure and deploy (Hetzner VPS, Docker Compose, Supabase project - needs operator
  decisions D-01 and D-03 first, see OPERATOR_TODO)
- WP-003 schema v1 plus repositories pattern and authz module
- WP-004 auth and workspace shell (Better Auth)

WP-001 and WP-003 can start without any operator input. WP-002 needs the Supabase region decision
(D-01) and the domain (D-03). After Phase 0, go straight at the pipeline (WP-010 to WP-024); the
chain WP-011 to WP-019 (intake, upload, extraction, citation verification, findings screen) is the
product.

## Phase status (tech plan Section 24)

- Phase 0 foundation: NOT STARTED
- Phase 1 MVP core product: not started
- Phase 2 trust, payments, launch readiness: not started
- Phase 3 retention and paid depth: not started

In parallel with Phase 1 the founder runs concierge validation (business plan: 3 paid pilots,
15 strong interviews) - tracked in OPERATOR_TODO, does not block development.

## Decisions log

- ADR 0001: product renamed from the earlier working name to Bidroom (2026-06-10)
- Open founder decisions D-01 to D-07 are listed in the tech plan Section 28 and mirrored in
  `docs/OPERATOR_TODO.md`
