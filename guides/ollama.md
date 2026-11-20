# Ollama

Ollama gives a Claude Code or OpenCode user open-weight models in Ollama's cloud, paid per token from usage credits, and the same models on your own hardware for free.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| One account per person, with a sign-in at ollama.com ([Pricing](https://ollama.com/pricing), read 2026-11-20). | Pay as you go costs $0 a month, with no subscription and 3 concurrent requests ([Pricing](https://ollama.com/pricing), read 2026-11-20). It includes no cloud usage: Pay as you go accounts pay for each request with usage credits ([Pricing](https://ollama.com/pricing), read 2026-11-20). Models on your own hardware are always unlimited ([Pricing](https://ollama.com/pricing), read 2026-11-20). | `ollama signin` for the app and CLI. For direct calls to `https://ollama.com/api`, `OLLAMA_API_KEY` from a key made in settings ([Creating an API key](https://docs.ollama.com/cloud/api), read 2026-11-20). | None hosted. Claude Code uses Ollama's Anthropic-compatible API: `ollama launch claude`, or base URL `https://ollama.com` ([Claude Code](https://docs.ollama.com/integrations/claude-code), read 2026-11-20). | Built-in `ollama`, which finds a local server on `127.0.0.1:11434` ([OpenCode providers](https://opencode.ai/docs/providers), read 2026-11-20). `ollama-cloud` reads `OLLAMA_API_KEY` ([models.dev](https://models.dev), read 2026-11-20). | Cloud requests spend only credits. Ollama uses included plan credits first, then purchased credits ([Pricing](https://ollama.com/pricing), read 2026-11-20). With neither, a cloud request returned HTTP 402 "Add usage credits or subscribe" in a test on 2026-11-20. Buying credits raises the stop by their amount. Team's automatic usage billing removes it ([Pricing](https://ollama.com/pricing), read 2026-11-20). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Plans

| Plan | Price | Included usage credits | Concurrent requests | Source |
| --- | --- | --- | --- | --- |
| Pay as you go | $0 | None | 3 | [Pricing](https://ollama.com/pricing), read 2026-11-20 |
| Pro | $20 a month, or $200 a year | $60 a month | 3 | [Pricing](https://ollama.com/pricing), read 2026-11-20 |
| Max | $100 a month | $300 a month | 10 | [Pricing](https://ollama.com/pricing), read 2026-11-20 |

Included usage resets monthly on the subscription's start day and does not roll over ([Pricing](https://ollama.com/pricing), read 2026-11-20). [catalog/plans.json](../catalog/plans.json) holds each plan as a row.

## Set up

1. Install Ollama from [ollama.com/download](https://ollama.com/download), then sign in through the browser ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20).

```bash
ollama signin
```

2. Stay on the free path with a local model. Claude Code and OpenCode need a context window of 64k tokens or more ([OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20). Check free disk with `df -h ~` before a pull.

```bash
ollama pull <model>
```

3. Turn cloud off if you want a hard local-only mode. Set `"disable_ollama_cloud": true` in `~/.ollama/server.json`, or `OLLAMA_NO_CLOUD=1`, then restart Ollama ([FAQ](https://docs.ollama.com/faq), read 2026-11-20). The log then shows `Ollama cloud disabled: true`.

4. Start Claude Code or OpenCode through Ollama. Each command picks a model and sets the base URL for you ([Claude Code](https://docs.ollama.com/integrations/claude-code), [OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20).

```bash
ollama launch claude
```

```bash
ollama launch opencode
```

5. For a cloud model, add usage credits or a plan on ollama.com first. Through the signed-in app or CLI, use the `:cloud` name, such as `gemma4:cloud` ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20).

6. Read your remaining included and purchased credits before a long run. The command names the variable; your shell supplies the key from your secret store ([Usage](https://docs.ollama.com/cloud/usage), read 2026-11-20).

```bash
curl -s https://ollama.com/api/balance -H "Authorization: Bearer $OLLAMA_API_KEY"
```

## Traps

| Trap | What happens |
| --- | --- |
| Pay as you go is not free cloud | The plan has no included cloud usage. In a test on 2026-11-20, every cloud model returned HTTP 402 with no credits. Only local models run free |
| Two model names | Direct calls to `ollama.com` use the name `/api/tags` lists, such as `gemma4:31b`. The app, CLI and local API use the `:cloud` name ([Models](https://docs.ollama.com/cloud/models), read 2026-11-20) |
| Auth variables in a dotfile | Ollama's direct cloud recipe sets `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_BASE_URL` ([Claude Code](https://docs.ollama.com/integrations/claude-code), read 2026-11-20). These outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-20). Set them per command, never in a dotfile |
| Claude settings win | Claude settings can override shell variables, so check `/status` after a change ([Claude Code](https://docs.ollama.com/integrations/claude-code), read 2026-11-20) |
| OpenCode config shape | Ollama's page shows OpenCode 1's `provider`, `npm` and `options` ([OpenCode](https://docs.ollama.com/integrations/opencode), read 2026-11-20). OpenCode 2 still loads it, but writes `providers`, `package` and `settings` ([Migrate from V1](https://opencode.ai/docs/migrate-v1), read 2026-11-20) |
| Concurrency | Requests past the plan's limit queue; a full queue rejects them ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Off-peak rates | Some models list a lower Off-Peak rate. The page says it applies outside 12:00 and 18:00 UTC on weekdays, and all day on weekends ([Pricing](https://ollama.com/pricing), read 2026-11-20) |
| Data | Ollama states a zero data retention policy for cloud prompts and responses, and never trains on them ([Cloud FAQ](https://docs.ollama.com/cloud/faq), read 2026-11-20). It hosts mainly in the United States and may route to Europe ([Pricing](https://ollama.com/pricing), read 2026-11-20) |

## Sources

| Page | Read |
| --- | --- |
| [Pricing](https://ollama.com/pricing) | 2026-11-20 |
| [Creating an API key](https://docs.ollama.com/cloud/api) | 2026-11-20 |
| [Models](https://docs.ollama.com/cloud/models) | 2026-11-20 |
| [Usage](https://docs.ollama.com/cloud/usage) | 2026-11-20 |
| [Cloud FAQ](https://docs.ollama.com/cloud/faq) | 2026-11-20 |
| [FAQ](https://docs.ollama.com/faq) | 2026-11-20 |
| [Claude Code](https://docs.ollama.com/integrations/claude-code) | 2026-11-20 |
| [OpenCode](https://docs.ollama.com/integrations/opencode) | 2026-11-20 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-20 |
| [Migrate from V1](https://opencode.ai/docs/migrate-v1) | 2026-11-20 |
| [models.dev](https://models.dev) | 2026-11-20 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-20 |
