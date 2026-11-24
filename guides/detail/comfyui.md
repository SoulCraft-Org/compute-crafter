# ComfyUI: guard and set up

What the ComfyUI guide moved out of its page. Traps and sources: [ComfyUI traps and sources](comfyui-traps.md). The diagram and wiring are in [ComfyUI](../comfyui.md).

## Guard

| Spend | Stop | Source |
| --- | --- | --- |
| Standard plan | $20 a month, or $192 billed yearly with 50,400 credits a year | [Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-24 |
| Top-ups | Bought by hand at any time. Plan credits spend first, and top-ups stay valid 1 year | [Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-24 |
| Limits | Team spending limits (per user, project and workspace) and auto-recharge are not yet available. Comfy says it is "actively building" them | [Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-24 |
| Rule | Read the balance before and after a paid run | [Git Crafter Comfy rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/comfy.md) |

## Set up

1. To run ComfyUI on a GPU you rent or own, use [ComfyUI Base](https://github.com/SoulCraft-Org/comfyui-base). Its README holds the installer and per-host recipes.
2. Install comfy-cli and turn its telemetry off ([getting started](https://docs.comfy.org/comfy-cli/getting-started), read 2026-11-24).
3. For Comfy Cloud, run `comfy cloud login`, `comfy cloud whoami` to confirm the sign-in, then `comfy cloud status` to read the balance before any run ([comfy-cli README](https://github.com/Comfy-Org/comfy-cli), read 2026-11-24).
4. Claude Desktop App: Customize, Connectors, the plus button, Add custom connector. Name it, enter `https://cloud.comfy.org/mcp`, click Add, then pick your workspace in the browser ([Comfy MCP](https://docs.comfy.org/agent-tools/mcp), read 2026-11-24).
5. Browsing templates, models and nodes is free with a Comfy account. Running generations needs an active subscription. Credits alone do not count.
6. OpenCode Desktop App: Comfy says any client with remote HTTP MCP can use the URL. Add it with the `opencode mcp add` line from the commands block, which OpenCode documents ([MCP servers](https://opencode.ai/docs/mcp-servers), read 2026-11-24).
7. For a ComfyUI on your own machine, install `comfy-mcp` and leave `comfy launch` running. The server does not start ComfyUI. Set `COMFY_BIN` in the server's environment block only when `comfy` is off the client's PATH ([Comfy MCP local](https://docs.comfy.org/agent-tools/local), read 2026-11-24).
8. `comfy skills install` adds the bundled agent skills, and `comfy skills list` names them ([comfy-cli README](https://github.com/Comfy-Org/comfy-cli), read 2026-11-24).
9. Start local ComfyUI on an explicit port, not the vendor default. After a paid run, run `comfy cloud status` again and compare.
