# OpenRouter: set up, traps and sources

What the OpenRouter guide moved out of its page. The diagram and wiring are in [OpenRouter](../openrouter.md).

## Set up

1. A custom connector: Customize, Connectors, Add custom connector. Enter the name "OpenRouter MCP" and `https://mcp.openrouter.ai/mcp`, leave the OAuth fields blank, then Add and Connect. OpenRouter is not in Claude's directory. Some organizations disallow custom connectors ([OpenRouter MCP](https://openrouter.ai/docs/guides/overview/mcp-server), read 2026-11-24).
2. The Claude Code CLI route: the two `claude mcp` commands on the guide. The login creates a dedicated key. Lower its cap on the approval screen if you only use `:free` models ([MCP](https://openrouter.ai/docs/guides/overview/mcp-server), read 2026-11-12). A server in the CLI's settings reaches the Code tab only, not Cowork ([Claude Desktop MCP](../claude-desktop-mcp.md)).
3. OpenCode: `opencode auth login openrouter`, then pick a method and run `/models`. A key goes in at the hidden prompt, never on the command line ([OpenCode 2](../README.md#opencode-2)). A model reference is the provider prefix plus the full OpenRouter ID, such as `openrouter/<vendor>/<model>:free`.
4. OpenCode 2 lists MCP servers under `mcp.servers` in `~/.config/opencode/opencode.jsonc`, and runs the OAuth flow on first use ([MCP servers](https://opencode.ai/docs/mcp-servers), read 2026-11-24).
5. Any other OpenAI-compatible tool uses base URL `https://openrouter.ai/api/v1` with `OPENROUTER_API_KEY` in its environment ([Quickstart](https://openrouter.ai/docs/quickstart), read 2026-11-12).

## Traps

| Trap | What happens |
| --- | --- |
| Negative balance | A negative credit balance returns 402 errors, even for free models, until credits bring it above zero ([Limits](https://openrouter.ai/docs/api/reference/limits), read 2026-11-12). |
| Missing `:free` suffix | A model ID without `:free` is the paid variant and spends credits. |
| Auto top-up | It refills the balance when it falls below your threshold; leave it off. |
| Credit expiry | OpenRouter can expire unused credits one year after purchase ([Frequently Asked Questions](https://openrouter.ai/docs/faq), read 2026-11-12). |
| Heavy bursts | Cloudflare's DDoS protection blocks requests that far exceed reasonable use ([Limits](https://openrouter.ai/docs/api/reference/limits), read 2026-11-12). |
| Gateway first-party only | OpenRouter guarantees the Claude Desktop App route only with the Anthropic first-party provider ([OpenRouter: Claude Desktop](https://openrouter.ai/docs/cookbook/coding-agents/claude-desktop-integration), read 2026-11-24). |
| Gateway needs no Anthropic account | That page says so. Whether a connector then works is not documented. |

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
| [OpenRouter: Claude Desktop](https://openrouter.ai/docs/cookbook/coding-agents/claude-desktop-integration) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers) | 2026-11-24 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |
| [Claude Desktop on 3P with a gateway](https://claude.com/docs/third-party/claude-desktop/gateway) | 2026-11-24 |

</details>
