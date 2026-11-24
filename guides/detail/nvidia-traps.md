# NVIDIA: traps and sources

What goes wrong with NVIDIA, and the pages this guide read. The set up is in [NVIDIA detail](nvidia.md). The diagram and wiring are in [NVIDIA](../nvidia.md).

## Traps

| Trap | What happens |
| --- | --- |
| No private data | The terms bar confidential and personal data. NVIDIA uses inputs and outputs to improve its products ([API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf), read 2026-11-12). Send test data only |
| Unpublished limits | No rate figure is given. Build retries with backoff into any batch job |
| Old credit wording | The NIM FAQ says "sign up for free credits" with no amount ([NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq), read 2026-11-12) |
| Self-hosted NIM is paid | It needs NVIDIA AI Enterprise. The price is "$4500 per GPU per year or $1 per GPU per hour in the cloud" ([NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq), read 2026-11-12) |
| Two kinds of key | The build.nvidia.com key and the NGC Personal API Key come from different pages |
| Entitled content | Guest pulls cover public content only. Entitled and third-party content needs a subscription or an ISV license key ([NGC Catalog guide](https://docs.nvidia.com/ngc/latest/ngc-catalog-user-guide.html), read 2026-11-12) |
| Key on a command line | `docker login -p` and `ngc config set` flags put the key in shell history |
| macOS install needs admin | The NGC CLI package installs with `sudo installer` ([NGC CLI setup](https://catalog.ngc.nvidia.com/orgs/nvidia/ngc-apps/resources/ngc_cli/-/setup), read 2026-11-12) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [build.nvidia.com](https://build.nvidia.com/) | 2026-11-24 |
| [Nsight AI](https://developer.nvidia.com/nsight-ai) | 2026-11-24 |
| [NIM API quickstart](https://docs.api.nvidia.com/nim/docs/api-quickstart) | 2026-11-12 |
| [NIM FAQ](https://docs.api.nvidia.com/nim/docs/faq) | 2026-11-12 |
| [API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf) | 2026-11-12 |
| [NGC CLI](https://docs.ngc.nvidia.com/cli/cmd.html) | 2026-11-12 |
| [NGC CLI setup](https://catalog.ngc.nvidia.com/orgs/nvidia/ngc-apps/resources/ngc_cli/-/setup) | 2026-11-12 |
| [NGC Catalog guide](https://docs.nvidia.com/ngc/latest/ngc-catalog-user-guide.html) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |
| [NIM LLM APIs](https://docs.api.nvidia.com/nim/reference/llm-apis) | 2026-11-12 |

</details>
