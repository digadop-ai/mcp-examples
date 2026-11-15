# Connect Digadop Help to Microsoft Copilot Studio

Verified against the Copilot Studio UI as of 2026-10-02.

Basis of that date: the steps and field names below were checked on 2026-10-02 against Microsoft Learn, "Connect your agent to an existing Model Context Protocol (MCP) server" (page updated 2026-08-19), "Create a custom connector from an OpenAPI definition" (page updated 2026-08-27), "Get access to Copilot Studio Standard harness" (page updated 2026-08-03), "Assign user licenses and manage access to Copilot Studio" (page updated 2026-08-03), and "Microsoft Copilot Studio messages and capacity management" (page updated 2026-10-01). They were not clicked through in a live Copilot Studio tenant. Microsoft changes this interface on its own schedule, so treat this date as the last time the wording was confirmed, and re-verify it before you rely on a label.

This guide connects a Copilot Studio agent to the Digadop Help MCP server, so the agent can search and read your Help articles.

Replace `your-digadop-api-host.example.com` below with the host Digadop gives you when your organization gets early access to the Help MCP server. [Contact us](https://digadop.ai/contact/) to request it.

## What you need

- A Copilot Studio User License for the maker who builds this connector. That is Microsoft's per-user seat for Copilot Studio (shown as "Copilot Studio User License" in the Microsoft 365 admin center), separate from the organization's tenant license. You also need a standalone Copilot Studio tenant subscription: Microsoft's Teams plan does not include Power Platform connectors, and this integration uses one.
- Copilot Studio message capacity on the tenant. The tenant administrator needs the tenant's prepaid Copilot Studio capacity license, or pay-as-you-go billing linked to an Azure subscription, before the agent can actually answer a question through this connector. Capacity is pooled across the tenant and is separate from the maker's seat: you can build and test the connection without it, but once the tenant's capacity is exhausted the agent stops answering until capacity is restored.
- Maker access to the Power Platform environment your agent lives in.
- A Digadop Help administrator, who creates the OAuth client in step 1.
- Your Digadop API host, given to you when your organization gets early access. The steps are identical regardless of the host; use yours wherever this guide shows `your-digadop-api-host.example.com`.

Copilot Studio reaches the server through a Power Platform connector, so your organization's Power Platform data policies apply to it. If a policy blocks custom connectors, ask your Power Platform admin to allow this one.

## Step 1: a Digadop Help admin creates the OAuth client

Copilot Studio signs in to Digadop Help with a confidential OAuth client: a client ID plus a client secret. A Digadop Help administrator creates it, for your tenant, in Digadop Help:

1. While signed in to Digadop Help as an administrator, send `POST /oauth/clients` to the Digadop API. Give it the redirect URI Copilot Studio will use, `https://global.consent.azure-apim.net/redirect`.
2. The response carries the `client_id` and the `client_secret`. The secret is shown once, and Digadop Help stores only a hash of it, so copy it straight into your organization's secret store. It cannot be shown again.
3. To retire the client later, send `DELETE /oauth/clients/<client_id>`. It stops working at once.

Never paste the secret into a chat, a ticket, a document, or a shared channel.

## Step 2: add the server in Copilot Studio (recommended path)

1. Open your agent in Copilot Studio and go to the **Tools** page.
2. Select **Add a tool**, then **New tool**, then **Model Context Protocol**. The MCP onboarding wizard opens.
3. Fill in **Server name** (for example `Digadop Help`), **Server description** (for example "Searches and reads the organization's Digadop Help articles"), and **Server URL**: `https://your-digadop-api-host.example.com/mcp/help`.
4. Under authentication choose **OAuth 2.0**, then the **Manual** type, and fill in:
   - **Client ID** and **Client secret**: the two values from step 1.
   - **Authorization URL**: `https://your-digadop-api-host.example.com/oauth/authorize`
   - **Token URL template**: `https://your-digadop-api-host.example.com/oauth/token`
   - **Refresh URL**: `https://your-digadop-api-host.example.com/oauth/token`
   - **Scopes**: leave empty.
5. Select **Create**. Copilot Studio shows a **callback URL**. Compare it with the redirect URI you gave in step 1. If they differ, ask the administrator to create a replacement client using the URL Copilot Studio shows, and enter the new client ID and secret.
6. Select **Next**. On **Add tool**, select **Create a new connection**, sign in to Digadop Help when prompted, then select **Add to agent**.

Digadop Help serves the streamable MCP transport, which is the one Copilot Studio supports.

## Step 2, alternative: import the connector file

If you prefer a custom connector, or your organization's process requires one:

1. On the agent's **Tools** page select **Add a tool**, then **New tool**, then **Custom connector**. You are taken to Power Apps.
2. Select **New custom connector**, then **Import OpenAPI file**.
3. Choose [`copilot-studio-agent-template.json`](../examples/copilot-studio/copilot-studio-agent-template.json) from this repository and select **Import**, then **Continue**.
4. On the connector's security settings, enter the **Client ID** and **Client secret** from step 1, and save the connector. The authorization and token URLs come from the file: edit them to match your own host before importing.
5. Create a connection to the connector, sign in to Digadop Help when prompted, and add the connector to your agent.

The template contains exactly three addresses: the authorization URL, the token URL, and the MCP endpoint. These are the addresses the Digadop API advertises at `/.well-known/oauth-authorization-server`.

## Check that it works

Ask your agent a question your Help articles answer. In the agent's test pane you should see the Digadop Help tools called. If sign-in fails with `invalid_client`, the client ID or secret is wrong, or the client was revoked; ask the administrator to create a new one.
