# Modal: guard and set up

What the Modal guide moved out of its page. The diagram and wiring are in [Modal](../modal.md).

## Guard

| Item | Figure | Source |
| --- | --- | --- |
| Spend limit | A monthly cap on net charges after credits. Owners and Managers set it under Settings, Usage & Billing | [Budgets](https://modal.com/docs/guide/budgets), read 2026-11-24 |
| Default | Without a custom value, it equals the usage limit minus credits | [Budgets](https://modal.com/docs/guide/budgets), read 2026-11-24 |
| Removal | **Reset to default** clears a custom value | [Budgets](https://modal.com/docs/guide/budgets), read 2026-11-24 |
| Members | Inviting members needs a payment method | [Workspaces](https://modal.com/docs/guide/workspaces), read 2026-11-12 |
| Credit coverage | Included usage "does not apply to Model APIs, which are billed per token" | [Plan pricing](https://modal.com/pricing), read 2026-11-24 |

## Set up

| Step | What |
| --- | --- |
| 1. CLI | `pip install modal`, then `modal setup` opens a browser login. `modal token info` checks it |
| 2. Spend limit | Set it before the first run. Lower it if the default is above what you accept |
| 3. Your own GPU code | `modal run` is one run. `modal deploy` keeps an app live until `modal app stop <app>` ([CLI app](https://modal.com/docs/reference/cli/app), read 2026-11-12) |
| 4. Model API | Create one and a proxy token. Join the token ID and secret with a period and keep it in your password manager |
| 5. OpenCode | Set `MODAL_PROXY_TOKEN` from that store in one shell, never a dotfile. Start `opencode --standalone`: the shared service cannot see it ([CLI providers](https://opencode.ai/docs/cli/providers), read 2026-11-20) |

Traps and sources: [Modal traps and sources](modal-traps.md).
