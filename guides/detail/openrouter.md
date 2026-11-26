# OpenRouter: set up, traps and sources

What the OpenRouter guide moved out of its page. The diagram and wiring are in [OpenRouter](../openrouter.md).

## Set up

1. The sign-in creates a dedicated key that expires within 7 days and starts with a $10 spend cap ([MCP](https://openrouter.ai/docs/guides/overview/mcp-server), read 2026-11-24). Lower the cap on the approval screen if you only use `:free` models.
2. OpenCode: `opencode auth login openrouter`, then pick a method and run `/models`. A key goes in at the hidden prompt, never on the command line ([OpenCode 2](../README.md#opencode-2)). A model reference is the provider prefix plus the full OpenRouter ID, such as `openrouter/<vendor>/<model>:free`.
3. OpenCode 2 lists MCP servers under `mcp.servers` in `~/.config/opencode/opencode.jsonc`, and runs the OAuth flow on first use ([MCP servers](https://opencode.ai/docs/mcp-servers), read 2026-11-24).
4. Any other OpenAI-compatible tool uses base URL `https://openrouter.ai/api/v1` with `OPENROUTER_API_KEY` in its environment ([Quickstart](https://openrouter.ai/docs/quickstart), read 2026-11-12).

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
| [MCP](https://openrouter.ai/docs/guides/overview/mcp-server) | 2026-11-24 |
| [Management API Keys](https://openrouter.ai/docs/guides/overview/auth/provisioning-api-keys) | 2026-11-12 |
| [OpenRouter: OpenCode](https://openrouter.ai/docs/cookbook/coding-agents/opencode-integration) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers) | 2026-11-24 |

</details>
