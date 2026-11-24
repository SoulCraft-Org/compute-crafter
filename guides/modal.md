# Modal

Modal gives the OpenCode Desktop App per-token Model APIs for open-weight models. It also runs serverless GPUs for your own code.

```mermaid
flowchart LR
  P[Modal] --> S[Sign in<br/>modal setup] --> G[Spend stop<br/>workspace spend limit]
  G --> O[OpenCode Desktop App<br/>provider modal]
  G -.-> C[Claude Desktop App, Code tab<br/>not confirmed]
  G -.-> W[Claude Desktop App, Cowork<br/>not confirmed]
```

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Browser sign-in. Whether Starter needs a card is not published ([Plan pricing](https://modal.com/pricing), read 2026-11-24). | Starter: $30 a month free compute ([Plan pricing](https://modal.com/pricing), read 2026-11-24), 3 seats. Model API tokens bill per token from the first request ([Plan pricing](https://modal.com/pricing), read 2026-11-24). | `modal setup`. Model APIs take a proxy token in `MODAL_PROXY_TOKEN`. | None. Modal documents hosting your own MCP server. | `modal`, base URL `https://inference.us-west.modal.direct/v1` ([models.dev](https://models.dev), read 2026-11-12). | A workspace spend limit stops workloads that cost out of pocket ([Budgets](https://modal.com/docs/guide/budgets), read 2026-11-24). Raising it removes the stop. [Detail](detail/modal.md#guard). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Wiring

| Host | Plugs in as | Source, read 2026-11-24 |
| --- | --- | --- |
| OpenCode Desktop App | `/connect`, pick Modal, enter the proxy token, then pick your Model API with `/models`. | [Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations) |
| Claude Desktop App, Code tab | Not confirmed. Modal's page names Claude Code, with environment variables, and not the Desktop App. | [Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations) |
| Claude Desktop App, Cowork | Not confirmed. No Modal page names Cowork. | [Endpoint integrations](https://modal.com/docs/guide/endpoint-integrations) |

<details>
<summary>Commands</summary>

```bash
pip install modal
modal setup
modal token info
modal endpoint create --shared --model <org/model>
modal workspace proxy-tokens create
```

</details>

Guard and set up: [Modal detail](detail/modal.md). Traps and sources: [Modal traps and sources](detail/modal-traps.md).
