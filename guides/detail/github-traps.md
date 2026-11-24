# GitHub: traps and sources

What goes wrong with GitHub, the App token case and the pages read. The steps are in [GitHub detail](github.md).

## Why an App token beats a personal access token

| App installation token | Personal access token |
| --- | --- |
| Expires after 1 hour ([Generating an installation access token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app), read 2026-11-12) | Lives until its set expiry or revocation |
| Narrows to listed repositories and permissions, never past the install's grant | Carries the person's access within its scopes |
| Not tied to a user, and uses no seat ([Deciding when to build a GitHub App](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app), read 2026-11-12) | Breaks when its owner loses access |

## Traps

| Trap | What happens |
| --- | --- |
| GitHub Models | Retired on July 30, 2026, for every customer ([GitHub Models is now retired](https://github.blog/changelog/2026-07-30-github-models-is-now-retired/), read 2026-11-12). Use Copilot or another provider |
| Larger runners | The free public-repo rule names standard runners only ([Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-24) |
| Private repo CI | It spends the included compute; public repositories on standard runners do not |
| Sandbox pool | Sandboxes share the private-repo pool, so one Copilot cloud session can use up a month's CI ([Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20) |
| Budget names | Budget `sandbox`, or a SKU such as `sandbox_linux`. A Bundled AI credits budget does not cover sandboxes ([Product and SKU names](https://docs.github.com/en/billing/reference/product-and-sku-names), read 2026-11-20) |
| Stop is opt-in | Without **Stop usage when budget limit is reached**, a budget only emails ([Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets), read 2026-11-20) |
| Snapshots | A stopped sandbox keeps a snapshot, metered until you delete it ([Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20) |
| Token on a command line | A header typed into a command lands in shell history |
| Printing the token | `gh auth status` has a flag that prints it. Never pass that flag |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | 2026-11-24 |
| [Install GitHub MCP Server in Claude](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [Claude Desktop docs](https://code.claude.com/docs/en/desktop) | 2026-11-24 |
| [Registering a GitHub App from a manifest](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest) | 2026-11-12 |
| [GitHub Models is now retired](https://github.blog/changelog/2026-07-30-github-models-is-now-retired/) | 2026-11-12 |
| [Copilot cloud experience](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/) | 2026-11-20 |
| [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) | 2026-11-20 |
| [Product and SKU names](https://docs.github.com/en/billing/reference/product-and-sku-names) | 2026-11-20 |
| [Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets) | 2026-11-20 |

</details>
