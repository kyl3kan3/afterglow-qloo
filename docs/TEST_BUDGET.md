# Qloo test and judging budget

The public Production demo remains sample-only. Production rejects live Qloo execution even with credentials and flags set. Approved live work uses the existing protected Preview and its original shared Redis counter. The isolated stdio/SQLite route is separate and retains a hard maximum of ten; it must not also fund this hosted approval.

## Verified state and remaining judge handoff

- Current protected Preview: commit `eb3ca64`, READY at its [canonical URL](https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/). Hosted configuration defaults to ten when `QLOO_TEST_APPROVED_CAP` is unset; explicit `QLOO_TEST_APPROVED_CAP=100` is now verified and matches the stored cap. Each reservation rejects a runtime/stored cap mismatch. The isolated SQLite maximum remains ten. Dated test counts are recorded separately in [VERIFICATION.md](VERIFICATION.md).
- Original counter: **cap 100, used 3, 97 remaining**, expiry `2026-11-06T04:45:00Z`. The approved amendment preserved the one previously spent search request; one live-plan POST then returned HTTP 200, mode `live`, four shared candidates and three stops, consuming exactly two more reservations.
- Authorization remains **100 hosted requests total** across tests and judge use, including all three already spent. The same counter/database was preserved; this is not a new 100-request pool. Remaining capacity is a readback snapshot, not a renewed allowance.
- Deployment-specific judge access is verified in an independent browser: no private link leads to Vercel login; the link opens the app and its query is removed. Status returns HTTP 200 with live enabled and maximum 100. Switching to live mode displayed the banner, empty actual-entity choosers, city input and disclosures. No search or plan was made in these checks; the counter reread remained cap 100, used 3, with the same expiry.
- **Actual access expiry: `2026-11-06T04:44:05Z`, 55 seconds before the official judging end at `04:45:00Z`.** The gap remains unresolved, so full-period coverage is not established. Private link delivery/placement and Devpost submission remain pending. The bearer value is kept only in memory, never in a file, public source, screenshots or logs.

Follow [READINESS.md](READINESS.md) for current evidence and submission blockers. No new counter/database, quota reset, replacement approval ID or additional account grant is authorized by this document. Keep the existing store and counter identity, preserve used requests and reconcile further attempts before reporting remaining capacity. Production live remains blocked.

## Separate isolated SQLite route

The local stdio route has a hard maximum of ten requests per separately approved durable ledger. The hosted 100-total bundle does not authorize creating or spending a SQLite ledger. Never fund one approval through both stores.

For a separately authorized first local setup only:

1. Choose one persistent local filesystem and an absolute ledger path outside the repository. All processes for that separate approval must use that exact file. Do not use `/tmp`, ephemeral containers, network filesystems, copied ledgers or multiple machines. Loss of state means stop and reconcile usage, never initialize replacement quota.
2. Initialize once with a cap no greater than ten and an expiry within the separately approved period and key validity. The parent directory must already exist. The ledger stores no credential. Existing initialized state must never be overwritten or reset.
3. The owner supplies the credential through a supported secure handoff. Do not paste it into chat, source, CLI arguments, shared MCP JSON or logs. Configure `QLOO_ENABLED=true` and `QLOO_TEST_LEDGER` for isolated stdio only. The route rejects either hosted Redis URL alias alongside its ledger.
4. Inspect remaining usage with the local budget-status command using a private absolute path. Do not expose the ledger, private approval reference, or filesystem-editing tools for it. No model API is invoked by Afterglow.

## Enforcement

Each uncached request commits one reservation before starting the official Qloo harness. Failed, timed-out or cancelled invocations keep their reservation. A two-profile plan uses up to two slots sequentially; a first-request error prevents the second request. With only one slot remaining, a plan can consume it before the second reservation fails. Cache hits consume none, but different functions, concurrent duplicates and cold starts may reserve separately. There is no refund, automatic reset or request-accessible initialization endpoint.

SQLite's atomic update and full synchronous writes preserve its separate cap across ordinary process restarts. The hosted Redis counter shares the hosted total across all instances, search/planning/MCP transports and judge use. A cap increase must preserve spent usage; 100 total never means 100 additional requests.

A preload guard in the harness child uses exactly one unpooled HTTPS request, only to `https://hackathon.api.qloo.com/search` or `/v2/insights`, and rejects redirects. This preserves the supported `qloo api` access surface while enforcing the single-attempt contract. Credential values are never written to the ledger. Missing, corrupt, exhausted or expired state prevents the subprocess from starting.

These controls bound requests made through the selected route. They cannot prevent an owner from editing source/state or spending the same key elsewhere. A local machine restart is supported only if its filesystem survives. Restoring old SQLite or Redis state can restore spent slots and must not be used to regain quota.

## Protected Vercel preview

The shared Redis adapter reserves before every uncached hosted HTTP and MCP Qloo request. No application request can initialize, overwrite, reset or refund its counter. Production is blocked independently of Preview flags.

For continued testing and judge handoff:

1. Reconcile the original counter against its verified cap 100, used 3 and expiry `2026-11-06T04:45:00Z`. Keep its existing database, approval identity and spent usage. Do not use a new ID, database or SQLite ledger to replenish or bypass this total.
2. Preserve the explicit hosted `QLOO_TEST_APPROVED_CAP=100` opt-in and stored-cap match; unset configuration defaults to ten. The isolated SQLite ceiling remains ten. The genuine search/plan and preserved reservations do not establish every Redis concurrency or long-term retention property.
3. Reuse the approved isolated Free Upstash database with eviction off. The adapter accepts `QLOO_TEST_REDIS_URL` / `QLOO_TEST_REDIS_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, with the same fixed `QLOO_TEST_BUDGET_ID`. Existing branch-scoped secrets are ready. Any further owner entry must use secure Preview settings; do not read secret values into reports or overwrite setup blindly.
4. Preserve Vercel Authentication on the unique deployment URL. Independent browser verification requires login without the private link and opens the app with it. Recheck protection and MCP access after deployment changes. Configuration flags and hostname checks are routing guards, not authentication proof.
5. Preserve Preview-only `QLOO_ENABLED=true` and `AFTERGLOW_PROTECTED_PREVIEW=true` opt-ins with platform `VERCEL=1`, `VERCEL_ENV=preview` and the valid unique `VERCEL_URL`. The app accepts only that exact raw Host and matching HTTPS Origin when supplied. Aliases, custom domains, forwarded-host substitutes, alternate ports and localhost are rejected before live results or quota use. Production remains off.
6. The two-Insights plan has passed with four shared candidates and three stops. Reuse the already verified public favorites if another approved test is needed; no fresh search is needed merely to rebuild that input. Retain only counts/status summaries in public artifacts, never real Qloo IDs, response datasets, screenshots or private payloads.
7. The judge-only access mechanism is verified, but its actual `2026-11-06T04:44:05Z` expiry leaves a 55-second gap before judging ends. Reconcile that gap and complete private delivery/placement before claiming full judging coverage. Keep the bearer value only in memory until that private handoff; never write it into repository files or public assets. This document makes no access changes or new grants.

The [organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) states that event API requests are free through judging and have no automatic paid charges. The [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide#quotas-limits--key-expiration) describes rate/monthly limits without numeric quotas and says keys remain active through judging. These service limits are distinct from the application's approved 100-total cap. Stop on rate, authentication, expiry or quota errors; paid upgrades and new grants are not authorized here.

[Official Rules section 4](https://qloo.devpost.com/rules) permits private-site judging credentials and requires free, unrestricted access through judging end; section 11.4 gives the Rules precedence over inconsistent event materials. The current 55-second access gap still needs resolution. An external model-directed MCP/agent-host run is optional validation, not a separate published submission requirement. Protocol fixtures do not prove a model-directed run; the hosted HTTP live-plan flow is independently verified. No demo video is required.

The hosted adapter follows [Upstash REST](https://upstash.com/docs/redis/features/restapi) and [atomic Lua execution](https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http). Automated fixtures and dated local test results are distinct from the current runtime evidence: one search, one successful two-profile plan and verified access/status/live-form checks that made no Qloo request.
