# Qloo test and judging budget

The public Production demo remains sample-only. Production rejects live Qloo execution even with credentials and flags set. Approved live work uses the existing protected Preview and its original shared Redis counter. The isolated stdio/SQLite route is separate and retains a hard maximum of ten; it must not also fund this hosted approval.

## Verified state and pending expansion

- Published baseline: open PR #8 at `b8cbd0764e59da600b8e8a2844fda0860692f4e9`, with 72 passing local tests. Its hosted ceiling is ten. Local support for a hosted ceiling of 100 is a separate candidate still under implementation and testing, not a published capability. That candidate defaults to ten unless explicitly configured with `QLOO_TEST_APPROVED_CAP`; `QLOO_TEST_APPROVED_CAP=100` selects the approved ceiling of 100. Each reservation requires the actual Redis cap to match this configured cap. The isolated SQLite maximum remains ten.
- Latest verified deployment: `dpl_4eVM3BtU1Q1LmV57dq445gPhF8DS`, READY October 28 at 13:40:37 UTC. Existing credentials are scoped to the readiness branch; Production live remains blocked.
- Actual original counter: **cap 10, used 1, nine remaining, original expiry unchanged**. One genuine hosted artist search returned HTTP 200 and six candidates and advanced the counter from zero to one. Full two-profile Insights planning remains pending.
- New authorization: **100 hosted requests total**, including the one already used, across tests and judge use. The same-counter cap/expiry mutation is pending. Only an actual verified cap of 100 with used 1 preserved would establish 99 remaining. Approval does not itself change stored state.
- Approved judging window: a judge-only, deployment-specific access link through `2026-11-06T04:45:00Z` (November 5 at 11:45 p.m. Eastern, judging end). Creation and access verification remain pending. Its bearer value is secret and must never enter public source, screenshots or logs.

Follow [READINESS.md](READINESS.md) for current evidence. No new counter/database, quota reset, replacement approval ID or additional account grant is authorized by this document. Keep the existing store and counter identity throughout the expansion. Preserve the used count and reconcile any further attempts before reporting remaining capacity.

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

Before expanding the existing hosted bundle or handing it to judges:

1. Reconcile the original counter's actual cap, used count and expiry. Keep its existing database, approval identity and spent usage. The last verified cap is ten with one used; the approved 100-total cap and judging expiry remain pending until their mutation is executed and read back. Do not use a new ID, database or SQLite ledger to bypass the old cap/expiry.
2. Test and release the candidate hosted ceiling of 100 before expecting runtime code to accept a cap above ten. The isolated SQLite ceiling remains ten. Review actual Redis Lua concurrency, fail-closed behavior and durable retention without replenishing the real counter. A fixture pass or one successful reservation does not establish every durability/concurrency property.
3. Reuse the approved isolated Free Upstash database with eviction off. The adapter accepts `QLOO_TEST_REDIS_URL` / `QLOO_TEST_REDIS_TOKEN` or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, with the same fixed `QLOO_TEST_BUDGET_ID`. Existing branch-scoped secrets are ready. Any further owner entry must use secure Preview settings; do not read secret values into reports or overwrite setup blindly.
4. Confirm Vercel Authentication protects the unique deployment URL. Verify ordinary anonymous status and MCP requests are rejected before reaching the application. Recheck each deployment. Configuration flags and hostname checks are routing guards, not authentication proof.
5. Preserve Preview-only `QLOO_ENABLED=true` and `AFTERGLOW_PROTECTED_PREVIEW=true` opt-ins with platform `VERCEL=1`, `VERCEL_ENV=preview` and the valid unique `VERCEL_URL`. The app accepts only that exact raw Host and matching HTTPS Origin when supplied. Aliases, custom domains, forwarded-host substitutes, alternate ports and localhost are rejected before live results or quota use. Production remains off.
6. Execute the prepared two-Insights plan using the already verified public favorites; do not spend another search merely to rebuild that payload. Full live Insights and complete core product behavior remain pending. Retain only status/count summaries in public artifacts; no real Qloo IDs, response datasets, screenshots or private payloads.
7. Create the approved judge-only, deployment-specific access mechanism and verify its scope and expiry through `2026-11-06T04:45:00Z`. The bearer link is a secret and belongs only in the private judge handoff. It must allow free end-to-end use during judging without broadening Production or granting unrelated access. Verify the actual mechanism on the exact deployment; a plan in this document is not proof that access exists.

The [organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) states that event API requests are free through judging and have no automatic paid charges. The [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide#quotas-limits--key-expiration) describes rate/monthly limits without numeric quotas and says keys remain active through judging. These service limits are distinct from the application's approved 100-total cap. Stop on rate, authentication, expiry or quota errors; paid upgrades and new grants are not authorized here.

[Official Rules section 4](https://qloo.devpost.com/rules) permits private-site judging credentials and requires free, unrestricted access through judging end; section 11.4 gives the Rules precedence over inconsistent event materials. An external model-directed MCP/agent-host run is optional validation, not a separate published submission requirement. Protocol fixtures do not prove a model-directed run, and the full live Qloo flow still needs testing. No demo video is required.

The hosted adapter follows [Upstash REST](https://upstash.com/docs/redis/features/restapi) and [atomic Lua execution](https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http). Published baseline tests use protocol fixtures. One genuine hosted search has now verified a real reservation and Qloo search response; full Insights behavior, the pending expanded counter and judge access remain unverified until separately recorded.
