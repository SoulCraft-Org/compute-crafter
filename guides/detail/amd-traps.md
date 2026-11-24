# AMD: traps and sources

What goes wrong with AMD, and the pages this guide read. The guard and steps are in [AMD detail](amd.md). The diagram and wiring are in [AMD](../amd.md).

## Traps

| Trap | What happens |
| --- | --- |
| Off is not free | A powered-off GPU VM is still billed, or still spends credit, until you destroy it ([AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24) |
| Payment method wording | DigitalOcean says a valid payment method is needed to use the credit, and standard rates apply once it runs out ([DigitalOcean AMD credits](https://docs.digitalocean.com/products/amd/details/credits/), read 2026-11-24). AMD's FAQ describes accounts with no method |
| Data loss at the end | Copy results off before the 30-day expiry |
| GPU only | The credit covers MI300X GPU time. AMD offers no credit for volumes, object storage or backups ([AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24) |
| Not for production | DigitalOcean limits the credit to testing and development ([DigitalOcean AMD credits](https://docs.digitalocean.com/products/amd/details/credits/), read 2026-11-24) |
| ROCm, not CUDA | A library with only a CUDA build does not run here. Check for a ROCm build before you rent the GPU |
| No macOS | The compatibility matrix lists no macOS ([compatibility matrix](https://rocm.docs.amd.com/en/latest/compatibility/compatibility-matrix.html), read 2026-11-24) |
| China-hosted catalog entry | models.dev has an `amd` provider with base URL `developer.amd.com.cn` and key `AMD_API_KEY` ([models.dev](https://models.dev/api.json), read 2026-11-24). It is a separate service. Do not use it |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html) | 2026-11-24 |
| [ROCm compatibility matrix](https://rocm.docs.amd.com/en/latest/compatibility/compatibility-matrix.html) | 2026-11-24 |
| [DigitalOcean AMD credits](https://docs.digitalocean.com/products/amd/details/credits/) | 2026-11-24 |
| [DigitalOcean AMD pricing](https://docs.digitalocean.com/products/amd/details/pricing/) | 2026-11-24 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-24 |
| [models.dev](https://models.dev/api.json) | 2026-11-24 |
| [ROCm install](https://rocm.docs.amd.com/en/latest/install/rocm.html) | 2026-11-12 |
| [AMD AI Developer Program](https://www.amd.com/en/developer/ai-dev-program.html) | 2026-11-12 |

</details>
