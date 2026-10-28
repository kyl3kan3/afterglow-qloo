# Release readiness - October 28, 2026

Afterglow's genuine hosted artist search, two-profile live Insights plan, independent-browser judge access and live-mode form are verified. The MIT-licensed project contains the sample planner, real MCP transports and the official Qloo harness bridge pinned at 0.1.26. Testing-instruction delivery, a 55-second access-expiry gap, entry creation and submission remain open.

## Published code and local work

- Current verified Preview revision: `eb3ca64`, in the [PR #8](https://github.com/kyl3kan3/afterglow-qloo/pull/8) release context. No merge or submission is recorded here.
- The release includes recent-candidate reuse and the explicit hosted 100-total opt-in. Hosted configuration defaults to ten; `QLOO_TEST_APPROVED_CAP=100` selects the approved ceiling and must match the actual Redis cap. The isolated SQLite maximum remains ten.
- The earlier published baseline passed 72 tests. A later hosted-cap candidate passed 82 tests on Node 24.19.0 with serial test execution, plus syntax/build/whitespace checks; the recent-candidate UI update separately passed all 11 UI tests. These are distinct recorded checks, not an invented combined test count. See [VERIFICATION.md](VERIFICATION.md).

## Observed October 28 evidence

- The Git connection and branch-scoped Preview secret configuration are in place. Production configuration was preserved; no credential values or private identifiers are recorded here.
- The current Preview at https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/ is READY at revision `eb3ca64`.
- Earlier October 28 Preview checks confirmed authenticated status HTTP 200, anonymous status HTTP 302 to Vercel SSO, and anonymous MCP initialization HTTP 401. A separate browser session then confirmed ordinary access reaches Vercel login, confidential judge access opens the app and removes the access query, and `/api/status` returns HTTP 200 with `enabled:true` and `maxTestRequests:100`. This access check made no Qloo request; instructions have not yet been placed with a Devpost entry.
- The public sample at https://afterglow-qloo.vercel.app/ still reports `enabled:false` and `blockedReason:PUBLIC_LIVE_DISABLED`. Production live blocking remains in place.
- One genuine Qloo artist search returned HTTP 200 and six candidates, moving the original counter from zero to one used request.
- The same hosted counter was successfully amended to `cap:100` while preserving `used:1`. Its current expiry is `2026-11-06T04:45:00Z`.
- A single `POST /api/plan` then returned HTTP 200 in live mode with four shared candidates and three proposed stops. The synthetic inputs were Nina Simone and Nina Hagen, New York City, a $140 budget, Intimate mood and 18:00. No new artist search was needed for that prepared input.
- After the plan, the original counter read `cap:100`, `used:3`, with the same expiry: exactly two new reservations and **97 remaining application slots**. This does not establish the provider key's numeric remaining quota. Returned venue names, identifiers, response datasets and screenshots are omitted from public source.
- The separate browser session switched from Sample studio to live mode and displayed the live banner, empty actual-entity choosers, city textbox and disclosures. It made no search or plan request; the counter was reread unchanged at 100 total / 3 used with the same expiry. Together with the real API plan and recorded 11 UI tests, this is the current product evidence; another browser-plan run is not a separately published submission requirement.
- The historical environment-API HTTP 403 was not retried. It must not be used to describe the later successful deployment or as a reason to bypass denied access.

## Usage and judging requirements

The executed hosted ceiling is **100 total**, including the earlier search and the two planning requests. The last observed used count is three, leaving 97 application slots. Keep the original shared counter and datastore; do not reset usage, replace the counter or also fund this bundle through SQLite. Failed, timed-out and cold-start requests consume slots when uncached. SQLite retains its separate ten-request maximum.

The judge-access check passed in an independent browser session. Access details remain confidential and are not recorded here. Their actual expiry is **November 6, 04:44:05 UTC**, 55 seconds before the official judging end and the counter expiry at 04:45 UTC. Do not describe that as full coverage through judging. Instruction placement remains pending, and this documentation update performs no service operation or additional request.

The [current Qloo guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide) describes rate and monthly limits, and keys remaining active through judging, but gives no numeric per-key allowance. The [organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) confirms that event API requests are free through judging with no automatic paid charges. Numeric remaining quota and rate limits are still operational uncertainties; do not equate them with automatic paid-overage risk.

The [official Rules, section 4](https://qloo.devpost.com/rules) require a working Qloo-integrated application that meets one of the agentic-tool, agent-framework or existing-agent routes, a functional demo, public open-source repository with a detectable license, and a text description. The [event homepage](https://qloo.devpost.com/) explicitly says a demo video is not required. An external agent-host/model/MCP interaction demonstration is useful optional evidence, not a separately listed submission requirement.

Rules section 4 permits a private website when testing instructions provide login credentials; judges must have free, unrestricted use through the end of judging. Section 11.4 gives the Rules precedence over inconsistent homepage wording about private access. Anonymous access is therefore not an established requirement. Judging runs from November 2 at noon Eastern through November 5 at 11:45 p.m. Eastern, ending **November 6 at 04:45 UTC**, matching the current application-budget expiry. The separate browser check establishes that the current access mechanism works, but its expiry is 55 seconds short and its instructions still need placement. Whether a cached-only interactive experience qualifies, or every judge needs fresh results, remains unanswered in the linked organizer discussion.

## Remaining gates

- [x] Deploy the hosted 100-total candidate as a READY Preview, keeping SQLite at ten.
- [x] Amend the original hosted counter to 100 total without resetting used requests; verify the resulting cap, used count and expiry.
- [x] Complete the prepared two-profile live Insights API check: HTTP 200, four shared candidates, three stops and exactly two additional reservations.
- [x] Verify confidential judge access in a separate browser session, ordinary-access protection and live status without a Qloo call.
- [x] Check the live-mode form and disclosures in the separate judge browser session without another Qloo request.
- [ ] Verify coverage through the exact judging end: current access expires at 04:44:05 UTC, 55 seconds before 04:45 UTC. Deliver testing instructions through the appropriate confidential channel after the remaining entry-creation blocker is resolved. Preserve ordinary-access protection and public Production live blocking.
- [ ] Recheck the shared counter and expiry for judging handoff. The observed 97 remaining slots are finite application capacity, not unlimited provider quota; exhaustion must remain explicit. Any further expansion or paid service needs separate scope.
- [ ] Resolve the Devpost project-creation blocker, then complete truthful fields, eligibility declarations and the final submission. Deadline: October 30, 10:45 p.m. Central. No video is required.

Additional phone/touch, screen-reader and model-directed external-host checks remain unperformed quality evidence. They are not added here as separate submission artifacts or prerequisites. Keep the recorded limits and avoid invented impact claims.

## Devpost blocker

The owner was signed in. Qloo's My projects view was blank and the portfolio contained no Afterglow project. Clicking Start project was **denied by automatic approval review** because creation of a new external Devpost entry was considered outside the existing-draft scope. A normal read-only reload cleared the earlier closed-event banner and continued to show the October 30 deadline. One retry of the same control with that materially new availability evidence was denied for the remaining creation-scope issue. No alternate route, project creation or final submission occurred. Explicit authorization to create the missing Devpost entry, or a direct existing-draft URL, is the current continuation requirement. A reCAPTCHA connection error was also observed before the reload; its recurrence is unverified.

This update changes local documentation only. It records the confirmed October 28 deployment, counter amendment and live plan. It performs no additional Qloo request, credential operation, counter change, access operation, publication, deployment or submission.
