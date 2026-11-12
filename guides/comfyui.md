# ComfyUI

ComfyUI runs open-weight image and video workflows, and its MCP servers let Claude Code drive it on Comfy Cloud, a rented GPU or your own box.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| A Comfy account for Comfy Cloud. Whether the Free plan needs a card is not published. Self-hosted ComfyUI needs no account | Free: "5 free runs on real GPUs and free Comfy Agent credits for new users". Standard: $20 a month or $192 billed yearly, 50,400 credits per year ([Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-12) | `comfy cloud login` (browser OAuth with PKCE). MCP: OAuth through `/mcp` | Comfy Cloud MCP `https://cloud.comfy.org/mcp`: `claude mcp add --transport http comfy-cloud https://cloud.comfy.org/mcp`. Local: `comfy-mcp` | None as a model provider. Add the Cloud MCP with `opencode mcp add` | Plan credits pay for GPU time and Partner Nodes; top-ups are manual ([Comfy Cloud pricing](https://www.comfy.org/cloud/pricing), read 2026-11-12). Buying a top-up raises the stop. [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md), [Git Crafter Comfy rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/comfy.md) |

## Set up

1. To run ComfyUI on a GPU you rent or own, use [ComfyUI Base](https://github.com/SoulCraft-Org/comfyui-base). Its README and handbook hold the installer, the per-host recipes and its MCP driver.
2. Install comfy-cli ([Comfy CLI getting started](https://docs.comfy.org/comfy-cli/getting-started), read 2026-11-12). Turn its telemetry off.

   ```bash
   pip install comfy-cli
   comfy tracking disable
   ```

3. For Comfy Cloud, log in and read the balance before any run.

   ```bash
   comfy cloud login
   comfy cloud whoami
   comfy cloud status
   ```

4. Connect the Comfy Cloud MCP. Generations need an active Comfy Cloud subscription; searching templates, models and nodes is free ([Comfy MCP](https://docs.comfy.org/agent-tools/mcp), read 2026-11-12).

   ```bash
   claude mcp add --transport http comfy-cloud -s user https://cloud.comfy.org/mcp
   opencode mcp add comfy-cloud --global --url https://cloud.comfy.org/mcp
   ```

   In Claude Code, run `/mcp`, pick **comfy-cloud** and choose **Authenticate**.

5. For a ComfyUI on your own machine, install the local server and register it ([Comfy MCP local](https://docs.comfy.org/agent-tools/local), read 2026-11-12). Set `COMFY_BIN` with `-e` only when `comfy` is off the client's PATH.

   ```bash
   pip install comfy-mcp
   claude mcp add comfy-mcp --scope user -- comfy-mcp
   ```

6. Start a local ComfyUI on an explicit port, not the vendor default. Arguments after `--` go to ComfyUI.

   ```bash
   comfy launch -- --listen 127.0.0.1 --port 3103
   ```

7. Agent skills install with `comfy skills install`; `comfy skills list` names them.
8. After a paid run, run `comfy cloud status` again and compare the two balances.

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
