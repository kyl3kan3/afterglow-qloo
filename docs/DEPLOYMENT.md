# Deployment and remaining submission gates

The public fictional-sample demo is available at **https://afterglow-qloo.vercel.app/**. It does not make live Qloo calls and is not yet a complete Qloo hackathon entry.

## Verified October 7, 2026

- Initial production deployment: `dpl_BgkUgD3yEuM72kvrwse5XYBxRQex`, source commit `0d7b1967d8905f0ac58a14279abb3a354e445004`, Vercel state READY
- Public page and sample planning work without Vercel sign-in
- `/api/status`: HTTP 200, `enabled:false`, fictional sample available
- `/api/search`: HTTP 503 while unconfigured; no sample substitution
- Cloud Chromium checks: desktop layout, sample generation, save/reload/reopen, Escape/reopen, swaps within budget, $50 budget producing three stops totaling $34, unavailable live mode, and native text export
- Responsive reflow: 388 CSS-pixel viewport through browser zoom; no horizontal overflow and dialog fits inside viewport. Device emulation is blocked in this browser; actual phone/touch behavior is not claimed
- Node 24 runtime; dependency patch and all 63 tests, syntax checks and build passed locally

The UI's saved-state indicator was corrected after browser QA: a changed saved plan shows **Save changes** until the revision is saved. The release following the initial deployment includes this correction and patched transitive dependencies.

## Configuration still required

The connected deployment tool can create projects/builds but Vercel returned HTTP 403 for writing this project's environment variables. This is a service permission restriction, not a failed build. No alternative write route or credential access was attempted.

An authorized owner must enter these in this project's settings through secure setup:

- `AFTERGLOW_ORIGIN=https://afterglow-qloo.vercel.app` as non-secret Production configuration, then redeploy. Until this is set, hosted MCP rejects its public hostname; local MCP protocol tests still work
- Keep Production `QLOO_ENABLED=false`
- After the shared quota store and protected preview are approved and ready, enter `QLOO_API_KEY` and `QLOO_TEST_REDIS_TOKEN` as Secret values directly. Never put them in chat, source, command arguments or reports
- Configure the verified preview origin, store URL and fixed budget ID as non-secret Preview values. Do not reuse another app's credentials or storage

The prepared Redis adapter remains unwired. It needs one durable, isolated approval counter and real datastore verification before any hosted live route can be enabled. The only currently implemented live path is isolated stdio with one durable SQLite ledger and at most ten total attempts.

## Devpost

The Devpost connector returned HTTP 405 on October 7 for identity and current submission requirements. No project or entry was written. Submission text is being prepared locally with unfinished claims clearly marked. Recheck the current official requirements and registration before the final submission action. A sample-only demonstration is insufficient evidence of a real Qloo-powered agentic tool.
