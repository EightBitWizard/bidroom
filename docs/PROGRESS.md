# Build progress

A running record of what is built versus pending, kept up to date as work lands. For the full
target picture see `technical_architecture_and_implementation_plan.md` (work packages and phases)
and `bidroom_user_stories_and_requirements.md`; this file is the short status overview.

Last updated: 2026-06-10 (Cloudflare-native stack revision, ADR 0002)

## Resume here (next session)

Done: the three founding documents are complete (market analysis, PRD v0.9, tech plan v1.1). The
product was renamed from its earlier working name to Bidroom across all docs (ADR 0001).
CLAUDE.md, README.md, PROGRESS.md, OPERATOR_TODO.md, and docs/adr/ are set up. The architecture
was revised to a Cloudflare-native stack aligned with moola (ADR 0002): Workers via OpenNext, D1
and R2 with jurisdiction=eu, Workflows for the pipeline, one Container for parsing/ClamAV,
Browser Rendering for PDFs, moola's magic-link auth pattern, typed dictionary i18n, Zustand, no
Sentry, moola script conventions (pnpm gate, cf:deploy).

Next: Phase 0, the walking skeleton (tech plan Section 24, two-week timebox):

- WP-001 app and CI scaffold (single Next.js app, bounded src/ folders, eslint boundaries, Vitest,
  Playwright, typed message catalog, check-copy script, pnpm gate, GitHub Actions)
- WP-002 infrastructure and deploy (Cloudflare provisioning: Workers Paid, D1 and R2 with
  jurisdiction=eu, OpenNext deploy workflow - needs the domain decision D-03 and a Cloudflare API
  token, see OPERATOR_TODO)
- WP-003 schema v1 plus repositories pattern and authz module (Drizzle on D1)
- WP-004 auth and workspace shell (port moola's magic-link auth pattern)

WP-001 and WP-003 can start without any operator input. WP-002 needs D-03 (domain) and the
Cloudflare API token. After Phase 0, go straight at the pipeline (WP-010 to WP-024); the chain
WP-011 to WP-019 (intake, upload, extraction, citation verification, findings screen) is the
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
- ADR 0002: Cloudflare-native stack aligned with moola; D-01 (data residency) resolved via
  jurisdiction=eu on D1 and R2; auth = moola magic-link pattern, founder decision (2026-06-10)
- Open founder decisions D-02 to D-07 are listed in the tech plan Section 28 and mirrored in
  `docs/OPERATOR_TODO.md`
