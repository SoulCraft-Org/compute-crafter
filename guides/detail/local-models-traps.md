# Local models: traps and sources

What goes wrong with Local models, and the pages this guide read. The steps are in [Local models set up](local-models.md). The diagram and wiring are in [Local models](../local-models.md).

## Traps

| Trap | What happens |
| --- | --- |
| `--trust-remote-code` on a shared model folder | It runs Python shipped with the model. Anyone who can write that folder runs code as you. Omit it; MLX then asks in the terminal ([mlx-lm README](https://github.com/ml-explore/mlx-lm), read 2026-11-24) |
| Vendor default ports | MLX uses 8080 and LM Studio reuses its last port, 1234 by default ([lms server start](https://lmstudio.ai/docs/cli/server-start), read 2026-11-24). Pass your own |
| `--cors` on LM Studio | It "can expose your server to security risks". LM Studio pairs it with authentication ([lms server start](https://lmstudio.ai/docs/cli/server-start), read 2026-11-24) |
| Any non-localhost bind | LM Studio says it exposes the server beyond localhost. Turn on authentication first |
| Two downloads at once | Parallel downloads race for the same free disk. Run one, then check `df -h ~` |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) | 2026-11-24 |
| [LM Studio lms server start](https://lmstudio.ai/docs/cli/server-start) | 2026-11-24 |
| [LM Studio Anthropic compatibility](https://lmstudio.ai/docs/developer/anthropic-compat) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [models.dev](https://models.dev/api.json) | 2026-11-24 |
| [mlx-lm README](https://github.com/ml-explore/mlx-lm) | 2026-11-24 |
| [mlx-lm server.py](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/server.py) | 2026-11-24 |
| [LM Studio lms CLI](https://lmstudio.ai/docs/cli) | 2026-11-12 |

</details>
