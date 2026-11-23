# Local models: traps and sources

What goes wrong with Local models, and the pages this guide read. The steps are in [Local models](../local-models.md).

## Traps

| Trap | What happens |
| --- | --- |
| `--trust-remote-code` on a shared model folder | It runs Python shipped with the model. Anyone who can write that folder runs code as you. Omit it; MLX then asks in the terminal ([mlx-lm README](https://github.com/ml-explore/mlx-lm), read 2026-11-12) |
| Vendor default ports | 8080 and 1234 collide with other servers. LM Studio reuses the last port when `--port` is omitted ([lms server start](https://lmstudio.ai/docs/cli/server-start), read 2026-11-12) |
| Small context | Claude Code needs a model and settings above about 25k context ([LM Studio for Claude Code](https://lmstudio.ai/docs/integrations/claude-code), read 2026-11-12) |
| Auth variables in a dotfile | `ANTHROPIC_AUTH_TOKEN` and `ANTHROPIC_API_KEY` both outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-12). Set them per command so other sessions keep the subscription |
| `--cors` on LM Studio | It exposes the server to web pages. LM Studio pairs it with authentication ([lms server start](https://lmstudio.ai/docs/cli/server-start), read 2026-11-12) |
| Two downloads at once | Parallel downloads race for the same free disk. Run one, then check `df -h ~` again |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [mlx-lm README](https://github.com/ml-explore/mlx-lm) | 2026-11-12 |
| [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) | 2026-11-12 |
| [mlx-lm server.py](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/server.py) | 2026-11-12 |
| [LM Studio lms CLI](https://lmstudio.ai/docs/cli) | 2026-11-12 |
| [LM Studio lms get](https://lmstudio.ai/docs/cli/get) | 2026-11-12 |
| [LM Studio lms server start](https://lmstudio.ai/docs/cli/server-start) | 2026-11-12 |
| [LM Studio OpenAI compatibility](https://lmstudio.ai/docs/developer/openai-compat) | 2026-11-12 |
| [LM Studio Anthropic compatibility](https://lmstudio.ai/docs/developer/anthropic-compat) | 2026-11-12 |
| [LM Studio for Claude Code](https://lmstudio.ai/docs/integrations/claude-code) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-12 |

</details>
