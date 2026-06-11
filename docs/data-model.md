# Data model

The implemented schema (`src/server/db/schema.ts`, Drizzle on D1). Timestamps are ISO-8601 text;
ids are application-generated. Tenant-owned tables carry `workspace_id` and are reached only through
repository functions that take a verified `WorkspaceContext` (ADR 0003). Forward-only migrations live
in `src/server/db/migrations`.

## Auth and tenancy (Phase 0)

| Table | Purpose | Scope |
| --- | --- | --- |
| `accounts` | Login identity; `session_version` revokes sessions when bumped | per-account |
| `auth_tokens` | Hashed single-use magic-link tokens | per-account |
| `workspaces` | A company tenant | tenant |
| `memberships` | Account-to-workspace link with role (owner, member); PK (workspace_id, account_id) | tenant |
| `invitations` | Email-bound single-use workspace invitations | tenant |
| `audit_events` | Append-only record of sensitive actions | system |

## Intake (Phase 1 batch 1, WP-010/011)

| Table | Purpose | Scope | Notes |
| --- | --- | --- | --- |
| `company_profiles` | One qualification baseline per workspace (capabilities, regions, languages, certifications, exclusions as JSON; `profile_version`) | tenant | unique on `workspace_id`; version bumps on save |
| `tender_source_items` | Official SIMAP notice references | system (shared) | `raw_source` is the verbatim API JSON, never edited (LEG-002); unique on (`simap_project_id`, `simap_publication_id`) |
| `dossiers` | A tender case referencing a source item | tenant | `status` draft for now; findings/files/decisions attach in later batches |

## Pending (later batches)

`uploaded_files` (WP-012), `analysis_runs` + `findings` + `citations` (WP-013 to WP-018),
`checklist_tasks` + `evidence_items` (WP-019 to WP-021), `decision_records` + `exports` (WP-022), and
the Phase 2 billing tables (`processed_events`, entitlement columns).
