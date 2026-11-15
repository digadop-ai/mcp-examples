# Digadop MCP examples

Connect your own AI agent or assistant to Digadop's [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers over Salesforce: **Who Sees What** (access and permission auditing) and **Digadop Help** (in-app help, search, and grounded Q&A).

This repository is example code and setup guides, not a product. It shows how to connect Claude Desktop, Claude Code, Cursor, Microsoft Copilot Studio, and Gemini Enterprise/Business to our MCP servers, and it links to the canonical, maintained reference docs for each server.

## The servers

- **Who Sees What MCP server**, live today on Who Sees What Enterprise. A hosted MCP server at `https://whoseeswhat.com/mcp`, reached with a self-serve Bearer credential you create yourself (organization menu, then API access). It lets an agent run access audits, search for users, objects, and records, compare orgs, and export reports. See the canonical reference: [whoseeswhat.com/developers/mcp](https://whoseeswhat.com/developers/mcp/) and the [FAQ entry](https://whoseeswhat.com/faq/). Professional plans do not include MCP access.
- **Digadop Help tools on the Who Sees What MCP server**, also live today. If your org holds both a Who Sees What Enterprise credential and a Digadop Help entitlement, the same `https://whoseeswhat.com/mcp` server also serves `help_*` tools (list and search Help content and layouts, analyze who sees what Help, and ask the Help assistant). See the live reference above for that tool catalog; it is not documented further in this repository.
- **The standalone Digadop Help MCP server**, early access, and the one this repository documents. A separate server, dedicated to Digadop Help, that lets an agent search and read an organization's Help articles with a grounding-attestation tool so a client can check whether a candidate answer is actually supported by the article it cites (see [`docs/help-mcp-client-contract.md`](docs/help-mcp-client-contract.md)). It is not self-serve yet, and it is not the same tool catalog as the `help_*` tools on the Who Sees What server above. If you want early access, or want to tell us how you'd use it, [contact us](https://digadop.ai/contact/).

Every host shown in this repository's generic examples (the TypeScript SDK sample, the vendor setup guides) is a placeholder, written as `https://<your-gateway-host>/mcp` or similar. Substitute your own endpoint: for Who Sees What that is the address shown on your Enterprise org's API access page, and for Digadop Help we will give you one once your organization has early access.

## What's in this repo

| Path | What it covers |
| --- | --- |
| [`docs/help-mcp-client-contract.md`](docs/help-mcp-client-contract.md) | The Digadop Help MCP tool catalog and its one load-bearing published limitation: the server attests grounding, but it does not and cannot compel any client to honor the attestation. |
| [`docs/connect-any-client.md`](docs/connect-any-client.md) | A generic "connect any MCP client" walkthrough, covering the TypeScript MCP SDK and the `mcpServers` JSON block, written up for Claude Desktop, Claude Code, and Cursor. |
| [`docs/copilot-studio-setup.md`](docs/copilot-studio-setup.md) | Step-by-step guide to connecting a Microsoft Copilot Studio agent to a Digadop MCP server. |
| [`docs/gemini-business-setup.md`](docs/gemini-business-setup.md) | Step-by-step admin guide to connecting Gemini Enterprise or Gemini Business to a Digadop MCP server. |
| [`examples/`](examples/) | The config files and code referenced by the docs above, ready to copy and edit. |

## Products

- [Who Sees What](https://whoseeswhat.com/), Salesforce access and permission auditing.
- [Digadop Help](https://digadop.ai/), in-app help for Salesforce, in context.
- [digadop-ai on GitHub](https://github.com/digadop-ai), our other public work.

## Status and scope

This is phase 1 of a staged rollout: generic connect guides and the servers' published contracts, no internal infrastructure, no customer data, no credentials. A ChatGPT connector guide and additional production-endpoint detail for Digadop Help will follow in later phases.

Found a problem with one of these guides, or connected a client we don't cover yet? [Contact us](https://digadop.ai/contact/) or open an issue.
