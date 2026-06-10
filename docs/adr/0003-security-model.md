# 0003 - Security model: hardened auth port plus multi-tenant and document controls

- Status: accepted
- Date: 2026-06-10

## Context

A cross-project security and risk assessment (`docs/RISK_ASSESSMENT.md`, a multi-agent audit
adversarially verified against the moola codebase) examined the hand-written magic-link auth that
Bidroom plans to reuse (ADR 0002). Its verdict: the cryptographic core is sound and the danger in
self-written auth is the surrounding controls, not the primitives. It also found that the larger
Bidroom-specific risk is not auth at all; it is making moola's single-user pattern multi-tenant over
a store of uploaded customer documents, where a single isolation bug exposes Class A personal data
across companies.

After that assessment, moola implemented its code-side P0/P1 items (its ADR 0035) while its backend
was dormant. Bidroom still has no code, so the cheapest possible moment to bake the same controls in
is now, before the first work package. This ADR records what Bidroom adopts from moola's hardened
pattern and the controls Bidroom must add that moola never needed because moola is single-user and
local-first.

## Decisions

### Adopted from moola's hardened auth (port the post-ADR-0035 pattern, not the original)

"Port moola's auth" means port the hardened version. These controls come across as proven, tested
patterns and must be present from WP-004, not deferred:

1. Server-side session revocation. The user/account row carries a `session_version`; the signed
   session embeds it (`ver`, integer-validated like `exp`); the session resolver rejects a mismatch
   using the account row it already reads (zero extra reads). Logout bumps the version, revoking all
   of that account's sessions including a stolen cookie. Same mechanism serves incident response and
   secret rotation.
2. Interstitial POST-to-consume magic link. The callback GET renders a confirm page
   (`Referrer-Policy: no-referrer`, `no-store`, `noindex`, `frame-ancestors none`, regex-gated
   base64url token); only the form POST consumes the token, so email scanners and link prefetch
   cannot burn or redeem a link.
3. Durable rate limiting. A KV-backed fixed-window limiter (moola's `KVRateLimiter` shape), durable
   across Workers isolates, keyed by both email and client IP, on link issuance and on the consume
   path. Per-IP throttling runs before any account work, closing the vary-the-email
   account-creation flood. No in-memory-only limiter in production.
4. Auth-token housekeeping. Every issuance purges used and expired tokens and caps outstanding
   tokens per account.
5. Cross-site request guards. An `isSameOriginRequest` check (Origin host match or Sec-Fetch-Site
   same-origin/none; absent headers pass for non-browser clients) on every state-changing route
   plus the consume POST, as defense in depth over `SameSite=Lax`. On the consume POST it also
   closes login CSRF.
6. Webhook integrity (Phase 2, Stripe). Event-id dedup via a `processed_events` table with the id
   recorded only after the entitlement write succeeds, an out-of-order guard via
   `last_event_created`, and a period-end backstop in plan resolution independent of webhook
   delivery.
7. CI and secrets hygiene. A gitleaks full-history job gating CI, Dependabot for npm and actions,
   and a tracked `.env.example` (names only).

Concrete moola sources to port from:
`src/server/http.ts` (`isSameOriginRequest`, `crossOrigin`), `src/server/ratelimit.ts`
(`KVRateLimiter`), `src/server/crypto.ts` and `src/server/db/schema.sql` (the `ver` /
`session_version` field), and `src/app/api/auth/callback/route.ts` (the interstitial confirm).

### Bidroom-specific controls (the real work; moola has no equivalent)

These are net-new because moola has no tenants, invitations, server-side documents, uploads, or LLM
pipeline. Each is a blocking gate, not a later cleanup:

1. Multi-tenant isolation (R-AUTHZ-01, critical). D1 has no row-level security, so the application
   authz module is the only barrier between tenants. Every repository function takes a verified
   `WorkspaceContext` (non-optional); the foreign-workspace authz test matrix returning 403/404 is a
   hard CI gate from the first tenant-owned table; the repositories-only boundaries lint blocks any
   raw query outside `src/server/repositories`.
2. Invitation security (R-INVITE-02, high). An invitation grants access to another tenant, unlike a
   sign-in. Invitations are email-bound, atomic single-use, with the granted role looked up
   server-side at acceptance (never trusted from the token), seat and plan revalidated at
   acceptance; invitation-abuse cases (replay, redirection to a different account, role escalation,
   surviving a downgrade) are part of the authz matrix.
3. Document-at-rest (R-DOCSTORE-03, critical). Uploaded documents and evidence carry personal data
   and commercial strategy. MVP relies on R2 encryption at rest with `jurisdiction=eu` and no
   application-layer encryption; that trade-off is recorded here with a revisit trigger (Enterprise
   plan or a pilot security questionnaire that requires per-workspace keys). Presigned URLs are
   short-lived and single-object-scoped; the private-bucket posture is verified in deploy checks.
4. Upload and Container trust boundary (R-SCAN-04, high). Scan-before-parse is fail-closed (no file
   is parsed before the ClamAV pass succeeds), verified with an EICAR test in CI; the parsing
   Container's outbound network is constrained so a malicious document cannot turn the parser into an
   exfiltration path.
5. Trust controls (R-CITATION-05, R-EVAL-10, high). Citation verification (every material finding
   carries a verified excerpt or is marked unsupported) and the extraction evaluation set are
   blocking merge gates with a zero-fabricated-citations threshold; the eval set is the product's
   real CI and must exist before pilots.
6. No account PII to LLM (R-LLM-06). Only extraction text reaches Claude or Mistral OCR; the
   no-account-PII-to-LLM invariant is asserted in code and tests, not left to convention. The
   Mistral OCR no-training and retention clause is verified before any pilot processes real
   documents.
7. FADP deletion and break-glass (R-FADP-09, R-ADMIN-08). Deletion is a verified purge job (object,
   extraction text, derived excerpts, rows, analytics references) with an integration test;
   break-glass admin document access requires a reason, is time-bounded, and writes an immutable
   audit event.

## Accepted risks (explicit)

- Email as the single authentication factor (no MFA). Accepted for MVP and pilot: the same
  interstitial, same-origin, and session-revocation controls apply, and break-glass admin access to
  documents carries stronger controls (reason, TTL, audit). Revisit trigger: before paid launch,
  evaluate a step-up second factor for the highest-value actions (FADP export, workspace or account
  deletion, billing changes), since Bidroom's server, unlike moola's, holds customer documents at
  rest. (R-06)
- Enumeration timing asymmetry on link issuance: barely measurable behind email latency; response
  bodies are uniform. (moola-auth-06)
- In-memory rate limiting only until the KV namespace is provisioned. The KV binding is an operator
  item required from WP-004, so the durable limiter is the default in any provisioned environment.
  (R-01)

## Consequences

- Bidroom inherits moola's hardened account-level auth for free by porting the current pattern, so
  the assessment's two structural auth gaps (non-durable limiter, no revocation) never reach Bidroom.
- The genuinely Bidroom-specific risks (tenant isolation, invitations, documents, the scan boundary,
  the trust gates) are committed as blocking gates from the first work packages, which is the
  assessment's central recommendation: wire them as automated gates, not later additions.
- The pilot-versus-paid-launch split: tenant isolation, invitation security, the scan boundary, the
  citation and eval gates, document-at-rest, and FADP deletion gate the pilot; the SIMAP reuse legal
  posture, LLM subprocessor terms, the in-console break-glass, and live cost quotas gate paid launch
  (per `RISK_ASSESSMENT.md`).
- This security posture is shared with moola by design, so hardening patterns and operator items
  converge across both products.
