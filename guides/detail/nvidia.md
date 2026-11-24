# NVIDIA: free tier, guard and set up

What the NVIDIA guide moved out of its page. The diagram and wiring are in [NVIDIA](../nvidia.md).

## Free tier

| Item | Figure | Source |
| --- | --- | --- |
| Credit amount or rate limit | Not published on the pages read | [build.nvidia.com](https://build.nvidia.com/), read 2026-11-24 |
| Allowed use | "internal testing and evaluation purposes, not in production" | [API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf), read 2026-11-12 |
| Public NGC containers | Pull with no sign-in | [NGC Catalog guide](https://docs.nvidia.com/ngc/latest/ngc-catalog-user-guide.html), read 2026-11-12 |

## Guard

The quickstart's sign-up asks for an email and a password, not a card ([API quickstart](https://docs.api.nvidia.com/nim/docs/api-quickstart), read 2026-11-12). Production use needs a paid Subscription from NVIDIA or a service provider ([API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf), read 2026-11-12).

## Set up

| Step | What |
| --- | --- |
| 1. Key | On any model page at [build.nvidia.com](https://build.nvidia.com/), click **Get API Key**, sign in, then **Copy Key** ([API quickstart](https://docs.api.nvidia.com/nim/docs/api-quickstart), read 2026-11-12) |
| 2. OpenCode | Paste the key at the hidden prompt ([OpenCode 2](../README.md#opencode-2)), then pick a model with `/models` |
| 3. CUDA docs MCP | Signs in with an NVIDIA Developer account on first connection ([Nsight AI](https://developer.nvidia.com/nsight-ai), read 2026-11-24). It documents CUDA and runs no models |
| 4. NGC | On a Linux GPU host, install the CLI from the [CLI install page](https://ngc.nvidia.com/setup/installers/cli), then `ngc config set` ([NGC CLI](https://docs.ngc.nvidia.com/cli/cmd.html), read 2026-11-12) |

Traps and sources: [NVIDIA traps and sources](nvidia-traps.md).
