# Ollama: guard, set up, traps and sources

What the Ollama guide moved out of its page. The diagram and wiring are in [Ollama](../ollama.md).

## Guard

Cloud requests use included plan credits first, then purchased ones ([Pricing](https://ollama.com/pricing), read 2026-11-20). With neither, a cloud request returned HTTP 402 "Add usage credits or subscribe" in a test on 2026-11-20. Buying credits raises the stop by their amount.

## Set up

1. Install Ollama from [ollama.com/download](https://ollama.com/download), then run `ollama signin` and sign in through the browser ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20).
2. Add usage credits or a plan on ollama.com first. Cloud models need them.
3. Pick a model by its `:cloud` name, such as `gemma4:cloud`. `ollama launch opencode` sets the base URL for you ([OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20).
4. For direct calls to `https://ollama.com/api`, make a key in settings and set `OLLAMA_API_KEY` ([Creating an API key](https://docs.ollama.com/cloud/api), read 2026-11-20).
5. Read your remaining credits before a long run. Your shell supplies the key from your secret store ([Usage](https://docs.ollama.com/cloud/usage), read 2026-11-20).

## Traps

| Trap | What happens |
| --- | --- |
| Pay as you go is not free cloud | The plan has no included cloud usage. In a test on 2026-11-20, every cloud model returned HTTP 402 with no credits. Add credits or a plan before the first call |
| Two model names | Direct calls to `ollama.com` use the name `/api/tags` lists, such as `gemma4:31b`. The app, CLI and local API use the `:cloud` name ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20) |
| Desktop app skips the variables | A local session in the Claude Desktop App gets its own `ANTHROPIC_BASE_URL`, whatever your shell sets ([Desktop docs](https://code.claude.com/docs/en/desktop), read 2026-11-24). Use the Ollama app's Connect Claude |
| Claude Code CLI recipe | Ollama's Claude Code page sets `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL`, and says Claude settings can override shell variables ([Claude Code](https://docs.ollama.com/integrations/claude-code), read 2026-11-24). These outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-20). Never put them in a dotfile |
| OpenCode config shape | Ollama's page shows OpenCode 1's `provider`, `npm` and `options` ([OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20). OpenCode 2 still loads it, but writes `providers`, `package` and `settings` ([Migrate from V1](https://opencode.ai/docs/migrate-v1), read 2026-11-20) |
| Concurrency | Requests past the plan's limit queue; a full queue rejects them ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Off-peak rates | Some models list a lower Off-Peak rate, outside 12:00 and 18:00 UTC on weekdays and all day on weekends ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Data | Ollama states a zero data retention policy for cloud prompts and responses, and never trains on them ([Cloud FAQ](https://docs.ollama.com/cloud/faq), read 2026-11-20). It hosts mainly in the United States and may route to Europe ([Pricing](https://ollama.com/pricing), read 2026-11-20) |

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
| [OpenCode](https://docs.ollama.com/integrations/opencode) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [Migrate from V1](https://opencode.ai/docs/migrate-v1) | 2026-11-20 |
| [models.dev](https://models.dev) | 2026-11-24 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-20 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |

</details>
