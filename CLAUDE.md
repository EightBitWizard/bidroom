# Bidroom coding agent instructions

## Product context

Bidroom is supplier-side software for Swiss companies bidding on public tenders via SIMAP. The user pastes a SIMAP notice URL, uploads the tender documents they already obtained, and receives a source-linked qualification brief: likely blockers, deadlines, award criteria, required evidence, a checklist tied to a reusable evidence library, and a recorded Bid/Pass/Hold decision, exportable as PDF.

Bidroom is decision support, not legal advice. It does not discover tenders, draft proposals, or submit bids. Trust comes from source citations, visible uncertainty, and a strict separation between official SIMAP data and Bidroom analysis.

The canonical source documents are:

- `docs/technical_architecture_and_implementation_plan.md` (tech plan)
- `docs/bidroom_user_stories_and_requirements.md` (PRD)
- `docs/bidroom_market_analysis.md` (business plan)

If the documents conflict, use this priority:

1. Current explicit user instruction
2. The PRD for product behavior and requirements (requirement IDs like ANA-003, LEG-001)
3. The tech plan for architecture, stack, and phasing (work packages WP-001 to WP-037)
4. The market analysis for positioning, pricing, and go-to-market

## Non-negotiable style rules

- Never use the Unicode em dash U+2014 anywhere: code, comments, docs, UI copy, commit messages, test names, fixtures. Use the plain ASCII hyphen-minus `-`.
- Default to no emojis. Use one only if the user explicitly asks.
- Calm, precise, audit-friendly language in all copy. No hype, no AI-generated tone, no filler.
- Prohibited phrases anywhere in product copy or marketing (PRD list): "official SIMAP partner" (unless contractually true), "guaranteed eligible", "guaranteed compliant submission", "win more tenders automatically", "we file the bid for you", "no human review needed".
- Preferred wording: "potential blocker", "needs review", "based on provided documents", "estimate", "under these assumptions".

## Architecture invariants

- Cloudflare-native, aligned with moola (ADR 0002): one Next.js app deployed to Workers via OpenNext, plus a pipeline Worker (second wrangler config, same repo) and one Container for parsing and malware scanning. Single app with bounded `src/` folders enforced by ESLint boundary rules; no pnpm-workspaces monorepo. Do not add services, queues, databases, or vendors without explicit founder approval.
- All state lives in Cloudflare D1 and R2, both created with `jurisdiction=eu`. The code is stateless; everything redeploys with wrangler.
- `src/domain` imports only `src/shared`. No React, no DB, no network. Fully unit-testable.
- `src/server/repositories` is the only module that touches the Drizzle client. Every repository function takes a non-optional verified `WorkspaceContext` from the authz module. D1 has no row-level security and no interactive transactions; this module is the only tenant barrier, and multi-statement writes use `batch()` and idempotent steps. The foreign-workspace authz matrix (every API route 403/404 under a foreign-workspace session) is a blocking gate from the first tenant-owned table (ADR 0003).
- UI components contain no business logic; data arrives via server components or server actions calling `server/services`.
- Anything over ~2 seconds of work runs in the dossier Workflow, a Queue consumer, or a Cron handler; never in request handlers. Pipeline steps are plain, portable functions.
- Auth follows moola's HARDENED pattern (ADR 0003): magic-link only, no passwords; server-side session revocation via `session_version`; interstitial POST-to-consume callback so scanners cannot burn links; durable KV rate limiting keyed by email and IP; `isSameOriginRequest` guard on every state-changing route; token housekeeping. Workspace invitations are email-bound, atomic single-use tokens with the role looked up server-side at acceptance (never trusted from the token) and seat revalidated.
- Client state uses Zustand where needed (same as moola); i18n uses the typed dictionary pattern (`messages/*.json`), never hardcoded strings.
- Citations are a first-class data structure. Every material finding stores a verified source excerpt and locator, or is explicitly marked unsupported. Never weaken the citation verification step.
- Official SIMAP source fields are stored verbatim (`raw_source`) and displayed unmodified, always with the required disclaimer component.
- Entitlements and plan limits are read from our database, never inferred from Stripe at request time.
- Prompts are versioned assets; changing them requires re-running the evaluation set.

## Hard product and legal boundaries (never violate)

- No SIMAP submission features, no QES signature validation, no SIMAP credential storage, no scraping. Notice metadata comes only from the public read-only SIMAP API, user-initiated.
- No modification of official source fields (LEG-002). No removal or weakening of the SIMAP disclaimer in UI or PDF (LEG-001).
- No competitor-pricing, bid-coordination, or collusion-adjacent features (LEG-005). Reject tickets that drift there.
- No copy implying legal advice, official status, or guarantees (LEG-003).
- No proposal drafting, no tender discovery/monitoring, no public tender mirror in the current scope. Tickets that drift toward these are rejected unless the roadmap changes.

## Privacy and security rules

- Never log, email, or send to analytics any document content or extracted personal data. The logger uses an allowlist; there is no error-tracking SaaS at MVP (same as moola). Product analytics are metadata-only event rows in our own D1 (the PRD-approved event list only).
- Never send account PII to LLM providers. Only extraction text goes to Claude/Mistral OCR; both are disclosed subprocessors; no training on customer content. The no-account-PII-to-LLM invariant is asserted in code and tests, not left to convention (ADR 0003).
- Uploads are fail-closed: no file is parsed before the ClamAV scan passes, parsing runs in the Container with constrained outbound network, and an EICAR test guards the boundary in CI.
- Never weaken the authz module, the durable rate limiter, session revocation, the cross-site (`isSameOriginRequest`) guard, the upload malware scan, the citation verification step, or webhook signature verification (ADR 0003).
- Admin/support is metadata-first; document access only via logged, time-bounded break-glass with a reason.
- Secrets only in wrangler secrets, `.dev.vars`, and GitHub encrypted secrets, never in the repo. Adding an env var or binding requires updating `.env.example` and `docs/deployment.md` in the same commit.
- Export and deletion are real product workflows (FADP rights), not back-office favors.

## Engineering workflow

For every non-trivial task:

1. Explore first. Read the relevant docs page and the ticket's requirement IDs (epic, story, requirement) before editing.
2. State the plan before broad changes: files, schema changes, tests, and docs you will touch. Confirm if scope exceeds the ticket.
3. Write or update tests before or alongside implementation.
4. Implement in small increments. One ticket, one verifiable outcome.
5. Run the smallest relevant test first, then the full quality gate before commit.
6. Update documentation and `.env.example` in the same logical change.
7. Commit a single coherent block with a descriptive conventional-commit message referencing requirement IDs.

Schema and migration changes ship first and separately; never mix a migration with a behavior change in one commit. Migrations are forward-only; destructive changes ship in two steps (expand, later contract).

## Test policy

- No new domain logic without tests. No bug fix without a failing regression test first, unless impossible; then explain why in the commit.
- No new UI flow without component, integration, or Playwright coverage.
- The cross-tenant authz matrix is mandatory: every API route tested with a foreign-workspace session (must 403/404).
- The extraction evaluation set (15 to 30 labeled real tenders) is the product's CI: no prompt or model change merges without passing its thresholds (blocker precision high, deadline accuracy 95%, zero fabricated citations). Grow it with every pilot error found.
- LLM and OCR calls are mocked with recorded fixtures in tests; live API calls only behind an explicit env flag (`LLM_USE_FIXTURES=true` is the local default).
- `domain/`, `extraction/citationVerify`, `authz`, and `entitlements` at or near full branch coverage.

## Quality gate

Before committing, run the project quality gate. If exact commands differ, discover them from `package.json` and update this section. Expected gate (tech plan Section 21, moola conventions):

- `pnpm gate` runs lint (ESLint plus boundaries rule), typecheck, test (unit plus integration), check:format, check:copy, and build
- `pnpm test:e2e` when UI or flows changed
- `pnpm test:eval` when prompts or extraction changed

`check:copy` must fail if an em dash appears anywhere in tracked source, docs, or copy, or if a prohibited phrase or the old product name appears; CI adds gitleaks for secrets.

## Documentation policy

Documentation is part of the implementation, not a later cleanup task. A change to behavior, dependencies, env vars, data model, integrations, or legal-relevant behavior without the corresponding doc update is incomplete.

Maintain (per tech plan Section 22, as the repo grows): `README.md`, `docs/adr/`, `docs/setup.md`, `docs/deployment.md`, `docs/testing.md`, `docs/data-model.md`, `docs/api.md`, `docs/security.md`, `docs/privacy.md`, `docs/prompts.md`, `docs/runbook.md`, `CHANGELOG.md`. Keep `docs/PROGRESS.md` and `docs/OPERATOR_TODO.md` current as work lands.

Keep the implementation plan's status current: the tech plan Section 25 has an "Implementation status" marker listing which work packages are done, in progress, and not started. Update it at the end of every batch so the plan always reflects reality.

## Git policy

During early development, committing directly to `main` is allowed if the quality gate passes. Keep commits small and logical.

- One coherent change per commit; do not mix unrelated refactors, features, and formatting.
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`, `ci:`. Reference requirement IDs in the body.
- Push to `origin/main` after each commit so the remote stays current. If a push fails for authentication, record it in `docs/OPERATOR_TODO.md` rather than leaving commits silently unpushed.
- Include tests and docs in the same commit as the behavior change.
- Never commit secrets, tokens, private keys, credentials, or real customer data (including pilot tender documents without written permission and anonymization).
- Before committing, show a short summary of changed files, tests run, and remaining risks.

From paid launch: short-lived branches plus PRs with the checklist, tagged releases, CHANGELOG maintained.

## Dependencies and cost

- No new dependency without a one-paragraph justification (need, alternatives, license, maintenance status).
- Ask before changes that materially increase per-dossier LLM cost, add paid vendor usage, or are irreversible (data deletion, migration contractions, key rotation).
- Record cost per AnalysisRun from the first pipeline version; respect the daily AI spend cap.

## AI agent behavior

- Do not guess silently. If implementation reveals a real product ambiguity, write a short decision record in `docs/adr/` or ask, instead of silently choosing.
- Do not claim something is done unless commands have been run and results are visible. Prefer evidence: test output, build output, screenshots for UI changes.
- The citation standard applies to you too: do not invent vendor capabilities, prices, or SIMAP behavior; check official docs or flag uncertainty.
- For security, privacy, billing, authz, and prompt changes, perform an adversarial self-review before committing; the founder reviews all schema, authz, billing, and prompt changes.
- Work that needs the founder (accounts, secrets, legal, purchases) goes into `docs/OPERATOR_TODO.md` and never blocks other development.
