# NVIDIA: traps and sources

What goes wrong with NVIDIA, and the pages this guide read. The steps are in [NVIDIA](../nvidia.md).

## Traps

| Trap | What happens |
| --- | --- |
| Testing only | The trial terms forbid production use without a Subscription. |
| No private data | The terms bar confidential information and personal data in inputs, and NVIDIA uses inputs and outputs to improve its products ([API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf), read 2026-11-12). Send test data only. |
| Unpublished limits | NVIDIA's pages give no rate figure. Build retries with backoff into any batch job. |
| Old credit wording | The NIM FAQ still says "sign up for free credits" with no amount ([NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq), read 2026-11-12). Plan around the trial terms, not a credit balance. |
| Self-hosted NIM is paid | Running NIM on your own GPUs needs NVIDIA AI Enterprise. It costs "$4500 per GPU per year or $1 per GPU per hour in the cloud" ([NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq), read 2026-11-12). |
| Two kinds of key | The build.nvidia.com key and the NGC Personal API Key come from different pages. Create each one for its own job. |
| Key on a command line | `docker login -p` and `ngc config set` flags put the key in shell history. Use the prompts. |
| macOS install needs admin | The macOS NGC CLI package installs with `sudo installer` into `/usr/local` ([NGC CLI setup](https://catalog.ngc.nvidia.com/orgs/nvidia/ngc-apps/resources/ngc_cli/-/setup), read 2026-11-12). |
| Entitled content | Guest pulls cover public content only; entitled and third-party content needs a subscription or an ISV license key. |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [build.nvidia.com](https://build.nvidia.com/) | 2026-11-12 |
| [NIM API quickstart](https://docs.api.nvidia.com/nim/docs/api-quickstart) | 2026-11-12 |
| [NIM LLM APIs](https://docs.api.nvidia.com/nim/reference/llm-apis) | 2026-11-12 |
| [NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq) | 2026-11-12 |
| [NVIDIA API Trial Terms of Service](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf) | 2026-11-12 |
| [Nsight AI (CUDA MCP server)](https://developer.nvidia.com/nsight-ai) | 2026-11-12 |
| [Getting Started with the NGC CLI](https://docs.ngc.nvidia.com/cli/cmd.html) | 2026-11-12 |
| [NGC CLI setup](https://catalog.ngc.nvidia.com/orgs/nvidia/ngc-apps/resources/ngc_cli/-/setup) | 2026-11-12 |
| [NGC Catalog user guide](https://docs.nvidia.com/ngc/latest/ngc-catalog-user-guide.html) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [Claude Code MCP](https://code.claude.com/docs/en/mcp) | 2026-11-12 |

</details>
