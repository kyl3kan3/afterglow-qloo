# NOT FOR SUBMISSION — Afterglow draft

**Status: internal draft only. Do not submit or present this text as a completed live integration until the live Qloo, external-agent and public-demo gates below have been cleared.** The existing public demo uses fictional sample data. Fixture and MCP protocol tests are not proof of live Qloo execution or model-directed tool use.

## Project name

Afterglow

## Tagline

A date-night planner that makes room for two different tastes.

## Problem / inspiration

Planning a night together often starts with two different sets of interests. A recommendation that fits one person especially well can leave the other with little reason to be excited. Afterglow explores a different starting point: use public cultural favorites from both people, make the tradeoffs visible, and look for an evening they can choose together.

The design gives extra weight to the person with the lower fit score. Its aim is to make a shared choice easier to discuss, while keeping the origin of recommendations and the limits of the available data visible.

## What it does

The current fictional sample lets each person choose up to five public cultural favorites, set a mood, choose a start time and select a sample budget for two. It builds a dinner / activity / finale itinerary, explains each person's sample taste fit, supports stop swaps within the sample budget, and lets people save, reopen, revise and export nights in their browser. Sample places, prices and scores are hand-authored or calculated locally.

The implemented Qloo path is designed to turn each person's selected public cultural entity IDs into place recommendations, intersect the two recommendation lists, and balance the shared results. It returns a three-place discovery shortlist with provenance. Actual live authentication, responses and end-to-end behavior still need to be demonstrated.

Live results do not establish venue categories, prices, opening hours, reservations or travel times. The budget maps to a restaurant price-tier filter; the total cost of a live shortlist remains unknown. Mood remains a planning note rather than an unsupported Qloo parameter. Sparse overlap produces a clear error instead of inserting fictional venues.

## How it is built

Afterglow uses semantic HTML, responsive CSS and vanilla browser JavaScript, with a Node.js backend and Vercel function entrypoints. The local planner validates inputs, scores the two people's preferences, searches sample dinner/activity/finale combinations within budget, and schedules the resulting sample itinerary.

The server-side Qloo adapter pins the official `@qloo/qloo-harness` at version `0.1.26`. It uses the harness's search and insights commands, keeps the credential out of browser code and command arguments, locks the destination to the official hackathon API, and preserves Qloo entity IDs and available raw affinities separately from Afterglow's own ranking indices. The adapter has fixture coverage; live Qloo proof is pending.

The source includes real Model Context Protocol servers over stdio and stateless Streamable HTTP. An external agent can discover the tools, resolve public cultural favorites, request a plan, inspect the result and replan after feedback. Afterglow does not bundle an LLM or simulate a model. The chosen agent host must supply its own authorized model access and make the tool-use decisions.

Production live execution is currently blocked in code. Isolated live testing requires an approved, durable request budget. Protected-preview execution additionally requires verified authentication and a shared quota store. These controls are implemented and covered by fixtures; actual hosted datastore and live execution checks remain pending.

## Meaningful Qloo use and agentic-tool route

The intended live workflow makes Qloo's cultural-to-place recommendations central to the output:

1. An external agent checks `afterglow_status` and identifies whether live access is available.
2. It uses `afterglow_search_favorites` to find real Qloo entity candidates for each person's public interests, and resolves ambiguity with the user.
3. It invokes `afterglow_plan_evening` with confirmed entity IDs and a city. A live plan uses separate Qloo place-insights requests for the two people.
4. Afterglow finds shared places and balances their list-rank indices. These are application ranking indices, not probabilities of enjoyment or Qloo affinity scores. The sample planner documents a lower-score-priority rule, with 70% of its pair score coming from the lower individual score and 30% from the mean.
5. The agent explains the shared recommendations using retained provenance and disclosed unknowns, then replans after a user constraint changes.

The MCP prompt `plan_an_afterglow_evening` describes this workflow and its disclosure requirements. Tools cannot book, pay or message. A real agent deciding to execute this workflow against live Qloo remains an evidence gate; tool definitions, protocol handshakes and fixture calls alone do not clear it.

## Creative idea and intended impact

Afterglow applies cultural discovery to a small, familiar negotiation: choosing a night that feels worthwhile to both people. Its lower-score priority makes the less well-served person's preferences part of the ranking itself. Explanations let the pair examine that compromise instead of treating a recommendation as an unexplained verdict.

The project combines an inspectable browser experience with reusable agent tools. That allows an agent to ask for clarification and respond to changing constraints while the application retains a clear record of where results came from and what they do not establish.

The intended benefit is less planning friction and a clearer shared choice. No user study, measured time saving, satisfaction improvement, adoption figure or business outcome has been established. Those claims must not be added without evidence. A completed live demonstration should show whether Qloo produces a useful shared shortlist for synthetic demo personas and whether the agent can explain and revise it coherently.

## Validation and evidence to attach

The repository contains domain, HTTP, Qloo adapter-contract, real MCP protocol and jsdom interaction tests, along with syntax/build checks. See `docs/VERIFICATION.md` for the recorded coverage and its limits. The historical verification record includes real MCP clients and live-path fixtures, but explicitly leaves actual Qloo, hosted Redis and agent-host execution unverified.

Replace the placeholders below with reviewed, non-secret evidence before submission. Do not include keys, tokens, secret-store screenshots or private/client information.

- **Current local candidate:** October 27 local changes over `1d1b12216e37ff2636f88e1a7207dd2354136bec`; 72/72 tests passed on Windows with Node 24.19.0, plus syntax, build and diff checks. This candidate is not yet published; record its final commit after an authorized release.
- **Live Qloo evidence:** `[approved run date; verified official endpoint; sanitized search and insights outcome; actual entity provenance; request-budget usage]`
- **Agent-run evidence:** `[agent host and transport; sanitized tool sequence; user clarification; live plan; one constraint change and replan]`
- **Public functional demo:** `[verified accessible URL and date; meaningful live Qloo workflow available to judges; quota, expiry and usage controls confirmed]`
- **Public open-source repository:** `https://github.com/kyl3kan3/afterglow-qloo` — MIT license; `[verify final candidate is published and public]`
- **Current sample demo:** `https://afterglow-qloo.vercel.app/` — fictional sample only; it does not satisfy the live-demo gate by itself.
- **Demonstrated impact:** `[brief evidence-backed description of usefulness from the completed demonstration or evaluation; no invented metrics]`

## Known limitations and submission gates

- Live Qloo credentials, quota, expiry and successful responses are not verified by the existing build record. Credential setup and calls require the owner's scoped authorization.
- A real model/agent host has not been shown choosing and invoking the live tools.
- Production live calls remain blocked. A protected test preview alone does not establish an accessible public judging demo.
- Actual hosted quota-store durability, concurrency, authenticated live access and Qloo subprocess behavior must be verified before claiming hosted live readiness. October 27 anonymous checks confirm that the existing Preview status redirects to Vercel SSO and MCP initialization returns HTTP 401.
- Live recommendations are a discovery shortlist with unknown total cost and operational details. They are not confirmed bookings or a verified timed itinerary.
- Screen-reader behavior, touch input and native phone hardware remain unverified in the existing record.
- Recheck the final official requirements and judging-period availability before publishing the entry. The supplied official requirements do not require a demo video.

## Rubric review before finalizing

The supplied rubric gives equal weight to these four areas. The final entry should support each with concrete evidence:

| Area | Current draft basis | Evidence still needed |
| --- | --- | --- |
| Technical Qloo use | Server adapter, two-person insights composition, provenance and MCP tools | Successful real Qloo calls and model-directed live tool run |
| Coherent design | Two-person inputs, visible tradeoffs, sample editing flow and explicit limits | Review of the final live experience and accessible public demo |
| Demonstrated impact | Clear intended planning benefit; no measured outcome claimed | Useful live example or evaluation with honest observations |
| Creative idea | Lower-score priority for shared cultural discovery, exposed as agent tools | Demonstration that the concept produces a coherent result |

**NOT FOR SUBMISSION until these evidence gaps and release gates are cleared and the draft is updated to match the verified final behavior.**
