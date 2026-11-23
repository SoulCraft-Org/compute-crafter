# AMD: traps and sources

What goes wrong with AMD, and the pages this guide read. The steps are in [AMD](../amd.md).

## Traps

| Trap | What happens |
| --- | --- |
| Off is not free | A powered-off GPU instance still bills or spends credit until it is destroyed ([AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-12). |
| Payment method wording | DigitalOcean's page says "You must provide a valid payment method to use the credit". AMD's FAQ describes accounts with no payment method. Once a card is on file, usage past the credit bills at standard rates ([DigitalOcean AMD credits](https://docs.digitalocean.com/products/amd/details/credits/), read 2026-11-12). |
| Data loss at the end | When credit expires with no payment method, the VM and the data on it are gone. Copy results off before the 30-day expiry ([AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-12). |
| GPU only | The credit covers MI300X GPU time only, not volumes, object storage or backups. |
| ROCm, not CUDA | ROCm runs HIP code. A library with only a CUDA build does not run here; check for a ROCm build before you rent the GPU. |
| No Mac support | The compatibility matrix lists no macOS, so ROCm work runs on a Linux or Windows host. |
| China-hosted catalog entry | OpenCode's catalog (models.dev) has an `amd` provider whose base URL is on `developer.amd.com.cn`. That is a separate service from ROCm and the Developer Cloud. |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [ROCm documentation](https://rocm.docs.amd.com/en/latest/) | 2026-11-12 |
| [ROCm Core SDK install](https://rocm.docs.amd.com/en/latest/install/rocm.html) | 2026-11-12 |
| [ROCm compatibility matrix](https://rocm.docs.amd.com/en/latest/compatibility/compatibility-matrix.html) | 2026-11-12 |
| [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html) | 2026-11-12 |
| [AMD AI Developer Program](https://www.amd.com/en/developer/ai-dev-program.html) | 2026-11-12 |
| [DigitalOcean AMD Developer Cloud credits](https://docs.digitalocean.com/products/amd/details/credits/) | 2026-11-12 |
| [DigitalOcean AMD pricing](https://docs.digitalocean.com/products/amd/details/pricing/) | 2026-11-12 |
| [OpenCode providers](https://opencode.ai/docs/providers) | 2026-11-12 |
| [models.dev](https://models.dev) | 2026-11-12 |

</details>
