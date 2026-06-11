# Operator to-do (manual actions and decisions for the owner)

This is the single place where work that needs the owner is collected. The build runs autonomously
around these; nothing here blocks ongoing development unless marked. Each item says what is needed
and why. Check items off as they are done. The decision IDs (D-01 to D-07) and risk IDs (R-xx)
reference the tech plan Sections 27 and 28.

## Decisions needed for Phase 0 (blocking WP-002 infrastructure)

- [x] D-01: data residency. RESOLVED by ADR 0002: D1 and R2 are created with `jurisdiction=eu`
      (a hard residency guarantee). State the posture in privacy and sales materials.
- [ ] D-03: Domain and brand asset. Check availability of bidroom.ch and bidroom.com and secure
      both together if possible. Note: "Bidroom" was previously used by a hotel-booking startup, so
      the .com may be taken or parked; verify trademark posture for the software category in
      Switzerland while at it. Email deliverability setup (SPF, DKIM, DMARC) and legal pages need
      the final domain.

## Accounts to create (needed during Phase 0 and 1; provide secrets as wrangler/CI secrets, never in the repo)

> Critical path note (2026-06-11): the code through WP-012 (auth, workspaces, dossier intake,
> document upload) is built and tested locally but cannot show real end-to-end value until these are
> provisioned. The next features (the analysis pipeline that produces the qualification brief) depend
> on: the Cloudflare account/token + D1/R2/KV, the parsing Container (PDF/DOCX text extraction and
> ClamAV), and the Anthropic + Mistral keys plus the 15-30 tender eval corpus. Provisioning is now
> the main thing standing between the working code and a usable product.

- [ ] GitHub: private repository `bidroom` is the origin (`git@github.com:EightBitWizard/bidroom.git`)
      and commits are being pushed. Confirm Actions are enabled so CI runs on push.
- [ ] Cloudflare: enable the Workers Paid plan (USD 5/month; required for Containers and
      Workflows) on your existing account or a new one, and provide an API token with Workers,
      D1, R2, KV, and Queues permissions so the agent can provision and deploy via wrangler (WP-002).
      D1 and R2 must be created with `jurisdiction=eu`. Same platform as moola, so the moola
      deploy knowledge carries over.
- [ ] Cloudflare KV namespace for the durable rate limiter (`RATE_LIMIT_KV` binding), required
      from WP-004 so the auth rate limiter is durable from day one and never an in-memory-only
      limiter in production (ADR 0003). This is the Bidroom equivalent of moola's open KV item.
- [ ] Cloudflare R2 bucket (`DOCS` binding, `jurisdiction=eu`) and the parsing Container (a Node
      image with the PDF/DOCX parsers and ClamAV, exposed for `getContainer(env.PARSER)`), required
      from WP-012/WP-013. Until then uploads use an in-memory store and the EICAR-only stub scanner;
      the real ClamAV Container is required before any real customer document is processed (ADR 0005,
      R-SCAN-04).
- [ ] Anthropic API account; provide `ANTHROPIC_API_KEY` and set a daily spend cap (plan default
      `LLM_DAILY_SPEND_CAP_USD=25`). Needed from WP-016 (LLM extraction).
- [ ] Mistral API account for OCR; needed from WP-014.
- [ ] Resend account plus DNS records on the final domain (after D-03); needed for auth emails in
      WP-004. Consider using Resend for moola's magic-link sender too (still an open moola
      operator item), so both projects share one email provider.
- [ ] Uptime monitoring free tier (e.g. UptimeRobot or Better Stack) pointed at `/api/health`.
- [ ] Later (Phase 2): Stripe account (CHF products Solo/Team), Plausible subscription at marketing launch.

## Decisions needed before later phases (not blocking now)

- [ ] D-02: LLM inference location. Default: Anthropic API (US processing, no-training default) with
      clear subprocessor disclosure; revisit Claude on Vertex/Bedrock EU endpoints if two or more
      pilots object. Decide before the privacy policy is finalized.
- [ ] D-04: Analysis quota numbers per plan (plan recommends Solo 15/month, Team 50/month, 600-page
      cap). Confirm before paid launch; tunable via flags.
- [ ] D-05: Pilot fixture policy. May anonymized pilot-customer tenders enter the eval set with
      written permission? Recommended: yes, with a one-page consent note.
- [ ] D-06: Trial entitlements (PRD default: 14 days, 3 active dossiers, 1 user; recommended quota
      5 analyses in trial). Confirm before Phase 2.
- [ ] D-07 / R-02: SIMAP reuse posture. Prepare a written description of the reuse model during
      Phase 1 and contact the SIMAP association with lawyer input before paid launch. SIMAP GTC
      require prior written agreement for some forms of content reuse. Pilot development with
      manual upload is not blocked; paid launch should not proceed without a documented posture.

## Legal and compliance (needed before paid launch)

- [ ] Commission a Swiss legal review of terms, privacy policy, DPA template, and the SIMAP reuse
      model (R-02) before paid launch.
- [ ] VAT advice: registration becomes mandatory at CHF 100,000 global turnover; get an
      accountant's confirmation of the approach before paid launch (tech plan Section 8).
- [ ] Provide the imprint postal address and operator legal name for the legal pages.

## Security operations (ADR 0003; converges with moola's post-ADR-0035 operator list)

- [ ] Protected GitHub deploy environment with a reviewer or wait timer; scope and rotate the
      Cloudflare API token so deploy is not an unguarded auto-deploy-to-prod path with a long-lived
      token (R-09). Needed before paid launch.
- [ ] D1 backup and restore runbook (Time Travel plus scheduled export to R2); run the restore drill
      monthly and record the date. Treat entitlements as reconstructible from Stripe (R-12).
- [ ] Monitoring decision: wire uptime, pipeline-failure, and (Phase 2) webhook-failure alerts, plus
      an incident-response and FADP breach-notification one-pager. Any error monitor must scrub
      document content and personal data (R-13).
- [ ] MFA / step-up revisit (accepted-risk review, R-06): before paid launch, decide whether the
      highest-value actions (FADP export, workspace/account deletion, billing changes) need a step-up
      second factor. MVP accepts email-as-single-factor per ADR 0003; revisit because Bidroom, unlike
      moola, stores customer documents at rest.

## Validation work (founder-led, parallel to Phase 1, from the business plan)

- [ ] Build a target list of ~100 Swiss IT/cloud/cyber/data consultancies in the launch wedge.
- [ ] Conduct 15 to 20 customer interviews (script in the market analysis, "Validation plan").
- [ ] Run paid concierge qualification on 10 to 15 live SIMAP tenders for 3 to 5 pilot firms;
      charge for at least 3 pilots. Kill/success criteria are in the market analysis.
- [ ] Collect at least 15 public SIMAP tenders (DE/FR/IT/EN mix) as the fixture corpus for the
      extraction evaluation set; needed before WP-016.
