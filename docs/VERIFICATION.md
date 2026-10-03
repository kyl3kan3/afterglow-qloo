# Verification — October 3, 2026

## Passed

- 51 automated tests in Node, including jsdom UI interaction tests
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

## Not verified

- A real LLM/agent host deciding to invoke the tools with live Qloo data
- Live Qloo authentication or response behavior: no real credential or live API call used
- Vercel build/deployment/serverless packaging: configuration prepared, no external deployment
- Real browser layout, screenshots, accessibility tree, screen reader behavior or responsive geometry
- Native download/save behavior in a browser
- Devpost submission
- Public deployment verification is recorded separately when deployment is complete

## Browser QA blocker

The installed Chromium process failed to create its required Unix socket (`Operation not permitted`) both normally and after reviewed escalation. The available cloud browser rejected the local URL with `ERR_BLOCKED_BY_CLIENT`. The current Sites portable-preview workflow has no supported user-facing preview/forwarding tool available here. No workaround or public publication was used.

`qa/browser_check.py` contains a prepared real-browser regression suite for an environment with working Chromium. It was attempted but did not reach page loading, so it is not counted as passed. The jsdom tests verify DOM interactions, not visual rendering.

## Remaining release work

1. Approve and configure backend Qloo access using a secure flow
2. Run a bounded live smoke test and verify event limits
3. Run real browser QA on desktop and phone widths, keyboard, Escape/reopen, save/reload, swap and export
4. Add durable deployment-level usage controls before public live access
5. Verify serverless packaging on a preview deployment
6. Publish the approved MIT source and sample demo; record the verified deployment and commit
