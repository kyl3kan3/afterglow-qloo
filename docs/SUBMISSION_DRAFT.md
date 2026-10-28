# Afterglow - public submission writeup

**Preparation status:** genuine hosted search, two-profile live planning, independent-browser judge access and the live-mode form are verified. Testing-instruction placement, entry creation and final submission remain pending. Current access expires at November 6, 04:44:05 UTC, 55 seconds before the official judging end; that gap remains open. The writeup below contains public project information only.

## Tagline

A date-night planner that makes room for two different tastes.

## Inspiration

Planning a night together often starts with two different sets of interests. A recommendation that fits one person especially well can leave the other with little reason to be excited. Afterglow starts with public cultural favorites from both people, makes the tradeoffs visible, and looks for places they can choose together.

Its ranking gives extra weight to the less well-served taste profile. The goal is a shared choice the pair can discuss, with clear explanations of where recommendations came from and what the available data cannot establish.

## What it does

Each person chooses up to five public cultural favorites, then sets a city, budget, mood and start time. In live mode, Afterglow resolves those favorites through Qloo, asks Qloo for place recommendations separately for each profile, finds the overlap, and returns a balanced three-place discovery shortlist with provenance.

On October 28, a hosted check used synthetic profiles based on Nina Simone and Nina Hagen, with New York City, a $140 budget, Slow & intimate mood and an 18:00 start. The live planning endpoint returned HTTP 200, four shared candidates and three proposed stops. The plan consumed exactly two upstream reservations. This verifies the cultural-to-place pipeline for those inputs; it does not establish measured user satisfaction or real-world venue availability.

The separate sample studio builds a fictional dinner / activity / finale itinerary. Its places, prices and taste scores are hand-authored or calculated locally. It supports budget-preserving stop swaps, saving and reopening plans on the same browser, revisions and text export. Sample results are visibly distinguished from genuine Qloo results.

## What makes it Qloo-powered

Qloo supplies the live cultural-to-place relationships. Afterglow sends each person's confirmed public cultural signals to Qloo independently, then balances only places returned for both. Without those Qloo recommendations, the verified live discovery pipeline would have no shared candidates to compose.

Afterglow's scores interpret list ranks; they are not Qloo probabilities, predictions of enjoyment or relationship-compatibility measures. The application favors the lower individual rank index so one person's stronger match does not hide the other's weaker one. Sparse overlap produces an explicit error instead of fictional filler.

## How we built it

The interface uses semantic HTML, responsive CSS and vanilla browser JavaScript. A Node.js backend serves the application locally and through Vercel functions. The server-side adapter pins the official `@qloo/qloo-harness` at version `0.1.26`, keeps credentials out of browser code and command arguments, and locks requests to the hackathon endpoint.

A durable shared counter reserves a slot before every uncached upstream request. The two profile requests run sequentially, so a failure on the first stops before another slot is spent. There are no automatic retries or silent substitutions. Harness children receive isolated temporary configuration directories, and response provenance is kept separate from the application's own ranking explanation.

Afterglow also exposes genuine Model Context Protocol tools over stdio and stateless Streamable HTTP. An external agent can check status, resolve public favorites, request a plan and replan after feedback. Real MCP clients have exercised discovery and tool calls in tests. Afterglow has no bundled LLM; a model-directed external-host run has not been demonstrated and is not claimed here.

## Challenges and what we learned

The main design challenge was making a shared recommendation inspectable without treating aggregate cultural affinity as certainty about either person. Keeping the two Qloo profiles separate, showing the shared results, and distinguishing Qloo provenance from application scoring make that compromise easier to inspect.

The implementation also needed to preserve a finite usage budget across hosted instances, handle partial failures conservatively, and keep fictional sample behavior separate from live results. Automated tests cover domain logic, HTTP behavior, real MCP transports, harness contracts, quota enforcement and browser interactions; the detailed record and limits are in [VERIFICATION.md](VERIFICATION.md).

## Limits and intended impact

Live output is a discovery shortlist. Prices, opening hours, reservations, route geography and travel times remain unverified. The budget applies a restaurant price-tier filter; it is not a verified total cost. Mood is a planning note, and proposed times are suggestions. Nothing is booked, paid for or messaged.

The intended benefit is less planning friction and a clearer shared choice. The completed hosted example establishes that two public cultural profiles can produce a shared live shortlist. No user study, measured time saving, adoption figure or satisfaction improvement is claimed.

The separate browser session also displayed the live-mode banner, empty entity choosers, city field and disclosures without another search or plan. The counter remained unchanged. Next steps are the testing-instruction handoff, access coverage through the exact judging end, and the entry/submission actions. Further phone/touch, accessibility and model-directed tool-use checks would provide additional quality evidence.

## Source and demonstration

- [Public source repository](https://github.com/kyl3kan3/afterglow-qloo), licensed under MIT.
- [Verified hosted Preview](https://afterglow-qloo-i2dn18naf-kyl3kan3-6147s-projects.vercel.app/), revision `eb3ca64`. An independent-browser access check passed; testing instructions have not been placed with an entry. This canonical URL contains no access credentials.
- [Public sample studio](https://afterglow-qloo.vercel.app/), explicitly fictional sample mode. Production live access remains disabled.

No project or final entry has been created or submitted. The remaining access and Devpost blockers are recorded in [READINESS.md](READINESS.md). No API keys, access credentials, returned identifiers or Qloo response datasets are included in this writeup.
