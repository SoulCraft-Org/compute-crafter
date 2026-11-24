# Modal: traps and sources

What goes wrong with Modal, and the pages this guide read. The set up is in [Modal detail](modal.md). The diagram and wiring are in [Modal](../modal.md).

## Traps

| Trap | What happens |
| --- | --- |
| Model APIs and the free credit | The first request bills money, not credit. Modal's pricing page now says "Model APIs"; its Shared Endpoints page says "pay per token" ([Shared Endpoints](https://modal.com/docs/guide/shared-endpoints), read 2026-11-24) |
| A deployed app left running | Stop it the same day |
| `modal config show --no-redact` | It shows secret values. Use `modal token info` |
| `modal token set --token-secret` | It puts the secret in shell history. Use `modal setup` |
| Token in the environment | `MODAL_TOKEN_ID` and `MODAL_TOKEN_SECRET` outrank `~/.modal.toml` ([Config reference](https://modal.com/docs/reference/modal.config), read 2026-11-12) |
| Environment budgets | Listed for Team and Enterprise, not Starter ([Plan pricing](https://modal.com/pricing), read 2026-11-24) |
| Service users for CI | They need Team or Enterprise ([Service users](https://modal.com/docs/guide/service-users), read 2026-11-12) |
| Anthropic variables | `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-12) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Plan pricing](https://modal.com/pricing) | 2026-11-24 |
| [Budgets](https://modal.com/docs/guide/budgets) | 2026-11-24 |
| [Shared Endpoints](https://modal.com/docs/guide/shared-endpoints) | 2026-11-24 |
| [Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations) | 2026-11-24 |
| [CLI app](https://modal.com/docs/reference/cli/app) | 2026-11-12 |
| [Config reference](https://modal.com/docs/reference/modal.config) | 2026-11-12 |
| [Service users](https://modal.com/docs/guide/service-users) | 2026-11-12 |
| [models.dev](https://models.dev/api.json) | 2026-11-12 |
| [OpenCode CLI providers](https://opencode.ai/docs/cli/providers) | 2026-11-20 |
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-12 |
| [Workspaces](https://modal.com/docs/guide/workspaces) | 2026-11-12 |

</details>
