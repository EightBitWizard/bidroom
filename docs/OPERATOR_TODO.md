# Operator to-do (manual actions and decisions for the owner)

This is the single place where work that needs the owner is collected. The build runs autonomously
around these; nothing here blocks ongoing development unless marked. Each item says what is needed
and why. Check items off as they are done. The decision IDs (D-01 to D-07) and risk IDs (R-xx)
reference the tech plan Sections 27 and 28.

## Decisions needed for Phase 0 (blocking WP-002 infrastructure)

- [ ] D-01: Supabase region. Zurich (eu-central-2) if offered at project creation, else Frankfurt
      (eu-central-1). Sales materials must state the region explicitly; record the choice in an ADR.
- [ ] D-03: Domain and brand asset. Check availability of bidroom.ch and bidroom.com and secure
      both together if possible. Note: "Bidroom" was previously used by a hotel-booking startup, so
      the .com may be taken or parked; verify trademark posture for the software category in
      Switzerland while at it. Email deliverability setup (SPF, DKIM, DMARC) and legal pages need
      the final domain.

## Accounts to create (needed during Phase 0 and 1; provide secrets as env/CI secrets, never in the repo)

- [ ] GitHub: private repository `bidroom` (if not already the origin) with Actions enabled.
- [ ] Hetzner Cloud account; one VPS (CX32 class, Falkenstein or Nuremberg) for WP-002.
- [ ] Supabase account; create the production project in the D-01 region (free tier acceptable for
      pilots; Pro at first real customer data).
- [ ] Anthropic API account; provide `ANTHROPIC_API_KEY` and set a daily spend cap (plan default
      `LLM_DAILY_SPEND_CAP_USD=25`). Needed from WP-016 (LLM extraction).
- [ ] Mistral API account for OCR; needed from WP-014.
- [ ] Sentry account (free developer tier) for WP-002.
- [ ] Resend account plus DNS records on the final domain (after D-03); needed for auth emails in WP-004.
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

## Validation work (founder-led, parallel to Phase 1, from the business plan)

- [ ] Build a target list of ~100 Swiss IT/cloud/cyber/data consultancies in the launch wedge.
- [ ] Conduct 15 to 20 customer interviews (script in the market analysis, "Validation plan").
- [ ] Run paid concierge qualification on 10 to 15 live SIMAP tenders for 3 to 5 pilot firms;
      charge for at least 3 pilots. Kill/success criteria are in the market analysis.
- [ ] Collect at least 15 public SIMAP tenders (DE/FR/IT/EN mix) as the fixture corpus for the
      extraction evaluation set; needed before WP-016.
