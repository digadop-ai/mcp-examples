// Example: connect to a Digadop MCP server with the TypeScript MCP SDK.
// npm install @modelcontextprotocol/sdk
//
// Replace the URL and token below with your own. See ../../docs/connect-any-client.md.

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const client = new Client({ name: 'my-agent', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(
  new URL('https://<your-gateway-host>/mcp'),
  { requestInit: { headers: { authorization: 'Bearer <your-token>' } } },
);

async function main() {
  await client.connect(transport);

  const { tools } = await client.listTools();
  console.log('Entitled tools:', tools.map((t) => t.name));

  const res = await client.callTool({
    name: 'help_search_articles',
    arguments: { query: 'how do I reset my password' },
  });
  console.log(res.structuredContent ?? res.content);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
