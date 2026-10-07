# Verification — October 7, 2026

## Passed

- 63 automated tests in Node, including jsdom UI interaction tests
- Real MCP stdio subprocess handshake, tool discovery, planning/replanning and safe tool errors
- Stateless Streamable HTTP MCP requests using the official client SDK
- Live-mode MCP path exercised against clearly labeled fixtures, with raw Qloo provenance preserved
- Host/origin rejection and MCP payload limits
- JavaScript syntax checks for application, server, API routes, scripts and tests
- Static client build to `dist/`
- Pinned official harness installation and local help/dry-run contract inspection
- Sample API end-to-end HTTP response with three distinct stops
- All sample budgets from $50 through $250 and all four moods respect the total budget
- Symmetric two-person scoring, lower-score priority, taste-dependent results and midnight rollover
- Missing credentials produce a clear 503 without network or subprocess execution
- Auth and quota errors are redacted; no automatic retry or fictional fallback
- Save, reopen, revise, remove, sample taste limits, preserved results after validation errors and HTML escaping in DOM tests
- Form edits do not alter the existing itinerary's explanation until a new plan is generated

- Twenty competing OS processes were limited to ten durable reservations
- Failed calls consume quota; client restarts, missing/corrupt state and expired budgets fail closed
- Public HTTP, Vercel preview/production and production Node contexts cannot call Qloo even with live flags
- Installed official harness executed against an in-process no-network fetch fixture; guard enforces exact endpoint, one HTTPS attempt and redirect rejection, including actual CLI 421/429/503 transport fixtures

- Prepared hosted quota adapter passes fixture tests for atomic-command shape, rejected destinations, malformed replies, redaction and no retries

## Not verified

- Actual shared Redis storage, its concurrency/durability and hosted live access are unconfigured and unverified

- A real LLM/agent host deciding to invoke the tools with live Qloo data
- Live Qloo authentication or response behavior: no real credential or live API call used
- Live Qloo subprocess execution in Vercel remains untested; the sample functions deploy successfully
- Screen-reader behavior, touch-device input and native phone hardware remain untested
- Devpost submission
- Public deployment verification is recorded separately when deployment is complete

## Browser QA

Public deployment tested in cloud Chromium: sample generation, save/reload/reopen, Escape/reopen, stop swaps, $50-budget plan ($34), disabled live mode and native text export. Desktop width 1165 and phone-width CSS viewport 388 (using 300% browser zoom) had no horizontal overflow; the dialog fit inside the narrow viewport. Actual device emulation is unavailable because this cloud browser blocks DevTools. A saved-state label issue discovered during swaps was fixed and covered by the existing revision test. A desktop screenshot was captured for release review.

The following local-preview limitation occurred before deployment:

The installed Chromium process failed to create its required Unix socket (`Operation not permitted`) both normally and after reviewed escalation. The available cloud browser rejected the local URL with `ERR_BLOCKED_BY_CLIENT`. The current Sites portable-preview workflow has no supported user-facing preview/forwarding tool available here. No workaround or public publication was used.

`qa/browser_check.py` contains a prepared real-browser regression suite for an environment with working Chromium. It was attempted but did not reach page loading, so it is not counted as passed. The jsdom tests verify DOM interactions, not visual rendering.

## Remaining release work

1. Configure the already-approved backend Qloo test access through secure user entry, after verifying quota/expiry
2. Run a bounded live smoke test and verify event limits
3. Complete a live Qloo agent demonstration and device-specific QA
4. Add durable deployment-level usage controls before public live access
5. Verify hosted MCP origin configuration and live serverless execution on a protected preview
6. Recheck official Devpost requirements and finalize truthful submission assets

Production dependency audit after the scoped patch reports zero known vulnerabilities in the installed dependency graph; this is not a repository-wide security clearance. Exact package versions were checked after clean npm ci and npm install.
