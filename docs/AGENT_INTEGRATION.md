> Version 0.4: production live calls remain blocked. Isolated stdio and explicitly enabled protected Vercel previews can use a durable shared test budget. Hosted credentials, datastore validation and a real agent/Qloo run remain pending. See [test budget](TEST_BUDGET.md).

# Afterglow as an agentic tool

## Exact status

The original UI is a deterministic planner. It is not a chatbot and does not run an LLM. Version 0.2 adds a genuine Model Context Protocol server that an external agent can invoke. It implements the competition's permitted **agentic-tool** architecture rather than adding an unapproved paid model dependency.

A protocol client successfully initialized the actual server, listed and called its tools, planned a sample evening, and replanned under a lower budget. Both stdio and stateless Streamable HTTP transports are tested. A fixture test traverses the live Qloo tool path without network calls. These are protocol/integration tests, **not evidence that an autonomous model or real Qloo credential has been exercised**.

There is no separate disabled model-provider adapter because no model lives in this application. The Qloo backend is disabled by default. The external host supplies an authorized model and makes the tool-use decisions.

## Tools

- `afterglow_status`: inspect sample/live configuration; explicitly reports no in-app LLM
- `afterglow_sample_tastes`: discover the public favorites supported by the hand-authored sample
- `afterglow_search_favorites`: use the official Qloo harness to obtain cultural entity candidates
- `afterglow_plan_evening`: construct a sample itinerary or intersect and balance live Qloo place recommendations

`plan_an_afterglow_evening` is an MCP prompt with the suggested agent workflow and disclosure requirements. It requires disambiguating entities with the user, retaining provenance and unknowns, and obtaining the user's choice before switching failed live requests to sample.

All tools are read-only with respect to external business actions. They cannot book, pay, message, alter a user account, install software or write a user's files. Live tools do send selected public cultural inputs and city to Qloo and consume its quota. The agent client is responsible for the user's data-sharing approval.

## Local stdio

```sh
npm ci --ignore-scripts
node mcp-server.mjs
```

Use `node` directly when launching from an MCP client. `npm run mcp` is convenient manually but npm's own banners must not be mixed with stdio protocol output by a client.

A client configuration has a local Node command plus the absolute path to `mcp-server.mjs`. Do not include a credential in a shared MCP JSON configuration. No client configuration or agent permission was installed during this build.

## Streamable HTTP

```sh
npm start
# MCP endpoint: http://localhost:4177/api/mcp
```

`/api/mcp` accepts POST requests using official MCP SDK transport with stateless JSON responses. A compatible client performs normal MCP initialization, discovery and tools/call requests. GET streams and DELETE sessions are not supported because no server session is retained.

For hosting, the Vercel route is `api/mcp.js`. Set `AFTERGLOW_ORIGIN` to the exact verified deployment origin. The endpoint rejects foreign Host/Origin headers and cross-site browser requests. An explicitly enabled protected preview derives its sole allowed host/origin from Vercel’s unique deployment URL; aliases and custom domains cannot access that test route. Public live access still needs deployment-level rate/usage controls and bundle verification before release.

## What still must be demonstrated

1. Approved event credential setup and quota/expiry checks
2. A chosen compatible agent host, with permission to connect to the new Afterglow MCP endpoint; no new model account or key is inherently required
3. An actual agent run that resolves two sets of public cultural interests, invokes the live planner, explains the shared recommendations from real Qloo results, and replans after one user constraint change
4. End-to-end public demo and source review with the required disclosures

Successful completion of those steps is necessary before claiming the Qloo-powered agentic workflow is demonstrated. Merely exposing MCP, using fixtures, or showing the sample UI does not prove competition readiness. Final eligibility is the organizer's judgment.

## Sources

- Qloo requirements: https://qloo.devpost.com/ and https://qloo.devpost.com/rules
- Official MCP server architecture: https://modelcontextprotocol.io/docs/develop/build-server
- Pinned SDK line: https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.x
- Official transport implementation patterns: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md
