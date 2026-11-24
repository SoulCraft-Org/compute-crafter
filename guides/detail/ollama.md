# Ollama: plans, set up, traps and sources

What the Ollama guide moved out of its page. The diagram and wiring are in [Ollama](../ollama.md).

## Plans

| Plan | Price | Included usage credits | Concurrent requests |
| --- | --- | --- | --- |
| Pay as you go | $0 ([Pricing](https://ollama.com/pricing), read 2026-11-20) | None | 3 |
| Pro | $20 a month, or $200 a year ([Pricing](https://ollama.com/pricing), read 2026-11-20) | $60 a month | 3 |
| Max | $100 a month ([Pricing](https://ollama.com/pricing), read 2026-11-20) | $300 a month | 10 |

Included usage resets monthly on the subscription's start day and does not roll over. [catalog/plans.json](../../catalog/plans.json) holds each plan as a row.

## Set up

1. Install Ollama from [ollama.com/download](https://ollama.com/download), then run `ollama signin` and sign in through the browser ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20).
2. Add usage credits or a plan on ollama.com first. Cloud models need them.
3. Pick a model by its `:cloud` name, such as `gemma4:cloud`. `ollama launch opencode` and `ollama launch claude` set the base URL for you ([Claude Code](https://docs.ollama.com/integrations/claude-code), [OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20).
4. Read your remaining included and purchased credits before a long run. Your shell supplies the key from your secret store ([Usage](https://docs.ollama.com/cloud/usage), read 2026-11-20).

## Traps

| Trap | What happens |
| --- | --- |
| Pay as you go is not free cloud | The plan has no included cloud usage. In a test on 2026-11-20, every cloud model returned HTTP 402 with no credits. Add credits or a plan before the first call |
| Two model names | Direct calls to `ollama.com` use the name `/api/tags` lists, such as `gemma4:31b`. The app, CLI and local API use the `:cloud` name ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20) |
| Desktop app skips the variables | A local session in the Claude Desktop App gets its own `ANTHROPIC_BASE_URL`, whatever your shell sets ([Desktop docs](https://code.claude.com/docs/en/desktop), read 2026-11-24). Use the Ollama app's Connect Claude |
| Auth variables in a dotfile | Ollama's direct cloud recipe sets `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL`. These outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-20). Set them per command, never in a dotfile |
| Claude settings win | Claude settings can override shell variables, so check `/status` after a change |
| OpenCode config shape | Ollama's page shows OpenCode 1's `provider`, `npm` and `options`. OpenCode 2 still loads it, but writes `providers`, `package` and `settings` ([Migrate from V1](https://opencode.ai/docs/migrate-v1), read 2026-11-20) |
| Concurrency | Requests past the plan's limit queue; a full queue rejects them ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Off-peak rates | Some models list a lower Off-Peak rate, outside 12:00 and 18:00 UTC on weekdays and all day on weekends ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Data | Ollama states a zero data retention policy for cloud prompts and responses, and never trains on them ([Cloud FAQ](https://docs.ollama.com/cloud/faq), read 2026-11-20). It hosts mainly in the United States and may route to Europe |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Pricing](https://ollama.com/pricing) | 2026-11-20 |
| [Creating an API key](https://docs.ollama.com/cloud/api) | 2026-11-20 |
| [Models](https://docs.ollama.com/cloud/models) | 2026-11-20 |
| [Usage](https://docs.ollama.com/cloud/usage) | 2026-11-20 |
| [Cloud FAQ](https://docs.ollama.com/cloud/faq) | 2026-11-20 |
| [Claude Code](https://docs.ollama.com/integrations/claude-code) | 2026-11-24 |
| [Claude Desktop](https://docs.ollama.com/integrations/claude-desktop) | 2026-11-24 |
| [OpenCode](https://docs.ollama.com/integrations/opencode) | 2026-11-20 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [Migrate from V1](https://opencode.ai/docs/migrate-v1) | 2026-11-20 |
| [models.dev](https://models.dev) | 2026-11-24 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-20 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |

</details>
