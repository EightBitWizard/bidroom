# Build progress

A running record of what is built versus pending, kept up to date as work lands. For the full
target picture see `technical_architecture_and_implementation_plan.md` (work packages and phases)
and `bidroom_user_stories_and_requirements.md`; this file is the short status overview.

Last updated: 2026-06-11 (Phase 1 batch 2 landed: document upload + scan boundary, WP-012). All
commits are pushed to origin/main.

## Resume here (next session)

Phase 1 intake + upload are COMPLETE and on `main` (gate green, 83 unit/integration tests, 4
Playwright smoke tests, all pushed):

- WP-010 company profile and WP-011 SIMAP dossier intake (paste a SIMAP URL -> the official notice is
  fetched via the public read-only client, stored verbatim, and a tenant-scoped dossier is created;
  ADR 0004).
- WP-012 document upload: attach tender PDF/DOCX files to a dossier behind a fail-closed malware-scan
  boundary (ADR 0005, R-SCAN-04). `Storage` and `Scanner` are interfaces (R2 + the parsing Container
  in production; in-memory + an EICAR stub in dev/test). A file's bytes are stored in R2 only after a
  clean scan; oversize, unsupported, infected, and scanner-error outcomes are flagged not stored
  (TND-004/005). Upload/list/delete routes and an upload UI on the dossier detail.

Next: the analysis pipeline that produces the brief - WP-013 text extraction with anchors, then
WP-014 OCR, WP-016 LLM extraction, WP-017 citation verification, WP-018 brief assembly, WP-019 the
brief UI. WP-013 (PDF/DOCX text extraction) runs in the parsing Container and can begin against
fixture documents; WP-016+ need the Anthropic + Mistral keys and the 15-30 tender eval corpus
(operator items). The SIMAP exact URL parsing (ADR 0004) and the ClamAV Container + live R2 (ADR
0005) are wired at provisioning.

Provisioning is now on the critical path for visible end-to-end value: the Cloudflare account/token,
D1/R2/KV, the parsing Container, and the LLM/OCR keys + eval corpus are all in `docs/OPERATOR_TODO.md`.

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
- Phase 1 MVP core: IN PROGRESS. Done: WP-010 company profile, WP-011 SIMAP dossier intake, WP-012
  document upload + scan boundary. Next: WP-013 to WP-019 extraction/LLM pipeline (needs the parsing
  Container for extraction, and the LLM/OCR keys + eval set for findings)
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
