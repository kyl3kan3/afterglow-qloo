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
- Connect a real external agent through MCP over stdio or stateless Streamable HTTP

**The initial experience is a fictional sample.** All sample places, prices and scores are hand-authored or calculated locally. There are no model calls, real reservations or Qloo calls in sample mode. The app never claims sample data is Qloo output.

## Run locally

Requires Node.js 22.19 or newer. Tested with Node.js 24.19.0.

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

Live access is deliberately off. No real credential was read, copied, configured or used during this build. Follow [INTEGRATION.md](docs/INTEGRATION.md) after the owner approves server-side credential configuration and a bounded live test. Never put keys in this repository, the browser or chat.

`vercel.json` is a deployment starting point, **not a verified deployment**. Publication is prepared as an explicitly labeled sample demo. Live Qloo access requires bounded credential testing and durable public-demo rate limiting before it is enabled. See the verification document for completed and pending checks.

## Agentic tool interface

This project implements the competition’s **agentic-tool** route. A real MCP server exposes status, sample signals, Qloo entity search and constrained planning, plus a transparent planning prompt. An external agent can discover tools, search, call the planner, inspect the result and replan after user feedback. Both stdio and Streamable HTTP are tested with real MCP clients. See [AGENT_INTEGRATION.md](docs/AGENT_INTEGRATION.md).

There is **no bundled LLM and no autonomous in-app model loop**. No model/provider is simulated. The sample UI alone is not evidence of a working Qloo-powered agent. Actual live Qloo execution from a chosen agent client is still required before claiming a competition-ready integration. No extra model API key is required by Afterglow; the agent host uses its own authorized model access.

## Competition

Prepared for the [Qloo Agentic Hackathon](https://qloo.devpost.com/) from original code. [Official rules](https://qloo.devpost.com/rules) require actual Qloo integration, a functional accessible demo, public source and an open-source license. This local sample build is not submission-ready on its own. The source is available under the [MIT license](LICENSE).
