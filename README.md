# Bidroom

Supplier-side software for Swiss companies bidding on public tenders via SIMAP. Paste a SIMAP notice URL, upload the tender documents, and get a source-linked qualification brief: likely blockers, deadlines, award criteria, required evidence, a checklist tied to a reusable evidence library, and a recorded Bid/Pass/Hold decision, exportable as PDF.

Bidroom is decision support, not legal advice. It does not discover tenders, draft proposals, or submit bids. This is not an official publication; the data published on the www.simap.ch platform are authoritative.

## Status

Phase 0 (the foundation) and the first two Phase 1 batches have landed: the gate, CI, Cloudflare config, the multi-tenant schema and authz, the hardened magic-link auth ported from moola, the workspace shell, dossier intake (a company profile plus creating a dossier from a SIMAP notice URL, with the official notice shown verbatim and the required disclaimer), and document upload behind a fail-closed malware-scan boundary. The live Cloudflare provisioning (real D1/R2/KV, the parsing Container, domain) and the LLM/OCR keys for the analysis pipeline remain operator tasks. See `docs/PROGRESS.md` for the current build status, `docs/setup.md` to run it locally, and `docs/OPERATOR_TODO.md` for founder action items.

## Documentation map

| Document                                                 | Purpose                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `docs/bidroom_market_analysis.md`                        | Market analysis and business plan: wedge, competition, pricing, validation plan         |
| `docs/bidroom_user_stories_and_requirements.md`          | PRD v0.9: personas, epics, user stories, requirement IDs, MVP definition                |
| `docs/technical_architecture_and_implementation_plan.md` | Tech plan v1.0: stack, architecture, cost model, work packages WP-001 to WP-037, phases |
| `docs/PROGRESS.md`                                       | Running build status and resume-here notes                                              |
| `docs/OPERATOR_TODO.md`                                  | Manual actions and decisions only the founder can take                                  |
| `docs/adr/`                                              | Architecture decision records                                                           |
| `CLAUDE.md`                                              | Working rules for AI coding agents                                                      |

## Planned stack (tech plan Section 7, ADR 0002)

Cloudflare-native, aligned with the founder's moola project: a single Next.js (App Router) app on Cloudflare Workers via OpenNext, plus a pipeline Worker (Workflows, Queues, Cron) and one Container for parsing and ClamAV; D1 and R2 with `jurisdiction=eu`; Drizzle ORM; magic-link auth ported from moola (no passwords); Zod; Zustand; typed dictionary i18n; Tailwind v4 plus shadcn/ui; Claude API (Sonnet extraction, Haiku triage) with citation verification; Mistral OCR; Browser Rendering for PDF exports; Stripe; Resend; Plausible; Vitest plus Playwright.

## Planned commands (available once Phase 0 lands, moola conventions)

```bash
pnpm dev          # next dev
pnpm test         # unit plus integration
pnpm test:e2e     # playwright
pnpm test:eval    # extraction evaluation set
pnpm gate         # lint, typecheck, test, check:format, check:copy, build
pnpm cf:preview   # build and preview on the local workerd runtime
pnpm cf:deploy    # build and deploy
```
