# GitHub

GitHub gives a Claude Code or OpenCode user free CI on Actions, a hosted MCP server, and Copilot models inside OpenCode.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with an email, on the GitHub Free plan. | Standard GitHub-hosted runners are free in public repositories ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-12). GitHub Free and Free for organizations include $12 USD of compute per month, 500 MB artifact storage and 10 GB cache per repository ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-12). The page states a dollar amount, not a minute count. | `gh auth login` (browser OAuth). | `https://api.githubcopilot.com/mcp/` ([Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server), read 2026-11-12). | `github-copilot` ([models.dev](https://models.dev), read 2026-11-12), through `/connect` and "Login with GitHub Copilot" ([OpenCode providers](https://opencode.ai/docs/providers), read 2026-11-12). | With no payment method, Actions use is blocked once the included compute is spent ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-11-12). Adding a payment method and a budget above zero removes the stop. See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Set up

1. Sign in the GitHub CLI with the browser flow. It stores the token in the system credential store.

```bash
gh auth login --web --git-protocol https
gh auth status
```

2. Add the GitHub MCP server to Claude Code. Put this in `.mcp.json`; Claude Code expands `${GITHUB_PAT}` from your shell at start.

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": { "Authorization": "Bearer ${GITHUB_PAT}" }
    }
  }
}
```

3. Set `GITHUB_PAT` in your shell to a fine-grained token with the fewest repositories and permissions. Then run `/mcp` in Claude Code to check the connection.

4. Connect Copilot models in OpenCode. The account needs Copilot Chat access; Copilot Free counts.

```bash
opencode auth login
```

Pick GitHub Copilot, finish the device code in the browser, then run `/models` inside OpenCode.

5. For automation, register a GitHub App from a manifest instead of minting a personal access token.
   - POST the manifest JSON to `https://github.com/settings/apps/new`, or `https://github.com/organizations/ORGANIZATION/settings/apps/new` for an org.
   - GitHub redirects to your `redirect_url` with a temporary `code`.
   - POST that code to `/app-manifests/{code}/conversions`. The reply carries the App ID, private key and webhook secret.
   - Finish all three steps within one hour ([Registering a GitHub App from a manifest](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest), read 2026-11-12).
   - Store the private key straight into a secret store from the conversion reply. Never print it.

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
| Header on a command line | `claude mcp add --header "Authorization: Bearer ..."` puts the token in shell history. Use the `${GITHUB_PAT}` form above. |
| `gh auth status --show-token` | Prints the token. Never pass that flag. |
| Manifest timing | All three manifest steps must finish within one hour, or you start over. |

## Sources

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
