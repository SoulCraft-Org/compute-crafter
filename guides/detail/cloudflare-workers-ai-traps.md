# Cloudflare Workers AI: traps and sources

What goes wrong with Cloudflare Workers AI, and the pages this guide read. The set up is in [Cloudflare Workers AI detail](cloudflare-workers-ai.md). The diagram and wiring are in [Cloudflare Workers AI](../cloudflare-workers-ai.md).

## Traps

| Trap | What happens |
| --- | --- |
| Spending-limit CLI | `cf billing spend-policies` with `--action usage_block` takes only `--product-id workers` or `durable_objects` ([cf CLI spending limits](https://developers.cloudflare.com/billing/manage/spend-management/cli/), read 2026-11-20) |
| Neurons per model | Each model spends Neurons at its own rate. Read its row before a long run |
| A limit is not a cap | Reporting and blocking take time, so an invoice can pass a limit ([Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/), read 2026-11-20) |
| Token scope | A custom token needs `Workers AI - Read` and `Workers AI - Edit`, and nothing else ([REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), read 2026-11-12) |
| Production account | Test in an account that serves no production Worker, so a test cannot spend its allocation |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) | 2026-11-24 |
| [MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/) | 2026-11-24 |
| [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) | 2026-11-12 |
| [Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/) | 2026-11-20 |
| [cf CLI spending limits](https://developers.cloudflare.com/billing/manage/spend-management/cli/) | 2026-11-20 |
| [AI Gateway spend limits](https://developers.cloudflare.com/ai-gateway/features/spend-limits/) | 2026-11-20 |
| [General commands](https://developers.cloudflare.com/workers/wrangler/commands/general/) | 2026-11-12 |
| [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) | 2026-11-12 |
| [OpenAI compatible endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-20 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |

</details>
