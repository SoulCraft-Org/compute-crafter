# Hugging Face

Hugging Face gives the OpenCode Desktop App and the Claude Desktop App the Hub's open-weight models. It adds a free daily ZeroGPU allowance inside Gradio Spaces, routed Inference Providers, and an official MCP server.

```mermaid
flowchart LR
  P[Hugging Face] --> S[Sign in<br/>hf auth login] --> G[Spend stop<br/>daily ZeroGPU quota,<br/>no free routed credit]
  G --> O[OpenCode Desktop App<br/>provider huggingface]
  G --> C[Claude Desktop App, Code tab<br/>Hugging Face connector]
  G --> W[Claude Desktop App, Cowork<br/>Hugging Face connector]
```

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with an email address. Hosting ZeroGPU Spaces needs a verified email and an account older than 30 days ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). | ZeroGPU: 5 minutes a day on a free account, 2 minutes signed out, 40 minutes on PRO. A free account hosts up to 2 ZeroGPU Spaces ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). CPU Basic: 2 vCPU, 16 GB, free ([Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12). Inference Providers: no monthly credit for free users, $2.00 for PRO ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). PRO costs $9 a month ([Pricing](https://huggingface.co/pricing), read 2026-11-12). | `hf auth login` (browser). Tools that need a token read `HF_TOKEN`. | `https://huggingface.co/mcp` ([Hugging Face MCP Server](https://huggingface.co/docs/hub/agents-mcp), read 2026-11-24). | `huggingface`, reads `HF_TOKEN`, base URL `https://router.huggingface.co/v1` ([models.dev](https://models.dev), read 2026-11-24). | A free account has no Inference Providers credit, so routed calls need a credit purchase first ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). Free ZeroGPU stops at the daily quota. Buying credits removes the stop: on PRO, ZeroGPU past quota bills "$1 per 10 minutes" automatically ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Wiring

| Host | Plugs in as | Source, read 2026-11-24 |
| --- | --- | --- |
| OpenCode Desktop App | Connect provider Hugging Face with a fine-grained token that has the Inference Providers permission. Calls fail on a free account until it holds purchased credits. | [HF: OpenCode](https://huggingface.co/docs/inference-providers/integrations/opencode), [OpenCode providers](https://opencode.ai/docs/providers) |
| Claude Desktop App, Code tab | Tools: add "Hugging Face" from the connector gallery. Models: not confirmed. Hugging Face names only the Claude Code CLI. | [hf-mcp-server](https://github.com/huggingface/hf-mcp-server), [HF: Claude Code](https://huggingface.co/docs/inference-providers/integrations/claude-code), [Desktop docs](https://code.claude.com/docs/en/desktop) |
| Claude Desktop App, Cowork | The same connector. Cowork takes connectors from your claude.ai account. Hugging Face names no Cowork step. | [Desktop docs](https://code.claude.com/docs/en/desktop), [HF MCP Server](https://huggingface.co/docs/hub/agents-mcp) |

<details>
<summary>Commands</summary>

```bash
uvx hf auth login
uvx hf auth whoami
claude mcp add --transport http hf-mcp-server "https://huggingface.co/mcp?login"
claude mcp login hf-mcp-server
opencode auth login huggingface --method key
```

</details>

Set-up notes, traps and sources: [Hugging Face traps and sources](detail/hugging-face.md).
