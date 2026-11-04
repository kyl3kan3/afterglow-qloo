# Deployment and remaining submission gates

## Last completed deployment evidence - October 28, 2026

- The tested live Preview is pinned to revision `eb3ca64` in the [PR #8](https://github.com/kyl3kan3/afterglow-qloo/pull/8) release context. Historical 72-test baseline, later 82-test hosted-cap run and 11-test UI run are separate records in [VERIFICATION.md](VERIFICATION.md); no invented combined count is assigned to this deployment.
- The approved Git connection is established. Three existing credentials are ready as branch-only Preview Secret entries; Production configuration was preserved.
- The READY Preview is https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/.
- One genuine artist search returned HTTP 200 and six candidates. A later live `POST /api/plan` returned HTTP 200, four shared candidates and three stops, consuming exactly two further reservations. No raw Qloo responses, returned identifiers or screenshots belong in public source.
- The original counter was amended in place to `cap:100`, preserving its earlier used request. After the plan it read `used:3`, leaving 97 application slots, expiring `2026-11-06T04:45:00Z`. It was not reset or replaced.
- In a separate browser session, ordinary access reached Vercel login; confidential judge access opened the app and removed its access query. Status returned HTTP 200, `enabled:true` and `maxTestRequests:100`, with no Qloo request. Testing instructions have not yet been placed with a Devpost entry.
- Actual access expiry is `2026-11-06T04:44:05Z`, 55 seconds before the official judging end and counter expiry at 04:45 UTC. This gap remains open; do not describe current access as covering the entire judging period.
- The public fictional sample at https://afterglow-qloo.vercel.app/ continues to report live disabled with `PUBLIC_LIVE_DISABLED`. Public Production live execution remains blocked.

The historical Vercel environment-API HTTP 403 was not retried. It is not evidence that the later successful Preview failed. Reuse the existing project and datastore; no duplicate project, replacement counter or credential retrieval is needed for these documentation changes.

## Current budget and access state

The executed hosted ceiling is **100 requests total**, including the earlier search and two planning requests. Hosted configuration defaults to ten; explicit `QLOO_TEST_APPROVED_CAP=100` matches the current stored cap. SQLite remains capped at ten and must not fund this hosted bundle as well. Failures and uncached calls from other functions or cold starts consume the same finite total.

Recent-candidate reuse is part of the live release. The prepared synthetic plan used Nina Simone and Nina Hagen, New York City, $140, Slow & intimate and 18:00, with no fresh artist search. A judge in a new browser may need searches; do not promise cross-browser or cold-start cache hits. Keep the original counter and spent usage; do not reset, refund or replace it.

The independent-browser access check passed. Confidential access details are kept separately from public source and this record. Preserve existing deployment protection, branch-only secret scope and Production settings. Access delivery and exact-end coverage still need completion; access creation is no longer an unperformed step.

## Remaining verification and handoff

1. Keep runtime evidence pinned to the tested `eb3ca64` Preview. Documentation-only publication does not establish runtime behavior on another deployment.
2. Verify access coverage through 04:45 UTC; the current 04:44:05 expiry is 55 seconds short. No access change is performed by this document.
3. The independent browser also displayed the live-mode form, banner, entity choosers, city field and disclosures without a new search or plan; the counter remained 100 total / 3 used. This and the recorded API plan/11 UI tests are current product evidence, not a claim of another browser plan run or a new submission prerequisite.
4. Deliver confidential testing instructions with the entry after the Devpost blocker below is resolved. Reconcile the counter at handoff; 97 was the last observed remainder, not a guarantee after later calls.
5. Phone/touch, screen-reader and external model-host checks remain optional quality evidence with their limits recorded. Stop any authorized live check on authentication, expiry, quota or rate-limit errors; never substitute fictional results.

## Judging access and submission

The [Official Rules](https://qloo.devpost.com/rules), section 4 Testing, permit private sites if judges receive working login credentials and have free, unrestricted testing access through judging. Section 11.4 gives those Rules precedence over inconsistent homepage wording. Anonymous access and an external model-directed MCP demonstration are not separately specified requirements. The published judging end is November 5, 2026, 11:45 p.m. Eastern / November 6, 04:45 UTC; current access expires 55 seconds earlier.

A usable Qloo-powered application, a public open-source repository/license and a truthful text description remain required. The [event homepage](https://qloo.devpost.com/) explicitly says no demo video is required. A fictional sample alone does not establish the live workflow. The approved 100-total bundle is finite and must be enforced honestly; no paid service or unbounded allowance is implied.

The signed-in owner's Qloo My projects view was blank and the portfolio contained no Afterglow project. A Start project click was denied by automatic approval review. A normal read-only reload cleared the prior closure banner and showed the October 30 deadline. One retry of the same control was still denied because creating a new Devpost entry was considered outside the existing-draft scope. No alternate route, project creation or final submission occurred. See [READINESS.md](READINESS.md) for the current continuation requirement and [SUBMISSION_DRAFT.md](SUBMISSION_DRAFT.md) for the public writeup. This documentation update makes no Qloo call.
