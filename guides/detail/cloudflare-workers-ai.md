# Cloudflare Workers AI: guard and set up

What the Cloudflare Workers AI guide moved out of its page. The diagram and wiring are in [Cloudflare Workers AI](../cloudflare-workers-ai.md).

## Guard

| Spend | Stop | Source |
| --- | --- | --- |
| Workers Free | "Further operations will fail with an error" past 10,000 Neurons a day | [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-24 |
| Workers Paid | $5 a month minimum, then $0.011 per 1,000 Neurons above the allocation | [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/), read 2026-11-12; [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-24 |
| Account spending limits | A Workers limit excludes Workers AI | [Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/), read 2026-11-20 |
| AI Gateway spend limit | Answers `429` once the budget is spent. A burst can pass it briefly | [AI Gateway spend limits](https://developers.cloudflare.com/ai-gateway/features/spend-limits/), read 2026-11-20 |

## Set up

| Step | What |
| --- | --- |
| 1. Login | `--use-keyring` keeps the OAuth credentials in the OS keychain, not a plaintext file ([General commands](https://developers.cloudflare.com/workers/wrangler/commands/general/), read 2026-11-12) |
| 2. Token | In the dashboard, open Workers AI, **Use REST API**, then **Create a Workers AI API Token**. Copy the Account ID too ([REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), read 2026-11-12) |
| 3. OpenCode | The catalog reads `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_KEY` ([models.dev](https://models.dev), read 2026-11-20). The shared background service does not see your shell ([CLI providers](https://opencode.ai/docs/cli/providers), read 2026-11-20) |
| 4. Other tools | Base URL `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1`, token as bearer ([OpenAI compatible endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/), read 2026-11-12) |
| 5. MCP | The API MCP server signs in with OAuth and asks which permissions to grant. A CI token goes in an `Authorization` header. The docs server is `https://docs.mcp.cloudflare.com/mcp` ([MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/), read 2026-11-24) |

Traps and sources: [Cloudflare Workers AI traps and sources](cloudflare-workers-ai-traps.md).
