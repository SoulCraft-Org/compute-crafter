# Quality starter

Your own Quality, Speed and Consumption page for the free tiers and credits you hold. It loads the Credits pack of this repo at one commit, and reads three small files you own. Copy this folder to `quality/` in your repo. Every file here holds fake example data from `example.com`.

| Step | Do |
| --- | --- |
| 1 | Copy this folder to `<your repo>/quality/`, with its `.gitignore`. Add `.code-os-packs/` to your repo's root `.gitignore` |
| 2 | Check the pin in `config.json`: `SoulCraft-Org/compute-crafter@<40-hex sha>`. To move to a newer commit, paste its full SHA. A tag or branch is refused, because a pack runs in CI |
| 3 | Replace the fake data: `inputs/systems.json` (limits), `inputs/usage.json` (use this cycle) and `inputs/registry/free.json` (free tiers). Then list your allowances in `targets/credits.json` |
| 4 | Run it on your machine: clone the pack at the pinned SHA into `.code-os-packs/SoulCraft-Org/compute-crafter`, then run `node <git-crafter>/quality/collect.mjs --local --only credits` from your repo's root |
| 5 | Copy Git Crafter's [`pages.yml`](https://github.com/SoulCraft-Org/git-crafter/blob/main/templates/ci/pages.yml) and the [process starter](../process/README.md). A push to main builds your page |

```mermaid
flowchart LR
  I[inputs/<br/>limits, use, free tiers] --> T[targets/credits.json<br/>your allowances]
  T --> L[Local run<br/>all 6 metrics]
  P[config.json<br/>pins the pack] --> C[CI run<br/>registry_age_days only]
  L --> D[data/local.json]
  D --> G[Your page<br/>Credits tab]
  C --> G
```

## What each metric reads

| Metric | Kind | File it needs | Runs |
| --- | --- | --- | --- |
| `credits.idle_replaceable` | quality | `inputs/systems.json`, `inputs/usage.json`, `inputs/registry/free.json` | local |
| `credits.unclaimed_free` | quality | `inputs/registry/free.json` | local |
| `credits.highest_used_share` | quality | `inputs/systems.json`, `inputs/usage.json` | local |
| `credits.actions_pool_used` | consumption | `inputs/systems.json`, `inputs/usage.json` | local |
| `credits.usage_read_share` | speed | `inputs/usage.json` | local |
| `credits.registry_age_days` | speed | the read dates in `inputs/`, and the pack's `catalog/plans.json` | CI and local |

A CI run reads no file of yours, so five metrics stay "not measured" there until a local run feeds them. `targets/credits.json` is one entry: Git Crafter merges a targets file's params key by key, so it feeds all six.

## Files

| File | Holds | In git |
| --- | --- | --- |
| `config.json` | The pack pin, and the one tab shown | yes |
| `targets/credits.json` | Paths, claim lanes, allowances and what each could take over | yes |
| `inputs/systems.json` | Each allowance's limit, the vendor page and the date read | private repo only |
| `inputs/usage.json` | What each allowance has used this cycle | private repo only |
| `inputs/registry/free.json` | One row per free tier: lane, price, `org_status` | private repo only |
| `.gitignore` | The page build's output | yes |

## Paths

A relative path is from your repo's root.

| Path form | Reads from |
| --- | --- |
| `quality/inputs/x.json` | Your repo's root, so your own files |
| `~/compute/x.json` | Your home folder |
| `.code-os-packs/SoulCraft-Org/compute-crafter/catalog/plans.json` | The pack's checkout, where Git Crafter puts it by default, so the page also scores the age of the public catalog |

Use the `~/` form for the catalog too when `CODE_OS_PACKS` moves the pack elsewhere.
