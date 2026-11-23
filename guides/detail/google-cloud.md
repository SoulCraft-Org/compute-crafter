# Google Cloud: traps and sources

What goes wrong with Google Cloud, and the pages this guide read. The steps are in [Google Cloud](../google-cloud.md).

## Spend caps

| Control | What it does | Limit |
| --- | --- | --- |
| Budget | Sends alerts. It does not cap spending. The page defaults the thresholds to 50, 90 and 100 percent ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-23) | Alerts can take several hours. Set the budget below your available funds |
| Net cost | With all Savings types selected, which is the default, spend is cost minus discounts and credits. Select none to count cost before credits ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-23) | An alert may not fire while credits keep net cost under the threshold |
| Kill switch | A budget notice goes to a Pub/Sub topic. A Cloud Run function then removes the project's billing account when cost passes the budget ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-23) | Notices arrive after costs. Google says the steps do not guarantee spend stays under budget |
| Unlinking billing | It shuts down all resources. Google says they can be irretrievably deleted ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-23) | Re-enabling billing is manual, and recovery is not assured. It needs `roles/billing.admin` |
| Quotas | A per-API request limit, set under **IAM & Admin**, then **Quotas** ([Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage), read 2026-11-23) | It caps request volume, not spend. Enforcement has a latency, so keep a safety buffer |

## Traps

| Trap | What happens |
| --- | --- |
| The upgrade | Upgrading ends the Free Trial. You keep unused credit until 90 days after sign-up. Then every cost is money ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-23) |
| Vertex AI after 2026-11-16 | The credit cannot pay for Gemini platform (Vertex AI) services. This applies to a sign-up or upgrade on or after that date ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-23) |
| Grace period | A trial that ends without an upgrade has 30 days to upgrade. After that, Google permanently deletes the trial's resources ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-23) |
| A budget is not a stop | An alerts-only budget does not stop use or billing ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-23) |
| A billing-locked project | Billing cannot be disabled on a project locked to a billing account ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-23) |
| Per-user quotas | Without a signed-in user they fall back to client IP, and shared IPs pool into one bucket ([Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage), read 2026-11-23) |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features) | 2026-11-23 |
| [Budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets) | 2026-11-23 |
| [Disable billing with notifications](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications) | 2026-11-23 |
| [Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage) | 2026-11-23 |
| [models.dev provider catalog](https://models.dev/api.json) | 2026-11-23 |

</details>
