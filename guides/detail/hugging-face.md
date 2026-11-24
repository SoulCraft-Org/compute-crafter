# Hugging Face: set up, traps and sources

What the Hugging Face guide moved out of its page. The diagram and wiring are in [Hugging Face](../hugging-face.md).

## Set up

1. Log the CLI in through the browser. `uvx` runs the latest `hf` with no install; `brew install hf` installs it ([CLI guide](https://huggingface.co/docs/huggingface_hub/guides/cli), read 2026-11-12). The login saves a token under `~/.cache/huggingface/`, which other Hugging Face tools on the machine read.
2. The CLI route to the MCP server uses the `?login` form, from Hugging Face's own server repo ([hf-mcp-server](https://github.com/huggingface/hf-mcp-server), read 2026-11-24). The Code tab reads a server added this way. Pick extra tools and Spaces at [MCP settings](https://huggingface.co/settings/mcp).
3. OpenCode: make a fine-grained token at [Access Tokens](https://huggingface.co/settings/tokens), then paste it at the hidden prompt ([OpenCode 2](../README.md#opencode-2)). Hugging Face's page shows `opencode auth login` ([HF: OpenCode](https://huggingface.co/docs/inference-providers/integrations/opencode), read 2026-11-24).
4. Host a ZeroGPU Space: pick the Gradio SDK and ZeroGPU hardware, then decorate each GPU function with `@spaces.GPU` ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). The default `large` size is half an RTX Pro 6000 Blackwell, 48 GB.

## Traps

| Trap | What happens |
| --- | --- |
| Paid plan to create Spaces | Gradio and Docker Spaces "require a paid plan to create". The exception is up to 2 ZeroGPU Gradio Spaces on a free account ([Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12). Static Spaces are free. |
| Gradio only | ZeroGPU works only with the Gradio SDK. The GPU exists only inside `@spaces.GPU` functions, 60 seconds each by default ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). |
| `xlarge` doubles the cost | A full 96 GB card spends 2x quota. |
| Quota clock | The daily quota resets 24 hours after your first GPU use, not at midnight. |
| PRO auto-billing | Once PRO holds prepaid credits, ZeroGPU past quota draws them with no prompt. |
| Custom provider key | A provider key saved in Hugging Face settings bills that provider directly, and included credits do not apply ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). |
| Spend limit | Only Team and Enterprise org admins can set an Inference Providers spending limit. The page names no limit for a personal account. |
| `HF_TOKEN` in the shell | `hf auth logout` does not log out a session that reads `HF_TOKEN`; unset it in your shell config ([CLI guide](https://huggingface.co/docs/huggingface_hub/guides/cli), read 2026-11-12). |
| Token in MCP config | The repo's header form puts a token in a config file. Use `?login` or the connector. |
| Sleeping Spaces | A Space on free hardware sleeps when unused, and its 50 GB disk does not persist ([Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12). |
| Desktop app skips the variables | The router takes Claude Code's Anthropic-format calls, but a local Desktop session sets its own `ANTHROPIC_BASE_URL` ([Desktop docs](https://code.claude.com/docs/en/desktop), read 2026-11-24). |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Spaces ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu) | 2026-11-12 |
| [Spaces overview](https://huggingface.co/docs/hub/spaces-overview) | 2026-11-12 |
| [Inference Providers pricing and billing](https://huggingface.co/docs/inference-providers/pricing) | 2026-11-12 |
| [Hugging Face pricing](https://huggingface.co/pricing) | 2026-11-12 |
| [hf CLI guide](https://huggingface.co/docs/huggingface_hub/guides/cli) | 2026-11-12 |
| [Hugging Face MCP Server](https://huggingface.co/docs/hub/agents-mcp) | 2026-11-24 |
| [huggingface/hf-mcp-server](https://github.com/huggingface/hf-mcp-server) | 2026-11-24 |
| [HF: OpenCode](https://huggingface.co/docs/inference-providers/integrations/opencode) | 2026-11-24 |
| [HF: Claude Code](https://huggingface.co/docs/inference-providers/integrations/claude-code) | 2026-11-24 |
| [models.dev](https://models.dev) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |

</details>
