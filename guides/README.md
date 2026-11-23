# Provider guides

One page per provider. Each provider page opens with one table: account, free tier with its source and date, login or key, Claude connector, OpenCode, guard. Four pages cover a topic, not one provider, and open with their own table or text: [Local models](local-models.md), [Logins](logins.md), [Training](training.md) and [Claude Desktop MCP](claude-desktop-mcp.md).

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
| [Ollama](ollama.md) | Inference | Cloud models paid from usage credits on a $0 plan, and launchers for Claude Code and OpenCode |
| [Modal](modal.md) | GPU | Serverless GPUs for your own code, and Shared Endpoints |
| [RunPod](runpod.md) | GPU | Prepaid GPU pods and Serverless endpoints, the RunPod MCP server |
| [AMD](amd.md) | GPU | ROCm, and one-time AMD Developer Cloud credit |
| [Google Cloud](google-cloud.md) | CPU, GPU | The $300 Free Trial credit and what it cannot pay for, the upgrade, and budgets, a kill switch and quotas |
| [ComfyUI](comfyui.md) | GPU | Comfy Cloud, comfy-cli, and the [comfyui-base](https://github.com/SoulCraft-Org/comfyui-base) installer |
| [Claude Desktop MCP](claude-desktop-mcp.md) | Client | One MCP server for the Code tab and Cowork: a custom connector, or a desktop extension that bridges a loopback app |
| [GitHub](github.md) | CI, tools | Actions, `gh` login, the GitHub MCP server, the App manifest flow, Copilot in OpenCode |
| [Local models](local-models.md) | Local | MLX and LM Studio serving a model on your own port |
| [Logins](logins.md) | Accounts | One sign-in order, passkeys and codes in Apple Passwords, the logins catalog and starter |
| [Training](training.md) | GPU | LoRA, then RL such as GRPO, on free and subscription credits: jobs by GPU size, lanes with terms and card guards, lanes to avoid |
| [Zed](zed.md) | Client | An editor that runs open-weight models on your own keys, and Claude Code, OpenCode and Goose over ACP |
| [Goose](goose.md) | Client | An open-source agent, CLI and desktop app, that keeps provider keys in the system keyring |

Every free-tier figure is on its guide page, with the vendor's own page and the date it was read. [catalog/plans.json](../catalog/plans.json) holds the plans across all vendors.

## OpenCode 2

The key store, hidden prompt, `--standalone`, update and `{env:VAR}` rules are in [OpenCode 2 rules](reference/opencode-2.md).

## Rules every guide follows

| Rule | Source |
| --- | --- |
| Free tiers and included credits only | [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| A CLI login or OAuth first; an env var name, never a key value | [Git Crafter key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| The Guard column names the vendor's own stop at the free limit, and what removes it | [CONTRIBUTING.md](../CONTRIBUTING.md) |

## Names

The vendor, the plan and the consumer name every plan, key and variable: see [Names](reference/names.md).
