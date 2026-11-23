# Logins starter

Your own logins sheet and board, built from [catalog/logins.json](../../catalog/logins.json). Bash and jq only. The board is one HTML file that loads nothing. The guide is [guides/logins.md](../../guides/logins.md).

| Step | Do |
| --- | --- |
| 1 | Make a private repository and copy this folder into it, with its `.gitignore` |
| 2 | Copy `catalog/logins.json` from a Compute Crafter commit, and write that commit down |
| 3 | Copy `sites.example.json` to `sites.json`: one row per account, with the catalog id as `vendor` |
| 4 | Put one `<!-- sheet:start -->` line in your README, and one `<!-- sheet:end -->` line after it. Then run the sheet. With the markers missing, repeated or out of order, `--write` leaves the file as it was and exits 2 |
| 5 | Keep `status.json` on your machine, build `board.json`, open `board.html` in a browser and pick `board.json` |

```bash
bash sheet.sh logins.json sites.json --write README.md
bash sheet.sh logins.json sites.json --json status.json > board.json
```

| File | Holds | In git |
| --- | --- | --- |
| `sites.json` | Your order, your code apps, one row per site | yes, in a private repo |
| `status.json` | How far each account is | never |
| `board.json` | The board's input, built from both | never |

## sites.json

| Key | Holds |
| --- | --- |
| `order` | Sign-in methods, in the order you prefer |
| `codes` | The app for codes: `default`, then one per identity family (`apple`, `google`, `microsoft`) |
| `sites[]` | `id`, `vendor` (a catalog id) and `stage`; optional `name`, `codes`, `email` and `top` override one site, so two accounts at one vendor stay apart |

## status.json

| Key | Values |
| --- | --- |
| `login_method` | The method the account uses now |
| `email_ok` | `yes`, `no` or `na` |
| `passkey` | `passwords`, `elsewhere`, `none`, `na` or `unknown` |
| `codes_app` | `passwords`, `microsoft-authenticator`, `google-authenticator`, `none` or `na` |
| `recovery` | `passwords`, `printed`, `missing`, `na` or `unknown` |
| `links` | Sign-in methods linked to the account |
| `tested` | The date of the last private-window sign-in, or `null` |

A site is green when every check that applies to it passes: top sign-in, email, passkey, codes, recovery and tested.
