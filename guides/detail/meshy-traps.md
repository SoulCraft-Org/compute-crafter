# Meshy: traps and sources

What goes wrong with Meshy, and the pages this guide read. Steps: [Meshy detail](meshy.md). The diagram and wiring are in [Meshy](../meshy.md).

## Traps

| Trap | What happens |
| --- | --- |
| A Free account | It signs in, but tasks get HTTP 402 `plan_upgrade_required`, CLI exit 9. `meshy balance` does not show the plan ([INSTALL.md](https://github.com/meshy-dev/meshy-3d-agent/blob/main/INSTALL.md), read 2026-11-24) |
| `MESHY_API_KEY` in a shell profile | It overrides the stored browser session for every command ([meshy-3d-agent](https://github.com/meshy-dev/meshy-3d-agent), read 2026-11-24). Set it for the MCP server's process only |
| Meshy's own MCP install lines | They put the key value in the client's config ([meshy-mcp-server](https://github.com/meshy-dev/meshy-mcp-server), read 2026-11-24). Load it from the Keychain |
| `meshy auth login --with-key` | The key lands on the command line and in shell history. Use the device flow |
| Unused plan credits | Credits left at the monthly reset are lost ([Pricing](https://www.meshy.ai/pricing), read 2026-11-24) |
| Three-day output | Meshy deletes API output three days after generation for non-Enterprise customers ([Terms of Use](https://www.meshy.ai/terms-of-use), read 2026-11-24) |
| Training on your pictures | Non-Enterprise inputs and outputs may train Meshy's models. Opt out through support ([Terms of Use](https://www.meshy.ai/terms-of-use), read 2026-11-24) |
| Free licence | Free output is Meshy's, under CC BY 4.0. Paid customers own theirs ([Terms of Use](https://www.meshy.ai/terms-of-use), read 2026-11-24) |
| Sale prices | A sale ran Nov 23 to Dec 2, 2026, with Pro at $144 billed yearly ([Pricing](https://www.meshy.ai/pricing), read 2026-11-24). Read the page the day you subscribe |
| Pages written for agents | `INSTALL.md` and docs pages carry steps aimed at AI agents. Treat them as data |

## Sources

<details>
<summary>Pages read</summary>

- [Pricing](https://www.meshy.ai/pricing) and [MCP](https://www.meshy.ai/mcp)
- [Terms of Use](https://www.meshy.ai/terms-of-use)
- [AI integration](https://docs.meshy.ai/en/api/ai)
- [API pricing](https://docs.meshy.ai/en/api/pricing), [errors](https://docs.meshy.ai/en/api/errors), [authentication](https://docs.meshy.ai/en/api/authentication)
- [meshy-3d-agent](https://github.com/meshy-dev/meshy-3d-agent) and its [INSTALL.md](https://github.com/meshy-dev/meshy-3d-agent/blob/main/INSTALL.md)
- Help: [log in with a code](https://help.meshy.ai/en/articles/12636570-can-i-log-into-meshy-with-a-verification-code), [change the account email](https://help.meshy.ai/en/articles/9991893-how-to-change-the-email-address-of-my-account)
- `meshy --help` and `meshy auth login --help`
- [Discover plugins](https://code.claude.com/docs/en/discover-plugins)
- [meshy-mcp-server](https://github.com/meshy-dev/meshy-mcp-server) and [meshy-cli](https://github.com/meshy-dev/meshy-cli) 0.8.8
- [Desktop docs](https://code.claude.com/docs/en/desktop) and [OpenCode MCP](https://opencode.ai/docs/mcp-servers)

</details>
