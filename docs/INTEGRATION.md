# Qloo integration and owner decisions

## Existing authorization and required live checks

The owner previously approved the existing Afterglow project, Qloo configuration and at most ten included-quota test requests in total. This is not a fresh ten-request allowance. Reconcile prior usage, the existing shared approval counter, remaining included quota, rate limits and expiry before any live call. Secure owner credential entry was reported historically; its validity and current authenticated runtime remain unverified here. No live request was made during the October 27 review. See [READINESS.md](READINESS.md) for the existing READY protected Preview and current evidence.

1. Continue in the existing Afterglow backend and previously approved isolated store. Do not create a duplicate project/database, retrieve secret values for reports, rotate credentials or issue new credentials. Any required owner entry must use an authorized secure mechanism, never chat, source or command arguments.
2. Inspect and reconcile the original fixed counter before selecting tests within its remaining cap. Do not reset it, create a replacement ledger or treat failed calls as free. Use only public cultural favorites and a city. Paid calls are not authorized.
3. Public MIT source and a public sample deployment were approved separately. The historical ten-request test approval does not supply a public live operating budget, paid upgrade or new account grant. Production live execution remains blocked in code.

Earlier Vercel environment writes and an environment-metadata read returned HTTP 403. Those are historical access restrictions; do not bypass them. They do not imply the later READY Preview failed to deploy. Current environment values and the shared counter have not been inspected by this review.

## Exact runtime configuration

- `QLOO_ENABLED=true`: live-test opt-in gate; defaults off and cannot enable production live access
- `QLOO_TEST_LEDGER`: absolute path to the single pre-initialized durable SQLite test ledger; never create a second ledger for the same approval
- `QLOO_API_KEY`: event-issued credential in the backend secret store only
- `QLOO_BASE_URL=https://hackathon.api.qloo.com`: optional explicit value; any other configured endpoint is rejected
- `AFTERGLOW_ORIGIN`: exact verified deployment origin (e.g. the new project’s https origin), required to allow its hostname for HTTP MCP; localhost is permitted for local testing
- Protected-preview configuration is listed in [TEST_BUDGET.md](TEST_BUDGET.md); it uses the same cap through Redis across all search, planning and MCP calls
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

## Planned live smoke test (within the original remaining cap)

1. Check `afterglow_status` over the selected isolated stdio or protected-preview transport: configured, no key in response (zero Qloo requests); inspect the ledger separately for remaining quota
2. Search two public cultural entities via the `afterglow_search_favorites` tool (two Qloo requests)
3. Call `afterglow_plan_evening` with confirmed entity IDs and a city (two insights requests)
4. Verify at least three shared actual entities and review labels/provenance. Sparse overlap returns a clear 422, never sample filler.
5. Re-run identical queries within 60 seconds to check cache behavior; no additional Qloo calls expected only when the same process handles the request; a cold start uses new slots
6. Only if reconciled quota remains, broaden public signals/location and verify the actual API response within that remaining cap. Stop on authentication, expiry, quota or rate-limit errors. Do not assume six requests remain after this sequence or ten were available before it.

A plan uses two independent place-insight requests, each limited to 20 results. They run sequentially so a first-request error stops before reserving the second slot. Search uses six results. There is a 60-second, 50-entry per-process cache. Every cache miss reserves one durable SQLite or shared Redis slot, depending on the selected test route, before a harness child starts. A Node preload guard permits only one fetch to the approved endpoint and rejects redirects/repeated attempts. Failures consume quota. The single shared ledger caps the approved test at ten upstream attempts. It never auto-initializes or resets. SQLite applies to one durable local filesystem; hosted tests use the same Redis approval key across all instances. Do not fund the same approval through both ledgers. Concurrent duplicate requests can consume separate slots; a two-profile plan with one slot remaining can consume it and then fail.

## Vercel checklist

- Reuse the existing Afterglow project and approved isolated database; do not create duplicates or borrow another app's secrets
- Node 22.19+ or 24 runtime, npm install, `npm run build`, static output `dist`
- Include the pinned harness and its transitive dependencies in the serverless function bundle (`vercel.json` includes node_modules)
- Confirm actual bundled size and subprocess execution in a preview deployment before public launch
- Add durable edge rate limiting / usage controls before enabling a public credential-backed endpoint
- Set backend secret and opt-in flag only through approved secure configuration
- Test status, search, plan, 401/429 handling, no-results, cold start and 20-second timeout
- Repeat the recorded desktop and narrow-layout Chromium checks after live setup; actual phone/touch QA remains pending
- Keep live demo available through the judging period and confirm credential expiry covers it

No LLM API key is needed by Afterglow. Its real MCP server is a structured, inspectable agent tool; it uses deterministic planning and real Qloo results when connected. A chat model is not simulated or bundled. The external agent host supplies its own authorized model access. A real host-to-tool live run remains unverified.
