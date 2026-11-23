# Cloudflare Workers AI: traps and sources

What goes wrong with Cloudflare Workers AI, and the pages this guide read. The steps are in [Cloudflare Workers AI](../cloudflare-workers-ai.md).

## Traps

| Trap | What happens |
| --- | --- |
| Plain-text login | Without `--use-keyring`, `wrangler login` writes its OAuth credentials to a plaintext TOML file. |
| Neurons per model | Each model spends Neurons at its own rate. Read the model's row on the pricing page before a long run. |
| Workers Paid | On Paid, use above the daily allocation bills per Neuron instead of failing. |
| Spending limits skip Workers AI | `cf billing spend-policies` with `--action usage_block` takes only `--product-id workers` or `durable_objects` ([cf CLI spending limits](https://developers.cloudflare.com/billing/manage/spend-management/cli/), read 2026-11-20). A Workers limit counts requests and CPU time, and excludes Workers AI ([Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/), read 2026-11-20). |
| AI Gateway as the stop | Route Workers AI through AI Gateway and set a spend limit: it answers `429` once the budget is spent, until the window resets. It is eventually consistent, so a burst can pass the limit briefly ([AI Gateway spend limits](https://developers.cloudflare.com/ai-gateway/features/spend-limits/), read 2026-11-20). |
| A limit is not a cap | A spending limit does not guarantee a maximum invoice: reporting and blocking take time ([Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/), read 2026-11-20). |
| Token scope | A custom token needs both `Workers AI - Read` and `Workers AI - Edit` ([REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), read 2026-11-12). Give it nothing else. |
| Production account | Run Workers AI tests in an account that serves no production Worker, so a test cannot spend its allocation. |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) | 2026-11-12 |
| [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) | 2026-11-12 |
| [Spending limits and alerts](https://developers.cloudflare.com/billing/manage/spend-management/) | 2026-11-20 |
| [cf CLI spending limits](https://developers.cloudflare.com/billing/manage/spend-management/cli/) | 2026-11-20 |
| [AI Gateway spend limits](https://developers.cloudflare.com/ai-gateway/features/spend-limits/) | 2026-11-20 |
| [General commands](https://developers.cloudflare.com/workers/wrangler/commands/general/) | 2026-11-12 |
| [Cloudflare's own MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/) | 2026-11-12 |
| [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) | 2026-11-12 |
| [OpenAI compatible API endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |

</details>
