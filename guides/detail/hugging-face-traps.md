# Hugging Face: traps and sources

What goes wrong with Hugging Face, and the pages this guide read. The steps are in [Hugging Face set up](hugging-face.md). The diagram and wiring are in [Hugging Face](../hugging-face.md).

## Traps

| Trap | What happens |
| --- | --- |
| Paid plan to create Spaces | Gradio and Docker Spaces "require a paid plan to create". The exception is up to 2 ZeroGPU Gradio Spaces on a free account ([Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12). Static Spaces are free. |
| Gradio only | ZeroGPU works only with the Gradio SDK. The GPU exists only inside `@spaces.GPU` functions, 60 seconds each by default ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). |
| `xlarge` doubles the cost | A full 96 GB card spends 2x quota ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). |
| Quota clock | The daily quota resets 24 hours after your first GPU use, not at midnight ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). |
| PRO auto-billing | Once PRO holds prepaid credits, ZeroGPU past quota draws them with no prompt. |
| Custom provider key | A provider key saved in Hugging Face settings bills that provider directly, and included credits do not apply ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). |
| Spend limit | Only Team and Enterprise org admins can set an Inference Providers spending limit ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). The page names no limit for a personal account. |
| `HF_TOKEN` in the shell | `hf auth logout` does not log out a session that reads `HF_TOKEN`; unset it in your shell config ([CLI guide](https://huggingface.co/docs/huggingface_hub/guides/cli), read 2026-11-12). |
| Token in MCP config | The repo's header form puts a token in a config file. Use the connector. |
| Sleeping Spaces | A Space on free hardware sleeps when unused, and its 50 GB disk does not persist ([Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12). |

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
| [models.dev](https://models.dev) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |

</details>
