# Cloudflare Workers AI

Cloudflare Workers AI gives a Claude Code or OpenCode user open-weight models on Cloudflare's network, with a free daily Neurons allocation and hosted MCP servers.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with a Cloudflare account on the Workers Free plan. | 10,000 Neurons per day at no charge, on Workers Free and Workers Paid ([Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-12). All limits reset daily at 00:00 UTC ([Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-12). | `wrangler login` (browser OAuth); for the REST API, a Workers AI API token. | `https://mcp.cloudflare.com/mcp` ([Cloudflare's own MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/), read 2026-11-12). | `cloudflare-workers-ai` ([models.dev](https://models.dev), read 2026-11-12). | On Workers Free, use past the allocation fails with an error ([Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-12). Upgrading to Workers Paid removes the stop: $5 USD per month minimum ([Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/), read 2026-11-12), then $0.011 per 1,000 Neurons above the allocation ([Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), read 2026-11-12). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Set up

1. Sign in Wrangler with the browser OAuth flow. `--use-keyring` keeps the credentials in the OS keychain instead of a plain TOML file ([General commands](https://developers.cloudflare.com/workers/wrangler/commands/general/), read 2026-11-12).

```bash
npx wrangler login --use-keyring
npx wrangler whoami
```

2. Add Cloudflare's API MCP server to Claude Code, then sign in with OAuth. Cloudflare's page calls it the only server most users need.

```bash
claude mcp add --transport http cloudflare-api https://mcp.cloudflare.com/mcp
claude mcp login cloudflare-api
```

Grant only the permissions you need on Cloudflare's consent screen. The Cloudflare Skills plugin installs the same servers: run `/plugin marketplace add cloudflare/skills` inside Claude Code.

3. Add the docs server too, if you want Cloudflare's documentation in context.

```bash
claude mcp add --transport http cloudflare-docs https://docs.mcp.cloudflare.com/mcp
```

4. Connect Workers AI as a model provider in OpenCode. In the dashboard, open Workers AI, select **Use REST API**, then **Create a Workers AI API Token** ([REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), read 2026-11-12). Copy the Account ID from the same screen.

```bash
opencode auth login
```

Pick Cloudflare Workers AI and enter the token at the hidden prompt. OpenCode's catalog reads `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_KEY` ([models.dev](https://models.dev), read 2026-11-12); set the account ID in your shell.

5. Any other OpenAI-compatible tool uses base URL `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1` with the token as a bearer header ([OpenAI compatible API endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/), read 2026-11-12).

## Traps

| Trap | What happens |
| --- | --- |
| Plain-text login | Without `--use-keyring`, `wrangler login` writes its OAuth credentials to a plaintext TOML file. |
| Neurons per model | Each model spends Neurons at its own rate. Read the model's row on the pricing page before a long run. |
| Workers Paid | On Paid, use above the daily allocation bills per Neuron instead of failing. |
| Token scope | A custom token needs both `Workers AI - Read` and `Workers AI - Edit` ([REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/), read 2026-11-12). Give it nothing else. |
| Production account | Run Workers AI tests in an account that serves no production Worker, so a test cannot spend its allocation. |

## Sources

| Page | Read |
| --- | --- |
| [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) | 2026-11-12 |
| [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) | 2026-11-12 |
| [General commands](https://developers.cloudflare.com/workers/wrangler/commands/general/) | 2026-11-12 |
| [Cloudflare's own MCP servers](https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/) | 2026-11-12 |
| [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/) | 2026-11-12 |
| [OpenAI compatible API endpoints](https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |
