# domain

Pure business logic: qualification rules, checklist generation, deadline normalization, fit
rationale shaping. This layer imports only `@/shared`. No React, no Next, no database, no network
(enforced by the ESLint boundary rule). It is fully unit-testable.

Empty in Phase 0; populated from WP-018 (brief assembly) onward.
