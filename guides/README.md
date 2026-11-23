# Provider guides

One page per provider. Each page opens with one table: account, free tier with its source and date, login or key, Claude connector, OpenCode, guard.

```mermaid
flowchart LR
  Q{What do you need?} -->|Hosted open-weight models| I[Inference]
  Q -->|GPUs for your own code| G[GPU]
  Q -->|CI, MCP, Copilot models| T[GitHub]
  Q -->|No account, no bill| M[Local models]
```

| Guide | Lane | What it covers |
| --- | --- | --- |
| [Hugging Face](hugging-face.md) | Inference, GPU | Hub models, ZeroGPU Spaces, Inference Providers, the Hugging Face MCP server |
| [NVIDIA](nvidia.md) | Inference | NIM trial endpoints on build.nvidia.com, NGC containers, the CUDA docs MCP server |
| [Groq](groq.md) | Inference | Fast hosted open-weight models on a free plan |
| [OpenRouter](openrouter.md) | Inference | One OpenAI-compatible API over many vendors, with `:free` variants |
| [Together AI](together.md) | Inference | Prepaid per-token open-weight models |
| [Cloudflare Workers AI](cloudflare-workers-ai.md) | Inference | A free daily Neurons allocation and hosted MCP servers |
| [Modal](modal.md) | GPU | Serverless GPUs for your own code, and Shared Endpoints |
| [RunPod](runpod.md) | GPU | Prepaid GPU pods and Serverless endpoints, the RunPod MCP server |
| [AMD](amd.md) | GPU | ROCm, and one-time AMD Developer Cloud credit |
| [ComfyUI](comfyui.md) | GPU | Comfy Cloud, comfy-cli, and the [comfyui-base](https://github.com/SoulCraft-Org/comfyui-base) installer |
| [GitHub](github.md) | CI, tools | Actions, `gh` login, the GitHub MCP server, the App manifest flow, Copilot in OpenCode |
| [Local models](local-models.md) | Local | MLX and LM Studio serving a model on your own port |
| [Logins](logins.md) | Accounts | One sign-in order, passkeys and codes in Apple Passwords, the logins catalog and starter |

Every free-tier figure is on its guide page, with the vendor's own page and the date it was read. [catalog/plans.json](../catalog/plans.json) holds the plans across all vendors.

## Rules every guide follows

| Rule | Source |
| --- | --- |
| Free tiers and included credits only | [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| A CLI login or OAuth first; an env var name, never a key value | [Git Crafter key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| The Guard column names the vendor's own stop at the free limit, and what removes it | [CONTRIBUTING.md](../CONTRIBUTING.md) |

## Names

Three parts name every plan, stored key and variable: the vendor, the plan and the consumer. [CHECKLIST.md](CHECKLIST.md) uses them for each new provider.

| Name | Pattern | Example | Rule |
| --- | --- | --- | --- |
| Vendor | A lowercase slug | `groq` | The prefix of the vendor's plan ids in the catalog |
| Plan id | `<vendor>-<plan>` | `groq-free` | The catalog's `id` field ([catalog/README.md](../catalog/README.md)) |
| Consumer | A lowercase slug for the tool or job that uses the key | `ci`, `nightly-eval` | One key per consumer, so revoking one leaves the others working |
| Stored key | `<vendor>:<consumer>` | `groq:ci` | The name in your secret store. The value never appears in a file, a command or a log |
| Variable | `<CONSUMER>_<VENDOR>_API_KEY`, upper case, `-` as `_` | `CI_GROQ_API_KEY`, `NIGHTLY_EVAL_GROQ_API_KEY` | Load it from the stored key at launch, never from a dotfile |
| Fixed variable | The tool's own name | `GROQ_API_KEY` in OpenCode's catalog ([models.dev](https://models.dev), read 2026-11-20) | Some tools fix the name. Load the stored key into it for one process only |
