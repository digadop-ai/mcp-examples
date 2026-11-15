# Digadop Help MCP: client contract and published limitations

This is the client-facing contract for the **standalone** Digadop Help MCP server (`/mcp/help`), early access, not the `help_*` tools already live on the Who Sees What MCP server. If your org has a Who Sees What Enterprise credential plus a Digadop Help entitlement, `https://whoseeswhat.com/mcp` already serves a different Help tool catalog today (`help_list_content`, `help_analyze_content_audience`, and others); see [whoseeswhat.com/developers/mcp](https://whoseeswhat.com/developers/mcp/) for that one. The server documented below is a separate surface, with its own tools and its own grounding-attestation contract, described here. It describes the tools the server exposes, their exact result shapes, and one published limitation every integrator should read before building on this server.

## Tool catalog

`tools/list` on `/mcp/help` returns exactly three read-only tools:

1. `help_search_articles`, tenant-scoped, entitlement-checked article search.
2. `help_get_article`, fetch one article by id. The result carries a `normalizedContentSha256` field (see below).
3. `help_verify_claims`, advisory grounding attestation (see below).

### Note for integrators who allowlist by tool name

If your integration pins an exact set of allowed tool names, make sure `help_verify_claims` is in that set. Nothing about the protocol, the other two tools' schemas, results, or auth changes when it is added; a client that ignores it behaves exactly as it did before the tool existed.

## The published limitation, stated affirmatively

> The Digadop Help MCP server does not verify, filter, or see any MCP client's final answer to the end user. A client that does not call `help_verify_claims` and act on its result may present ungrounded claims; the existence of this tool does not change that.

This is the load-bearing sentence of this contract, and it is deliberately not softened. The MCP protocol gives a tool server no way to compel a client to call a tool or to honor its result. The final prose an AI client (Claude, Microsoft 365 Copilot, or any other MCP host) shows its user is composed client-side, after tool results have left the server. What the server guarantees is exactly what it serves and attests: tool results, and, on request, a deterministic verdict on whether candidate claim-and-quote pairs are grounded in an article's actual content.

A passing acceptance record for this surface certifies one thing, and only one thing: that the Help MCP surface deterministically detects, attests, and reports claim grounding. It does not certify that any third-party client's displayed answer is grounded; that remains the client's responsibility, per this published limitation.

## `help_verify_claims`

Read-only. Attests which of the caller's candidate `{claim, quote}` pairs are grounded in one article's current content. The attestation is bound to `(articleId, normalizedContentSha256)`.

- **Input**: `articleId` (string), `pairs` (a non-empty array of `{claim, quote}` objects, both non-empty strings), `expectedNormalizedContentSha256` (the 64-hex value echoed from `help_get_article`, see below).
- **Result**: `{ articleId, normalizedContentSha256, attestedCount, rejectedCount, attestedPairs, rejectedPairs }`, where each rejected pair carries one of these frozen `reason` codes: `empty-quote`, `absent-from-traced-article`, `near-miss-after-typography-and-case-folding`, `below-minimum-evidential-length`, or `no-content-word-overlap-with-claim`.
- **Verification semantics** (frozen): a pair is attested only when the quote is a verbatim substring of the article content after whitespace-only normalization, the normalized quote carries at least 12 characters, and the quote shares at least one content word with its claim. Paraphrase is rejected as unsupported, never partially credited. Case, punctuation, and typography are never folded for the verdict.
- **`content_sha_drift` error**: the echoed sha did not match the article's current content. The correct client response is to re-fetch `help_get_article` and retry with the fresh `normalizedContentSha256`, not to ignore the error.
- **`answer_grounding_failed` error**: zero pairs survived. This is a deliberate, loud result, never an empty success.
- **Multi-article answers**: call `help_verify_claims` once per source `articleId` and merge the attested sets.
- **Advisory**: the server cannot compel any client to call this tool or to honor its result. Displaying only attested pairs to the end user is the client's responsibility.

## `normalizedContentSha256`

`help_get_article` results carry `normalizedContentSha256`, computed by the server as the sha256 (hex) of the whitespace-normalized serialization of the article result, without the field itself. Clients must echo this server-computed value into `help_verify_claims`; no client needs to (or should) reimplement the normalization, so a `content_sha_drift` refusal can only mean the article content actually changed between the fetch and the verify call.

## Early access

The Digadop Help MCP server is not self-serve today. [Contact us](https://digadop.ai/contact/) for early access, or to tell us how you would use it.
