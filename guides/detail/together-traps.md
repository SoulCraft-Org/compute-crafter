# Together AI: traps and sources

What goes wrong with Together AI, and the pages this guide read. The set up is in [Together AI detail](together.md). The diagram and wiring are in [Together AI](../together.md).

## Traps

| Trap | What happens |
| --- | --- |
| Late metering | "The cut-off does not guarantee an exact spending cap" ([Spend controls](https://docs.together.ai/docs/billing-spend-controls), read 2026-11-12) |
| No budgets or alerts | They are planned, not available. The balance cut-off is the only hard stop |
| Sign-in provider is fixed | A second provider with the same email fails. Moving needs a new account and support |
| Anthropic key in Together Link | An optional Anthropic API key lets the auto router send hard requests to Claude Opus, billed to Anthropic ([Together Link](https://docs.together.ai/docs/togetherlink), read 2026-11-24). Leave it unset |
| OpenCode version | Together Link needs OpenCode 2 and stops on OpenCode 1 ([Together Link](https://docs.together.ai/docs/togetherlink), read 2026-11-12). Its Desktop mode keeps a profile that stores your key locally |
| Docs MCP is not inference | It reads documentation only. It names OpenCode and the Claude Code CLI, not the Desktop App ([Docs MCP](https://docs.together.ai/docs/mcp), read 2026-11-24) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Billing and credits](https://docs.together.ai/docs/billing-credits) | 2026-11-24 |
| [Docs MCP](https://docs.together.ai/docs/mcp) | 2026-11-24 |
| [Together Link](https://docs.together.ai/docs/togetherlink) | 2026-11-24 |
| [Spend controls](https://docs.together.ai/docs/billing-spend-controls) | 2026-11-12 |
| [Account management](https://docs.together.ai/docs/account-management) | 2026-11-12 |
| [OpenAI API compatibility](https://docs.together.ai/docs/openai-api-compatibility) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |

</details>
