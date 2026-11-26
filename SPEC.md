# Compute Crafter spec

| Field | Value |
|---|---|
| Status | Draft, 2026-11-25. Waits for the owner's answer on the open choices |
| Repo | `SoulCraft-Org/compute-crafter`, public, Apache-2.0 |
| Written from | [README](README.md), [AGENTS.md](AGENTS.md), [GOVERNANCE](GOVERNANCE.md), [guides/](guides/README.md) and the open issues. No goal here is new |
| Tracks | #278 |

```mermaid
flowchart LR
  C[Plan catalog: 170 plans, 6 lanes] --> G[Provider guide] --> L[Sign in] --> S[Spend stop] --> W[Wire into OpenCode] --> Q[Score page]
```

## Purpose

Wire open-weight compute into the OpenCode Desktop App, on free credits and flat subscriptions. Then keep your list, sign-ins and score page. The starters work with any client, but this repo promotes only open weights and OpenCode.

## Goals

| Goal | Measured by |
|---|---|
| Free credits and flat plans only, never pay-per-use | Every guide opens with a spend guard |
| No key value in a session | CLI login and OAuth first, env var names only |
| Every free-tier figure cites the vendor's page and the date read | `CONTRIBUTING.md`, `tools/voice_lint.py` |
| Nothing private ships | `tests/privacy.mjs` on every page build |
| Quality page and Spend map at goal | The live score page |

## Not goals

| Not | Why |
|---|---|
| Editing plan rows | They are edited in compute-credits. `catalog/` is a pinned copy |
| Holding accounts, keys or balances | Vendor facts only |
| Guides for closed models or their clients, such as Claude Desktop | The repo promotes open weights and OpenCode. Starters may serve any client |

## Parts

| Part | Folder |
|---|---|
| Provider guides | `guides/` |
| Pinned plan catalog and 66 sign-in vendors | `catalog/` |
| Four starters: list, logins, quality, process | `templates/` |
| Credits pack and Spend map | `pack.json`, `collectors/`, `maps/` |

## Roadmap, from the open issues

| Theme | Issues |
|---|---|
| Re-read dated cites, re-pin the catalog after 2026-11-30 | #208, #209 |
| Pin the upstream Claudius release | #270, #274 |
| Confirm each OpenCode cell | #204 |
| Quality page: unmeasured metrics, words before first action | #231, #285 |

## Open choices

| # | Choice | Recommendation |
|---|---|---|
| 1 | Closed models: none. Owner decision 2026-11-26: OpenCode only, open weights only | Closed |
| 2 | Catalog: keep the pinned copy, or move plan rows here | Keep the copy: one source of rows |
| 3 | Re-read cadence: every 14 days, or on each provider change | Every 14 days, one issue |
| 4 | Providers: only free or flat plans, or every provider | Only free or flat plans |
