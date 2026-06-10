# Security and Risk Assessment: moola and Bidroom

One-line purpose: An honest, evidence-based assessment of the security and operational risk in moola (live) and Bidroom (planned), centred on the founder's specific worry about hand-written authentication.

Date: 2026-06-10

> Portability note: this document covers both projects and is meant to be shared into either session. It lives in the Bidroom repo but applies equally to moola; a copy can sit in `moola/docs/` unchanged. Findings were produced by a multi-agent audit of moola's actual source code, then adversarially verified against the real files (10 code findings confirmed, 0 invented; several were downgraded from their first-pass severity by the verification step).

## Executive summary

No, the hand-written magic-link authentication is not inherently dangerous here. The cryptographic core is sound: 256-bit random tokens from a CSPRNG, stored only as SHA-256 hashes, single-use with atomic consumption, and HMAC-SHA256 session cookies verified in constant time with hardened expiry parsing. The danger in self-written auth is almost never the primitives; it is the surrounding controls that hand-rolled flows routinely omit, and OWASP itself recommends transferring this risk to a vetted system "whenever possible" (A07:2025). That argument is real but not one-sided: the major libraries and managed services have shipped severe authentication CVEs too (Next.js CVE-2025-29927 at CVSS 9.1, NextAuth email and JWT bypasses, Supabase Auth email-link poisoning and an OIDC issuer-spoofing bypass), so "use a library" means inheriting a maintained codebase and a stream of advisories you must patch, not eliminating the risk. The verdict: moola's auth is a defensible early-stage choice with a small attack surface and the right primitives, and the residual risks are concrete, mostly already documented by the founder, and fixable without a rewrite. The far larger risk is not auth at all; it is Bidroom porting this single-user pattern into a multi-tenant document store, where every isolation control is currently planned rather than present.

## The auth question, answered

This section addresses the founder's specific concern: the hand-written magic-link sign-in plus HMAC session cookie, as built in moola and slated for reuse in Bidroom.

### What the hand-rolled auth does well

The verified strengths are not cosmetic. They cover the failure modes that actually cause account takeover:

- Magic-link tokens are 32 random bytes (256 bits) from `crypto.getRandomValues`, base64url-encoded, making online guessing infeasible regardless of rate limiting.
- Tokens are stored only as SHA-256 hashes, never in plaintext, and are never logged in production (`NoopEmailSender` is the default; the console sender is gated behind a dev-only flag).
- Token consumption is atomic and replay-safe: a single `UPDATE ... WHERE token_hash = ? AND used_at IS NULL AND expires_at > ? RETURNING`, so a token cannot be redeemed twice even under a race.
- Session cookies use HMAC-SHA256 verified with `crypto.subtle.verify` (constant time). Tampered payloads, wrong secrets, and expired tokens all return null, and a forged non-integer or `Infinity` expiry is explicitly rejected with `Number.isInteger`, closing the "never-expiring token" trick.
- The cookie carries the correct flags: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, explicit `Max-Age`.
- All database access uses parameterized prepared statements, so the account and token store is not SQL-injectable.
- The backend stays dormant (clean 503) unless `BILLING_ENABLED=true`, a database binding exists, and `SESSION_SECRET` is at least 32 characters. A weak secret is treated as unconfigured and can never silently become the HMAC key.
- Stale-cookie handling is sound: a deleted account falls back to guest, and a paid plan is served only when the live entitlement status is active or grace.

This maps closely onto OWASP's Forgot Password and Session Management guidance, which is the correct reference standard for URL-token flows ([OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)).

### The evidence-based risks (from the actual code)

These are the verified findings against moola's auth surface, reported at their corrected severity:

| Finding | Verified severity | Exploitable | What it actually is |
|---|---|---|---|
| Rate limiter is in-memory per-isolate, not durable (moola-auth-01) | Low | No | The 5-per-15-minute cap does not hold globally across Cloudflare isolates. Real hardening gap, but no email provider is wired, the backend is dormant by default, tokens have 256-bit entropy, and the limiter is not even on the guessing path. The original "high / email-bombing / token-guessing" framing was over-rated. |
| No rate limit on the callback / verify path (moola-auth-02) | Info | No | The verify path is unthrottled, but 256-bit single-use tokens make guessing infeasible and there is no timing oracle (SHA-256 lookup, constant-time HMAC). Defense-in-depth only. Originally reported medium; downgraded to info. |
| Magic-link request limit keyed only by attacker-controlled email, not IP (moola-auth-03) | Medium | Yes | A genuine missing per-IP/global throttle on an unauthenticated write that creates account and entitlement rows. Live harm today is bounded to database-row spam on a provisioned backend; the email-bombing escalation is contingent on wiring a real email provider. |
| State-changing routes rely solely on SameSite=Lax, no CSRF token or Origin check (moola-auth-04) | Low | No | Real defense-in-depth gap on irreversible actions (account delete), but SameSite=Lax plus a single origin plus modern browsers means no live CSRF vector. Originally medium; downgraded to low. |
| Expired and used auth tokens are never purged (moola-auth-05) | Low | No | Table grows unbounded; a data-minimization and housekeeping gap, not a security or denial-of-service vector given the per-email cap. |
| Account enumeration via timing and account-creation side effects (moola-auth-06) | Low | No | A real but barely measurable timing asymmetry, swamped by the email-send latency; the secondary 429 claim does not actually leak registration status. Registration status is low-sensitivity for this product. |

Two posture-level auth risks were also confirmed and are not in the table above because they are design choices rather than code defects:

- No server-side session revocation (R-04, impact high). Sessions are stateless 30-day HMAC cookies; a stolen cookie cannot be invalidated, logout cannot truly revoke, and rotating the secret logs everyone out at once. The residual risk is theft and persistence, not forgery.
- No MFA; the email inbox is the single authentication and recovery factor (R-06). Acceptable for a product whose server holds no plaintext financial data, but it concentrates all account risk on email security.

### Magic-link-specific risks

These are inherent to the pattern, independent of code quality:

- Email is the single factor. A compromised, forwarded, or phished inbox grants full access with no further barrier; security is "fundamentally delegated to the security of the user's email account" ([FusionAuth](https://fusionauth.io/articles/identity-basics/magic-links), [Baytech](https://www.baytechconsulting.com/blog/magic-links-ux-security-and-growth-impacts-for-saas-platforms-2025)).
- Link prefetch consumption. Corporate email scanners and clients prefetch URLs and can burn a single-use token before the user clicks, breaking login (this is moola's confirmed R-05). The fix is to not consume the token on a prefetchable GET; require an explicit POST confirmation.
- Token-in-URL leakage via Referer headers, browser history, and proxy logs. OWASP mandates a `no-referrer` policy on the landing page and never logging the raw token.
- Host-header / link poisoning. If the email URL is built from an untrusted `Host` or `X-Forwarded-Host` header, an attacker can redirect the token to their own server. This is exactly Supabase Auth [GHSA-3529-5m8x-rpv3](https://github.com/supabase/auth/security/advisories/GHSA-3529-5m8x-rpv3). Hard-code or allowlist the host.
- No step-up for sensitive actions. A clicked link trusts the session for its lifetime with no re-authentication for billing, data export, or deletion.

moola's callback redirect is already built from `url.origin` plus a fixed allowlisted-locale path, so it has no user-controlled open-redirect, which closes one of the most common magic-link mistakes.

### Hand-rolled versus a library

This is an honest trade-off, not "always use a library." OWASP A07:2025 explicitly says to "use a premade, well-trusted system ... Transfer this risk whenever possible" ([OWASP A07:2025](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)). That is the single strongest argument against hand-rolling, and it comes from OWASP, not a vendor. But libraries and managed services are not a safe default by definition: Next.js [CVE-2025-29927](https://github.com/advisories/GHSA-f82v-jwr5-mffw) is a CVSS 9.1 middleware authorization bypass; NextAuth has an email sign-in bypass ([GHSA-5jpx-9hw9-2fx4](https://www.miggo.io/vulnerability-database/cve/GHSA-5jpx-9hw9-2fx4)) and a pre-4.24.5 middleware bypass ([GHSA-v64w-49xw-qq89](https://github.com/nextauthjs/next-auth/security/advisories/GHSA-v64w-49xw-qq89)); Supabase Auth had email-link poisoning and an OIDC issuer-spoofing bypass ([CVE-2026-31813](https://www.sentinelone.com/vulnerability-database/cve-2026-31813/)). "Use a library" therefore means inheriting a maintained, reviewed codebase and a stream of advisories you must patch promptly. A self-hostable middle path exists (Better Auth, the successor to Lucia) for teams that want vetted auth code without managed-service lock-in ([Val Town write-up](https://blog.val.town/better-auth)).

### Verdict and mandatory controls

The hand-rolled magic-link flow is acceptable for both products provided it is treated as security-critical code and the full control set below is present and tested. The danger is in the omissions, not the approach. moola already satisfies the token and storage controls; the gaps to close are the surrounding controls.

Mandatory controls:

1. Token: CSPRNG, high entropy, hashed at rest, single-use with invalidation on use, short TTL (10-15 minutes). Present in moola.
2. Verification: look up by hash, constant-time compare, and do not consume the token on a prefetchable GET; require an explicit POST confirmation. Present except the POST confirmation (moola R-05).
3. Enumeration: identical body and timing for known and unknown emails. Body is uniform; equalize the work asymmetry (moola-auth-06).
4. Rate limiting: durable per-email and per-IP limits on both issuance and verification; the codebase already IP-keys its feedback route, so the pattern exists (moola-auth-03, R-01).
5. Link construction: hard-code or allowlist the host, HTTPS only, allowlist redirect targets, `Referrer-Policy: no-referrer`, never log the raw token.
6. Session cookie: constant-time HMAC verify (present), sufficient entropy, explicit expiry (present), `HttpOnly` + `Secure` + `SameSite` (present), session revocation plus idle and absolute timeouts (the gap, R-04).
7. Step-up factor for high-value actions: for Bidroom specifically, FADP export, deletion, and billing changes warrant a second factor rather than trusting email indefinitely. OWASP cites MFA as stopping roughly 99.9% of account compromises ([OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)).

## moola risk assessment

moola is live, local-first, and pre-billing. Its defining strength is that the simulation engine and all financial scenario data stay client-side in the browser; the server holds only email, entitlement, hashed auth tokens, opaque end-to-end-encrypted backups, and scrubbed feedback. This collapses the privacy and breach blast radius: a full server compromise exposes no financial data.

### Risk table

| Area | Risk | Likelihood | Impact | Status | Mitigation |
|---|---|---|---|---|---|
| Infra | Rate limiter in-memory per-isolate, not durable (R-01) | High | Medium | Partial | KV/Durable-Object limiter keyed by email and IP before flipping `BILLING_ENABLED`. Already documented as a launch blocker. |
| Billing | Webhook idempotency relies on upsert; no event-id dedup or ordering guard (R-02, moola-billing-01) | Medium | Medium | Partial | Processed-events table keyed by `event.id`; ignore events older than stored `current_period_end`. |
| Billing | `current_period_end` stored but never enforced (moola-billing-02) | Medium (downgraded) | Low | Partial | Defense-in-depth: treat a past period end as not served; add Stripe reconciliation. Not attacker-controllable; relies on Stripe failing redelivery over a multi-day window. |
| Data | No scheduled cleanup of auth_tokens (R-03) | Medium | Low | Missing | Cron purge of expired and used rows; cap outstanding tokens per account. |
| Auth | No server-side session revocation; 30-day cookie unrevocable (R-04) | Medium | High | Planned | Per-account token version or sessions table checked at resolve time; pair with secret rotation. |
| Auth | Single-use token burned by email-scanner prefetch (R-05) | Medium | Medium | Planned | Interstitial POST-to-consume confirm page. |
| Auth | No MFA; email is the single factor (R-06) | Medium | Medium | Missing | Document the email-equals-account threat model; consider optional TOTP/WebAuthn step-up post-launch; record the accepted risk in an ADR. |
| Privacy | Encrypted backup unrecoverable on passphrase loss (R-07) | Medium | Medium | Partial | Make irrecoverability unmissable in the opt-in UX; do not add key escrow. |
| Ops | CI gate has no secret scanning and no `.env.example` (R-08) | Medium | High | Missing | Add gitleaks and a tracked secrets template. Low effort, high payoff before billing secrets exist. |
| Infra | Auto-deploy to prod on every push to main, long-lived token, no environment protection (R-09) | Medium | High | Partial | Protected GitHub Environment with reviewer or wait timer; scope and rotate the Cloudflare token. |
| Dependency | No automated dependency or vulnerability scanning (R-10) | Low | Medium | Partial | Enable Dependabot/Renovate and a non-blocking audit step. |
| Infra | Secrets management sound but operationally unverified (R-11) | Low | High | Present | Add the gitleaks gate, a rotation runbook, and tie secret rotation to the session-version mechanism. |
| Ops | No documented D1 backup/restore or disaster recovery (R-12) | Medium | High | Missing | Document a backup/restore runbook; treat entitlements as reconstructible from Stripe. |
| Ops | No monitoring, alerting, or incident response; CI observability degraded (R-13) | High | Medium | Missing | Wire a scrubbing error monitor, webhook-failure and uptime alerts, an incident-response one-pager, and re-authenticate the expired gh token. |
| Legal | FADP policy and DR obligations pending review (R-14) | Medium | Medium | Partial | Complete the Swiss legal review, fill the imprint, enumerate subprocessors, document breach notification. Export and deletion already work. |

### Confirmed code findings (prose)

Beyond auth (covered above), two billing findings stand at their verified levels. The Stripe webhook (moola-billing-01, medium) verifies signatures correctly over the raw body with a constant-time compare, but has no event-id deduplication and no ordering guard, so under Stripe's documented at-least-once, out-of-order delivery a stale `subscription.updated` arriving after a `subscription.deleted` can silently re-grant a paid plan. This is a real billing-integrity defect that occurs under normal operation, but it is not attacker-exploitable: an external party has no webhook secret and cannot forge events. The companion finding that `current_period_end` is never enforced (moola-billing-02) was downgraded from medium to low for the same reason: it requires Stripe to fail webhook redelivery over a multi-day window, not any user action. The denial-of-service finding on backup PUT, checkout, and portal (moola-dos-01, low, exploitable) is genuine but bounded to self-inflicted cost amplification on the attacker's own paid account, against a single overwritten capped row, behind authentication and entitlement gates.

### Posture risks (prose)

moola's posture risks cluster at the moment `BILLING_ENABLED` is flipped and real email, Stripe, and the database go live. The auth and billing surface needs four things landed together: the KV-backed rate limiter (R-01), webhook event-id idempotency plus an ordering guard (R-02), scheduled token cleanup (R-03), and server-side session revocation (R-04). The thinnest layer is operations: no secret scanning in CI and no secrets template (R-08), an auto-deploy-to-prod pipeline with a long-lived token and no human gate (R-09), no documented database backup/restore (R-12), and no monitoring, alerting, or incident-response runbook (R-13). None of these are architectural rewrites; they are disciplined hardening of an already-conservative design, and the founder has correctly pre-identified most of them in the project's security and operator-todo documents.

### Genuine strengths

- Local-first data minimization enforced by architecture: no financial data ever reaches the server, and the schema confirms it.
- Genuine end-to-end-encrypted backups: AES-256-GCM under a PBKDF2 key (200,000 iterations) that never leaves the device; the server stores only ciphertext it cannot read, gated server-side by session and entitlement.
- Carefully built Web Crypto auth: hashed single-use tokens, atomic consumption, HMAC sessions, hardened expiry parsing.
- Card data never touches the systems (hosted Checkout and Portal only); webhook signatures verified over the raw body.
- The no-advice legal boundary is enforced as an automated CI check, not a guideline.
- Disciplined logging: a tree-wide search found one console statement, dev-only and flag-gated.
- Account deletion and export are real workflows that satisfy FADP rights.

## Bidroom risk assessment

Bidroom is entirely on paper. It is qualitatively higher-stakes than moola for one structural reason: it stores uploaded customer documents (CVs, certifications, insurance documents, signatures, and commercially sensitive bid strategy) at rest, where moola keeps its sensitive data in the browser. A single isolation bug in Bidroom exposes Class A personal data across companies; the same bug in moola exposes account metadata. The design is security-aware and the chosen controls are the right ones, but every one of them is planned, not present, and they all rest on a solo founder reviewing AI-agent output, which the plan itself flags as a risk.

### The new risk from making single-user auth multi-tenant

This is the central new exposure and directly extends the founder's auth concern. moola's auth pattern was single-user. Bidroom adds workspaces, memberships, two roles, invitations, and a support-admin role. The entire multi-tenant isolation surface is net-new code with no precedent in the ported pattern, and D1 has no row-level security, so the only thing between tenants is the application-level authz module plus the repositories-only data-access rule. A single repository function that forgets to scope by `workspace_id`, or any raw query that slips past the boundaries lint rule, leaks Class A data across companies (R-AUTHZ-01, high likelihood, critical impact). The defenses are well chosen (a central `assertWorkspaceAccess`, every repository function taking a verified `WorkspaceContext`, a mandatory foreign-workspace authz test matrix returning 403/404, boundaries lint), but they are all planned and depend on perfect discipline.

Invitations are a second, distinct new surface (R-INVITE-02, high impact). An invitation grants access to another tenant's data, unlike a magic-link sign-in. The risks the single-user pattern never had to handle: a token not bound to the invited email (redirection to a different account), token reuse if single-use enforcement races under D1's lack of interactive transactions, role escalation if the role is carried in the token rather than looked up server-side, and invitations surviving a plan downgrade. The acceptance-flow security is not yet designed.

### Design-level risk table

| Risk | Area | Likelihood | Impact | Gates |
|---|---|---|---|---|
| Multi-tenant authz on single-user pattern, no RLS backstop (R-AUTHZ-01) | authz | High | Critical | Pilot |
| Invitation tokens as a privileged-grant surface (R-INVITE-02) | authz | Medium | High | Pilot |
| Sensitive document store at rest with MVP-level protection, no app-layer encryption (R-DOCSTORE-03) | privacy | Medium | Critical | Pilot |
| Malware-scan and Container trust boundary on attacker-controlled uploads (R-SCAN-04) | infra | Medium | High | Pilot |
| Citation verification as the load-bearing anti-hallucination control (R-CITATION-05) | data | High | High | Pilot |
| FADP-grade deletion and break-glass discipline (R-FADP-09, R-ADMIN-08) | legal/privacy | Low | High | Pilot |
| Extraction eval set is the product's real CI but does not yet exist (R-EVAL-10) | ops | High | High | Pilot |
| SIMAP commercial-reuse legal posture unresolved (R-SIMAP-07) | legal | Medium | High | Paid |
| LLM/OCR subprocessor terms and inference location (R-LLM-06) | privacy | Medium | High | Paid |
| In-console break-glass with audit and owner notification (R-ADMIN-08) | privacy | Low | High | Paid |
| Per-dossier LLM/OCR cost versus plan economics (R-COST-12) | billing | Medium | Medium | Paid |
| Pipeline split (Workflows + Queues + Container) distributed-failure surface (R-PIPELINE-11) | infra | Medium | Medium | Pilot/Paid |
| Solo-founder operational concentration (R-SOLO-13) | ops | Medium | High | Ongoing |

### What gates pilot versus paid launch

Pilot-gating risks (these must be hard, blocking CI gates before any real customer document is processed): multi-tenant data isolation (R-AUTHZ-01) and the invitation flow (R-INVITE-02) via the foreign-workspace authz matrix; the citation-verification control with its zero-fabricated-citations eval gate (R-CITATION-05); the extraction eval set, which is the product's real CI and is slow expert work that does not yet exist (R-EVAL-10); the scan-before-parse fail-closed boundary on uploads with the EICAR test (R-SCAN-04); and FADP-grade deletion plus break-glass discipline (R-FADP-09, R-ADMIN-08). The document store's no-app-layer-encryption trade-off (R-DOCSTORE-03) should be captured in an ADR with a concrete revisit trigger before pilots involve real documents, and presigned-URL TTLs kept short and single-object-scoped.

Paid-launch-gating risks: the SIMAP commercial-reuse legal posture, which the plan explicitly designates a paid-launch blocker and not a pilot blocker (R-SIMAP-07); confirmed LLM/OCR subprocessor terms, specifically the Mistral OCR no-training and retention clause that must be verified before any pilot processes real documents, and the inference-location decision before the privacy policy is finalized (R-LLM-06); the in-console break-glass with audit and owner notification (R-ADMIN-08); and live cost quotas and the daily spend cap with finalized numbers (R-COST-12).

### Strengths

Bidroom's design strengths are well matched to the data sensitivity: citations as a first-class verified data structure with a dedicated verification step and a planned eval gate; a single central authz module deliberately compensating for the missing row-level security; allowlist logging and metadata-only analytics; guaranteed EU data residency (D1 and R2 created with `jurisdiction=eu`); a non-removable SIMAP disclaimer used in both UI and PDF with verbatim source storage; no stored passwords; an isolated parsing Container that keeps heavy and risky work off the web tier with fail-closed scan-before-parse; and real export and deletion workflows with append-only audit events. The principal danger is execution: the controls are correct, but all are planned, and they must be wired as blocking automated gates from the first work packages rather than added later.

## Cross-cutting risks shared by both apps

- Stateless, unrevocable sessions. Both products share the same HMAC session-cookie model with no server-side revocation. A stolen cookie is valid until expiry; logout cannot truly revoke; rotating the secret logs everyone out. The session-version mechanism should be built once and used by both (moola R-04).
- Durable rate limiting. Both depend on the same in-memory per-isolate limiter pattern. It must become KV or Durable-Object backed, keyed by email and IP, before either product is trusted with real abuse pressure (moola R-01; Bidroom inherits this through the ported auth).
- Secret scanning and CI hygiene. moola's gate currently lacks gitleaks and a secrets template (R-08). Bidroom's CLAUDE.md mandates gitleaks; the two should converge on the same standard so neither leaks a Stripe key, session secret, or Cloudflare token.
- Deploy and supply-chain posture. Auto-deploy to production with a long-lived token and no human gate (moola R-09), plus no automated dependency or vulnerability scanning (R-10), apply to both. A protected environment and dependency scanning are shared low-effort wins.
- Monitoring and incident response. Neither product has wired error monitoring (with a financial-value-scrubbing `beforeSend`), uptime or webhook-failure alerting, or a rehearsed FADP breach-notification runbook (moola R-13; Bidroom R-SOLO-13). Bidroom's document sensitivity raises the stakes of this gap sharply.
- Email as a single factor. Both rely on email-only authentication and recovery with no step-up. For Bidroom's higher-value actions (billing, FADP export and deletion), a second factor is more strongly indicated than for moola.
- Solo-founder concentration. Every review gate, break-glass procedure, restore drill, and incident response depends on one person, and AI agents do most implementation while being flagged for boundary violations. The mitigation is the same for both: lean on blocking automated gates so the machine, not the founder, catches most errors.

## Prioritised action list

P0 means before trusting the app with real customer data. For moola this is before flipping `BILLING_ENABLED`; for Bidroom this is before any pilot processes a real document.

| Priority | Item | App(s) | Why |
|---|---|---|---|
| P0 | Foreign-workspace authz test matrix (403/404) as a hard CI gate; `WorkspaceContext` non-optional on every repository function; boundaries lint blocking | Bidroom | D1 has no row-level security; this is the only barrier between tenants for Class A data. A single missed scope is a critical cross-tenant leak (R-AUTHZ-01). |
| P0 | Citation verification at near-full coverage with a zero-fabricated-citations eval gate as a hard merge gate | Bidroom | The entire trust proposition rests on this control; a fabricated cited finding is the worst failure for the audience (R-CITATION-05). |
| P0 | Build the 15-30 tender extraction eval set and wire `test:eval` into the merge process | Bidroom | It is the product's real CI, does not exist yet, and is slow expert work; without it every prompt change is an unmeasured trust regression (R-EVAL-10). |
| P0 | Fail-closed, idempotent scan-before-parse gate with EICAR test; constrain Container outbound network | Bidroom | Uploads are attacker-controlled input reaching parsers with a path to the data stores; the gate must be unbypassable (R-SCAN-04). |
| P0 | Invitation flow security: email-bound, atomic single-use, server-side role lookup, seat revalidation at acceptance; add invitation-abuse cases to the authz matrix | Bidroom | Invitations grant cross-tenant access; forge, replay, or redirect yields direct data exposure (R-INVITE-02). |
| P0 | Durable (KV/Durable-Object) rate limiter keyed by email and IP on issuance and verification | Both | Sole abuse control on the auth surface; in-memory per-isolate limits do not hold, and moola-auth-03 is exploitable on a provisioned backend (R-01, moola-auth-03). |
| P0 | Server-side session revocation (per-account token version or sessions table) | Both | A stolen 30-day cookie is currently unrevocable; logout cannot revoke and secret rotation is destructive (R-04). |
| P0 | Add gitleaks to CI and a tracked `.env.example` / secrets template | Both | Prevents an accidentally committed Stripe key, session secret, or Cloudflare token before billing secrets exist in the blast radius (R-08). |
| P0 | Verify-and-record the Mistral OCR no-training/retention clause; assert LLM payloads carry no account PII | Bidroom | Real pilot documents must not be processed under unverified terms; the no-PII-to-LLM invariant currently relies on convention (R-LLM-06). |
| P0 | FADP deletion as a verified purge job (object, extraction text, derived excerpts, rows, analytics references) with integration test; break-glass that writes an immutable audit record with a reason | Bidroom | Missed deletion surfaces leave personal data behind; break-glass without enforced audit collapses the accountability story (R-FADP-09, R-ADMIN-08). |
| P1 | Stripe webhook event-id dedup plus ordering guard | moola | Out-of-order redelivery can silently re-grant a paid plan; a money-relevant integrity defect under normal operation (moola-billing-01, R-02). |
| P1 | Interstitial POST-to-consume on the magic-link callback | Both | Email scanners prefetch and burn single-use tokens, breaking the only login path (R-05). |
| P1 | Document the no-app-layer-encryption trade-off in an ADR with a concrete revisit trigger; keep presigned-URL TTLs short and single-object-scoped; verify private-bucket posture in deploy checks | Bidroom | Honest record of an MVP trade-off on Class A data, and the operational controls that contain it (R-DOCSTORE-03). |
| P1 | Protected GitHub Environment for deploy; scope and rotate the Cloudflare token | Both | Removes the unguarded auto-deploy-to-prod path and shrinks the standing supply-chain target (R-09). |
| P1 | Document a database backup/restore and disaster-recovery runbook; treat entitlements as reconstructible from Stripe | Both | No recovery story for billing and backup data on a single database (moola R-12). |
| P1 | Wire scrubbing error monitoring, webhook-failure and uptime alerting, and a rehearsed incident-response and FADP breach-notification one-pager | Both | Near-zero operational visibility today; document sensitivity makes this acute for Bidroom (moola R-13, Bidroom R-SOLO-13). |
| P1 | Scheduled purge of expired and used auth tokens; cap outstanding tokens per account | Both | Data minimization and unbounded table growth (R-03). |
| P1 | Resolve and ship analysis quotas, page cap, Haiku-first triage, and the daily AI spend cap with finalized numbers; record cost per run from the first pipeline version | Bidroom | Without live caps, whale users or a re-analysis loop erode unit economics or trip the cap (R-COST-12). |
| P1 | Equalize the account-creation work asymmetry on the request-link path | moola | Removes the residual enumeration side channel; keep the uniform response body (moola-auth-06). |
| P2 | Origin / Sec-Fetch-Site allowlist or double-submit token on state-changing routes, especially account delete | Both | Defense-in-depth beyond SameSite=Lax on irreversible actions (moola-auth-04, moola-authz-01). |
| P2 | Period-end backstop in plan resolution plus a Stripe reconciliation job | moola | Independent of webhook delivery; closes the lapsed-access edge case (moola-billing-02). |
| P2 | Enable Dependabot/Renovate and a non-blocking dependency audit step | Both | No automated dependency or vulnerability scanning today (R-10). |
| P2 | Optional step-up factor (TOTP or WebAuthn) for billing, export, and deletion; record the email-equals-account accepted risk in an ADR | Both | Email is the single factor; MFA is the highest-leverage control for high-value actions (R-06). |
| P2 | Complete the Swiss legal review, fill the imprint, enumerate subprocessors; for Bidroom, send the SIMAP reuse-model description with lawyer input before paid launch | Both | Process compliance gaps; SIMAP reuse explicitly gates Bidroom's paid launch (moola R-14, Bidroom R-SIMAP-07). |

## Bottom line

Self-written authentication is not the main danger here, and the founder's specific worry, while reasonable, is largely answered by the code: moola's magic-link and session crypto is built correctly on Web Crypto, the verified findings against it are mostly low or informational, and the one genuinely exploitable item (the missing per-IP throttle) is bounded and fixable. The real, larger risk is everything around the auth: durable rate limiting, session revocation, secret scanning, deploy gating, backups, and monitoring for moola, and for Bidroom the net-new multi-tenant isolation surface, the invitation flow, the citation-verification control, and the eval set that is its true CI. Bidroom is higher-stakes than moola because it stores customer documents at rest, so a single isolation bug is critical rather than cosmetic, and every one of its strong controls is currently planned rather than present. The defenses chosen are the right ones; the assessment is that they must be wired as blocking automated gates from the first work packages, not added later, and that no real customer data should be trusted to either app until the P0 items above are landed and tested.

---

## Appendix: method and confidence

This assessment was produced by a multi-agent workflow: parallel deep audits of moola's actual auth and billing source, a moola posture review, a Bidroom design-level review from the planning documents, and external research on hand-rolled versus library auth. Every concrete code finding was then handed to an independent skeptical verifier that re-read the real files and tried to refute it. Of 10 verified code findings, 0 were invented and several were downgraded from their first-pass severity (the rate-limiter finding from high to low, the callback-throttle finding from medium to info, two CSRF findings from medium to low, and the period-end finding from medium to low), which is why the severities here are lower and more specific than a first-pass scan would report. The moola findings cite real `file:line` locations in the moola repository; the Bidroom risks are design-level because no code exists yet. Re-run the audit after the P0 items land to confirm closure.
