# Modal: traps and sources

What goes wrong with Modal, and the pages this guide read. The steps are in [Modal](../modal.md).

## Traps

| Trap | What happens |
| --- | --- |
| Shared Endpoints and the free credit | Plan credits cannot pay for Shared Endpoint tokens ([Shared Endpoints](https://modal.com/docs/guide/shared-endpoints), read 2026-11-12). The first request bills money, not credit |
| A deployed app left running | `modal deploy` keeps the app live. `modal app stop <app>` stops it and terminates its containers ([CLI app](https://modal.com/docs/reference/cli/app), read 2026-11-12). Do it the same day |
| `modal config show --no-redact` | It shows secret credential values. Use `modal token info` to check the login |
| `modal token set --token-secret` | It puts the secret on the command line and in shell history. Use `modal setup` |
| Token in the environment | `MODAL_TOKEN_ID` and `MODAL_TOKEN_SECRET` take precedence over `~/.modal.toml` ([Config reference](https://modal.com/docs/reference/modal.config), read 2026-11-12). Keep them out of dotfiles |
| Environment budgets | They need the Team plan ([Plan pricing](https://modal.com/pricing), read 2026-11-12). On Starter the workspace spend limit is the only cap |
| Service users for CI | They need the Team or Enterprise plan ([Service users](https://modal.com/docs/guide/service-users), read 2026-11-12) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Modal plan pricing](https://modal.com/pricing) | 2026-11-12 |
| [Modal user account setup](https://modal.com/docs/guide/modal-user-account-setup) | 2026-11-12 |
| [Modal budgets and spend limits](https://modal.com/docs/guide/budgets) | 2026-11-12 |
| [Modal workspaces](https://modal.com/docs/guide/workspaces) | 2026-11-12 |
| [Modal Endpoints](https://modal.com/docs/guide/endpoints) | 2026-11-12 |
| [Modal Shared Endpoints](https://modal.com/docs/guide/shared-endpoints) | 2026-11-12 |
| [Modal endpoint integrations](https://modal.com/docs/guide/endpoint-integrations) | 2026-11-12 |
| [Modal config reference](https://modal.com/docs/reference/modal.config) | 2026-11-12 |
| [Modal CLI: config](https://modal.com/docs/reference/cli/config) | 2026-11-12 |
| [Modal CLI: app](https://modal.com/docs/reference/cli/app) | 2026-11-12 |
| [Modal service users](https://modal.com/docs/guide/service-users) | 2026-11-12 |
| [models.dev provider catalog](https://models.dev/api.json) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-12 |

</details>
