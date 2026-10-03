# Qloo integration and owner decisions

## Required approvals before live work

1. Approve entering the owner's event-issued Qloo credential into the chosen backend's secret store. The owner must enter it through an authorized secure mechanism; do not paste it into chat or source files. Destination should be specified (for example, the new Afterglow project on the owner's Vercel account). This creates ongoing server access to Qloo.
2. Confirm the event credential's quota, rate limit and expiry, then approve an initial cap of ten live requests using only public cultural favorites and a city. No paid requests are authorized by this build.
3. Public source under MIT and a public sample deployment have been approved. That permission does not authorize live credential configuration, paid calls, account grants or upgrades.

## Exact runtime configuration

- `QLOO_ENABLED=true`: opt-in execution gate; defaults off
- `QLOO_API_KEY`: event-issued credential in the backend secret store only
- `QLOO_BASE_URL=https://hackathon.api.qloo.com`: optional explicit value; any other configured endpoint is rejected
- `AFTERGLOW_ORIGIN`: exact verified deployment origin (e.g. the new project’s https origin), required to allow its hostname for HTTP MCP; localhost is permitted for local testing
- `PORT=4177`: local development only

The adapter pins `@qloo/qloo-harness` 0.1.26. Node must be at least 22.19.0. It invokes the official `qloo api search` and `qloo api insights` surfaces using `execFile`, no shell, a 20-second timeout and 2 MiB output cap. Arguments include required `--query` / `--type` options and validated JSON parameters. The key is never a command argument.

The child receives a minimal environment containing the endpoint, credential and `QLOO_TRUSTED_BASE_URL` equal to that same hard-coded official hackathon endpoint. HOME points to an empty temporary location so an unrelated saved Qloo configuration cannot be used as a fallback. Nothing writes a Qloo config file.

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

## Planned live smoke test (maximum 10 requests)

1. Check `/api/status`: enabled, no key in response (zero Qloo requests)
2. Search two public cultural entities via `/api/search` (two Qloo requests)
3. Generate one plan with the confirmed entity IDs and a city (two insights requests)
4. Verify at least three shared actual entities and review labels/provenance. Sparse overlap returns a clear 422, never sample filler.
5. Re-run identical queries within 60 seconds to check cache behavior; no additional Qloo calls expected
6. If necessary, use at most six remaining requests to broaden public signals/location and verify the actual API response. Stop on authentication, expiry, quota or rate-limit errors.

A plan uses two independent place-insight requests, each limited to 20 results. Search uses six results. There is a 60-second, 50-entry per-process cache and a 100-request per-process safety ceiling. There are no automatic retries. These conservative local limits do not replace the organizer's quota or a durable deployment-level rate limit.

## Vercel checklist

- New project only; do not reuse another project's secrets or environment
- Node 22.19+ or 24 runtime, npm install, `npm run build`, static output `dist`
- Include the pinned harness and its transitive dependencies in the serverless function bundle (`vercel.json` includes node_modules)
- Confirm actual bundled size and subprocess execution in a preview deployment before public launch
- Add durable edge rate limiting / usage controls before enabling a public credential-backed endpoint
- Set backend secret and opt-in flag only through approved secure configuration
- Test status, search, plan, 401/429 handling, no-results, cold start and 20-second timeout
- Complete real desktop/mobile/keyboard visual QA; this execution environment could not run Chromium
- Keep live demo available through the judging period and confirm credential expiry covers it

No LLM API key is needed by Afterglow. Its real MCP server is a structured, inspectable agent tool; it uses deterministic planning and real Qloo results when connected. A chat model is not simulated or bundled. The external agent host supplies its own authorized model access. A real host-to-tool live run remains unverified.
