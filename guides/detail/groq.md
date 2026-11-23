# Groq: traps and sources

What goes wrong with Groq, and the pages this guide read. The steps are in [Groq](../groq.md).

## Traps

| Trap | What happens |
| --- | --- |
| Tokens per minute | A coding agent's long context counts against the free plan's 8K tokens per minute; past it, requests return 429. |
| One agent request | One OpenCode agent request measured 16,387 tokens (source: a live test on 2026-11-20). That is twice the free plan's 8K tokens per minute per model ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-20), so the request failed with a 413 or 429 tokens-per-minute error. Use Groq Free for short calls, not an agent loop. |
| `retry-after` | Groq sets this header, in seconds, only on a 429 ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-12). Wait that long before a retry. |
| Spend limits | Groq's spend limit exists only on paid plans, and its tracking lags 10 to 15 minutes ([Spend Limits](https://console.groq.com/docs/spend-limits), read 2026-11-12). Staying on Free is the stronger stop. |
| Developer plan billing | After upgrade, Groq bills at month end or as usage crosses $1, $10, $100, $500 and $1,000 ([Billing FAQs](https://console.groq.com/docs/billing-faqs), read 2026-11-12). |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Rate Limits](https://console.groq.com/docs/rate-limits) | 2026-11-12 |
| [OpenAI Compatibility](https://console.groq.com/docs/openai) | 2026-11-12 |
| [OpenCode + Groq](https://console.groq.com/docs/coding-with-groq/opencode) | 2026-11-12 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |
| [Spend Limits](https://console.groq.com/docs/spend-limits) | 2026-11-12 |
| [Billing FAQs](https://console.groq.com/docs/billing-faqs) | 2026-11-12 |
| [Examples](https://console.groq.com/docs/examples) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |

</details>
