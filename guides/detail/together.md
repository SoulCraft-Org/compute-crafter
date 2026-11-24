# Together AI: guard, set up, traps and sources

What the Together AI guide moved out of its page. The diagram and wiring are in [Together AI](../together.md).

## Guard

| Item | Figure | Source |
| --- | --- | --- |
| First purchase | At least $15; later ones at least $5 | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Expiry | Prepaid credits have no expiration date | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Zero balance | "API access is suspended until you add credits" | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Auto-recharge | Needs a card as the default payment method. It "does not cap spend" | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24; [Spend controls](https://docs.together.ai/docs/billing-spend-controls), read 2026-11-12 |

## Set up

| Step | What |
| --- | --- |
| 1. Sign in | At [api.together.ai](https://api.together.ai/signin). Pick the provider you will keep |
| 2. Balance | Buy the smallest balance you need, with auto-recharge off. A purchase is spend: clear it under your own money rule first |
| 3. Key | Create it in Together's settings and keep it in a password manager |
| 4. OpenCode | Paste the key at the hidden prompt ([OpenCode 2](../README.md#opencode-2)). Other tools use base URL `https://api.together.ai/v1` ([OpenAI compatibility](https://docs.together.ai/docs/openai-api-compatibility), read 2026-11-12) |
| 5. Claude Desktop App | Install Together Link, run `togetherlink configure`, then `togetherlink claude-desktop`. It needs macOS or Linux, and the app in `/Applications` or `~/Applications` ([Together Link](https://docs.together.ai/docs/togetherlink), read 2026-11-24) |

## Traps

| Trap | What happens |
| --- | --- |
| Late metering | "The cut-off does not guarantee an exact spending cap" ([Spend controls](https://docs.together.ai/docs/billing-spend-controls), read 2026-11-12) |
| No budgets or alerts | They are planned, not available. The balance cut-off is the only hard stop |
| Sign-in provider is fixed | A second provider with the same email fails. Moving needs a new account and support |
| Anthropic key in Together Link | An optional Anthropic API key lets the auto router send hard requests to Claude Opus, billed to Anthropic ([Together Link](https://docs.together.ai/docs/togetherlink), read 2026-11-24). Leave it unset |
| OpenCode version | Together Link needs OpenCode 2. Its Desktop mode keeps a profile that stores your key locally |
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
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |

</details>
