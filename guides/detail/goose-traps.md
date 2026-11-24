# Goose: traps and sources

What goes wrong with Goose, and the pages this guide read. The steps are in [Goose detail](goose.md).

## Traps

| Trap | What happens |
| --- | --- |
| A key in `config.yaml` | Goose ignores it, and the run fails with an error such as `No api key passed in` ([Configuration files](https://goose-docs.ai/docs/guides/config-files), read 2026-11-24) |
| Plaintext fallback | Without a keyring, with `GOOSE_DISABLE_KEYRING` set, or when the keyring fails, secrets go to `secrets.yaml` in plain text ([Configuration files](https://goose-docs.ai/docs/guides/config-files), read 2026-11-24). The log says `Keyring unavailable. Using file storage for secrets.` ([Known issues](https://goose-docs.ai/docs/troubleshooting/known-issues), read 2026-11-20) |
| Keys in a shell profile | The known-issues page suggests a key in `~/.zshrc` when the keyring fails ([Known issues](https://goose-docs.ai/docs/troubleshooting/known-issues), read 2026-11-20). That puts it in plain text for every process; fix the keyring instead |
| Secrets in a provider file | The custom provider example puts a secret header value in the JSON file ([Providers](https://goose-docs.ai/docs/getting-started/providers), read 2026-11-20). Keep secrets in the keyring or `api_key_env` |
| Variable beats keyring | A provider's environment variable wins over stored secrets ([Configuration files](https://goose-docs.ai/docs/guides/config-files), read 2026-11-24) |
| Ollama's cloud host | Ollama's page says to point `OLLAMA_HOST` at `https://ollama.com` and save the key in `.env` ([Ollama: Goose](https://docs.ollama.com/integrations/goose), read 2026-11-20). Goose's page says to use the Ollama Cloud provider. Follow Goose's, which keeps the key in the keyring |
| `auto` by default | A new session can change and delete files with no approval step ([Permissions](https://goose-docs.ai/docs/guides/managing-tools/goose-permissions), read 2026-11-24) |
| Two updaters | `goose update` and Homebrew both update the CLI ([Install goose](https://goose-docs.ai/docs/getting-started/installation), read 2026-11-24). Use the one that installed it |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [aaif-goose/goose README](https://github.com/aaif-goose/goose) | 2026-11-24 |
| [Install goose](https://goose-docs.ai/docs/getting-started/installation) | 2026-11-24 |
| [Providers](https://goose-docs.ai/docs/getting-started/providers) | 2026-11-24 |
| [Permissions](https://goose-docs.ai/docs/guides/managing-tools/goose-permissions) | 2026-11-24 |
| [OpenCode ACP](https://opencode.ai/docs/cli/acp) | 2026-11-24 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |
| [config/base.rs](https://github.com/aaif-goose/goose/blob/main/crates/goose/src/config/base.rs) | 2026-11-20 |
| [Configuration files](https://goose-docs.ai/docs/guides/config-files) | 2026-11-24 |
| [Project instructions](https://goose-docs.ai/docs/guides/context-engineering/using-goosehints) | 2026-11-20 |
| [Skills](https://goose-docs.ai/docs/guides/context-engineering/using-skills) | 2026-11-20 |
| [Known issues](https://goose-docs.ai/docs/troubleshooting/known-issues) | 2026-11-20 |
| [Ollama: Goose](https://docs.ollama.com/integrations/goose) | 2026-11-20 |

</details>
