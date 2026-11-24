# Groq: free tier, guard, traps and sources

What the Groq guide moved out of its page. The diagram and wiring are in [Groq](../groq.md).

## Free tier

| Item | Figure | Source |
| --- | --- | --- |
| Per-model limits | 30 requests a minute, 1K a day, 8K tokens a minute, 200K tokens a day | [Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-24 |
| Plan label | The page calls these base limits and does not say which plan tab is open. Read your own at the console's limits page | [Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-24 |
| Other tools | Base URL `https://api.groq.com/openai/v1` with `GROQ_API_KEY` | [OpenAI Compatibility](https://console.groq.com/docs/openai), read 2026-11-12 |

## Guard

Past a limit the API returns `429 Too Many Requests`, with `retry-after` in seconds ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-24). Upgrading needs a payment method and bills later, with no immediate charge ([Billing FAQs](https://console.groq.com/docs/billing-faqs), read 2026-11-24). Staying on Free is the stronger stop.

## Traps

| Trap | What happens |
| --- | --- |
| One agent request | One OpenCode agent request measured 16,387 tokens in a live test on 2026-11-20 (source: our own test). That is twice 8K tokens a minute, so it failed with a 413 or 429 ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-20). Use Free for short calls, not an agent loop |
| Spend limits | They exist only on paid plans, and tracking lags 10 to 15 minutes ([Spend Limits](https://console.groq.com/docs/spend-limits), read 2026-11-12) |
| Developer billing | Invoices come at month end or as cumulative usage crosses $1, $10, $100, $500 and $1,000 ([Billing FAQs](https://console.groq.com/docs/billing-faqs), read 2026-11-24) |
| Key handling | Keep the key in the console's copy step and your secret store, never in a chat or a command |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Rate Limits](https://console.groq.com/docs/rate-limits) | 2026-11-24 |
| [Billing FAQs](https://console.groq.com/docs/billing-faqs) | 2026-11-24 |
| [Examples](https://console.groq.com/docs/examples) | 2026-11-24 |
| [OpenAI Compatibility](https://console.groq.com/docs/openai) | 2026-11-12 |
| [OpenCode + Groq](https://console.groq.com/docs/coding-with-groq/opencode) | 2026-11-12 |
| [Spend Limits](https://console.groq.com/docs/spend-limits) | 2026-11-12 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |
| [models.dev](https://models.dev) | 2026-11-12 |

</details>
