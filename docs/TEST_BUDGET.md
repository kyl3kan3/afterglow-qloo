# Isolated live-test budget

The public demo is sample-only. All HTTP routes and Vercel environments reject live Qloo execution even when a credential and `QLOO_ENABLED=true` are present. Only the local stdio MCP entrypoint can execute bounded live tests. **This does not make the hosted app live-ready.**

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

## Minimum hosted route still needed

For Vercel, a single shared durable datastore must reserve quota atomically for **all** search, plan and MCP requests before the harness runs. A small Redis database with an atomic Lua reservation or a transactional SQL row can provide a fixed approval ID, immutable cap, expiry and spent count. Rejected and failed requests must never refund or reset the count; reads/storage failures must fail closed. Use a protected preview for the ten-request smoke test, verify its protection, and do not generate a bypass credential. Keep production live disabled.

Creating a new database/service, accepting its terms, selecting a paid plan or configuring its persistent access credential needs separate approval and secure user entry. No such service or credential has been created. Existing unused storage may be used only after ownership, scope and permissions are verified. `lib/hosted-test-budget.mjs` contains a prepared Upstash REST adapter and atomic Lua scripts. Its protocol/error tests use fixtures only; no actual Redis server has been exercised, and it is deliberately not wired into live execution. Initialization refuses to overwrite an existing approval key; request handling never creates or resets a key. After approval, securely configure QLOO_TEST_REDIS_URL, QLOO_TEST_REDIS_TOKEN and one fixed QLOO_TEST_BUDGET_ID. Then validate actual datastore concurrency, expiry and durable retention, wire the shared adapter into every upstream path, verify preview authentication, and explicitly enable only the protected preview. A public judging demo will need its own approved quota and abuse limits.

The hosted adapter follows [Upstash REST](https://upstash.com/docs/redis/features/restapi) and [atomic Lua execution](https://upstash.com/blog/lua-scripting-on-upstash-redis-atomic-operations-over-http).

No key was used and no real Qloo request was sent while implementing these controls.
