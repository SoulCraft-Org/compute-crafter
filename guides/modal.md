# Modal

Modal gives a Claude Code or OpenCode user serverless GPUs for their own code, plus per-token Shared Endpoints for open-weight models.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with a browser sign-in. Whether Starter needs a card is not published. Inviting members needs a payment method ([Workspaces](https://modal.com/docs/guide/workspaces), read 2026-11-12) | Starter: $30 a month of free compute credits and 3 workspace seats ([Plan pricing](https://modal.com/pricing), read 2026-11-12). Shared Endpoint tokens are not covered and bill from the first request ([Plan pricing](https://modal.com/pricing), read 2026-11-12) | `modal setup` (browser login). Shared Endpoints take a proxy token in `MODAL_PROXY_TOKEN` | None. Modal documents hosting your own MCP server, not one of its own | Provider id `modal` in the models.dev catalog, base URL `https://inference.us-west.modal.direct/v1`, env `MODAL_PROXY_TOKEN`. Connect with `/connect` | Workspace spend limit on Usage & Billing: past it, Modal stops workloads that would cost out of pocket ([Budgets](https://modal.com/docs/guide/budgets), read 2026-11-12). Raising it or **Reset to default** removes the cap. [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |

## Set up

1. Install the CLI and log in. The login opens a browser and stores the token for the CLI.

   ```bash
   pip install modal
   modal setup
   modal token info
   ```

2. Set the spend limit before the first run. Open **Settings**, then **Usage & Billing** (https://modal.com/settings/usage). Only Owners and Managers can change it.
3. Read the default first. With no custom value, the spend limit equals the usage limit minus credits ([Budgets](https://modal.com/docs/guide/budgets), read 2026-11-12). Set a lower one if that default is above what you accept.
4. For your own GPU code, run and stop it from the CLI. `modal run` is one run; `modal deploy` keeps an app live until you stop it.
5. For an open-weight model in OpenCode, create a Shared Endpoint and a proxy token. Both bill per token outside the plan credit.

   ```bash
   modal endpoint create --shared --model <org/model>
   modal workspace proxy-tokens create
   ```

6. Join the token ID and secret with a period, and keep the result in your password manager. Set `MODAL_PROXY_TOKEN` in the shell that starts OpenCode from that store, never in a dotfile.
7. In OpenCode, run `/connect`, pick Modal, then `/models` and pick the endpoint by its hostname ([Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations), read 2026-11-12).
8. Claude Code can use the same gateway through `ANTHROPIC_BASE_URL=https://inference.us-west.modal.direct` and `ANTHROPIC_AUTH_TOKEN`. The endpoint's model must support tool calling ([Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations), read 2026-11-12). Set both per command: they outrank a subscription login ([Authentication](https://code.claude.com/docs/en/iam), read 2026-11-12).

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
| [Claude Code authentication](https://code.claude.com/docs/en/iam) | 2026-11-12 |
