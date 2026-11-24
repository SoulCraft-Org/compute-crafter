# GitHub: guard and set up

What the GitHub guide moved out of its page. Traps and sources: [GitHub traps and sources](github-traps.md). The diagram and wiring are in [GitHub](../github.md).

## Guard

| Spend | Stop | Source |
| --- | --- | --- |
| Actions on private repositories | Blocked once the included compute is spent, with no payment method | [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-24 |
| Same, with a payment method | A budget above zero removes the stop | [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-24 |
| Copilot cloud sandboxes, from 2026-11-23 | Draw on the same included compute | [Copilot cloud experience](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/), read 2026-11-20 |
| Sandbox budget | **Stop usage when budget limit is reached** blocks them at the limit | [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20 |

## Set up

1. Run `gh auth login --web --git-protocol https`. It stores the token in the system credential store.
2. In OpenCode, run `/connect`, pick GitHub Copilot, finish the device code, then run `/models` ([OpenCode providers](https://opencode.ai/docs/providers), read 2026-11-24).
3. Claude Desktop cannot use the hosted MCP server. GitHub's page offers a local Docker server in `claude_desktop_config.json`, and notes some Docker servers misbehave in Claude Desktop ([Install in Claude](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md), read 2026-11-24).
4. For automation, register a GitHub App from a manifest.
   - POST the manifest JSON to `https://github.com/settings/apps/new`, or to the organization's `settings/apps/new`.
   - GitHub redirects to your `redirect_url` with a temporary `code`.
   - POST that code to `/app-manifests/{code}/conversions`. The reply carries the App ID, private key and webhook secret.
   - Finish all three steps within one hour ([Registering a GitHub App from a manifest](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest), read 2026-11-12).
   - Store the private key straight into a secret store. Never print it.
