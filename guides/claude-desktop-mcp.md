# Claude Desktop: one MCP server for the Code tab and Cowork

The Claude desktop app has two places that use MCP tools: the Code tab (Claude Code) and Cowork. This guide picks the route that gives one server to both.

| Your server | Use | Reaches | Who adds it | Source |
| --- | --- | --- | --- | --- |
| A public HTTPS URL | A custom connector. | claude.ai, the mobile app, and the desktop app's chat, Cowork and Code tab. Claude Code in a terminal too, when signed in with a Claude account. | Free, Pro, Max and Ultra: you, at Customize > Connectors. Team and Enterprise: an Owner adds it for the organization. Each member then connects. | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), [unlisted connectors](https://claude.com/docs/connectors/custom/add-unlisted), [Claude Code MCP](https://code.claude.com/docs/en/mcp#how-connectors-reach-claude-code), read 2026-11-20 |
| An app that listens only on `127.0.0.1` | A desktop extension (`.mcpb`) built from [loopback-bridge/](loopback-bridge/). | The desktop app on that computer: Cowork and the Code tab's local sessions (source: a test on 2026-11-20). Not claude.ai, the mobile app or cloud sessions. | You, on each computer. Installation is per user. | [MCPB page](https://claude.com/docs/connectors/building/mcpb), read 2026-11-20 |
| A server in `~/.claude.json` or `.mcp.json` | Claude Code's own config. | Claude Code only, the Code tab included. Cowork takes its connectors from your Claude account, not from `~/.claude`. | You, with `claude mcp add`. | [Desktop docs](https://code.claude.com/docs/en/desktop#extend-claude-code), read 2026-11-20 |
| A server in `claude_desktop_config.json` | Claude Desktop's local config. | The desktop app, and a Cowork session running on this computer. Not claude.ai or cloud Cowork. | You. Claude Code copies it with `claude mcp add-from-claude-desktop`. | [Custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), [Claude Code MCP](https://code.claude.com/docs/en/mcp#import-mcp-servers-from-claude-desktop), read 2026-11-20 |

## Set up: a remote server

1. On Free, Pro, Max or Ultra, go to Customize > Connectors, select Add, then Add custom connector.
2. On Team or Enterprise, an Owner goes to Organization settings > Connectors, selects Add, then Custom, then Web.
3. Enter a name and the server URL exactly as the provider documents it, path included, such as `https://example.com/mcp`. Keep any authentication option marked Detected unless the server's docs say otherwise. Select Add.
4. On Team or Enterprise, each member goes to Customize > Connectors, finds the connector labeled Custom, and selects Connect.
5. For a read-only docs connector, open its page under Customize > Connectors. Under Tool permissions, set the group of read-only tools to Always allow, so Cowork stops asking before every lookup. Leave write tools at Needs approval.
6. Start a new Code tab session. A session that was already open did not list a new connector (source: a test on 2026-11-20).

## Set up: an app that listens only on this computer

A connector can't reach `127.0.0.1`, so a loopback app needs a desktop extension. The [loopback-bridge/](loopback-bridge/) template is one: a stdio MCP server with no dependencies that forwards to the app's Streamable HTTP endpoint.

1. Copy `loopback-bridge/` (`manifest.json` and `server/bridge.js`).
2. In `manifest.json`, replace `<app-id>`, `<App name>` and `<your name>`. Set `<port>` to the port the app's own docs give.
3. Pack it from inside the folder: `zip -r ../app-bridge.mcpb manifest.json server`. A `.mcpb` file is a zip archive with `manifest.json` at its root, per the [MCPB README](https://github.com/modelcontextprotocol/mcpb). The [MCPB CLI](https://github.com/modelcontextprotocol/mcpb/blob/main/CLI.md)'s `mcpb pack` also works and validates the manifest first.
4. Install it: on macOS run `open -a Claude app-bridge.mcpb`, the command form of double-clicking it. Or drag the file onto Settings > Extensions. Review the preview and select Install.
5. Open the app, then start a new Code tab or Cowork session.

| Bridge behavior | Detail |
| --- | --- |
| Loopback only | It forwards only to `127.0.0.1`, `localhost` or `[::1]`. Any other host, or a missing `MCP_URL`, exits with code 2 |
| App closed | It still starts. `tools/list` returns no tools, and a tool call returns "`<App name>` is not running at `<url>`. Open it, then try again." |
| App opens later | It retries every 5 seconds (source: the template's code), then sends `notifications/tools/list_changed` so the tools appear |
| App restarts | A `404` on the old session opens a new one and retries the request once |
| Runtime | Node 18 or later, from `fetch` alone. The MCPB README says Node ships with Claude for macOS and Windows |
| Tested | On 2026-11-20, against a desktop app's loopback MCP server. Its tools listed, a closed app gave the error above, and a non-loopback URL exited with code 2. A mock loopback server gave the same results the same day. |

## Traps

| Trap | Detail |
| --- | --- |
| A loopback or LAN URL as a connector | Claude connects to a custom connector from Anthropic's cloud, not from your computer. The server must be reachable from the public internet on port 443 (source: [custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)). Use the bridge, or the MCP tunnels page the [unlisted connector page](https://claude.com/docs/connectors/custom/add-unlisted) links |
| A URL with its own port | Per the same support page, Claude can't connect to a URL that names a port other than 443 |
| Free plan | Per the [unlisted connector page](https://claude.com/docs/connectors/custom/add-unlisted), the Free plan allows one custom connector |
| Changing a connector's sign-in | Authentication settings are fixed once added. Remove the connector, add it again, and members reconnect |
| A shared key on Team or Enterprise | A request-header credential gives every member who connects that credential's access. Use a key limited to what members should reach |
| `~/.claude.json` for Cowork | Cowork doesn't read Claude Code's config. A server there reaches the Code tab only |
| The same URL in two places | A server added in Claude Code wins over a connector with the same URL. Then `/mcp` lists the connector as hidden ([Claude Code MCP](https://code.claude.com/docs/en/mcp#use-mcp-servers-from-claude-ai)). |
| An API key login | Claude Code in the terminal fetches connectors only under a Claude subscription login. `ANTHROPIC_API_KEY` or `apiKeyHelper` turns them off |
| Extensions turned off | An organization can turn extensions off or limit them. Then Extensions doesn't appear in settings |
| Always allow on write tools | Always allow skips the prompt for good. Keep it to read-only tools on servers you trust |
| An app that needs a token | The bridge sends no auth header. It suits apps that serve MCP on loopback without one |

## Sources

| Page | Read |
| --- | --- |
| [Add a connector that isn't in the directory](https://claude.com/docs/connectors/custom/add-unlisted) | 2026-11-20 |
| [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) | 2026-11-20 |
| [Get started with connectors](https://claude.com/docs/connectors/getting-started) | 2026-11-20 |
| [Build a desktop extension with MCPB](https://claude.com/docs/connectors/building/mcpb) | 2026-11-20 |
| [MCPB README and v0.4 manifest schema](https://github.com/modelcontextprotocol/mcpb) | 2026-11-20 |
| [MCPB CLI](https://github.com/modelcontextprotocol/mcpb/blob/main/CLI.md) | 2026-11-20 |
| [Claude Code: connect to MCP servers](https://code.claude.com/docs/en/mcp) | 2026-11-20 |
| [Claude Code: the desktop app](https://code.claude.com/docs/en/desktop) | 2026-11-20 |
