# Connect Digadop Help to Gemini Enterprise / Gemini Business (admin setup)

Verified against Google's Gemini Enterprise custom MCP server documentation (Google Cloud docs and the Gemini Enterprise Business Edition help page) as of 2026-09-26.

Consumer Gemini has no custom MCP support, so this guide targets Gemini Enterprise and Gemini Business only; do not attempt this on the consumer product.

This is the admin path for adding the Digadop Help MCP server as a custom MCP server connection. It was written from Google's published pages, not from a live Gemini tenant: buying a Gemini Business tenant is a separate decision, and the steps below that only a live tenant can confirm are listed at the end.

Replace `your-digadop-api-host.example.com` below with the host Digadop gives you when your organization gets early access to the Help MCP server. [Contact us](https://digadop.ai/contact/) to request it.

## What Google requires of the server

These come from Google's pages:

| Google requirement | Why it matters |
| --- | --- |
| StreamableHTTP transport only; the legacy SSE transport is not supported | Digadop's MCP servers speak StreamableHTTP, so this is already satisfied. |
| A publicly trusted TLS certificate; self-signed certificates are rejected | Your host must present a certificate from a public CA. |
| Limit enabled actions to 100 at a time | Choose which tools to enable in Gemini's form; keep the enabled count under 100. |
| An HTTPS MCP server URL, usually ending in `/mcp` | Digadop's endpoint shape matches this. |

## Who can do this

- Gemini Enterprise, Business Edition: a Team administrator (Settings & help, Team, Manage team, Connected apps, Add MCP Server).
- Gemini Enterprise in Google Cloud: the Discovery Engine Editor role (`roles/discoveryengine.editor`), an organization policy that allows a Custom MCP data store, and the server, authorization, and token domains allowed by that policy.

## Steps (Business Edition)

1. Sign in to Gemini Enterprise, Business edition, and open Settings & help.
2. Go to Team, then Manage team, then Connected apps, and click Add MCP Server.
3. Enter the server URL and a name, then click Next. For the Digadop Help surface the URL is `https://your-digadop-api-host.example.com/mcp/help`.
4. Choose OAuth 2.0 and fill in the fields below.
5. Tick Enable PKCE Support. Digadop's token endpoint advertises only `S256` code challenges.
6. Select the data connector multi-region location, enter a data connector name, and click Add.
7. Register Google's redirect URI with the Digadop client: `https://vertexaisearch.cloud.google.com/oauth-redirect`.
8. Click Verify Auth, then enable the actions you want. Keep the enabled set under 100.

| Gemini field | Value |
| --- | --- |
| Server URL | `https://your-digadop-api-host.example.com/mcp/help` |
| Authorization URL | `https://your-digadop-api-host.example.com/oauth/authorize` |
| Token URL | `https://your-digadop-api-host.example.com/oauth/token` |
| Client ID | Issued by Digadop for this connection (never shared between organizations) |
| Client Secret | Issued with the client, entered only in Gemini's form, never written to a file or a chat |
| Scopes | None are advertised in Digadop's metadata (`scopes_supported` is absent) |

These URLs match the live `/.well-known/oauth-authorization-server` document Digadop serves for your host. Re-read it before an install, since it is the source of truth.

## Not verified without a live Gemini tenant

- Whether Gemini's form accepts a client with no secret (Digadop also advertises the public `none` auth method, but Google's pages list Client Secret as a field).
- Whether Verify Auth completes against the Digadop authorize endpoint end to end.
- The exact wording of Gemini's screens, which Google may change. The date at the top is the date the steps were read, not a guarantee they are unchanged.
