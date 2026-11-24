# Meshy: guard and set up

What the Meshy guide moved out of its page. Traps and sources: [Meshy traps and sources](meshy-traps.md). The diagram and wiring are in [Meshy](../meshy.md).

## Guard

| Spend | Stop | Source, read 2026-11-24 |
| --- | --- | --- |
| Plan credits | Too few gets HTTP 402. Plan credits reset monthly and do not accumulate | [Errors](https://docs.meshy.ai/en/api/errors), [Pricing](https://www.meshy.ai/pricing) |
| Extra credit pack | Permanent credits remove the stop. Git Crafter's compute rules forbid one | [Pricing](https://www.meshy.ai/pricing) |
| One API key | A Monthly credit limit on the key | [Authentication](https://docs.meshy.ai/en/api/authentication) |
| One run | `--max-credits` refuses a run estimated over it. `--dry-run` prints an estimate | [INSTALL.md](https://github.com/meshy-dev/meshy-3d-agent/blob/main/INSTALL.md) |

## Set up

1. Subscribe to Pro at https://www.meshy.ai/pricing. Buy no extra pack.
2. Install the CLI. The skills are written for meshy-cli 0.8 on Node.js 22.12 or later ([meshy-3d-agent](https://github.com/meshy-dev/meshy-3d-agent), read 2026-11-24).
3. In the Claude Desktop App, open Plugins and add the marketplace `meshy-dev/meshy-3d-agent`. Install `meshy-3d-generation`. The Plugins screen is in the [Desktop docs](https://code.claude.com/docs/en/desktop), read 2026-11-24. The marketplace step was not tried here.
4. Sign in with the device flow and approve the code at `https://www.meshy.ai/device` within 10 minutes. The CLI keeps the session encrypted under a Keychain key on macOS ([INSTALL.md](https://github.com/meshy-dev/meshy-3d-agent/blob/main/INSTALL.md), read 2026-11-24).
5. Price a run, then run it, then read the balance.
6. Save each model as its task finishes. Meshy deletes API output three days after generation ([Terms of Use](https://www.meshy.ai/terms-of-use), read 2026-11-24).

## Local MCP server

Create a key at https://www.meshy.ai/developers/keys and set its Monthly credit limit. The page shows it once ([Authentication](https://docs.meshy.ai/en/api/authentication), read 2026-11-24). Store it in the Keychain as `meshy:claude-code` ([Names](../reference/names.md)). `security` asks for the value at a hidden prompt when `-w` comes last (`man security`).

A server in `claude_desktop_config.json` works in a Cowork session on this computer, not in cloud Cowork ([Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), read 2026-11-24). Whether the Code tab reads that file is not confirmed. Set the config's command to `sh` with the launcher below, so the file holds a lookup and never the key.

<details>
<summary>Commands</summary>

```bash
security add-generic-password -s meshy:claude-code -a "$USER" -w
sh -c 'MESHY_API_KEY="$(security find-generic-password -s meshy:claude-code -w)" exec npx -y @meshy-ai/meshy-mcp-server@0.6'
meshy balance
meshy make ./hero.png -o out/hero/ --max-credits 40
```

</details>
