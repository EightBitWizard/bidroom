# Build progress

A running record of what is built versus pending, kept up to date as work lands. For the full
target picture see `technical_architecture_and_implementation_plan.md` (work packages and phases)
and `bidroom_user_stories_and_requirements.md`; this file is the short status overview.

Last updated: 2026-06-11 (Phase 1 batch 1 landed: dossier intake, WP-010 + WP-011)

## Resume here (next session)

Phase 1 batch 1 (dossier intake) is COMPLETE and on `main` (gate green, 71 unit/integration tests,
4 Playwright smoke tests):

- WP-010 company profile: one versioned profile per workspace, tenant-scoped, with a form.
- WP-011 SIMAP intake: paste a SIMAP notice URL -> the public read-only SIMAP client fetches the
  notice (isolated in `src/server/integrations/simap`, mockable with a recorded fixture, ADR 0004)
  -> the official data is stored verbatim (`tender_source_items.raw_source`, LEG-002) -> a
  tenant-scoped dossier is created -> the dossier detail shows the official fields under an
  "Official source" heading with the `SourceDisclaimer`, separated from a "Bidroom analysis"
  placeholder. Non-SIMAP URLs are rejected (TND-002); duplicate notices in a workspace reuse the
  existing dossier. The foreign-workspace authz matrix now covers dossiers and profiles.

Next: Phase 1 continues toward the brief. The honest next frontiers each have an operator
dependency:

- WP-012 document upload + the fail-closed ClamAV Container: needs R2 provisioning and the
  Cloudflare Container (image + binding). Build the upload + scan interface, wire the Container at
  provisioning.
- WP-013 to WP-019 extraction -> LLM findings -> citation verification -> the brief UI: needs the
  Anthropic + Mistral API keys and the 15-30 tender eval corpus (operator items). The pipeline is
  built against recorded fixtures (LLM_USE_FIXTURES default); live runs need the keys.

The SIMAP exact URL parsing and field mapping (ADR 0004) are refined against a real notice URL
during rollout; the tolerant parser plus the manual-entry fallback cover the interim.

## Earlier resume note (Phase 0)

Phase 0 (the foundation) is on `main` (the auth, multi-tenant workspaces, and the gate):

- WP-001 scaffold + CI (pnpm gate, ESLint boundaries, check-copy, i18n, landing, gitleaks/dependabot).
- WP-002 Cloudflare config (wrangler.jsonc with DB/KV/R2 bindings, OpenNext, drizzle.config, deploy
  workflow, setup.md/deployment.md). Live provisioning is operator-blocked (D-03 domain, API token,
  KV namespace) in docs/OPERATOR_TODO.md.
- WP-003 schema v1 (Drizzle: accounts+session_version, auth_tokens, workspaces, memberships,
  invitations, audit_events) plus repositories and the authz module; the foreign-workspace authz
  matrix is a blocking test gate.
- WP-004 hardened magic-link auth ported from moola (session_version revocation, interstitial
  POST-to-consume, durable KV limiter, isSameOriginRequest, token housekeeping), the multi-tenant
  workspace/invitation routes, and the workspace UI shell. The signup-to-workspace backend flow is
  covered end to end by src/server/flow.test.ts against real SQLite.

Next: Phase 1 MVP core (tech plan Section 24). Start the dossier chain that is the product:

- WP-010 company profile, WP-011 SIMAP URL intake (needs the public SIMAP API client), WP-012 file
  upload + fail-closed Container scan, then WP-013 to WP-019 (extraction, citation verification,
  findings screen). WP-011 onward needs the Anthropic/Mistral accounts and the SIMAP access posture
  (operator items). WP-010 can start without operator input.

Operator items to unblock production sign-in: the Cloudflare API token, the D1 database id (run the
provisioning in docs/deployment.md), and the RATE_LIMIT_KV namespace; then `wrangler d1 migrations
apply` + `cf:deploy`. A Playwright pass of the live signup flow against the OpenNext preview runtime
is a follow-up once a local D1 is seeded.

## Earlier resume note (superseded)

Done: the three founding documents are complete (market analysis, PRD v0.9, tech plan v1.1). The
product was renamed from its earlier working name to Bidroom across all docs (ADR 0001).
CLAUDE.md, README.md, PROGRESS.md, OPERATOR_TODO.md, and docs/adr/ are set up. The architecture
was revised to a Cloudflare-native stack aligned with moola (ADR 0002): Workers via OpenNext, D1
and R2 with jurisdiction=eu, Workflows for the pipeline, one Container for parsing/ClamAV,
Browser Rendering for PDFs, moola's magic-link auth pattern, typed dictionary i18n, Zustand, no
Sentry, moola script conventions (pnpm gate, cf:deploy). The cross-project risk assessment
(`docs/RISK_ASSESSMENT.md`) was then baked into the plan as ADR 0003: WP-004 ports moola's HARDENED
auth, and the multi-tenant authz matrix, invitation security, scan boundary, and citation/eval
trust gates are committed as blocking gates.

Next: Phase 0, the walking skeleton (tech plan Section 24, two-week timebox):

- WP-001 app and CI scaffold (single Next.js app, bounded src/ folders, eslint boundaries, Vitest,
  Playwright, typed message catalog, check-copy script, pnpm gate, GitHub Actions, gitleaks + dependabot)
- WP-002 infrastructure and deploy (Cloudflare provisioning: Workers Paid, D1 and R2 with
  jurisdiction=eu, OpenNext deploy workflow - needs the domain decision D-03 and a Cloudflare API
  token, see OPERATOR_TODO)
- WP-003 schema v1 (users with session_version) plus repositories with non-optional WorkspaceContext;
  the foreign-workspace authz matrix is a blocking gate from the first tenant table
- WP-004 auth and workspace shell: port moola's HARDENED pattern (session_version revocation,
  interstitial POST-to-consume, durable KV limiter by email+IP, isSameOriginRequest, token
  housekeeping) plus email-bound atomic single-use invitations with server-side role lookup. Needs
  the RATE_LIMIT_KV namespace (operator item)

WP-001 and WP-003 can start without any operator input. WP-002 needs D-03 (domain) and the
Cloudflare API token; WP-004 needs the KV namespace. After Phase 0, go straight at the pipeline
(WP-010 to WP-024); the chain WP-011 to WP-019 (intake, upload, extraction, citation verification,
findings screen) is the product.

## Phase status (tech plan Section 24)

- Phase 0 foundation: COMPLETE (WP-001 to WP-004; live Cloudflare provisioning operator-blocked)
- Phase 1 MVP core: IN PROGRESS. Done: WP-010 company profile, WP-011 SIMAP dossier intake. Next:
  WP-012 upload + Container (needs R2/Container), WP-013 to WP-019 pipeline (needs LLM/OCR keys + eval set)
- Phase 1 MVP core product: not started
- Phase 2 trust, payments, launch readiness: not started
- Phase 3 retention and paid depth: not started

In parallel with Phase 1 the founder runs concierge validation (business plan: 3 paid pilots,
15 strong interviews) - tracked in OPERATOR_TODO, does not block development.

## Decisions log

- ADR 0001: product renamed from the earlier working name to Bidroom (2026-06-10)
- ADR 0002: Cloudflare-native stack aligned with moola; D-01 (data residency) resolved via
  jurisdiction=eu on D1 and R2; auth = moola magic-link pattern, founder decision (2026-06-10)
- ADR 0003: security model. Cross-project risk assessment (`docs/RISK_ASSESSMENT.md`) baked into the
  plan; WP-004 ports moola's HARDENED auth (session_version revocation, interstitial POST-to-consume,
  durable KV limiter by email+IP, isSameOriginRequest, token housekeeping); WP-003/WP-004 carry the
  multi-tenant authz matrix and invitation security as blocking gates; document-at-rest, scan
  boundary, and citation/eval trust gates committed; email-as-single-factor accepted with a
  paid-launch revisit. Mirrors moola ADR 0035 (2026-06-10)
- Open founder decisions D-02 to D-07 are listed in the tech plan Section 28 and mirrored in
  `docs/OPERATOR_TODO.md`
