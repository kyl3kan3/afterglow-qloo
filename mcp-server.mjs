import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {createMcpServer} from './lib/mcp.mjs';
// stdout belongs exclusively to MCP protocol messages. No model or agent is started here.
const server=createMcpServer();
await server.connect(new StdioServerTransport());
