# Isolated live-test budget

The public demo is sample-only. Production always rejects live Qloo execution, even with a credential and all flags set. The isolated stdio path and a separately enabled protected Vercel preview can execute bounded tests. **Hosted datastore, access and actual Qloo validation remain pending; code and fixture tests do not establish live readiness.**

## Before an approved test

1. Verify the owner's included Qloo quota, rate limit and expiry. The approved cap is at most ten upstream requests in total, not ten per process or test run. Do not create another ledger to continue the same authorization.
2. Choose one persistent local filesystem and an absolute ledger path outside the repository. All agent processes for this authorization must use that exact file. Do not use `/tmp`, an ephemeral container, a network filesystem, copied ledgers or multiple machines. Loss of the file means stop and reconcile usage, never initialize replacement quota.
3. Initialize the ledger once with an expiry no later than the credential/test authorization expires. The parent directory must already exist. This stores no credential. For example, replace the path, time and reference with reviewed values:

   `npm run test-budget -- init /durable/afterglow/test.sqlite 10 ISO_EXPIRY APPROVAL_REFERENCE`

4. The owner enters the credential into the chosen process's secure environment through a supported handoff. Do not paste it into chat, source, CLI arguments, shared MCP JSON or logs. Configure `QLOO_ENABLED=true` and `QLOO_TEST_LEDGER` for the isolated stdio process only, then launch `node mcp-server.mjs` from the trusted agent host. No model API is invoked by Afterglow.
5. Inspect remaining usage with `npm run test-budget -- status /durable/afterglow/test.sqlite`. Do not expose the ledger or grant the agent filesystem-editing tools for it.

## Enforcement

Each uncached request commits one reservation before starting the official Qloo harness. SQLite's atomic update and full synchronous writes share the cap across processes and preserve it across ordinary process restarts. Failed, timed-out or cancelled invocations keep their reservation. A two-profile plan can consume two slots. Cache hits consume none. There is no refund, automatic reset or remote initialization endpoint.

A preload guard in the harness child uses exactly one unpooled HTTPS request, only to `https://hackathon.api.qloo.com/search` or `/v2/insights`, and rejects redirects. This preserves the supported `qloo api` access surface while enforcing the single-attempt contract. Credential values are never written to the ledger. Missing, corrupt, exhausted or expired state prevents the subprocess from starting.

These controls bound requests made by this application on one trusted machine. They cannot prevent an owner from editing the source/ledger or spending the same key elsewhere. A machine restart is supported only if its filesystem survives; restoring an older backup can restore spent slots and must not be done.

## Protected Vercel preview

The shared Redis adapter is wired into every uncached HTTP and MCP Qloo request. No request can initialize, overwrite, reset or refund its counter. Production is blocked independently of the flags below.

Before enabling the preview:

1. Confirm included Qloo quota, rate limits and expiry. Reconcile any previous attempts. Use one fixed approval ID for the remaining cap, at most ten total. No Qloo requests have been made during development. Do not also create or use a SQLite ledger for this approval, and never change databases/IDs to replenish it.
2. Provision only the approved isolated Free Upstash database. Keep eviction off. The owner must enter and save the database token and Qloo key directly in Vercel’s secure Preview settings, not chat or source. Configure `QLOO_TEST_REDIS_URL`, `QLOO_TEST_REDIS_TOKEN` and `QLOO_TEST_BUDGET_ID`. Initial `QLOO_ENABLED=false` and `AFTERGLOW_PROTECTED_PREVIEW=false` keep live calls off.
3. Validate actual Redis Lua concurrency, missing/invalid/expired state and durable retention using a separately named validation key, then initialize the single real approval counter once with `initializationScript`. The script refuses an existing key and accepts a cap no greater than ten and a future expiry. Never delete or restore this counter to regain quota. Initialization stores no Qloo key or cultural inputs.
4. Confirm Vercel Authentication protects the project’s unique preview URL. Check anonymous status and MCP initialization requests are rejected before reaching the application. No access exception, share link or bypass token is needed or created. Repeat this check for each deployment before a live test. The app’s configuration flag and hostname checks are not authentication proof; managed Vercel protection is the authentication boundary.
5. Only after those checks, the owner enables `QLOO_ENABLED=true` and `AFTERGLOW_PROTECTED_PREVIEW=true` in Preview and redeploys. Both are opt-ins. Platform-provided `VERCEL=1`, `VERCEL_ENV=preview` and a valid unique `VERCEL_URL` must also be present. The app accepts only that exact raw Host and, if supplied, the corresponding HTTPS Origin; aliases, custom domains, forwarded-host substitutes, ports and localhost are rejected before live results or quota use. The preview automatically derives its MCP origin; production `AFTERGLOW_ORIGIN` behavior is unchanged.
6. Verify anonymous rejection on the new deployment, then conduct the bounded live smoke test from an authenticated owner session. Inspect the counter without exposing credentials. Failures and timeouts consume slots. Cache misses on other functions/cold starts consume their own slots. Two-profile plans require two remaining slots; concurrent identical queries may consume separate slots.

The minimal hosted test needs no new model service or application bearer token. Vercel Authentication protects the preview, and one Redis counter enforces the total quota. An actual external agent integration still needs a supported authenticated host connection; do not claim model-driven live proof from protocol fixtures. A public judging demo will need separately approved quota and abuse controls.

The hosted adapter follows [Upstash REST](https://upstash.com/docs/redis/features/restapi) and [atomic Lua execution](https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http). Its automated tests use protocol fixtures. They do not prove actual Redis execution, retention, Vercel Authentication or a working Qloo key.
