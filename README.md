# Compute Crafter

![Open-weight models flow through a guide, a sign-in and a spend stop into the OpenCode and Claude Desktop Apps](assets/hero.svg)

Wire open-weight compute into the OpenCode Desktop App first and the Claude Desktop App second, on free credits and flat subscriptions. Then keep your list, sign-ins and score page.

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

One guide per provider, opening with a table of account, free tier, login, connector and guard. [All guides](guides/README.md).

## Starters

Copy one folder; its README has the steps.

| Starter | You get |
| --- | --- |
| 🗂️ [compute-list](templates/compute-list/README.md) | A sheet and board of your plans |
| 🔐 [logins](templates/logins/README.md) | A sheet and board of your sign-ins |
| 📈 [quality](templates/quality/README.md) | Your Quality, Speed and Consumption page, pinned to this pack |
| 🗺️ [process](templates/process/README.md) | The five-step Spend map on your Process page |

## Three doors

| Door | Holds |
| --- | --- |
| 🔌 [compute-crafter](https://github.com/SoulCraft-Org/compute-crafter) | This repo: guides, sign-ins, starters, score pages |
| 💳 [compute-credits](https://github.com/Colorado-Compute/compute-credits) | The plan catalog and its Credits Explorer. [catalog/](catalog/README.md) here is a pinned copy |
| 🚀 [startup-credits](https://github.com/Colorado-Startups/startup-credits) | Startup programs |

## Folder map

| Folder | Holds |
|---|---|
| `assets/` | Hero image, social preview |
| `catalog/` | Pinned plan catalog and sign-in vendors |
| `collectors/` | The Credits collector and the engine door |
| `docs/` | Spend notes, handoff notes, the spec |
| `guides/` | Provider guides, checklist, CI guides |
| `ideals/` | The Credits tab's ideals |
| `maps/` | The spend map |
| `quality/` | Quality page config, targets, process maps |
| `site/` | The wiring map page |
| `targets/` | The Credits tab's targets |
| `templates/` | The four starters |
| `tests/` | Pin, bridge, logins and pack tests |
| `tools/` | Voice lint and the private-terms scan |

## Rules every page follows

| Rule | Source |
| --- | --- |
| Free credits and flat monthly plans with a lot of usage; never pay-per-use | [Compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |
| No key value in a session: CLI logins and OAuth first, env var names only | [Key rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/keys.md) |
| Every free-tier figure cites the vendor's own page and the date read | [CONTRIBUTING.md](CONTRIBUTING.md) |
| A Claude Code Project stays on its flat plan: usage credits off, spend limit at zero, three free ultrareviews | [Spend guards](docs/claude-code-projects-spend.md) |

## Built on

[Git Crafter](https://github.com/SoulCraft-Org/git-crafter) supplies the CI standard and the Claude rules, and the Credits pack (`pack.json`) moved from it ([NOTICE](NOTICE)). [pages.yml](.github/workflows/pages.yml) builds the Quality and Process pages after the [privacy gate](tests/privacy.mjs).

Published by [SoulCraft-Org](https://github.com/SoulCraft-Org) under [Apache-2.0](LICENSE).
