# Afterglow

A date-night planner that makes room for two different tastes.

## What works now

- Choose up to five public cultural favorites per person
- Set mood, start time and a $50–$250 sample budget for two
- Generate a balanced dinner / activity / finale itinerary
- Inspect the sample taste-fit explanation for each person
- Swap stops without exceeding the original sample budget
- Save and reopen nights on this browser, revise them, and export plain text
- Inspect source/provenance and the explicit missing-integration state
- Run the server-only Qloo integration against test fixtures
- Search public artists and generate a genuine two-profile live shortlist on the protected Preview; a hosted check returned four shared candidates and three stops
- Connect a real external agent through MCP over stdio or stateless Streamable HTTP

**The initial experience is a fictional sample.** All sample places, prices and scores are hand-authored or calculated locally. There are no model calls, real reservations or Qloo calls in sample mode. The app never claims sample data is Qloo output.

## Run locally

Requires Node.js 24.x. Tested with Node.js 24.19.0.

```sh
npm ci --ignore-scripts
npm start
# http://localhost:4177
```

No credentials are needed for the sample. The server does not automatically load `.env` files.

```sh
npm test
npm run check
npm run build
```

`npm test` includes domain, HTTP, Qloo-adapter contract, MCP protocol and jsdom interaction tests. See [verification](docs/VERIFICATION.md) for exact coverage and limits.

## Design

Vanilla browser JavaScript, semantic HTML and responsive CSS keep the frontend small. Node's built-in HTTP server runs locally; Vercel function entrypoints are included under `api/`. There is no client framework, external font request, analytics, authentication database or model-provider requirement.

- `public/`: interface, styling and fictional sample catalog
- `lib/planner.mjs`: validation, two-person ranking, budget-constrained route search and scheduling
- `lib/qloo.mjs`: pinned official Qloo harness bridge and live recommendation composition
- `lib/http.mjs`: API handler, safe errors, payload limits and request gate
- `lib/mcp.mjs` and `mcp-server.mjs`: working agent-callable MCP tools
- `api/`: Vercel function entrypoints, including `/api/mcp`
- `tests/`: test suites
- `docs/`: integration, release checklist and agent-tool contract

## Recommendation approach

Sample mode turns hand-authored cultural tags into per-person fit indices. Afterglow gives 70% of the pair score to the lower score and 30% to the mean, then adds a small explicit mood preference. It evaluates every dinner/activity/finale combination within budget. This is an application ranking rule, not a probability of enjoyment.

Live mode asks Qloo separately for place recommendations using each person's chosen public cultural entity IDs. It intersects the results and balances their list-rank indices. It does not infer personal or sensitive traits. Qloo entity IDs, names and available raw affinities are retained separately from Afterglow's own indices and explanations.

Live mode produces a three-place discovery shortlist, not a verified dinner/activity/finale booking itinerary. It does not invent venue categories, prices, hours, available tables, opening times or travel durations. The budget is a restaurant price-tier filter; total live cost is unknown. Mood is displayed as the user's planning note and is not translated into unsupported Qloo parameters.

## Live connection and release

See the [October 28 readiness checklist](docs/READINESS.md) for verified live planning, judge-access checks and the remaining submission blockers.

Public Production live access remains blocked. On October 28, the protected Preview completed a genuine artist search and a two-profile live plan: HTTP 200, four shared candidates and three proposed stops. The plan consumed exactly two reservations after the earlier search. Never put credentials, raw Qloo responses or private access details in public source.

The original hosted counter now has a 100-total cap, three used requests and 97 remaining at the last readback, expiring November 6, 2026, 04:45 UTC. Hosted configuration defaults to ten and requires explicit `QLOO_TEST_APPROVED_CAP=100` to match this cap; the separate SQLite route remains capped at ten. Stored usage was preserved. See [TEST_BUDGET.md](docs/TEST_BUDGET.md) and [INTEGRATION.md](docs/INTEGRATION.md).

The [public sample demo](https://afterglow-qloo.vercel.app/) remains explicitly fictional. A separate browser session verified that confidential judge access opens the live Preview while ordinary access reaches Vercel login; status returned HTTP 200, live enabled and a configured maximum of 100 without a Qloo call. Delivery of testing instructions and Devpost submission remain pending. The current access expiry is November 6 at 04:44:05 UTC, 55 seconds before the official judging end and counter expiry at 04:45 UTC. This coverage gap remains open; see [deployment verification](docs/DEPLOYMENT.md).

## Agentic tool interface

This project implements the competition’s **agentic-tool** route. A real MCP server exposes status, sample signals, Qloo entity search and constrained planning, plus a transparent planning prompt. An external agent can discover tools, search, call the planner, inspect the result and replan after user feedback. Both stdio and Streamable HTTP are tested with real MCP clients. See [AGENT_INTEGRATION.md](docs/AGENT_INTEGRATION.md).

There is **no bundled LLM and no autonomous in-app model loop**. No model/provider is simulated. A real model-directed external-host run can strengthen the agentic-tool evidence, but it is not a separately listed submission requirement. The live planning API, independent-browser access and live-mode form checks have passed. The latter showed the live banner, entity choosers, city field and disclosures without a new Qloo request; the counter remained 100 total / 3 used. Final access handoff and submission remain. No extra model API key is required by Afterglow; any external agent host supplies its own authorized model access.

## Competition

Prepared for the [Qloo Agentic Hackathon](https://qloo.devpost.com/) from original code. [Official rules](https://qloo.devpost.com/rules) require actual Qloo integration, a functional accessible demo, public source and an open-source license. Live Preview behavior is verified, but entry creation and submission are blocked and have not occurred. The source is available under the [MIT license](LICENSE).

## Dependency installation

Use the committed lockfile with `npm ci --ignore-scripts`. Scoped overrides pin `brace-expansion` 5.0.12 and `undici` 8.10.2 beneath pi-coding-agent 0.84.2. The root lock intentionally omits that package's `hasShrinkwrap` marker so npm installs the patched versions; regenerating the lock from scratch can restore the upstream versions. Verify actual installed package versions after dependency changes. The official Qloo harness remains pinned at 0.1.26.
