# Readers for an allowance's use

Part of the [Quality starter](README.md).

An allowance can carry a `reader` in `targets/credits.json`, so a `--local` run writes its use instead of you typing it. A reader that cannot read says why on the page and never counts as 0.

| Reader | Reads | Needs |
| --- | --- | --- |
| `{ "claude_cost": true }` | The Claude Console cost report's spend this UTC month, in USD ([Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api), read 2026-11-23) | An Admin API key (`sk-ant-admin...`) in the env var `ANTHROPIC_ADMIN_KEY`. A normal API key cannot read it. Priority Tier cost is not in the report |
| `{ "gcp_billing_export": "project.dataset.table" }` | This invoice month's Google Cloud cost before credits, from the billing export's standard usage cost table, by `bq query` ([export](https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery), read 2026-11-23) | The export turned on in the Cloud Billing console, `bq` from the Google Cloud CLI, your own `gcloud auth login`, and BigQuery read access to the table. The credits and net cost go in the row's source text |
