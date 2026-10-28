> Version 0.4: Production live calls remain blocked. Protected Preview `eb3ca64` has a verified live two-profile Insights plan. The original counter is cap 100, used 3, with 97 remaining. Judge access works, but expires 55 seconds before judging ends; private handoff remains pending. See [test budget](TEST_BUDGET.md).

# Afterglow as an agentic tool

## Exact status

The original UI is a deterministic planner. It is not a chatbot and does not run an LLM. Version 0.2 adds a genuine Model Context Protocol server that an external agent can invoke. It implements the competition's permitted **agentic-tool** architecture rather than adding an unapproved paid model dependency.

A protocol client successfully initialized the actual server, listed and called its tools, planned a sample evening, and replanned under a lower budget. Both stdio and stateless Streamable HTTP transports are tested. A fixture test traverses the live Qloo tool path without network calls. Those fixtures establish protocol behavior, not autonomous model execution. Separately, a genuine hosted artist search returned HTTP 200 and six candidates, followed by a live plan returning HTTP 200, four shared candidates and three stops. That plan consumed exactly two original-counter reservations.

There is no separate disabled model-provider adapter because no model lives in this application. The Qloo backend is disabled by default. When an external model host is used, it supplies its own authorized model and makes the tool-use decisions. Such a run is useful optional validation, not a separate published submission requirement.

## Hosted budget and actual state

The current [protected Preview](https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/) is READY at `eb3ca64`. Hosted configuration defaults to ten when `QLOO_TEST_APPROVED_CAP` is unset; explicit `QLOO_TEST_APPROVED_CAP=100` is now verified and matches the actual Redis cap. Reservations fail closed on a cap mismatch. Status reports the configured ceiling, not proof of remaining quota. The isolated SQLite route retains its hard maximum of ten and must not fund the same hosted approval. Dated automated-test counts remain separate in [VERIFICATION.md](VERIFICATION.md).

The original counter is **cap 100, used 3, 97 remaining**, expiry `2026-11-06T04:45:00Z`: one search plus exactly two plan reservations. The amendment preserved spent usage rather than resetting it. Deployment-specific access works in an independent browser and its status check made no Qloo request. **Actual access expiry is `2026-11-06T04:44:05Z`, 55 seconds before judging end.** That gap and private judge-link delivery/placement remain pending, as does submission. The bearer value is retained only in memory and must not be written to any file. Keep private grant/approval identities and real Qloo results out of public source.

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

1. Preserve the verified code/counter cap match, original store/identity and spent usage; do not reset or duplicate it. Reconcile the remaining snapshot before more requests.
2. The live two-profile HTTP plan passed with four shared candidates and three stops. No fresh search is needed merely to rebuild its synthetic inputs. Preserve provenance/unknowns without publishing raw results.
3. Independent browser verification requires Vercel login without the private link; the link opens the app and its query is removed. Status returned HTTP 200, enabled `true`, maximum 100. Switching to live mode displayed the live banner, empty actual-entity choosers, city input and expected disclosures, without a search/plan request; the counter reread stayed cap 100, used 3, with the same expiry. Reconcile the actual access expiry's 55-second gap and finish private delivery/placement before claiming complete judging coverage. Production live stays off.
4. Optionally connect a compatible external model host through a separately authorized connection and demonstrate tool discovery, live planning and replanning. No new model account or key is inherently required, and this optional test must share the same hosted counter.

Current product evidence includes the genuine hosted live plan, independent live-form inspection and the recorded 11 jsdom UI tests. External host/model interaction proof and a demo video are not separately required submission artifacts. Additional device/accessibility QA was not performed; that is a validation limit rather than an extra eligibility gate. Official Rules section 4 permits private-site judge credentials and requires free, unrestricted access through judging end; section 11.4 gives those Rules precedence over inconsistent event materials. Final eligibility is the organizer's judgment.

## Sources

- Qloo requirements: https://qloo.devpost.com/ and https://qloo.devpost.com/rules
- Official MCP server architecture: https://modelcontextprotocol.io/docs/develop/build-server
- Pinned SDK line: https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.x
- Official transport implementation patterns: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md
