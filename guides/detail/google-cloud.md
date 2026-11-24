# Google Cloud: guard and set up

What the Google Cloud guide moved out of its page. Traps and sources: [Google Cloud traps and sources](google-cloud-traps.md). The diagram and wiring are in [Google Cloud](../google-cloud.md).

## Guard

| Control | What it does | Limit |
| --- | --- | --- |
| Unbilled trial | Not billed unless you upgrade. At the end, 30 days of grace, then Google permanently deletes the resources ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24) | Upgrading removes this stop |
| Budget | Alerts only. Defaults are 50, 90 and 100 percent ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-24) | Alerts take several hours. Set the budget below your funds |
| Net cost | All Savings types selected is the default, so spend is cost minus credits. Deselect them to count gross cost ([Budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets), read 2026-11-24) | An alert may not fire while credits cover the cost |
| Kill switch | A budget notice goes to Pub/Sub. A Cloud Run function then disables the project's billing ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-24) | Google says it "doesn't guarantee" spend stays under budget. Google warns resources can be irretrievably deleted. It needs `roles/billing.admin` |
| Quotas | Set under IAM & Admin, Quotas ([Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage), read 2026-11-24) | They cap request volume, not spend, and enforcement lags |

## Set up

1. Sign up for the Free Trial in the Cloud console. Note the date: the credit ends 90 days later ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-24).
2. Stay on the trial for CPU work. While it is unbilled you cannot add GPUs, use Marketplace or request a quota increase.
3. Upgrade only for a GPU or a quota increase. On the Welcome page choose **Activate**. Google then bills usage the credit and Free Tier do not cover.
4. On a paid account, set a budget, then a kill switch, then a quota. In the kill-switch sample, `SIMULATE_DEACTIVATION` is `True` by default. Set it to `False` only after you test it ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-24).

A net-cost budget plus a kill switch is the right pair, because the budget counts what you really pay.
