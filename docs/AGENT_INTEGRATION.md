> Version 0.4: Production live calls remain blocked. One genuine protected-Preview Qloo search is verified; a complete two-profile Insights plan remains pending. See [test budget](TEST_BUDGET.md) for the original counter and pending hosted expansion.

# Afterglow as an agentic tool

## Exact status

The original UI is a deterministic planner. It is not a chatbot and does not run an LLM. Version 0.2 adds a genuine Model Context Protocol server that an external agent can invoke. It implements the competition's permitted **agentic-tool** architecture rather than adding an unapproved paid model dependency.

A protocol client successfully initialized the actual server, listed and called its tools, planned a sample evening, and replanned under a lower budget. Both stdio and stateless Streamable HTTP transports are tested. A fixture test traverses the live Qloo tool path without network calls. Those fixtures establish protocol behavior, not autonomous model execution or complete live Qloo behavior. Separately, one genuine hosted artist search returned HTTP 200 and six candidates; full live Insights planning remains pending.

There is no separate disabled model-provider adapter because no model lives in this application. The Qloo backend is disabled by default. When an external model host is used, it supplies its own authorized model and makes the tool-use decisions. Such a run is useful optional validation, not a separate published submission requirement.

## Hosted budget candidate and actual state

The published 72-test baseline at `b8cbd0764e59da600b8e8a2844fda0860692f4e9` has a hosted ceiling of ten. The separate local candidate defaults to ten when `QLOO_TEST_APPROVED_CAP` is unset. Explicit `QLOO_TEST_APPROVED_CAP=100` opts the approved protected Preview into a ceiling of 100; reservations fail closed unless the actual counter cap matches the configured cap. Status reports the configured ceiling, not proof of remaining quota. The isolated SQLite route retains its hard maximum of ten and must not fund the same hosted approval.

The last executed original counter state remains **cap 10, used 1, original expiry unchanged**. The owner approved 100 hosted requests total, including that used request, and a secret deployment-specific judge link through `2026-11-06T04:45:00Z`. The same-counter amendment, candidate release and judge-link creation/verification remain pending. Do not report 99 remaining until an actual cap of 100 with used 1 preserved is verified. Never put bearer links, private approval identities or real Qloo results in public source.

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

## Live release checks and optional host validation

1. Verify the candidate code and the original shared counter's actual cap, spent usage and expiry; preserve the same store/identity and do not reset or duplicate it.
2. Complete the prepared two-profile Insights plan using the already verified public favorites. No fresh search is needed. Verify actual shared recommendations and truthful provenance/unknowns in the core product flow.
3. Verify the approved deployment-specific judge access mechanism, free end-to-end use through judging end and source disclosures. The secret bearer link belongs only in the private judge handoff. Production live stays off.
4. Optionally connect a compatible external model host through a separately authorized connection and demonstrate tool discovery, live planning and replanning. No new model account or key is inherently required, and this optional test must share the same hosted counter.

Merely exposing MCP, using fixtures or showing the sample UI does not establish a complete live Qloo product. The published requirements do not separately require external host/model interaction proof or a demo video. Official Rules section 4 permits private-site judge credentials and requires free, unrestricted access through judging end; section 11.4 gives those Rules precedence over inconsistent event materials. Final eligibility is the organizer's judgment.

## Sources

- Qloo requirements: https://qloo.devpost.com/ and https://qloo.devpost.com/rules
- Official MCP server architecture: https://modelcontextprotocol.io/docs/develop/build-server
- Pinned SDK line: https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.x
- Official transport implementation patterns: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md
