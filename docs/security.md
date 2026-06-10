# Security

This page tracks the implemented security posture. The full model and the accepted risks are in
`docs/adr/0003-security-model.md`; the cross-project assessment is `docs/RISK_ASSESSMENT.md`.

## Implemented in Phase 0

Authentication (ported from moola's hardened pattern, ADR 0003):

- Magic-link only, no passwords. Tokens are 256-bit, stored only as SHA-256 hashes, single-use via
  an atomic guarded UPDATE, and short-lived (15 minutes). Housekeeping caps outstanding tokens.
- Sessions are HMAC-SHA256 signed httpOnly + Secure + SameSite=Lax cookies carrying a
  `session_version`. Logout bumps the version, revoking every outstanding session including a stolen
  cookie. Forged non-integer/Infinity expiries are rejected.
- The magic-link callback is an interstitial: the GET renders a confirm page (no-referrer, no-store,
  noindex, frame-ancestors none, regex-gated token) and does not consume the token, so email
  scanners and prefetchers cannot burn links. The POST consumes it behind an `isSameOriginRequest`
  guard (closes login CSRF) and a per-IP throttle. The request-link endpoint throttles per IP before
  any account work, then per email.
- Rate limiting is durable (KV-backed) in any environment that binds `RATE_LIMIT_KV`; an in-memory
  per-isolate limiter is the dev/test fallback only.

Multi-tenant isolation (the net-new Bidroom surface, R-AUTHZ-01 / R-INVITE-02):

- D1 has no row-level security, so the authz module is the only barrier between tenants. Every
  tenant-scoped repository function takes a non-optional `WorkspaceContext`, produced only by
  `assertWorkspaceAccess` after a membership check; a non-member receives 404 (the workspace's
  existence is not revealed), a non-owner 403.
- The Drizzle client is importable only by `src/server/repositories` and `src/server/db` (ESLint
  boundary rule); nothing else touches the database directly.
- Invitations are email-bound, atomic single-use, with the granted role stored on the row and looked
  up server-side at accept time, never trusted from the invitee.
- The foreign-workspace authz matrix (`src/server/authz/authz.test.ts` and the workspace-service
  tests) is a blocking gate: it proves a non-member can never obtain a context.

CI hygiene: a gitleaks full-history job and Dependabot (npm + actions); `.env.example` lists names
only; secrets live in wrangler secrets and GitHub encrypted secrets.

## Accepted risks (ADR 0003)

- Email as the single factor (no MFA) for MVP and pilot; revisit a step-up factor for the
  highest-value actions before paid launch.
- In-memory rate limiting only until `RATE_LIMIT_KV` is provisioned (an operator item).

## Pending (later work packages)

Upload malware scan and the fail-closed Container boundary (WP-012), citation verification and the
extraction eval gate (WP-016 onward), FADP deletion and break-glass audit (WP-023), the Stripe
webhook integrity controls (Phase 2), and the operator hardening items (protected deploy, D1
backup/restore runbook, monitoring) in `docs/OPERATOR_TODO.md`.
