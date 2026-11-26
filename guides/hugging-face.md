# Hugging Face

Hugging Face gives the OpenCode Desktop App the Hub's open-weight models. It adds a free daily ZeroGPU allowance inside Gradio Spaces, routed Inference Providers, and an official MCP server.

```mermaid
flowchart LR
  P[Hugging Face] --> S[Sign in<br/>hf auth login] --> G[Spend stop<br/>daily ZeroGPU quota,<br/>no free routed credit]
  G --> O[OpenCode Desktop App<br/>provider huggingface]
```

| Account | Free tier | Login or key | OpenCode | Guard |
| --- | --- | --- | --- | --- |
| Anyone with an email. Hosting ZeroGPU Spaces needs a verified email and an account older than 30 days ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). | ZeroGPU: 5 minutes a day free, 40 on PRO ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12). PRO costs $9 a month ([Pricing](https://huggingface.co/pricing), read 2026-11-12). [More](detail/hugging-face.md#free-tier). | `hf auth login` (browser). Tools that need a token read `HF_TOKEN`. | `huggingface`, reads `HF_TOKEN`, base URL `https://router.huggingface.co/v1` ([models.dev](https://models.dev), read 2026-11-24). | A free account has no routed-call credit: buy credits first ([Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12). [More](detail/hugging-face.md#guard). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Wiring

| Host | Plugs in as | Source, read 2026-11-24 |
| --- | --- | --- |
| OpenCode Desktop App | Connect provider Hugging Face with a fine-grained token that has the Inference Providers permission. Calls fail on a free account until it holds purchased credits. | [HF: OpenCode](https://huggingface.co/docs/inference-providers/integrations/opencode), [OpenCode providers](https://opencode.ai/docs/providers) |

<details>
<summary>Commands</summary>

```bash
uvx hf auth login
uvx hf auth whoami
opencode auth login huggingface --method key
```

</details>

Free tier, guard and set up: [Hugging Face detail](detail/hugging-face.md). Traps and sources: [Hugging Face traps and sources](detail/hugging-face-traps.md).
