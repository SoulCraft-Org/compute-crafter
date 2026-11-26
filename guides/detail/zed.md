# Zed: set up

What the Zed guide moved out of its page. Traps and sources: [Zed traps and sources](zed-traps.md). The diagram and wiring are in [Zed](../zed.md). Zed is a secondary client here: start with OpenCode, then add Zed if you want it.

## Set up

1. Add OpenCode from the ACP Registry (`zed: acp registry`), or as a custom agent. Run `opencode auth login` in a terminal first ([OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24).

```json
{
  "agent_servers": {
    "OpenCode": { "type": "custom", "command": "opencode", "args": ["acp"] }
  }
}
```

2. To use Zed's own agent panel with open-weight models, add a provider key: run `agent: open settings`, open **LLM Providers**, and paste the key. Zed stores it in the keychain ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-24).
3. Or add an OpenAI-compatible provider in `settings.json`. The provider ID sets the variable Zed reads, so `my-gateway` reads `MY_GATEWAY_API_KEY` ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-24). Keep the key out of this file.

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

4. For Ollama, use cloud models only. Set the API URL to `https://ollama.com` and give Zed a key in the provider UI or `OLLAMA_API_KEY` ([Ollama: Zed](https://docs.ollama.com/integrations/zed), read 2026-11-20). See [Ollama](../ollama.md).
