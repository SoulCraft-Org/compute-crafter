# Compute Crafter

![Open-weight models flow through a guide, a sign-in and a spend stop into the OpenCode Desktop App first and the Claude Desktop App second](assets/hero.svg)

Wire open-weight compute into the OpenCode Desktop App first and the Claude Desktop App second, on free credits and flat subscriptions. Then keep your own list, sign-ins and score page.

## [📊 Open the live score page](https://soulcraft-org.github.io/compute-crafter/)

[![170 plans](https://img.shields.io/badge/plans-170-0b5fc4)](catalog/README.md) ![6 lanes](https://img.shields.io/badge/lanes-6-0b5fc4) [![66 sign-in vendors](https://img.shields.io/badge/sign--in_vendors-66-0b5fc4)](catalog/logins.json) ![166 verified](https://img.shields.io/badge/verified-166-2ea44f) [![4 starters](https://img.shields.io/badge/starters-4-c4572b)](#starters) [![Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-555)](LICENSE)

```mermaid
flowchart LR
  G[Pick a provider guide] --> S[Sign in] --> C[Set the spend stop] --> W[Wire into the OpenCode Desktop App or the Claude Desktop App] --> Q[Score it]
```

## Quickstart: use it from a Code Project

| # | Do | Where |
|---|---|---|
| 1 | Make a private repo for your plans. Attach it to a Code Project, with this repo read-only | [Code Projects](https://code.claude.com/docs/en/claude-projects) |
| 2 | Copy the compute-list starter into your private repo and run `bash sync.sh` | [templates/compute-list](templates/compute-list/README.md) |
| 3 | List the plans you hold in `mine.json`, give each a `lane` and a `rung`, and write its spend guard in `notes` | [Ladders](templates/compute-list/README.md#ladders) |
| 4 | Run `bash sheet.sh vendor/plans.json mine.json --ladders`. Use the first rung with room. A paid rung waits for your yes | the same page |

## Provider guides

Each opens with one table of account, free tier, login, connector and guard. [All guides](guides/README.md).

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

Copy one folder. Each README has its steps.

| Starter | You get |
| --- | --- |
| 🗂️ [compute-list](templates/compute-list/README.md) | A sheet and board of your plans |
| 🔐 [logins](templates/logins/README.md) | A sheet and board of your sign-ins |
| 📈 [quality](templates/quality/README.md) | Your own Quality, Speed and Consumption page, pinned to this pack |
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
| Free credits, plus flat monthly subscriptions that give a lot of usage or functionality; never pay-per-token or pay-per-use consumption | [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| A session never holds a key value: CLI logins and OAuth first, env var names only | [Git Crafter key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| Every free-tier figure cites the vendor's own page and the date it was read | [CONTRIBUTING.md](CONTRIBUTING.md) |
| A Claude Code Project stays on its flat plan: usage credits off or capped, three free ultrareviews | [Projects spend guards](docs/claude-code-projects-spend.md) |

## Built on

[Git Crafter](https://github.com/SoulCraft-Org/git-crafter) supplies the CI standard and the Claude rules. The Credits pack (`pack.json`) moved from it ([NOTICE](NOTICE)). [pages.yml](.github/workflows/pages.yml) builds the Quality and Process pages after the [privacy gate](tests/privacy.mjs). The [ComfyUI guide](guides/comfyui.md) links the [comfyui-base](https://github.com/SoulCraft-Org/comfyui-base) installer.

Published by [SoulCraft-Org](https://github.com/SoulCraft-Org) under [Apache-2.0](LICENSE).
