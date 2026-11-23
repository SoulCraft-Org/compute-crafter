# ComfyUI: traps and sources

What goes wrong with ComfyUI, and the pages this guide read. The steps are in [ComfyUI](../comfyui.md).

## Traps

| Trap | What happens |
| --- | --- |
| Free plan and MCP generations | The MCP runs generations only on an active subscription ([Comfy MCP](https://docs.comfy.org/agent-tools/mcp), read 2026-11-12). |
| Partner Nodes | They spend the same credit pool as GPU time ([Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-12). Price a graph before it runs |
| Spend controls | Team spending limits and auto-recharge are announced, not shipped ([Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-12). The plan's credit is the only stop |
| `--api-key` on `comfy generate` | It puts the key on the command line. Prefer `comfy cloud login`; a key goes in `COMFY_API_KEY` from your password manager ([Comfy CLI reference](https://docs.comfy.org/comfy-cli/reference), read 2026-11-12) |
| Automatic consent | `comfy generate consent always`, `--yes` on a spend and `spend.auto_confirm=true` skip the spend prompt. Git Crafter's Comfy rules forbid all three |
| Cloud upload telemetry | `comfy tracking disable` does not cover it. Only `DO_NOT_TRACK` or `COMFY_NO_TELEMETRY` turns it off ([comfy-cli README](https://github.com/Comfy-Org/comfy-cli), read 2026-11-12) |
| A committed `.mcp.json` | It starts a command on every machine that trusts the repo. Register MCP servers at user scope |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Comfy Cloud pricing](https://www.comfy.org/cloud/pricing) | 2026-11-12 |
| [Comfy CLI getting started](https://docs.comfy.org/comfy-cli/getting-started) | 2026-11-12 |
| [Comfy CLI reference](https://docs.comfy.org/comfy-cli/reference) | 2026-11-12 |
| [comfy-cli README](https://github.com/Comfy-Org/comfy-cli) | 2026-11-12 |
| [Comfy MCP](https://docs.comfy.org/agent-tools/mcp) | 2026-11-12 |
| [Comfy MCP local](https://docs.comfy.org/agent-tools/local) | 2026-11-12 |
| [ComfyUI Base README](https://github.com/SoulCraft-Org/comfyui-base) | 2026-11-12 |
| [OpenCode MCP servers](https://opencode.ai/docs/mcp-servers) | 2026-11-12 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |
| [Git Crafter Comfy rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/comfy.md) | 2026-11-12 |

</details>
