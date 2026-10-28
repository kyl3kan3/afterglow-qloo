# Qloo integration and owner decisions

## October 28 verification and pending release

The published baseline in open PR #8 is `b8cbd0764e59da600b8e8a2844fda0860692f4e9`, with 72 passing local tests. Protected Preview deployment `dpl_4eVM3BtU1Q1LmV57dq445gPhF8DS` became READY on October 28 at 13:40:37 UTC. Its three existing credentials are scoped to the readiness branch. Production live execution remains blocked.

One genuine hosted artist search returned HTTP 200 and six candidates. The original shared counter advanced from zero to one used request. Its last verified state is still **cap 10, used 1, nine remaining, with the original expiry unchanged**. A complete two-profile live Insights plan remains pending. Previously verified favorites are available for the prepared two-Insights test; it does not need another search.

The owner has now approved **100 hosted requests in total**, including that already-used request, for the bounded test and judging bundle. Local support for a hosted ceiling of 100 is a separate candidate under implementation and testing; it is not part of the published 72-test baseline. The existing counter's cap and expiry update is also pending. **Do not report 99 remaining until an actual update is verified as cap 100 with used 1 preserved.** Approval alone neither changes runtime code nor updates the counter. See [READINESS.md](READINESS.md) for current execution evidence.

## Authorization and required live checks

1. Continue in the existing Afterglow backend and original isolated Redis database with the same counter identity. Preserve used requests. Do not reset or replace the counter, change its ID/store to replenish it, or fund the hosted approval through SQLite as well. The isolated SQLite route retains its separate hard maximum of ten and is not a second allowance for this bundle.
2. Before further calls, inspect the actual original counter and its expiry through an authorized mechanism. Only a verified, approved update may raise that same counter's cap to 100 total and set its expiry to `2026-11-06T04:45:00Z`. Until then, its existing cap and expiry govern. Failures, timeouts, cold starts and judging traffic all count against the same total.
3. Public MIT source and the sample deployment are already approved. The owner additionally approved a judge-only, deployment-specific access link through `2026-11-06T04:45:00Z` (November 5 at 11:45 p.m. Eastern, the judging end). Its creation and verification remain pending. The bearer link is a secret: never commit it, include it in public documentation, or expose it in screenshots or logs. This approval is scoped to that deployment and period; it does not authorize broad access exceptions, new account grants or public Production live access.
4. Use synthetic demo inputs consisting only of public cultural favorites and a city. Keep real Qloo entity IDs, response data, cultural datasets, screenshots, private approval identifiers and bearer URLs out of public repository artifacts. Record counts and status summaries instead. Do not retrieve secret values for reports, rotate credentials, or issue new credentials. Any required owner entry must use an authorized secure mechanism.

The [event organizer's clarification](https://qloo.devpost.com/forum_topics/45690-tasteatlas-no-cost-judging-access-and-cached-demo-requirements) states that hackathon API requests are free through judging and have no automatic paid charges. The [developer guide](https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide#quotas-limits--key-expiration) confirms rate/monthly limits and key validity through judging but publishes no numeric limits. The application's 100-total approval is an application usage cap, not a claim about the event key's numeric quota. Paid plans, upgrades and new grants remain outside this approval.

Earlier Vercel environment writes and an environment-metadata read returned HTTP 403. Respect those historical access restrictions; the later READY deployment and successful search do not authorize bypassing them.

## Exact runtime configuration

- `QLOO_ENABLED=true`: live-test opt-in gate; defaults off and cannot enable production live access
- `QLOO_TEST_LEDGER`: isolated stdio only, an absolute path to one separately authorized durable SQLite ledger with a hard maximum of ten; never fund the hosted approval here
- `QLOO_TEST_APPROVED_CAP`: hosted candidate only; defaults to ten when unset. Explicit `QLOO_TEST_APPROVED_CAP=100` selects the approved ceiling of 100, and the original Redis counter's actual cap must match before reservations succeed. This pending opt-in does not raise SQLite's hard maximum of ten or itself update Redis.
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

## Planned live smoke test and judging handoff

1. Verify the released code supports the intended hosted cap, the original counter's actual cap/used/expiry, and anonymous protection on the exact deployment. A status response is configuration evidence and spends zero Qloo requests; it does not prove remaining quota or authentication.
2. Use the already verified public favorites for the prepared two-profile plan. No additional search is needed. Submit only the approved synthetic constraints through the protected deployment.
3. Execute the two Insights requests within the counter's verified remaining allowance. Confirm at least three shared places and preserve provenance privately. Sparse overlap returns a clear 422, never sample filler. No full live plan has yet passed this check.
4. Check repeat-query caching only when useful and within the remaining total. Identical queries avoid new Qloo calls only if the same warm process serves them within 60 seconds; other functions and cold starts can reserve more slots.
5. Create and verify the approved deployment-only judge access mechanism, including its intended expiry and free end-to-end functionality. Keep its bearer value in a private judge handoff, never source or public assets. Recheck access after any replacement deployment; a link scoped to an older deployment is not proof for a newer one.
6. Stop on authentication, expiry, quota or rate-limit errors. Preserve enough of the verified remaining bundle for judges through the judging end. Never reset the counter or treat failed calls as free.

A plan uses two independent place-insight requests, each limited to 20 results. They run sequentially so a first-request error stops before reserving the second slot. Search uses six results. There is a 60-second, 50-entry per-process cache. Every cache miss reserves one slot before a harness child starts. A Node preload guard permits only one fetch to the approved endpoint and rejects redirects/repeated attempts. Failures consume quota. The original Redis counter covers all hosted instances and transports; it never auto-initializes, refunds or resets. A verified cap update preserves spent usage rather than creating a fresh 100-request pool. Concurrent duplicates can consume separate slots; a two-profile plan with one slot remaining can consume it and then fail.

## Vercel checklist

- Reuse the existing Afterglow project and approved isolated database; do not create duplicates or borrow another app's secrets
- Node 24.x runtime, committed dependency lock, `npm run build`, static output `dist`
- Include the pinned harness and its transitive dependencies in the serverless function bundle (`vercel.json` includes node_modules)
- Revalidate bundled harness execution and both Insights requests on the candidate deployment before judging handoff
- Preserve the one shared usage counter and Production live block; release the hosted 100-ceiling candidate only after its tests pass
- Set backend secret and opt-in flag only through approved secure configuration
- Test status, search, plan, 401/429 handling, no-results, cold start and 20-second timeout
- Repeat the recorded desktop and narrow-layout Chromium checks after live setup; actual phone/touch QA remains pending
- Verify the approved deployment-specific judge link, counter expiry and key coverage through `2026-11-06T04:45:00Z`

No LLM API key is needed by Afterglow. Its real MCP server is a structured, inspectable agent tool; it uses deterministic planning and real Qloo results when connected. A chat model is not simulated or bundled. An external model-directed host run is optional validation and remains unverified; the published requirements do not separately require proof of such a run or a demo video. The complete live Qloo product flow still needs verification.

[Official Rules section 4](https://qloo.devpost.com/rules) permits private-site judge credentials and requires free, unrestricted judging access through the end of judging. Section 11.4 gives the Official Rules precedence over inconsistent event materials. The approved secret judge link is a planned delivery mechanism under that rule, not completed access proof.
