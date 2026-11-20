# Zed

Zed is a free editor that runs open-weight models through your own provider keys, and runs Claude Code, OpenCode and Goose as external agents over the Agent Client Protocol (ACP).

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| None for the editor itself ([Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-20). A Zed sign-in is needed only for Zed-hosted models. | Zed Free is $0 forever, with unlimited use of your own API keys or external agents ([Pricing](https://zed.dev/pricing), read 2026-11-20). Zed-hosted models and Edit Predictions need Pro ([Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-20). | Keys saved in **Settings > AI > LLM Providers** go to the system keychain, not `settings.json`. A non-empty environment variable wins over the keychain. An OpenAI-compatible provider reads `<PROVIDER_ID>_API_KEY` in upper snake case ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20). | Claude Agent from the ACP Registry. It owns its own login and billing ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-20). | From the ACP Registry, or a custom agent that runs `opencode acp` ([ACP](https://opencode.ai/docs/cli/acp), read 2026-11-20). | On Zed Free, Zed bills nothing: each provider's own guard applies to its key. On Pro, the Monthly Spend Limit caps token spend past the $5 included; it defaults to $10, accepts $0, and stops usage when hit ([Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-20). Per the same page, any limit above $0 lets tokens bill past the included $5. See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Set up

1. Add a provider key in the editor. Run `agent: open settings` from the command palette, open **LLM Providers**, and paste the key there; Zed stores it in the keychain ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20).

2. Add an OpenAI-compatible provider, such as one from these guides, in `settings.json`. Name the provider ID with care: it sets the variable Zed reads, so `my-gateway` reads `MY_GATEWAY_API_KEY` ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20). Keep the key itself out of this file.

```json
{
  "language_models": {
    "openai_compatible": {
      "<provider-id>": {
        "api_url": "https://<base-url>/v1",
        "available_models": [{ "name": "<model>", "max_tokens": 128000 }]
      }
    }
  }
}
```

3. For Ollama, Zed finds models on a local server by itself. For Ollama's cloud, set the API URL to `https://ollama.com` and give Zed a key in the provider UI or `OLLAMA_API_KEY` ([Use a Local Model](https://zed.dev/docs/ai/use-a-local-model), [Ollama: Zed](https://docs.ollama.com/integrations/zed), read 2026-11-20). See [Ollama](ollama.md) for its credits.

4. Add OpenCode as an external agent: install it from the ACP Registry (`zed: acp registry`), or add a custom agent ([External Agents](https://zed.dev/docs/ai/external-agents), [ACP](https://opencode.ai/docs/cli/acp), read 2026-11-20). OpenCode uses the credentials it already holds, so run `opencode auth login` in a terminal first.

```json
{
  "agent_servers": {
    "OpenCode": { "type": "custom", "command": "opencode", "args": ["acp"] },
    "Goose": { "type": "custom", "command": "goose", "args": ["acp"] }
  }
}
```

5. Add Goose the same way: `goose acp` runs Goose as an ACP agent on stdio (`goose acp --help`, v1.60.1). See [Goose](goose.md) for its own keys.

6. Add Claude Agent from the ACP Registry, open a Claude Agent thread and run `/login` there. A key set for the Zed Agent does not configure it ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-20).

## Traps

| Trap | What happens |
| --- | --- |
| A stale variable wins | A non-empty provider variable overrides the keychain. To stop using it, unset it and restart Zed ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20) |
| Keys in `settings.json` | Zed's page says never to put API keys there ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20). The file is plain text |
| Agents own their keys | A key for the Zed Agent is not an external agent's key. Claude Agent, OpenCode and Goose each sign in on their own ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-20) |
| Ollama's small context | Zed asks Ollama for 4,096 tokens of context unless you set `context_window` or a model's `max_tokens` ([Use a Local Model](https://zed.dev/docs/ai/use-a-local-model), read 2026-11-20). A coding agent needs far more |
| `opencode` not found | A graphical app may not see your shell's `PATH`. Set `command` to the absolute path `which opencode` prints ([ACP](https://opencode.ai/docs/cli/acp), read 2026-11-20) |
| Pro overage | Pro bills tokens past the included $5 at list price plus 10%, at month end or every $10 ([Pricing](https://zed.dev/pricing), read 2026-11-20). Per [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), a $0 spend limit caps Pro at its fee |
| Remote projects | Keys saved in Zed are read from the local keychain, even in an SSH project ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20) |

## Sources

| Page | Read |
| --- | --- |
| [Pricing](https://zed.dev/pricing) | 2026-11-20 |
| [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage) | 2026-11-20 |
| [Use API Access](https://zed.dev/docs/ai/use-api-access) | 2026-11-20 |
| [Use a Local Model](https://zed.dev/docs/ai/use-a-local-model) | 2026-11-20 |
| [External Agents](https://zed.dev/docs/ai/external-agents) | 2026-11-20 |
| [OpenCode ACP](https://opencode.ai/docs/cli/acp) | 2026-11-20 |
| [Ollama: Zed](https://docs.ollama.com/integrations/zed) | 2026-11-20 |
