# OpenRouter: traps and sources

What goes wrong with OpenRouter, and the pages this guide read. The steps are in [OpenRouter](../openrouter.md).

## Traps

| Trap | What happens |
| --- | --- |
| Negative balance | A negative credit balance returns 402 errors, even for free models, until credits bring it above zero ([Limits](https://openrouter.ai/docs/api/reference/limits), read 2026-11-12). |
| Missing `:free` suffix | A model ID without `:free` is the paid variant and spends credits. |
| Auto top-up | It refills the balance when it falls below your threshold; leave it off. |
| Credit expiry | OpenRouter can expire unused credits one year after purchase ([Frequently Asked Questions](https://openrouter.ai/docs/faq), read 2026-11-12). |
| Heavy bursts | Cloudflare's DDoS protection blocks requests that far exceed reasonable use ([Limits](https://openrouter.ai/docs/api/reference/limits), read 2026-11-12). |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Limits](https://openrouter.ai/docs/api/reference/limits) | 2026-11-12 |
| [Frequently Asked Questions](https://openrouter.ai/docs/faq) | 2026-11-12 |
| [Quickstart](https://openrouter.ai/docs/quickstart) | 2026-11-12 |
| [MCP](https://openrouter.ai/docs/guides/overview/mcp-server) | 2026-11-12 |
| [Management API Keys](https://openrouter.ai/docs/guides/overview/auth/provisioning-api-keys) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers) | 2026-11-20 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |

</details>
