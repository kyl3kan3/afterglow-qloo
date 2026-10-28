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
- Search public artists on the protected Preview; one genuine hosted search is verified, while complete two-profile live planning remains pending
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

See the [October 28 readiness checklist](docs/READINESS.md) for current deployment evidence, the local candidate and remaining live-planning/judging-access work.

Public Production live access remains blocked. On October 28, a securely configured protected Preview completed one genuine artist search, and the original durable counter moved from zero to one used request under its ten-request cap. Full two-profile Insights planning remains unverified. Never put keys, raw Qloo responses or private access links in this repository, the browser source or chat.

The owner approved a hosted bundle of 100 requests total, including the already-used request, and a deployment-only judge access link through November 6, 2026, 04:45 UTC. Execution and verification of that expanded bundle and link remain pending. The local candidate requires explicit `QLOO_TEST_APPROVED_CAP=100` for the protected hosted route; its default remains ten, and the separate SQLite route stays capped at ten. The flag neither changes stored quota nor creates authorization: the original shared counter must be updated in place under the approved scope, preserving used requests. See [TEST_BUDGET.md](docs/TEST_BUDGET.md) and [INTEGRATION.md](docs/INTEGRATION.md).

The [public sample demo](https://afterglow-qloo.vercel.app/) is deployed on Vercel and remains explicitly fictional. The protected Preview has configured live access, working anonymous-access rejection, and one verified search; the two-profile plan and private judge handoff are pending. The judge link will be a bearer secret delivered privately, never added to public source. See [deployment verification](docs/DEPLOYMENT.md) for the last completed deployment and the approved next-release checklist.

## Agentic tool interface

This project implements the competition’s **agentic-tool** route. A real MCP server exposes status, sample signals, Qloo entity search and constrained planning, plus a transparent planning prompt. An external agent can discover tools, search, call the planner, inspect the result and replan after user feedback. Both stdio and Streamable HTTP are tested with real MCP clients. See [AGENT_INTEGRATION.md](docs/AGENT_INTEGRATION.md).

There is **no bundled LLM and no autonomous in-app model loop**. No model/provider is simulated. A real model-directed external-host run can strengthen the agentic-tool evidence, but it is not a separately listed submission requirement. The complete live Qloo planning flow and usable judge access still need verification; a fictional sample alone does not establish them. No extra model API key is required by Afterglow; any external agent host supplies its own authorized model access.

## Competition

Prepared for the [Qloo Agentic Hackathon](https://qloo.devpost.com/) from original code. [Official rules](https://qloo.devpost.com/rules) require actual Qloo integration, a functional accessible demo, public source and an open-source license. This local sample build is not submission-ready on its own. The source is available under the [MIT license](LICENSE).

## Dependency installation

Use the committed lockfile with `npm ci --ignore-scripts`. Scoped overrides pin `brace-expansion` 5.0.12 and `undici` 8.10.2 beneath pi-coding-agent 0.84.2. The root lock intentionally omits that package's `hasShrinkwrap` marker so npm installs the patched versions; regenerating the lock from scratch can restore the upstream versions. Verify actual installed package versions after dependency changes. The official Qloo harness remains pinned at 0.1.26.
