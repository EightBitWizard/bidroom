# API

Internal product API (no public API in v1). JSON, session-cookie authenticated except the auth
endpoints. Mutating endpoints require a same-origin request (`isSameOriginRequest`). Errors use
`{ error: <code> }`. Workspace-nested routes resolve a verified `WorkspaceContext` first
(`resolveWorkspaceContext`): 401 if not signed in, 404 if not a member (a foreign workspace is not
revealed), 403 if the role is insufficient. Backend not configured returns 503.

## Auth

| Method | Path | Purpose | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/request-link` | Email a magic link | Per-IP then per-email throttle; uniform response |
| GET | `/api/auth/callback` | Interstitial confirm page | Does not consume the token |
| POST | `/api/auth/callback` | Consume token, set session | Same-origin; per-IP throttle |
| POST | `/api/auth/logout` | Revoke all sessions, clear cookie | Same-origin; bumps session_version |

## Workspaces and invitations

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/workspaces` | List the account's workspaces |
| POST | `/api/workspaces` | Create a workspace (creator is owner) |
| POST | `/api/workspaces/:id/invites` | Owner-only; email-bound single-use invitation |
| POST | `/api/invitations/accept` | Accept an invitation as the signed-in account |

## Company profile (WP-010)

| Method | Path | Purpose | Body |
| --- | --- | --- | --- |
| GET | `/api/workspaces/:id/profile` | The workspace profile, or null | - |
| PUT | `/api/workspaces/:id/profile` | Create or update the profile | `capabilityTags, regions, languages, certifications, exclusions` (string arrays) |

## Dossiers (WP-011)

| Method | Path | Purpose | Body / Notes |
| --- | --- | --- | --- |
| GET | `/api/workspaces/:id/dossiers` | List the workspace's dossiers | - |
| POST | `/api/workspaces/:id/dossiers` | Create a dossier from a SIMAP notice URL | `{ url }`. 400 `invalid-url` for a non-SIMAP URL (TND-002); 502 `not-found`/`fetch-error` for an unreachable notice; returns `{ id, title, reused }` (reused = an existing dossier for the same notice) |
| GET | `/api/workspaces/:id/dossiers/:dossierId` | The dossier with its official source item | 404 if the dossier is not in this workspace (tenant isolation). Source fields are the official notice, shown verbatim with the disclaimer |

## Dossier files (WP-012)

| Method | Path | Purpose | Body / Notes |
| --- | --- | --- | --- |
| GET | `/api/workspaces/:id/dossiers/:dossierId/files` | List the dossier's uploaded files | Each file has `status` (stored, unsupported, too_large, failed) and `scanStatus` (pending, clean, infected, error) |
| POST | `/api/workspaces/:id/dossiers/:dossierId/files` | Upload a document (multipart, field `file`) | Fail-closed scan-before-store (R-SCAN-04): bytes are stored only after a clean scan. PDF/DOCX only (TND-004); 50 MB cap; infected/unsupported/oversize return the file with an explicit status, never stored (TND-005). 404 if the dossier is not in this workspace |
| DELETE | `/api/workspaces/:id/dossiers/:dossierId/files/:fileId` | Remove the R2 object and the row | 404 if the file is not in this workspace |
