# Connect any MCP client

Digadop's MCP servers speak standard [Streamable HTTP MCP](https://modelcontextprotocol.io/), authenticated with a Bearer token on the initialize request. Any MCP client that supports a remote HTTP server with custom headers can connect, not just the ones named below.

Replace `https://<your-gateway-host>/mcp` and `<your-token>` with your own values everywhere in this document:

- For **Who Sees What**, the host and the token are the ones shown on your Enterprise org's API access page (organization menu, then API access). See [whoseeswhat.com/developers/mcp](https://whoseeswhat.com/developers/mcp/) for the live reference.
- For **Digadop Help**, we issue both once your organization has early access. [Contact us](https://digadop.ai/contact/) to request it.

## The TypeScript MCP SDK

```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const client = new Client({ name: 'my-agent', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(
  new URL('https://<your-gateway-host>/mcp'),
  { requestInit: { headers: { authorization: 'Bearer <your-token>' } } },
);
await client.connect(transport);

// Discover the tools your token is entitled to
const { tools } = await client.listTools();
console.log(tools.map((t) => t.name));

// Call one
const res = await client.callTool({
  name: 'help_search_articles',
  arguments: { query: 'how do I reset my password' },
});
console.log(res.structuredContent);
```

A successful tool call returns the resource both as text content and, when the result is an object, as `structuredContent`. A failure returns an MCP error result (`isError: true`) whose text is `code: message`, for example `forbidden: not entitled to "whoseeswhat_run_template"`.

The full runnable version of this example is in [`examples/typescript-sdk/connect.ts`](../examples/typescript-sdk/connect.ts).

## Claude Desktop

Claude Desktop reads server definitions from its configuration file (Settings, then Developer, then Edit Config). Add an entry under `mcpServers`:

```json
{
  "mcpServers": {
    "digadop": {
      "url": "https://<your-gateway-host>/mcp",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

See [`examples/claude-desktop/claude_desktop_config.json`](../examples/claude-desktop/claude_desktop_config.json).

## Claude Code

Claude Code reads the same `mcpServers` shape from a project-level `.mcp.json` file at the root of your repository, so the server is available to anyone working in that project:

```json
{
  "mcpServers": {
    "digadop": {
      "url": "https://<your-gateway-host>/mcp",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

See [`examples/claude-code/.mcp.json`](../examples/claude-code/.mcp.json).

## Cursor

Cursor reads MCP server definitions from `.cursor/mcp.json` (per-project) or `~/.cursor/mcp.json` (global), using the same `mcpServers` shape:

```json
{
  "mcpServers": {
    "digadop": {
      "url": "https://<your-gateway-host>/mcp",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

See [`examples/cursor/mcp.json`](../examples/cursor/mcp.json).

## Notes for every client

- The entitlement gate runs both at tool discovery (`listTools`) and at call time, so a tool you are not entitled to is neither listed nor callable.
- Treat your Bearer token the way you would any other credential: never paste it into a chat, a ticket, a document, or a public repository.
