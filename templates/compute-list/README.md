# Compute list starter

Your own list of the plans you hold, built from [catalog/plans.json](../../catalog/plans.json). Bash and jq only. The board is one HTML file that loads nothing. It has the same shape as the [logins starter](../logins/README.md).

| Step | Do |
| --- | --- |
| 1 | Make a private repository and copy this folder into it, with its `.gitignore` |
| 2 | Run `bash sync.sh`. It copies the catalog at a Compute Crafter commit into `vendor/plans.json` and writes that commit to `vendor/PIN` |
| 3 | Copy `mine.example.json` to `mine.json`: one row per plan, with the catalog `id` |
| 4 | Put one `<!-- sheet:start -->` line in your README, and one `<!-- sheet:end -->` line after it. Then run the sheet. With the markers missing, repeated or out of order, `--write` leaves the file as it was and exits 2 |
| 5 | Build `board.json`, open `board.html` in a browser and pick `board.json` |

```bash
bash sync.sh
bash sheet.sh vendor/plans.json mine.json --write README.md
bash sheet.sh vendor/plans.json mine.json --json > board.json
```

```mermaid
flowchart LR
  C[catalog/plans.json<br/>at one commit] -->|sync.sh| V[vendor/plans.json<br/>and vendor/PIN]
  V --> S[sheet.sh]
  M[mine.json<br/>your plans] --> S
  S --> R[Your README sheet]
  S -->|--json| B[board.json] --> H[board.html<br/>opens locally]
```

| File | Holds | In git |
| --- | --- | --- |
| `sync.sh` | The copy of the catalog, and its pin | yes |
| `sheet.sh` | The sheet and the board input | yes |
| `board.html` | The board, which reads `board.json` in your browser | yes |
| `mine.example.json` | Six example plans | yes |
| `mine.json` | Your plans, status and notes | yes, in a private repo |
| `vendor/plans.json`, `vendor/PIN` | The catalog copy, and `owner/repo@sha` of its commit | yes |
| `board.json` | The board's input, built from both | never |
| `.gitignore` | Keeps `board.json` and `local/` out | yes |

## mine.json

| Key | Holds |
| --- | --- |
| `plans[].id` | A catalog plan `id`. One not in the catalog is flagged with a ❔ and never dropped |
| `plans[].have` | `true` when you hold the plan |
| `plans[].status` | `use` (work runs on it), `idle` (held, unused), `want` (to claim) or `skip` |
| `plans[].notes` | Your words. The sheet prints them as text, never as markup |
