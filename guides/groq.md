# Groq

Groq gives a Claude Code or OpenCode user fast hosted open-weight models, such as `openai/gpt-oss-120b`, on a free plan.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with a GroqCloud console sign-in; a payment method is asked for only on upgrade to Developer ([Billing FAQs](https://console.groq.com/docs/billing-faqs), read 2026-11-12). | Free plan, per model: `openai/gpt-oss-120b`, `openai/gpt-oss-20b` and `qwen/qwen3.8-27b` each get 30 requests per minute, 1K per day, 8K tokens per minute and 200K tokens per day ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-12). | `GROQ_API_KEY`, from a key made in the console. | None hosted. Groq's Examples page lists a local [Groq MCP Server](https://github.com/groq/groq-mcp-server) ([Examples](https://console.groq.com/docs/examples), read 2026-11-12). | `groq` ([models.dev](https://models.dev), read 2026-11-12), through `/connect`. | The Free plan stops with `429 Too Many Requests` at a limit ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-12). Adding a payment method to upgrade to Developer removes it. See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Set up

1. Sign in at [console.groq.com](https://console.groq.com) and create an API key there. Keep the key in the console's copy step and your secret store; never paste it into a chat or a command.

2. Connect Groq in OpenCode. OpenCode saves the key to `~/.local/share/opencode/auth.json` ([OpenCode + Groq](https://console.groq.com/docs/coding-with-groq/opencode), read 2026-11-12).

```bash
opencode auth login
```

Pick Groq, enter the key at the hidden prompt, then run `/models` inside OpenCode and pick `groq/openai/gpt-oss-120b`.

3. Any other OpenAI-compatible tool uses base URL `https://api.groq.com/openai/v1` with `GROQ_API_KEY` set in its environment ([OpenAI Compatibility](https://console.groq.com/docs/openai), read 2026-11-12).

4. Read your own organization's limits on the console's limits page before a long run. The rate-limit page points there for exact values.

## Traps

| Trap | What happens |
| --- | --- |
| Tokens per minute | A coding agent's long context counts against the free plan's 8K tokens per minute; past it, requests return 429. |
| `retry-after` | Groq sets this header, in seconds, only on a 429 ([Rate Limits](https://console.groq.com/docs/rate-limits), read 2026-11-12). Wait that long before a retry. |
| Spend limits | Groq's spend limit exists only on paid plans, and its tracking lags 10 to 15 minutes ([Spend Limits](https://console.groq.com/docs/spend-limits), read 2026-11-12). Staying on Free is the stronger stop. |
| Developer plan billing | After upgrade, Groq bills at month end or as usage crosses $1, $10, $100, $500 and $1,000 ([Billing FAQs](https://console.groq.com/docs/billing-faqs), read 2026-11-12). |

## Sources

| Page | Read |
| --- | --- |
| [Rate Limits](https://console.groq.com/docs/rate-limits) | 2026-11-12 |
| [OpenAI Compatibility](https://console.groq.com/docs/openai) | 2026-11-12 |
| [OpenCode + Groq](https://console.groq.com/docs/coding-with-groq/opencode) | 2026-11-12 |
| [Spend Limits](https://console.groq.com/docs/spend-limits) | 2026-11-12 |
| [Billing FAQs](https://console.groq.com/docs/billing-faqs) | 2026-11-12 |
| [Examples](https://console.groq.com/docs/examples) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
