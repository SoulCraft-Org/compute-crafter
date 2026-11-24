# ComfyUI: traps and sources

What goes wrong with ComfyUI, and the pages this guide read. The guard and steps are in [ComfyUI detail](comfyui.md). The diagram and wiring are in [ComfyUI](../comfyui.md).

## Traps

| Trap | What happens |
| --- | --- |
| Free plan and MCP generations | The MCP runs generations only on an active subscription ([Comfy MCP](https://docs.comfy.org/agent-tools/mcp), read 2026-11-24) |
| Partner Nodes | They spend credits from the same pool as GPU time. Price a graph before it runs ([Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-12) |
| `--api-key` on `comfy generate` | It puts the key on the command line. Use `comfy cloud login` ([Comfy CLI reference](https://docs.comfy.org/comfy-cli/reference), read 2026-11-12) |
| Automatic consent | `comfy generate consent always`, `--yes` on a spend and `spend.auto_confirm=true` skip the spend prompt. Git Crafter's Comfy rules forbid all three |
| Cloud upload telemetry | `comfy tracking disable` does not cover it. Only `DO_NOT_TRACK` or `COMFY_NO_TELEMETRY` does ([comfy-cli README](https://github.com/Comfy-Org/comfy-cli), read 2026-11-12) |
| Local MCP in the browser apps | Browser clients such as claude.ai take only remote connectors, so they cannot use `comfy-mcp` ([Comfy MCP local](https://docs.comfy.org/agent-tools/local), read 2026-11-24) |
| A committed `.mcp.json` | It starts a command on every machine that trusts the repo. Register servers per user |
| Claude Code CLI route | Comfy's page also shows a Claude Code plugin and command. This guide uses the app's connector screens |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Comfy Cloud pricing](https://www.comfy.org/cloud/pricing) | 2026-11-24 |
| [Comfy MCP](https://docs.comfy.org/agent-tools/mcp) | 2026-11-24 |
| [Comfy MCP local](https://docs.comfy.org/agent-tools/local) | 2026-11-24 |
| [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers) | 2026-11-24 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |
| [Comfy CLI getting started](https://docs.comfy.org/comfy-cli/getting-started) | 2026-11-12 |
| [Comfy CLI reference](https://docs.comfy.org/comfy-cli/reference) | 2026-11-12 |
| [comfy-cli README](https://github.com/Comfy-Org/comfy-cli) | 2026-11-12 |
| [Git Crafter Comfy rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/comfy.md) | 2026-11-12 |

</details>
