# Zed

Zed is a free editor that runs open-weight models on your own provider keys. It runs OpenCode and Goose as external agents over the Agent Client Protocol (ACP).

```mermaid
flowchart LR
  P[Zed editor] --> S[Sign in<br/>none for the editor,<br/>keys in the keychain] --> G[Spend stop<br/>Zed Free bills nothing,<br/>Pro spend limit]
  G -.-> O[OpenCode Desktop App<br/>not confirmed]
```

| Account | Free tier | Login or key | OpenCode | Guard |
| --- | --- | --- | --- | --- |
| None for the editor. A Zed sign-in is needed only for Zed-hosted models ([Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-24). | Zed Free is $0 forever, with unlimited use of your own API keys or external agents ([Pricing](https://zed.dev/pricing), read 2026-11-24). | Keys saved in **Settings > AI > LLM Providers** go to the keychain, not `settings.json` ([Use API Access](https://zed.dev/docs/ai/use-api-access), read 2026-11-24). | Not confirmed for the Desktop App. Zed runs `opencode acp` ([OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24). | On Free, Zed bills nothing. On Pro, the spend limit defaults to $10 and accepts $0 ([Plans & Pricing](https://zed.dev/docs/ai/plans-and-usage), read 2026-11-24). [More](detail/zed.md#guard). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Wiring

| Host | Plugs in as | Source |
| --- | --- | --- |
| OpenCode Desktop App | Not confirmed. Zed runs `opencode acp` with the credentials the OpenCode CLI holds. The Desktop App is not named. | [OpenCode ACP](https://opencode.ai/docs/cli/acp), read 2026-11-24; [External Agents](https://zed.dev/docs/ai/external-agents), read 2026-11-24 |

<details>
<summary>Commands</summary>

```bash
opencode auth login
```

```json
{ "agent_servers": { "OpenCode": { "type": "custom", "command": "opencode", "args": ["acp"] } } }
```

</details>

Providers, guard and agents: [Zed detail](detail/zed.md). Traps and sources: [Zed traps and sources](detail/zed-traps.md).
