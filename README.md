# Compute Crafter

![Open-weight models flow through a guide, a sign-in and a spend stop into OpenCode desktop first and Claude Code second](assets/hero.svg)

Wire open-source and open-weight compute into OpenCode desktop first and Claude Code second, on free tiers and included credits. Then keep your own list, sign-ins and score page.

## [📊 Open the live score page](https://soulcraft-org.github.io/compute-crafter/)

[![170 plans](https://img.shields.io/badge/plans-170-0b5fc4)](catalog/README.md) ![6 lanes](https://img.shields.io/badge/lanes-6-0b5fc4) [![66 sign-in vendors](https://img.shields.io/badge/sign--in_vendors-66-0b5fc4)](catalog/logins.json) ![166 verified](https://img.shields.io/badge/verified-166-2ea44f) [![4 starters](https://img.shields.io/badge/starters-4-c4572b)](#starters) [![Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-555)](LICENSE)

```mermaid
flowchart LR
  G[Pick a provider guide] --> S[Sign in] --> C[Set the spend stop] --> W[Wire into OpenCode or Claude Code] --> Q[Score it]
```

## Provider guides

Each opens with one table: account, free tier, login or key, Claude connector, OpenCode, guard. [All guides](guides/README.md).

| Guide | Lane |
| --- | --- |
| 🤗 [Hugging Face](guides/hugging-face.md) | Inference, GPU |
| 🟩 [NVIDIA](guides/nvidia.md) | Inference |
| ⚡ [Groq](guides/groq.md) | Inference |
| 🔀 [OpenRouter](guides/openrouter.md) | Inference |
| 🤝 [Together AI](guides/together.md) | Inference |
| ☁️ [Cloudflare Workers AI](guides/cloudflare-workers-ai.md) | Inference |
| 🦙 [Ollama](guides/ollama.md) | Inference |
| 🧠 [Claude API](guides/claude-api.md) | Inference |
| 🧱 [Modal](guides/modal.md) | GPU |
| 🖥️ [RunPod](guides/runpod.md) | GPU |
| 🔴 [AMD](guides/amd.md) | GPU |
| 🌐 [Google Cloud](guides/google-cloud.md) | CPU, GPU |
| 🎨 [ComfyUI](guides/comfyui.md) | GPU |
| 🧊 [Meshy](guides/meshy.md) | 3D |
| 🧩 [Claude Desktop MCP](guides/claude-desktop-mcp.md) | Client |
| 🐙 [GitHub](guides/github.md) | CI, tools |
| 💻 [Local models](guides/local-models.md) | Local |
| 🔑 [Logins](guides/logins.md) | Accounts |
| 🏋️ [Training](guides/training.md) | GPU |
| ✏️ [Zed](guides/zed.md) | Client |
| 🪿 [Goose](guides/goose.md) | Client |

## Starters

Copy one folder. Each README has its steps and a fake example.

| Starter | You get |
| --- | --- |
| 🗂️ [compute-list](templates/compute-list/README.md) | A sheet and a board of your plans |
| 🔐 [logins](templates/logins/README.md) | A sheet and a board of your sign-ins |
| 📈 [quality](templates/quality/README.md) | Your own Quality, Speed and Consumption page: the six Credits metrics, pinned to this pack |
| 🗺️ [process](templates/process/README.md) | The five-step Spend map on your Process page |

## Three doors

| Door | Holds |
| --- | --- |
| 🔌 [compute-crafter](https://github.com/SoulCraft-Org/compute-crafter) | This repo: guides, sign-ins, starters, score pages |
| 💳 [compute-credits](https://github.com/Colorado-Compute/compute-credits) | The plan catalog and its Credits Explorer. [catalog/](catalog/README.md) here is a pinned copy |
| 🚀 [startup-credits](https://github.com/Colorado-Startups/startup-credits) | Startup programs |

## Rules every page follows

| Rule | Source |
| --- | --- |
| Free tiers and included credits only; never metered billing past an included amount | [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| A session never holds a key value: CLI logins and OAuth first, env var names only | [Git Crafter key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| Every free-tier figure cites the vendor's own page and the date it was read | [CONTRIBUTING.md](CONTRIBUTING.md) |

## Built on

[Git Crafter](https://github.com/SoulCraft-Org/git-crafter) supplies the CI standard and the Claude Code rules. The Credits pack (`pack.json`) moved from it ([NOTICE](NOTICE)). [pages.yml](.github/workflows/pages.yml) builds the Quality page (11 library tabs plus Credits) and the Process page (every library map plus Spend) after the [privacy gate](tests/privacy.mjs), and shows only what CI reads. The [ComfyUI guide](guides/comfyui.md) links the [comfyui-base](https://github.com/SoulCraft-Org/comfyui-base) installer.

Published by [SoulCraft-Org](https://github.com/SoulCraft-Org) under [Apache-2.0](LICENSE).
