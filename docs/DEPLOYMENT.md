# Deployment and remaining submission gates

## Last completed deployment evidence - October 28, 2026

- Published candidate: `b8cbd0764e59da600b8e8a2844fda0860692f4e9`, open and unmerged [PR #8](https://github.com/kyl3kan3/afterglow-qloo/pull/8). Its recorded validation is 72 passing tests on Node 24.19.0, plus syntax/build checks. Later local candidate work needs its own validation and release record.
- The approved Git connection is established. Three existing credentials are ready as branch-only Preview Secret entries; Production configuration was preserved.
- Preview `dpl_4eVM3BtU1Q1LmV57dq445gPhF8DS` was READY at 13:40:37 UTC: https://afterglow-qloo-kry673cfj-kyl3kan3-6147s-projects.vercel.app/.
- Authenticated Preview status returned HTTP 200 and its live UI was configured. Anonymous Preview access returned HTTP 302 to Vercel SSO; anonymous MCP initialization returned HTTP 401. The protection is working, but judge access has not yet been established by these checks.
- One genuine artist search returned HTTP 200 and six candidates. The original shared counter moved from `used:0` to `used:1`, with `cap:10` and expiry unchanged. Complete two-profile Insights planning remains unverified. No raw Qloo responses, returned IDs or screenshots belong in public source.
- The public fictional sample at https://afterglow-qloo.vercel.app/ continues to report live disabled with `PUBLIC_LIVE_DISABLED`. Public Production live execution remains blocked.

The historical Vercel environment-API HTTP 403 was not retried. It is not evidence that the later successful Preview failed. Reuse the existing project and datastore; no duplicate project, replacement counter or credential retrieval is needed for these documentation changes.

## Approved next release bundle - not yet executed

The owner approved a hosted ceiling of **100 requests total, including the already-used request**, and one deployment-specific judge-only access link expiring `2026-11-06T04:45:00Z`. The last executed evidence above still shows a ten-request counter. Do not describe the 100 ceiling, new candidate deployment or judge link as completed until their actual results are recorded.

The candidate under preparation adds recent-candidate reuse and hosted 100-total enforcement. SQLite remains capped at ten. The hosted change must preserve the original counter identity, datastore and used count: `cap:100`, `used:1` would mean 99 remaining before any later attempts, not 100 new calls. No reset, refund, second ledger, paid upgrade or additional access grant is part of this local update.

The judge link is a bearer secret, scoped only to the approved deployment. It must never appear in public source, a public Devpost field, screenshots or logs. Private judge instructions are drafted outside this repository with a placeholder; the actual link is to be filled and delivered only through the approved private channel after verification. Preserve existing deployment protection, branch-only secret scope and Production settings.

## Release verification checklist

1. Complete local candidate validation and record its final commit and test results. Do not carry the published 72-test result forward as evidence for later changes.
2. Deploy the approved candidate as a protected Preview in the existing project and branch scope. Verify its actual commit, runtime readiness and unique hostname; keep Production live blocking intact.
3. Reconcile the original hosted counter, then perform only the approved in-place 100-total change without resetting usage. Verify the resulting used count, cap and expiry. See [TEST_BUDGET.md](TEST_BUDGET.md); do not initialize a replacement or fund the same bundle through SQLite.
4. Recheck anonymous status/MCP rejection on that exact deployment. Create and test only its approved judge-specific link, with the exact expiry above; confirm it unlocks the intended deployment while access without the link remains protected. Record the non-secret outcome, never the bearer value.
5. Run the prepared synthetic two-profile check using Nina Simone and Nina Hagen, New York City, $140, Slow & intimate, 18:00. Both public-artist candidates are already verified, so the prepared operator payload needs two uncached Insights attempts and no new search. A judge using a fresh browser may need entity searches; do not promise cross-browser or cold-start cache hits. Record only a truthful outcome and non-secret usage counts.
6. Inspect the live shortlist, provenance, error state and unknown prices/hours/travel disclosures. Stop on authentication, expiry, quota or rate-limit errors; never substitute fictional places for failed live results.
7. Recheck usable judge access and expiry, plus the final live UI. Finish phone/touch and accessibility checks without claiming unperformed device testing.

## Judging access and submission

The [Official Rules](https://qloo.devpost.com/rules), section 4 Testing, permit private sites if judges receive working login credentials and have free, unrestricted testing access through judging. Section 11.4 gives those Rules precedence over inconsistent homepage wording. Anonymous access and an external model-directed MCP demonstration are not separately specified requirements. The link expiry matches the published judging end: November 5, 2026, 11:45 p.m. Eastern / November 6, 04:45 UTC.

A usable Qloo-powered application, a public open-source repository/license and a truthful text description remain required. The [event homepage](https://qloo.devpost.com/) explicitly says no demo video is required. A fictional sample alone does not establish the live workflow. The approved 100-total bundle is finite and must be enforced honestly; no paid service or unbounded allowance is implied.

The historical Devpost connector HTTP 405 did not create a project or entry. [SUBMISSION_DRAFT.md](SUBMISSION_DRAFT.md) remains local and unfinished until the actual plan/deployment/access evidence is recorded. No submission, deployment, access-link creation, counter mutation or Qloo call is performed by this document update.
