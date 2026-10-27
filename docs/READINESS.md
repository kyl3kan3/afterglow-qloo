# Release readiness — October 27, 2026

Afterglow is the existing Qloo entry. Do not create another project. The public repository is MIT licensed and includes a functional fictional-sample planner, real MCP transports and an official Qloo harness bridge pinned at 0.1.26. A completed live Qloo integration is still unverified, so this is not yet a qualifying submission.

## Current read-only evidence

- Baseline: `main` commit `1d1b12216e37ff2636f88e1a7207dd2354136bec`.
- The existing public sample is https://afterglow-qloo.vercel.app/.
- On October 27, anonymous `GET /api/status` returned HTTP 200 with `enabled:false`, `blockedReason:PUBLIC_LIVE_DISABLED` and `sampleAvailable:true`. This proves the public route refuses live execution; it does not prove credential validity or remaining quota.
- The latest existing Preview, deployment `dpl_CUAhGRFqRANL3rHdVFBA11a3XkPK`, was READY at that baseline commit. Its unique URL is https://afterglow-qloo-9cd15177n-kyl3kan3-6147s-projects.vercel.app/.
- Vercel project metadata reports Node 24.x and Preview SSO protection enabled. Anonymous Preview `GET /api/status` returned HTTP 302 to Vercel SSO; anonymous MCP `initialize` returned HTTP 401. These probes made zero Qloo requests. Repeat them on any later deployment.

Older October 7 integration/deployment documents are historical. Their environment-write HTTP 403 is not evidence that the later READY Preview failed to deploy. No denied configuration action was retried during this review.

## Local candidate

- Stop live planning after the first profile request fails, preserving the next slot on authentication, quota/rate-limit or availability errors.
- Allow the browser to wait for two sequential upstream calls and quota checks, with a 55-second timeout within the hosted 60-second limit.
- Reject both hosted Redis URL aliases on the isolated SQLite path, preventing an accidental second budget backend.
- Invalidate pending taste search results when the dialog reopens for either person; the new dialog can search immediately.
- Use portable file URLs for Node ESM preloads and subprocess import fixtures on Windows and POSIX.
- Close a SQLite connection if initial PRAGMA setup fails, including corrupt-ledger handling.
- Give every harness invocation a fresh explicit Qloo configuration directory, preventing fallback to saved owner configuration on Windows and POSIX.

All 72 automated tests, syntax checks, static build and diff whitespace checks passed on Windows with Node 24.19.0. Detailed results are recorded in [VERIFICATION.md](VERIFICATION.md). All Qloo and Redis paths tested locally use fixtures, not live credentials.

## Remaining gates, in order

- [ ] Reconcile the one existing approval counter and all prior Qloo attempts. Verify remaining included quota, rate limits and credential/approval expiry. The earlier authorization is **at most ten total attempts**, not a fresh ten now. Do not initialize a replacement counter or fund both Redis and SQLite for that authorization.
- [ ] Verify the already-created isolated Upstash Free database and its existing fixed approval ID. Do not recreate the database. Validate actual Lua concurrency, retention and fail-closed behavior with a separate non-production validation key only within the authorized setup; never reset the real counter to recover quota.
- [ ] Verify the owner's securely entered credential and Preview configuration through an authorized mechanism. Do not copy secrets into chat, source, CLI arguments or reports. Do not bypass the historical environment-metadata/write HTTP 403.
- [ ] On the selected protected deployment, repeat anonymous status and MCP initialization checks. Confirm authenticated status separately; configuration status alone is not authentication or quota proof.
- [ ] Run the bounded smoke test only after those conditions pass: resolve public cultural favorites, plan two profiles, inspect actual shared Qloo entities/provenance and error behavior. Stop on authentication, expiry, quota or rate-limit errors. Failures spend slots. No synthetic results may be labeled Qloo data.
- [ ] Demonstrate a real authorized agent host discovering/calling the tools with live Qloo results and replanning after feedback. The real MCP fixture tests do not establish this proof.
- [ ] Provide a functional public judging experience with meaningful live Qloo access. Production currently blocks that access. A protected test Preview and a public fictional sample do not fulfill this gate. Any public live release needs a separately scoped quota/abuse-control decision; the earlier ten-request test cap is not a public operating budget.
- [ ] Confirm credential expiry and demo availability cover judging; finish phone/touch and accessibility QA; record truthful impact evidence.
- [ ] Finalize Devpost text and eligibility/legal declarations against https://qloo.devpost.com/rules, using only verified claims. A demo video is not required by the supplied event requirements. Target deadline: October 30, 10:45 p.m. Central.

No live Qloo calls, credential changes, new grants, database creation, public push, deployment or submission were performed in this local review.
