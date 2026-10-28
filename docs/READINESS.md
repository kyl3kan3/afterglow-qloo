# Release readiness - October 28, 2026

Afterglow is the existing Qloo entry. The MIT-licensed repository contains a fictional-sample planner, real MCP transports and the official Qloo harness bridge pinned at 0.1.26. A genuine Qloo search now works on the protected Preview. The complete two-profile Insights workflow and a usable judging route remain unverified; the search alone does not establish submission readiness.

## Published code and local work

- Published candidate: `b8cbd0764e59da600b8e8a2844fda0860692f4e9` on [PR #8](https://github.com/kyl3kan3/afterglow-qloo/pull/8). The PR remains open and unmerged.
- That candidate preserves quota by stopping after the first profile failure, rejects both hosted Redis URL aliases on the SQLite path, isolates harness configuration, uses portable ESM preload URLs, closes failed SQLite setup and discards stale dialog searches.
- The published candidate passed 72 automated tests on Windows with Node 24.19.0, plus syntax, static-build and whitespace checks. MCP protocol, Qloo/Redis fixtures, OS-process budget concurrency and UI regressions are covered; these checks do not establish the complete live workflow. See [VERIFICATION.md](VERIFICATION.md).
- Local candidate work adds reuse of recent live search candidates and support for the approved hosted 100-total bundle, with regression tests. It is not part of the published commit above and must not be described as released until its validation and publication are recorded. The isolated SQLite ceiling remains ten.

## Observed October 28 evidence

- The approved Git connection is established. Three branch-scoped Preview Secret entries are ready; Production configuration was preserved. No credential values or private approval identifiers are included here.
- Deployment `dpl_4eVM3BtU1Q1LmV57dq445gPhF8DS` was READY at 13:40:37 UTC. Its unique Preview URL is https://afterglow-qloo-kry673cfj-kyl3kan3-6147s-projects.vercel.app/.
- Authenticated Preview status returned HTTP 200 and the UI showed the configured live state. Anonymous Preview access returned HTTP 302 to Vercel SSO, and anonymous MCP initialization returned HTTP 401. These boundary checks do not establish that judges have usable credentials.
- The public sample at https://afterglow-qloo.vercel.app/ still reports `enabled:false` and `blockedReason:PUBLIC_LIVE_DISABLED`. Production live blocking remains in place.
- One genuine Qloo search returned HTTP 200 with six artist candidates. No returned names, IDs, response datasets or screenshots are published in this document or repository.
- The original shared counter moved from `used:0` to `used:1`, with `cap:10` and its expiry unchanged. It was not reset or replaced. This proves one recorded reservation and one successful search; it does not prove two-profile Insights behavior or provider-side remaining quota.
- The historical environment-API HTTP 403 was not retried. It must not be used to describe the later successful deployment or as a reason to bypass denied access.

## Usage and judging requirements

The owner has approved a **100-total hosted request bundle, including the one request already used**, plus a judge-only access link for one deployment through `2026-11-06T04:45:00Z`. These approved operations are pending execution and verification; this document does not raise a counter, create a link or grant access.

The last observed counter remains `cap:10`, `used:1`, with its expiry unchanged. After a verified in-place change to `cap:100` preserving `used:1`, the arithmetic remainder would be 99, before any later attempts. This is never a fresh 100 requests. Keep the original shared counter, datastore and identity; do not reset usage, create a replacement counter, or also fund a SQLite ledger for this bundle. Failed, timed-out and cold-start requests still consume slots when uncached. SQLite remains capped at ten and is not the hosted judging budget.

The approved link must be scoped to the selected deployment only, with the existing protection and Production configuration preserved. Its bearer value is a secret: never place it in public source, the public submission description, screenshots, logs or this file. Private judge instructions are being prepared outside the repository with a placeholder until the approved link is created and tested. The bundle authorizes no paid upgrade, additional grant or scope beyond those approved operations.

The [current Qloo guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide) describes rate and monthly limits, and keys remaining active through judging, but gives no numeric per-key allowance. The [organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) confirms that event API requests are free through judging with no automatic paid charges. Numeric remaining quota and rate limits are still operational uncertainties; do not equate them with automatic paid-overage risk.

The [official Rules, section 4](https://qloo.devpost.com/rules) require a working Qloo-integrated application that meets one of the agentic-tool, agent-framework or existing-agent routes, a functional demo, public open-source repository with a detectable license, and a text description. The [event homepage](https://qloo.devpost.com/) explicitly says a demo video is not required. An external agent-host/model/MCP interaction demonstration is useful optional evidence, not a separately listed submission requirement.

Rules section 4 permits a private website when testing instructions provide login credentials; judges must have free, unrestricted use through the end of judging. Section 11.4 gives the Rules precedence over inconsistent homepage wording about private access. Anonymous access is therefore not an established requirement. Judging runs from November 2 at noon Eastern through November 5 at 11:45 p.m. Eastern, ending **November 6 at 04:45 UTC**. The approved link expiry matches that end, not a later grace period. The current Vercel SSO boundary alone does not prove a working judge-access route. Whether a cached-only interactive experience qualifies, or every judge needs fresh results, remains unanswered in the linked organizer discussion.

## Remaining gates

- [ ] Finish, validate and release the hosted 100-total candidate, keeping SQLite at ten. Apply the approved change to the existing hosted counter without resetting its used value; record the actual cap, used count and expiry afterward. Approval is recorded here, not successful execution.
- [ ] Complete the prepared two-profile live Insights workflow. The synthetic demo uses Nina Simone and Nina Hagen, whose verified candidates are already available, with New York City, a $140 budget, Intimate mood and an 18:00 start. Its uncached plan needs two new upstream attempts; no fresh artist search is needed for that prepared input. Do not publish Qloo IDs or the private request payload. Reconcile the counter before the run, stop on authentication, expiry, quota or rate-limit errors, and do not retry automatically.
- [ ] Inspect actual shared-place results, provenance and the honest unknown-price/availability disclosures. The successful artist search and fixture tests do not establish this result.
- [ ] Create and verify only the approved deployment-specific judge access link, expiring November 6 at 04:45 UTC, then deliver it through an approved private judge-access channel. Verify the link unlocks the selected working deployment while anonymous access without it remains protected. Preserve public Production live blocking; the sample and an owner-only protected Preview do not establish judge access by themselves.
- [ ] Verify that the approved shared 100-total enforcement and expiry support the judging route. It is a finite bundle, not unlimited provider quota; exhaustion must remain explicit. Any later expansion or paid service needs separate scope, and this local documentation update performs neither.
- [ ] Finish phone/touch and accessibility checks, then record only verified functionality and impact claims. An external-agent demonstration may strengthen the entry if pursued within authorized scope.
- [ ] Finalize truthful Devpost materials and eligibility declarations against the current [Rules](https://qloo.devpost.com/rules). Deadline: October 30, 10:45 p.m. Central. No video is required.

This update changes local documentation only. It records the earlier October 28 search and deployment and the newly approved, still-pending bundle. It performs no additional Qloo request, credential operation, counter change, access grant, publication, deployment or submission.
