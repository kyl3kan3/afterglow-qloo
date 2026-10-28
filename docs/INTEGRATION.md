# Qloo integration and owner decisions

## October 28 verified live Preview

Protected Preview commit `eb3ca64` is READY at its [canonical deployment URL](https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/). Existing credentials remain scoped to the readiness branch. Production live execution remains blocked. Earlier test counts, including the 72-test `b8cbd076` baseline, remain separate dated records in [VERIFICATION.md](VERIFICATION.md).

One genuine hosted artist search returned HTTP 200 and six candidates. The original counter was then amended in place to cap 100 while preserving its one spent request. A two-profile live plan returned HTTP 200, mode `live`, four shared candidates and three stops. The same counter advanced by exactly two reservations to **cap 100, used 3, 97 remaining**, with expiry `2026-11-06T04:45:00Z`. This is a 100-total test/judging bundle, not 100 additional requests.

Deployment-specific judge access was verified in an independent browser: without the private link, the deployment requires Vercel login; the private link opens the app and its query is removed. The subsequent status request returned HTTP 200 with live enabled and maximum 100, without making a Qloo request. **The actual access expiry is `2026-11-06T04:44:05Z`, 55 seconds before the official judging end at `04:45:00Z`.** That gap remains unresolved. Private judge-link delivery/placement and Devpost submission remain pending. The link value is retained only in memory and is not included in any file. See [READINESS.md](READINESS.md) for the central release status.

The same independent browser switched from Sample studio to live Qloo and displayed the live banner, empty actual-entity choosers, city input and expected disclosures. It made no search or plan request; the counter reread remained cap 100, used 3, with the same expiry. This live-form check, the successful HTTP plan and the recorded 11 jsdom UI tests are the current product evidence. Additional device/accessibility QA is an unperformed validation limit, not an extra required submission artifact.

## Authorization and required live checks

1. Continue in the existing Afterglow backend and original isolated Redis database with the same counter identity. Preserve used requests. Do not reset or replace the counter, change its ID/store to replenish it, or fund the hosted approval through SQLite as well. The isolated SQLite route retains its separate hard maximum of ten and is not a second allowance for this bundle.
2. Before further calls, reconcile the original counter against its verified cap 100, used 3 and expiry `2026-11-06T04:45:00Z`. Failures, timeouts, cold starts and judging traffic all count against the same total. The 97 remaining figure is a readback snapshot and must decrease with further reservations.
3. Public MIT source and the sample deployment are already approved. Judge-only deployment access is verified, but its actual expiry is 55 seconds short of the approved judging window. Resolve that coverage gap before claiming access lasts through judging end. Keep the bearer value only in memory until the private judge handoff; never put it in source, public documentation, screenshots or logs. This scoped access does not authorize broad access exceptions, new account grants or public Production live access.
4. Use synthetic demo inputs consisting only of public cultural favorites and a city. Keep real Qloo entity IDs, response data, cultural datasets, screenshots, private approval identifiers and bearer URLs out of public repository artifacts. Record counts and status summaries instead. Do not retrieve secret values for reports, rotate credentials, or issue new credentials. Any required owner entry must use an authorized secure mechanism.

The [event organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) states that hackathon API requests are free through judging and have no automatic paid charges. The [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide#quotas-limits--key-expiration) confirms rate/monthly limits and key validity through judging but publishes no numeric limits. The application's 100-total approval is an application usage cap, not a claim about the event key's numeric quota. Paid plans, upgrades and new grants remain outside this approval.

Earlier Vercel environment writes and an environment-metadata read returned HTTP 403. Respect those historical access restrictions; the later READY deployment and successful search do not authorize bypassing them.

## Exact runtime configuration

- `QLOO_ENABLED=true`: live-test opt-in gate; defaults off and cannot enable production live access
- `QLOO_TEST_LEDGER`: isolated stdio only, an absolute path to one separately authorized durable SQLite ledger with a hard maximum of ten; never fund the hosted approval here
- `QLOO_TEST_APPROVED_CAP`: hosted only; defaults to ten when unset. Explicit `QLOO_TEST_APPROVED_CAP=100` is verified on the protected Preview and matches the original Redis cap. Reservations fail closed on a cap mismatch. This setting does not raise SQLite's hard maximum of ten or itself update Redis.
- `QLOO_API_KEY`: event-issued credential in the backend secret store only
- `QLOO_BASE_URL=https://hackathon.api.qloo.com`: optional explicit value; any other configured endpoint is rejected
- `AFTERGLOW_ORIGIN`: exact verified deployment origin, required to allow its hostname for HTTP MCP; localhost is permitted for local testing
- Protected-preview configuration is listed in [TEST_BUDGET.md](TEST_BUDGET.md); all hosted search, planning and MCP calls share the original Redis counter, including judge use
- `PORT=4177`: local development only

The adapter pins `@qloo/qloo-harness` 0.1.26. The application pins Node 24.x (the harness itself requires at least 22.19.0). It invokes the official `qloo api search` and `qloo api insights` surfaces using `execFile`, no shell, a 20-second timeout and 2 MiB output cap. Arguments include required `--query` / `--type` options and validated JSON parameters. The key is never a command argument.

The child receives a minimal environment containing the endpoint, credential and `QLOO_TRUSTED_BASE_URL` equal to that same hard-coded official hackathon endpoint. Each uncached invocation gets a fresh temporary home, supplied through both `HOME` and Windows `USERPROFILE`, plus an explicit `QLOO_HOME` beneath it. An unrelated saved Qloo configuration cannot be used as a fallback on either platform. The adapter does not write a Qloo config file and removes that invocation's temporary directory after completion.

The event kit's credential and safe-use guidance:
- https://github.com/qloo/qloo-hackathon-kit/blob/main/README.md
- https://github.com/qloo/qloo-hackathon-kit/blob/main/docs/API_ACCESS.md
- https://github.com/qloo/qloo-hackathon-kit/blob/main/docs/SAFE_USE.md
- https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide

## Credential-free checks that were performed

The installed official harness's help, bundled implementation and `--dry-run` argument parsing were inspected. Dry runs used an explicitly fake fixture string, never a real key, and made no API call. This found and fixed three important contract details:

1. CLI required options must be explicit even when also passed in `--params`.
2. `qloo api ... --json` returns an entity array. The adapter handles this as well as standard API envelopes.
3. Harness 0.1.26's dry-run URL display ignores `QLOO_BASE_URL` and prints its config/default URL, while its actual client constructor does use `QLOO_BASE_URL`. This is a display inconsistency in the installed package. No production endpoint was contacted. The adapter hard-locks the hackathon endpoint and passes the exact matching trust value. Verify the actual destination during an approved live smoke test.

## Verified flow and remaining judging handoff

1. The deployed hosted cap, original counter and two-profile Insights path are verified. Recheck state after changes. A status response alone is configuration evidence and spends zero Qloo requests; it does not establish remaining quota.
2. The live plan reused previously verified public favorites, returned four shared candidates and composed three stops. No further search is needed merely to rebuild that synthetic input.
3. Preserve provenance privately and keep public artifacts to counts/status summaries. Sparse overlap remains a clear 422 rather than fictional filler.
4. Check repeat-query caching only when useful and within the remaining total. Identical queries avoid new Qloo calls only if the same warm process serves them within 60 seconds; other functions and cold starts can reserve more slots.
5. The deployment-only access mechanism opens the app in an independent browser, but its actual `2026-11-06T04:44:05Z` expiry leaves a 55-second coverage gap. Reconcile that gap and complete private judge delivery/placement before claiming the handoff is complete. Recheck access after any replacement deployment.
6. Stop on authentication, expiry, quota or rate-limit errors. Preserve enough of the verified remaining bundle for judges through the judging end. Never reset the counter or treat failed calls as free.

A plan uses two independent place-insight requests, each limited to 20 results. They run sequentially so a first-request error stops before reserving the second slot. Search uses six results. There is a 60-second, 50-entry per-process cache. Every cache miss reserves one slot before a harness child starts. A Node preload guard permits only one fetch to the approved endpoint and rejects redirects/repeated attempts. Failures consume quota. The original Redis counter covers all hosted instances and transports; it never auto-initializes, refunds or resets. A verified cap update preserves spent usage rather than creating a fresh 100-request pool. Concurrent duplicates can consume separate slots; a two-profile plan with one slot remaining can consume it and then fail.

## Vercel checklist

- Reuse the existing Afterglow project and approved isolated database; do not create duplicates or borrow another app's secrets
- Node 24.x runtime, committed dependency lock, `npm run build`, static output `dist`
- Include the pinned harness and its transitive dependencies in the serverless function bundle (`vercel.json` includes node_modules)
- Preserve the verified bundled harness and two-Insights flow; revalidate after deployment changes
- Preserve the one shared 100-total usage counter and Production live block
- Set backend secret and opt-in flag only through approved secure configuration
- Test status, search, plan, 401/429 handling, no-results, cold start and 20-second timeout
- Additional native phone/touch and accessibility checks were not performed in this run; record them as validation limits, not extra eligibility artifacts
- Reconcile the judge-access expiry at `2026-11-06T04:44:05Z` with the required judging end at `04:45:00Z`; the counter already expires at the latter

No LLM API key is needed by Afterglow. Its real MCP server is a structured, inspectable agent tool; it uses deterministic planning and real Qloo results when connected. A chat model is not simulated or bundled. An external model-directed host run is optional validation and remains unverified; the published requirements do not separately require proof of such a run or a demo video. The hosted HTTP live-plan flow is verified; the remaining judge handoff and duration gap are separate release work.

[Official Rules section 4](https://qloo.devpost.com/rules) permits private-site judge credentials and requires free, unrestricted judging access through the end of judging. Section 11.4 gives the Official Rules precedence over inconsistent event materials. Verified access currently falls 55 seconds short of that full period; private delivery and submission are still pending.
