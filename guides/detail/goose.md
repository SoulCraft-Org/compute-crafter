# Goose: set up

What the Goose guide moved out of its page. Traps and sources: [Goose traps and sources](goose-traps.md). The diagram and wiring are in [Goose](../goose.md).

## Set up

1. Install with Homebrew, which also updates it. The CLI is `block-goose-cli` and the desktop app is the `block-goose` cask ([Install goose](https://goose-docs.ai/docs/getting-started/installation), read 2026-11-24).
2. Run `goose configure`, choose **Configure Providers**, then enter the key at the prompt so it goes to the keyring. On macOS that is the Keychain item with service `goose` and account `secrets` ([config/base.rs](https://github.com/aaif-goose/goose/blob/main/crates/goose/src/config/base.rs), read 2026-11-20). The Desktop app can store the key there too ([Providers](https://goose-docs.ai/docs/getting-started/providers), read 2026-11-24).
3. For Ollama's cloud, pick the **Ollama Cloud** provider, which reads `OLLAMA_CLOUD_API_KEY`. Use cloud models only; the plain **Ollama** provider is for a local server ([Providers](https://goose-docs.ai/docs/getting-started/providers), read 2026-11-24). See [Ollama](../ollama.md) for its credits.
4. For another OpenAI-compatible endpoint, add a custom provider file in `~/.config/goose/custom_providers/`. Its `api_key_env` names the variable that holds the key ([Providers](https://goose-docs.ai/docs/getting-started/providers), read 2026-11-24).

```json
{
  "name": "<provider_id>",
  "engine": "openai",
  "display_name": "<Provider>",
  "api_key_env": "<CONSUMER>_<VENDOR>_API_KEY",
  "base_url": "https://<base-url>/v1/chat/completions",
  "models": [{ "name": "<model>", "context_limit": 128000 }],
  "requires_auth": true
}
```

5. Set the tool mode in `~/.config/goose/config.yaml`, or per session with `/mode smart_approve`. The modes are `auto`, `approve` and `smart_approve` ([Permissions](https://goose-docs.ai/docs/guides/managing-tools/goose-permissions), read 2026-11-24).

```yaml
GOOSE_MODE: smart_approve
```

6. Goose reads `AGENTS.md`, then `.goosehints`, in each folder ([Project instructions](https://goose-docs.ai/docs/guides/context-engineering/using-goosehints), read 2026-11-20). It loads skills from `~/.agents/skills/`, `<project>/.agents/skills/` and `<project>/.claude/skills/` ([Skills](https://goose-docs.ai/docs/guides/context-engineering/using-skills), read 2026-11-20).
