# GitHub: App tokens, traps and sources

The App token case, the traps and the pages read. The steps are in [GitHub](../github.md).

## Why an App token beats a personal access token

| App installation token | Personal access token |
| --- | --- |
| Expires after 1 hour ([Generating an installation access token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app), read 2026-11-12) | Lives until its set expiry or revocation |
| Each token can narrow to listed repositories and permissions, never past the install's grant | Carries the person's access within its scopes |
| Not tied to a user, and uses no GitHub seat ([Deciding when to build a GitHub App](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app), read 2026-11-12) | Breaks when its owner loses access |
| Activity is attributed to the app ([About authentication with a GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app), read 2026-11-12) | Activity is attributed to the person |

## Traps

| Trap | What happens |
| --- | --- |
| GitHub Models | Retired on July 30, 2026: the playground, catalog, inference API and BYOK are gone for every customer ([GitHub Models is now retired](https://github.blog/changelog/2026-07-30-github-models-is-now-retired/), read 2026-11-12). Use Copilot or another provider. |
| Private repo CI | Private repositories spend the included compute; public ones on standard runners do not. |
| Larger runners | The free public-repo rule names standard GitHub-hosted runners only. |
| Copilot cloud sandboxes | Billing starts on November 23, 2026, and draws from the included Actions entitlement ([Copilot cloud experience](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/), read 2026-11-20). Sandbox compute and memory share that pool with private-repo runners, so a Copilot cloud session can use up a month's CI ([Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20). |
| Budget for sandboxes | Set a product-level budget on `sandbox`, or a SKU budget on `sandbox_linux`, `sandbox_memory` or `sandbox_snapshot` ([Product and SKU names](https://docs.github.com/en/billing/reference/product-and-sku-names), read 2026-11-20). A Bundled AI credits budget does not cover sandboxes ([Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20). |
| Stop usage is opt-in | Without **Stop usage when budget limit is reached**, a budget only emails; usage goes on ([Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets), read 2026-11-20). |
| Snapshot storage | A stopped sandbox keeps a snapshot, metered per GiB month until the sandbox is deleted ([Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes), read 2026-11-20). Delete sandboxes you are done with. |
| Header on a command line | `claude mcp add --header "Authorization: Bearer ..."` puts the token in shell history. Use the `${GITHUB_PAT}` form above. |
| `gh auth status --show-token` | Prints the token. Never pass that flag. |
| Manifest timing | All three manifest steps must finish within one hour, or you start over. |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions) | 2026-11-12 |
| [gh auth login](https://cli.github.com/manual/gh_auth_login) | 2026-11-12 |
| [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server) | 2026-11-12 |
| [Install GitHub MCP Server in Claude](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-claude.md) | 2026-11-12 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [About authentication with a GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app) | 2026-11-12 |
| [Registering a GitHub App from a manifest](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest) | 2026-11-12 |
| [Generating an installation access token](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app) | 2026-11-12 |
| [Deciding when to build a GitHub App](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app) | 2026-11-12 |
| [GitHub Models is now retired](https://github.blog/changelog/2026-07-30-github-models-is-now-retired/) | 2026-11-12 |
| [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) | 2026-11-20 |
| [Copilot cloud experience](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/) | 2026-11-20 |
| [Product and SKU names](https://docs.github.com/en/billing/reference/product-and-sku-names) | 2026-11-20 |
| [Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets) | 2026-11-20 |

</details>
