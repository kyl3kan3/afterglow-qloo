# Third-party dependencies

Original Afterglow code and interface were created for this project. All sample venues are fictional. Public artist, book and film names identify cultural favorites only; no third-party photographs, logos, font files or media assets are bundled.

Runtime: `@qloo/qloo-harness` 0.1.26 (MIT), installed from the official npm package. Its own `THIRD_PARTY_NOTICES.md` and transitive dependency licenses remain in the installed package. The lockfile records the complete dependency graph.

Development tests: `jsdom`, installed from npm; its license and dependency notices remain in the package. Node built-ins provide runtime HTTP, validation and test execution.

Redistribution should retain all required dependency notices. `node_modules` is not included in the source archive; `npm ci --ignore-scripts` reproduces the pinned installation.

Agent interface: `@modelcontextprotocol/sdk` 1.32.0 (official MCP TypeScript SDK, v1 line) and `zod` for tool-schema validation. Runtime versions are pinned in the lockfile. Official SDK code handles protocol negotiation and stdio/Streamable HTTP transport.
