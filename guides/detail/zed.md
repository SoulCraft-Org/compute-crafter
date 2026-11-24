# Zed: guard, providers and agents

What the Zed guide moved out of its page. Traps and sources: [Zed traps and sources](zed-traps.md). The diagram and wiring are in [Zed](../zed.md).

## Guard

| Plan | Figure | Source |
| --- | --- | --- |
| Zed Free | $0, no Zed-hosted models | [Pricing](https://zed.dev/pricing), read 2026-11-24 |
| Pro | $10 a month, with $5 of tokens included | [Pricing](https://zed.dev/pricing), read 2026-11-24 |
| Hosted models, Edit Predictions | Need Pro, Student or Business. Edit Predictions from other providers work without it | [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-24 |
| Monthly Spend Limit | Defaults to $10 past the included $5, accepts $0, and stops hosted use when hit | [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-24 |
| Limit at $0 | Per the page, caps Pro at its fee, "exactly $10/month" |
| Raising it | Any limit above $0 lets tokens bill past the included $5 | [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-24 |

## Set up

1. Add a provider key: run `agent: open settings`, open **LLM Providers**, and paste the key. Zed stores it in the keychain ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-24).
2. Add an OpenAI-compatible provider in `settings.json`. The provider ID sets the variable Zed reads, so `my-gateway` reads `MY_GATEWAY_API_KEY` ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-24). Keep the key out of this file.

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

3. For Ollama, use cloud models only. Set the API URL to `https://ollama.com` and give Zed a key in the provider UI or `OLLAMA_API_KEY` ([Ollama: Zed](https://docs.ollama.com/integrations/zed), read 2026-11-20). See [Ollama](../ollama.md).
4. Add OpenCode from the ACP Registry (`zed: acp registry`), or as a custom agent. Run `opencode auth login` in a terminal first ([OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24).
5. Add Goose as a custom agent with `goose acp` (`goose acp --help`, v1.60.2, run 2026-11-24). Zed's page does not mention Goose ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-24). See [Goose](../goose.md).

```json
{
  "agent_servers": {
    "OpenCode": { "type": "custom", "command": "opencode", "args": ["acp"] },
    "Goose": { "type": "custom", "command": "goose", "args": ["acp"] }
  }
}
```

6. Add Claude Agent from the ACP Registry, open a thread and run `/login`. A key set for the Zed Agent does not configure it ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-24).
