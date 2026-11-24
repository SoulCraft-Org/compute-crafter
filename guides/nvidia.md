# NVIDIA

NVIDIA gives the OpenCode Desktop App trial access to hosted open-weight models (NIM endpoints) at build.nvidia.com. It also offers a CUDA docs MCP server and GPU containers on NGC.

```mermaid
flowchart LR
  P[NVIDIA build.nvidia.com] --> S[Sign in<br/>NVIDIA account] --> G[Spend stop<br/>trial, no card asked]
  G --> O[OpenCode Desktop App<br/>provider nvidia]
  G -.-> C[Claude Desktop App, Code tab<br/>CUDA docs MCP: not confirmed]
  G -.-> W[Claude Desktop App, Cowork<br/>not confirmed]
```

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Email address; an API key makes you an NVIDIA Developer Program member ([API quickstart](https://docs.api.nvidia.com/nim/docs/api-quickstart), read 2026-11-12). | "Free inference with leading models" ([build.nvidia.com](https://build.nvidia.com/), read 2026-11-24). No credit or rate figure is published. [Detail](detail/nvidia.md#free-tier). | `NVIDIA_API_KEY`. NGC: a Personal API Key. | CUDA docs only: `https://api.copilot.nsight.ngc.nvidia.com/mcp/cuda-docs` ([Nsight AI](https://developer.nvidia.com/nsight-ai), read 2026-11-24). | `nvidia`, base URL `https://integrate.api.nvidia.com/v1` ([models.dev](https://models.dev), read 2026-11-12). | The trial terms allow testing, not production ([API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf), read 2026-11-12). A Subscription removes the stop. [Detail](detail/nvidia.md#guard). See [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md). |

## Wiring

| Host | Plugs in as | Source, read 2026-11-24 |
| --- | --- | --- |
| OpenCode Desktop App | Connect provider NVIDIA with a build.nvidia.com key. | [models.dev](https://models.dev), [OpenCode providers](https://opencode.ai/docs/providers) |
| Claude Desktop App, Code tab | Not confirmed. Nsight AI names Claude Code, Codex, Cursor and Antigravity, not the Desktop App. | [Nsight AI](https://developer.nvidia.com/nsight-ai) |
| Claude Desktop App, Cowork | Not confirmed. No NVIDIA page names Cowork. | [Nsight AI](https://developer.nvidia.com/nsight-ai) |

<details>
<summary>Commands</summary>

```bash
opencode auth login nvidia --method key
ngc config set
docker login nvcr.io --username '$oauthtoken'
```

Paste each key at its hidden prompt, never on a command line.

</details>

Free tier, guard and set up: [NVIDIA detail](detail/nvidia.md). Traps and sources: [NVIDIA traps and sources](detail/nvidia-traps.md).
