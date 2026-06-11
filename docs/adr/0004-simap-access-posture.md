# 0004 - SIMAP access posture

- Status: accepted
- Date: 2026-06-11

## Context

WP-011 lets a user start a tender case from a SIMAP notice. SIMAP exposes a public, read-only JSON
API (no authentication) under `https://www.simap.ch/api/...`; a single publication is
`GET /publications/v1/project/{projectId}/publication-details/{publicationId}`. SIMAP's terms require
that reusers do not present their output as an official publication and that they display that the
data on www.simap.ch are authoritative; the broader reuse of platform content needs the SIMAP
association's written agreement (the legal posture is tracked as R-02 / D-07 and is a paid-launch
gate, not a pilot/dev gate). The hard product boundaries (no scraping, no SIMAP credential storage,
no SIMAP submission) apply.

## Decisions

1. Access only the public, read-only SIMAP API, user-initiated, one notice at a time (the URL the
   user pasted). No scraping, no crawling, no stored SIMAP credentials, no automated polling or
   discovery (those remain out of scope).
2. The full API response is stored verbatim as `tender_source_items.raw_source` and never edited
   (LEG-002). The extracted display fields (title, authority, procedure type, publication date) are
   best-effort and for display only; `raw_source` is the source of record.
3. Wherever SIMAP source data are shown (UI and, later, PDF), the non-removable `SourceDisclaimer`
   component renders the required statement (LEG-001) and the data are labeled "Official source",
   kept visually separate from any later "Bidroom analysis".
4. The integration is isolated in `src/server/integrations/simap/` behind a `SimapClient` interface
   with a live HTTP implementation and a fixture implementation. External calls are mocked with a
   recorded fixture in tests by default; live calls happen only outside tests. A contract test on
   the response mapping catches API-shape drift (R-15).
5. The exact id-extraction from a notice URL and the precise field mapping are refined against a real
   notice URL and the live Swagger spec during rollout; the URL parser and the field mapper are
   deliberately tolerant (multiple candidate shapes), and a manual notice-entry fallback is the
   degradation path if the live shape is uncertain.
6. Non-SIMAP URLs are rejected with a clear message (TND-002); a notice already opened in a workspace
   offers reuse rather than creating a duplicate dossier.

## Consequences

- Building intake now is safe for pilot development: it uses only the public read-only path with the
  disclaimer and verbatim storage. The written reuse agreement with the SIMAP association is still
  required before paid launch (OPERATOR_TODO, R-02).
- Storing `raw_source` verbatim makes the official data auditable and lets the display mapping evolve
  without losing fidelity.
- The tolerant parser and the fixture-based tests mean a SIMAP API change degrades to a clear error
  or the manual-entry fallback rather than silently producing wrong data; the contract test flags it.
