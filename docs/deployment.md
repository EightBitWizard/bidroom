# Deployment

Bidroom deploys to Cloudflare Workers via OpenNext (ADR 0002). This page covers provisioning and the
deploy flow. The live provisioning steps are operator tasks (see `docs/OPERATOR_TODO.md`); until they
are done, everything runs and is tested locally.

## One-time provisioning (operator)

All state is created in the EU jurisdiction (ADR 0002, resolves D-01):

```bash
# D1 database (EU jurisdiction)
pnpm exec wrangler d1 create bidroom --location weur

# R2 bucket (EU jurisdiction)
pnpm exec wrangler r2 bucket create bidroom-docs --jurisdiction eu

# KV namespace for the durable auth rate limiter (ADR 0003)
pnpm exec wrangler kv namespace create RATE_LIMIT_KV
```

Put the returned ids into `wrangler.jsonc` (the `PLACEHOLDER_SET_AT_PROVISIONING` fields). Set the
production secrets:

```bash
pnpm exec wrangler secret put SESSION_SECRET     # 32+ chars
pnpm exec wrangler secret put APP_BASE_URL
# Email/LLM/OCR/Stripe secrets are added as their work packages land.
```

A Cloudflare API token with Workers, D1, R2, and KV permissions is set as the `CLOUDFLARE_API_TOKEN`
GitHub secret, and the `production` GitHub environment is protected with a reviewer (ADR 0003, R-09).

## Migrations

Migrations are forward-only (CLAUDE.md). Generate from the schema, review the SQL, commit it, then
apply:

```bash
pnpm db:generate
pnpm exec wrangler d1 migrations apply bidroom --remote   # production
```

CI applies migrations before the deploy step (the commented `wrangler d1 migrations apply` job in
`.github/workflows/ci.yml`, enabled once the database id is set).

## Deploy

On a push to `main`, CI runs the gate, e2e, and gitleaks, then deploys:

```bash
pnpm cf:deploy            # opennextjs-cloudflare build && deploy (web app)
# pipeline Worker (from WP-013): wrangler deploy -c wrangler.pipeline.jsonc
```

## Rollback

Cloudflare keeps prior Worker versions; roll back to the previous deployment from the dashboard or
with `wrangler rollback`. Because migrations are forward-only, destructive schema changes ship in two
steps (expand, later contract) with a D1 Time Travel bookmark taken first.

## Local preview of the Workers build

```bash
pnpm cf:preview           # build with OpenNext and preview on the local workerd runtime
```
