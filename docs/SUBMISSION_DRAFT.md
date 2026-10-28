# NOT FOR SUBMISSION — Afterglow draft

**Status: internal draft only. Finish the live two-profile planning check and usable judging access before submission.** A protected Preview completed one genuine Qloo artist search on October 28; the existing public demo still uses fictional sample data. External model-directed MCP use would strengthen the evidence, but is not a separately listed submission requirement in the Official Rules.

## Approved release bundle - execution pending

The owner approved 100 total hosted Qloo requests, including the one request already used, and a judge-only access link for one selected deployment through `2026-11-06T04:45:00Z`. The last observed state is still `cap:10`, `used:1`; neither the counter change nor the access link has been verified as executed. After a verified increase to 100 preserving that used value, 99 slots would remain before later attempts. There is no new 100-request balance, reset, replacement counter or separate SQLite funding. SQLite retains its ten-request ceiling. Production live execution stays blocked, and existing Preview protection and branch-only secrets are preserved.

The access link will be a bearer secret and must not appear in this public-repository draft or any public submission field. Prepare the judge instructions privately outside the repository and fill the link placeholder only after the approved deployment-only link works. The expiry matches the Rules' judging end: November 5, 2026, 11:45 p.m. Eastern / November 6, 04:45 UTC.

The prepared demonstration uses two synthetic taste profiles, Nina Simone and Nina Hagen, with New York City, a $140 budget for two, Slow & intimate mood and an 18:00 start. Both artist candidates have already been verified, so the prepared operator check needs two uncached Insights requests and no fresh search. The resulting shortlist and judging-access behavior remain pending; do not convert this plan into a completed claim before recording the actual result.

## Project name

Afterglow

## Tagline

A date-night planner that makes room for two different tastes.

## Problem / inspiration

Planning a night together often starts with two different sets of interests. A recommendation that fits one person especially well can leave the other with little reason to be excited. Afterglow explores a different starting point: use public cultural favorites from both people, make the tradeoffs visible, and look for an evening they can choose together.

The design gives extra weight to the person with the lower fit score. Its aim is to make a shared choice easier to discuss, while keeping the origin of recommendations and the limits of the available data visible.

## What it does

The current fictional sample lets each person choose up to five public cultural favorites, set a mood, choose a start time and select a sample budget for two. It builds a dinner / activity / finale itinerary, explains each person's sample taste fit, supports stop swaps within the sample budget, and lets people save, reopen, revise and export nights in their browser. Sample places, prices and scores are hand-authored or calculated locally.

The implemented Qloo path turns each person's selected public cultural entity IDs into place recommendations, intersects the two recommendation lists, and balances the shared results. It is designed to return a three-place discovery shortlist with provenance. Live artist search and authentication were verified in protected Preview on October 28; the two-profile Insights and complete planning outcome remain unverified.

Live results do not establish venue categories, prices, opening hours, reservations or travel times. The budget maps to a restaurant price-tier filter; the total cost of a live shortlist remains unknown. Mood remains a planning note rather than an unsupported Qloo parameter. Sparse overlap produces a clear error instead of inserting fictional venues.

## How it is built

Afterglow uses semantic HTML, responsive CSS and vanilla browser JavaScript, with a Node.js backend and Vercel function entrypoints. The local planner validates inputs, scores the two people's preferences, searches sample dinner/activity/finale combinations within budget, and schedules the resulting sample itinerary.

The server-side Qloo adapter pins the official `@qloo/qloo-harness` at version `0.1.26`. It uses the harness's search and insights commands, keeps the credential out of browser code and command arguments, locks the destination to the official hackathon API, and preserves Qloo entity IDs and available raw affinities separately from Afterglow's own ranking indices. The adapter has fixture coverage and one successful hosted live search; live Insights validation is pending.

The source includes real Model Context Protocol servers over stdio and stateless Streamable HTTP. An external agent can discover the tools, resolve public cultural favorites, request a plan, inspect the result and replan after feedback. Afterglow does not bundle an LLM or simulate a model. The chosen agent host must supply its own authorized model access and make the tool-use decisions.

Production live execution is currently blocked in code. Isolated live testing requires an approved, durable request budget. Protected-preview execution additionally requires authentication and a shared quota store. The October 28 hosted search consumed exactly one slot in the original durable counter. Anonymous Preview status redirected to Vercel SSO, anonymous MCP initialization returned 401, and public Production status still reported live execution disabled. Support for the approved 100-total hosted bundle and the deployment-only judge link is being prepared; it is not a completed deployment or counter change. Hosted concurrency and failure-mode checks remain covered by fixtures rather than live stress tests.

## Meaningful Qloo use and agentic-tool route

The intended live workflow makes Qloo's cultural-to-place recommendations central to the output. It can be used from the browser; the corresponding reusable agent-tool workflow is:

1. An external agent checks `afterglow_status` and identifies whether live access is available.
2. It uses `afterglow_search_favorites` to find real Qloo entity candidates for each person's public interests, and resolves ambiguity with the user.
3. It invokes `afterglow_plan_evening` with confirmed entity IDs and a city. A live plan uses separate Qloo place-insights requests for the two people.
4. Afterglow finds shared places and balances their list-rank indices. These are application ranking indices, not probabilities of enjoyment or Qloo affinity scores. The sample planner documents a lower-score-priority rule, with 70% of its pair score coming from the lower individual score and 30% from the mean.
5. The agent explains the shared recommendations using retained provenance and disclosed unknowns, then replans after a user constraint changes.

The MCP prompt `plan_an_afterglow_evening` describes this workflow and its disclosure requirements. Tools cannot book, pay or message. A real agent deciding to execute the workflow against live Qloo would provide useful evidence for the agentic-tool route; it is not a separately named artifact in the Official Rules. Protocol handshakes and fixture calls must still be described accurately and must not be presented as model-directed live execution.

## Creative idea and intended impact

Afterglow applies cultural discovery to a small, familiar negotiation: choosing a night that feels worthwhile to both people. Its lower-score priority makes the less well-served person's preferences part of the ranking itself. Explanations let the pair examine that compromise instead of treating a recommendation as an unexplained verdict.

The project combines an inspectable browser experience with reusable agent tools. That allows an agent to ask for clarification and respond to changing constraints while the application retains a clear record of where results came from and what they do not establish.

The intended benefit is less planning friction and a clearer shared choice. No user study, measured time saving, satisfaction improvement, adoption figure or business outcome has been established. Those claims must not be added without evidence. A completed live demonstration should show whether Qloo produces a useful shared shortlist for synthetic demo personas and whether the agent can explain and revise it coherently.

## Validation and evidence to attach

The repository contains domain, HTTP, Qloo adapter-contract, real MCP protocol and jsdom interaction tests, along with syntax/build checks. See `docs/VERIFICATION.md` for the recorded coverage and its limits. Real Qloo artist search and one hosted Redis reservation were additionally verified on October 28. Full live planning and model-directed external-host execution remain unverified.

Replace the placeholders below with reviewed, non-secret evidence before submission. Do not include keys, tokens, secret-store screenshots or private/client information.

- **Published candidate:** Commit `b8cbd0764e59da600b8e8a2844fda0860692f4e9`, open PR #8. Its 72/72 tests passed on Windows with Node 24.19.0, plus syntax, build and diff checks. Later local changes require their own final validation and release record.
- **Live Qloo evidence:** October 28 protected Preview search returned HTTP 200 and six artist candidates; the original shared counter increased by exactly one. No raw response data belongs in the public repository. `[Add verified two-profile Insights outcome and retained provenance after the next approved check.]`
- **Optional agent-run evidence:** `[If performed: actual agent host and transport, sanitized tool sequence and model decisions. Do not label a manual protocol client as registered-host model execution.]`
- **Functional judging demo:** `[Non-secret canonical deployment URL and verified access outcome only. Deliver the bearer access link and testing instructions through the approved private judge channel, never this file.]` Official Rules section 4 Testing permits private sites with working login credentials; section 11.4 gives the Rules precedence over inconsistent event materials. The approved deployment-only link expiry is November 6 at 04:45 UTC; creation and access verification remain pending.
- **Public open-source repository:** `https://github.com/kyl3kan3/afterglow-qloo` - public, MIT license; PR #8 contains the reviewed candidate and remains unmerged.
- **Current sample demo:** `https://afterglow-qloo.vercel.app/` — fictional sample only; it does not satisfy the live-demo gate by itself.
- **Demonstrated impact:** `[brief evidence-backed description of usefulness from the completed demonstration or evaluation; no invented metrics]`

## Known limitations and submission gates

- Live artist search, the server credential and one durable reservation are verified; live two-profile Insights are not. The event key's numeric remaining allowance and exact per-key expiry are not published. The official guide says keys remain active through judging; the organizer says event API requests are free through judging without automatic paid charges.
- A real model/agent host has not been shown choosing registered live tools. This is a useful evidence opportunity, not a separately stated submission artifact.
- Production live calls remain blocked. The protected Preview needs a verified deployment-only judge access link and private instructions; private access is permitted by Official Rules section 4 Testing. A viewable sample alone does not establish complete live Qloo planning behavior.
- One hosted reservation and successful harness search are verified. The approved 100-total bundle includes that used slot and remains pending an in-place counter update, candidate deployment and verification. It is finite, not an unlimited judging-service allowance; actual hosted concurrency/retention and broader live failure modes have not been stress-tested. No paid upgrade or additional grant is authorized by this draft.
- Live recommendations are a discovery shortlist with unknown total cost and operational details. They are not confirmed bookings or a verified timed itinerary.
- Screen-reader behavior, touch input and native phone hardware remain unverified in the existing record.
- Recheck the final official requirements and judging-period availability before publishing the entry. The supplied official requirements do not require a demo video.

## Rubric review before finalizing

The supplied rubric gives equal weight to these four areas. The final entry should support each with concrete evidence:

| Area | Current draft basis | Evidence still needed |
| --- | --- | --- |
| Technical Qloo use | Server adapter, genuine hosted artist search, two-person insights composition, provenance and MCP tools | Successful real two-profile Insights plan; optional model-directed tool-use evidence |
| Coherent design | Two-person inputs, visible tradeoffs, sample editing flow and explicit limits | Review of the final live experience and usable judge access |
| Demonstrated impact | Clear intended planning benefit; no measured outcome claimed | Useful live example or evaluation with honest observations |
| Creative idea | Lower-score priority for shared cultural discovery, exposed as agent tools | Demonstration that the concept produces a coherent result |

**NOT FOR SUBMISSION until these evidence gaps and release gates are cleared and the draft is updated to match the verified final behavior.**
