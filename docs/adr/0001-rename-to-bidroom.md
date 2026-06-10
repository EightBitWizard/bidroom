# 0001 - Product renamed to Bidroom

- Status: accepted
- Date: 2026-06-10

## Context

The three founding documents (market analysis, PRD v0.9, tech plan v1.0) were written under the
working name. The founder renamed the product to Bidroom, matching the repository name.
The market analysis itself had noted that the old name was slightly generic and could be misread as
discounts or quote management.

## Decisions

1. Bidroom is the product name everywhere. All occurrences of the old name (including domains,
   repo paths, and env examples) were replaced across the docs.
2. The naming-considerations paragraph in the market analysis was adapted: Bidroom directly evokes
   bidding, but could be misread as an auction product, so every page pairs it with the descriptor
   "Swiss public tender qualification software".
3. The domain decision (tech plan D-03) now targets bidroom.ch / bidroom.com. Availability and the
   prior use of "Bidroom" by a hotel-booking startup must be verified by the founder
   (see `docs/OPERATOR_TODO.md`).
4. Once code exists, the quality gate's copy check should guard against the old name reappearing
   (same pattern as moola's rename gate).

## Consequences

- All documents are consistent under the new name; requirement IDs and work-package IDs are
  unchanged.
- Brand and trademark verification is an operator task before public-facing use of the name.
