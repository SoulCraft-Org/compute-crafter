# Zed: external agents, traps and sources

How to add OpenCode, Goose and Claude Agent to Zed, what goes wrong, and the pages this guide read. Steps 1 to 3 are in [Zed](../zed.md).

## Set up the agents

4. Add OpenCode as an external agent: install it from the ACP Registry (`zed: acp registry`), or add a custom agent ([External Agents](https://zed.dev/docs/ai/external-agents), [ACP](https://opencode.ai/docs/cli/acp), read 2026-11-20). OpenCode uses the credentials it already holds, so run `opencode auth login` in a terminal first.

```json
{
  "agent_servers": {
    "OpenCode": { "type": "custom", "command": "opencode", "args": ["acp"] },
    "Goose": { "type": "custom", "command": "goose", "args": ["acp"] }
  }
}
```

5. Add Goose the same way: `goose acp` runs Goose as an ACP agent on stdio (`goose acp --help`, v1.60.1). See [Goose](../goose.md) for its own keys.

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

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Pricing](https://zed.dev/pricing) | 2026-11-20 |
| [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage) | 2026-11-20 |
| [Use API Access](https://zed.dev/docs/ai/use-api-access) | 2026-11-20 |
| [Use a Local Model](https://zed.dev/docs/ai/use-a-local-model) | 2026-11-20 |
| [External Agents](https://zed.dev/docs/ai/external-agents) | 2026-11-20 |
| [OpenCode ACP](https://opencode.ai/docs/cli/acp) | 2026-11-20 |
| [Ollama: Zed](https://docs.ollama.com/integrations/zed) | 2026-11-20 |

</details>
