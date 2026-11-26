# Provider guides

One page per provider. Each opens with a diagram, then one table: account, free tier, login or key, OpenCode, guard. A Wiring table follows for the OpenCode Desktop App. Three topic pages open with their own table or text: [Local models](local-models.md), [Logins](logins.md) and [Training](training.md). Every guide covers open-weight models or the compute and tools around them. Closed-model providers have no guide here. OpenCode is first. Zed and Goose are short "also works with" pages, listed last among the clients.

```mermaid
flowchart LR
  Q{What do you need?} -->|Hosted open-weight models| I[Inference]
  Q -->|GPUs for your own code| G[GPU]
  Q -->|CI and MCP tools| T[GitHub]
  Q -->|No account, no bill| M[Local models]
  I & G & T & M --> H[OpenCode Desktop App]
```

| Guide | Lane | OpenCode Desktop App | Covers |
| --- | --- | --- | --- |
| [Ollama](ollama.md) | 🧠 Inference | ✅ | Cloud models on usage credits |
| [OpenRouter](openrouter.md) | 🧠 Inference | ✅ | One API, many vendors, `:free` variants |
| [Hugging Face](hugging-face.md) | 🧠 Inference, ⚡ GPU | ✅ | Hub models, ZeroGPU Spaces, Inference Providers, MCP server |
| [NVIDIA](nvidia.md) | 🧠 Inference | ✅ | NIM trial endpoints, NGC containers, CUDA docs MCP server |
| [Groq](groq.md) | 🧠 Inference | ✅ | Fast open-weight models on a free plan |
| [Together AI](together.md) | 🧠 Inference | ✅ | Prepaid per-token open-weight models |
| [Cloudflare Workers AI](cloudflare-workers-ai.md) | 🧠 Inference | ✅ | Free daily Neurons, hosted MCP servers |
| [Modal](modal.md) | ⚡ GPU | ✅ | Serverless GPUs, Model APIs |
| [RunPod](runpod.md) | ⚡ GPU | ✅ | Prepaid pods and Serverless endpoints, RunPod MCP server |
| [AMD](amd.md) | ⚡ GPU | ❔ | ROCm, one-time AMD Developer Cloud credit |
| [Google Cloud](google-cloud.md) | 🖥️ CPU, ⚡ GPU | ❔ | The $300 Free Trial, budget kill switch, quotas |
| [ComfyUI](comfyui.md) | ⚡ GPU | ✅ | Comfy Cloud, comfy-cli, [comfyui-base](https://github.com/SoulCraft-Org/comfyui-base) installer |
| [Training](training.md) | ⚡ GPU | ❔ | LoRA, then RL such as GRPO, on free credits |
| [GitHub](github.md) | 🔧 CI, tools | ❔ | Actions, `gh` login, MCP server, App manifest |
| [Zed](zed.md) | 🔌 Client, also works with | ❔ | Open-source editor, runs OpenCode over ACP |
| [Goose](goose.md) | 🔌 Client, also works with | ❔ | Open-source agent, keys in the keyring |
| [Local models](local-models.md) | 🏠 Local | ✅ | MLX and LM Studio on your own port |
| [Logins](logins.md) | 🔑 Accounts | ❔ | One sign-in order, passkeys, logins catalog |

✅ a vendor or OpenCode page documents it, ❔ not confirmed, ➖ a page says it is not available. Each mark follows its guide's Wiring table, which dates every source (issue #192).

Every free-tier figure cites the vendor's page and read date. [catalog/plans.json](../catalog/plans.json) holds every plan.

## OpenCode 2

Key store, hidden prompt, `--standalone`, update and `{env:VAR}` rules: [OpenCode 2 rules](reference/opencode-2.md).

## Rules every guide follows

| Rule | Source |
| --- | --- |
| Free tiers and included credits only | [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| A CLI login or OAuth first; an env var name, never a key value | [Git Crafter key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| Guard names the vendor's own stop at the free limit and what removes it | [CONTRIBUTING.md](../CONTRIBUTING.md) |

## Names

Vendor, plan and consumer name every plan, key and variable: [Names](reference/names.md).
