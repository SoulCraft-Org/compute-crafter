# Together AI: traps and sources

What goes wrong with Together AI, and the pages this guide read. The steps are in [Together AI](../together.md).

## Traps

| Trap | What happens |
| --- | --- |
| Auto-recharge | It charges your card to refill the balance each time, so the balance stops being a cap. |
| Late metering | "The cut-off does not guarantee an exact spending cap": some usage lands after the balance hits zero ([Spend controls](https://docs.together.ai/docs/billing-spend-controls), read 2026-11-12). |
| No budgets or alerts | Organization and project budgets and spend alerts are planned, not available. The balance cut-off is the only hard stop. |
| Sign-in provider is fixed | A second provider with the same email fails with "This email is already linked to another sign-in method". Moving email needs a new account and support. |
| Anthropic key in Together Link | Saving an Anthropic API key lets Together Link send hard requests to Claude Opus, billed to that Anthropic account. Leave it unset to stay on Together models. |
| OpenCode version | Together Link needs OpenCode 2 and stops on OpenCode 1 ([Together Link](https://docs.together.ai/docs/togetherlink), read 2026-11-12). |
| Docs MCP is not inference | `docs.together.ai/mcp` reads documentation only. Model calls go through the API key. |
| Desktop profiles | Together Link's Claude Desktop and ChatGPT Desktop modes keep a persistent profile that stores your API key locally. |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Billing and credits](https://docs.together.ai/docs/billing-credits) | 2026-11-12 |
| [Spend controls](https://docs.together.ai/docs/billing-spend-controls) | 2026-11-12 |
| [Account management](https://docs.together.ai/docs/account-management) | 2026-11-12 |
| [OpenAI API compatibility](https://docs.together.ai/docs/openai-api-compatibility) | 2026-11-12 |
| [Coding agent setup (docs MCP)](https://docs.together.ai/docs/mcp) | 2026-11-12 |
| [Together Link](https://docs.together.ai/docs/togetherlink) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |

</details>
