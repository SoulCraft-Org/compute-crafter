# Zed: traps and sources

What goes wrong with Zed, and the pages this guide read. The steps are in [Zed detail](zed.md).

## Traps

| Trap | What happens |
| --- | --- |
| A stale variable wins | A non-empty provider variable overrides the keychain. Unset it and restart Zed ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20) |
| Keys in `settings.json` | Zed's page says never to put API keys there. The file is plain text ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20) |
| Agents own their keys | A key for the Zed Agent is not an external agent's key. Claude Agent signs in with `/login`, and OpenCode handles its own auth ([External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-24) |
| Ollama's small context | Zed asks Ollama for 4,096 tokens of context unless you set `context_window` or a model's `max_tokens` ([Use a Local Model](https://zed.dev/docs/ai/use-a-local-model), read 2026-11-20). A coding agent needs far more |
| `opencode` not found | A graphical client may not see your shell's `PATH`. Set `command` to the path `which opencode` prints ([OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24) |
| Looks stuck | `opencode acp` waits for input. Never run it by hand ([OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24) |
| Pro overage | Tokens past the included $5 bill at API list price plus 10%, at month end or every $10 ([Pricing](https://zed.dev/pricing), read 2026-11-24) |
| Remote projects | Keys saved in Zed come from the local keychain, even in an SSH project ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-20) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Pricing](https://zed.dev/pricing) | 2026-11-24 |
| [Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage) | 2026-11-24 |
| [External Agents](https://zed.dev/docs/ai/external-agents) | 2026-11-24 |
| [OpenCode ACP](https://opencode.ai/docs/cli/acp) | 2026-11-24 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |
| [Use API Access](https://zed.dev/docs/ai/use-api-access) | 2026-11-20 |
| [Use a Local Model](https://zed.dev/docs/ai/use-a-local-model) | 2026-11-20 |
| [Ollama: Zed](https://docs.ollama.com/integrations/zed) | 2026-11-20 |

</details>
