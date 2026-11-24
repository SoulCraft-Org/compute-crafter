# Google Cloud: traps and sources

What goes wrong with Google Cloud, and the pages this guide read. The guard and steps are in [Google Cloud detail](google-cloud.md). The diagram and wiring are in [Google Cloud](../google-cloud.md).

## Traps

| Trap | What happens |
| --- | --- |
| The upgrade | It ends the Free Trial. Unused credit lasts until 90 days after sign-up, then every cost is money ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24) |
| Vertex AI after 2026-11-16 | It cannot pay for Gemini platform services after a sign-up or upgrade on or from that date ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24) |
| Grace period | A trial that ends without an upgrade has 30 days. After that, Google permanently deletes its resources ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24) |
| A budget is not a stop | An alerts-only budget does not stop use or billing ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-24) |
| Disabling billing | It terminates all services in the project, including Free Tier services. Re-enabling billing is manual, and recovery is not guaranteed ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-24) |
| A billing-locked project | You cannot disable billing on a project locked to a billing account ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-24) |
| Partner models | The credit cannot pay for a generative AI partner model offered as a managed API ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24) |
| Per-user quotas | Without a signed-in user they fall back to client IP. Shared IPs pool into one bucket ([Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage), read 2026-11-24) |
| Service account keys | Keep them out of CI. Use `gcloud auth login` on your own machine |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features) | 2026-11-24 |
| [Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets) | 2026-11-24 |
| [Disable billing with notifications](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications) | 2026-11-24 |
| [Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage) | 2026-11-24 |
| [models.dev provider catalog](https://models.dev/api.json) | 2026-11-24 |

</details>
