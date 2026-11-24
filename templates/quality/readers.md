# Readers for an allowance's use

Part of the [Quality starter](README.md).

An allowance can carry a `reader` in `targets/credits.json`, so a `--local` run writes its use instead of you typing it. A reader that cannot read says why on the page and never counts as 0.

| Reader | Reads | Needs |
| --- | --- | --- |
| `{ "claude_cost": true }` | The Claude Console cost report's spend this UTC month, in USD, before credits ([Get Cost By Dimension](https://platform.claude.com/docs/en/api/beta/organization/analytics/cost/list), read 2026-11-23). No data yet is not read, never 0. | An `org:admin` OAuth token in `ANTHROPIC_AUTH_TOKEN`, or an Admin API key (`sk-ant-admin...`) in `ANTHROPIC_ADMIN_KEY`. The token wins when both are set ([Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api), read 2026-11-23). A normal API key cannot read it |
| `{ "gcp_billing_export": "project.dataset.table" }` | This invoice month's Google Cloud cost before credits. It reads the export's standard usage cost table with `bq query` ([export](https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery), read 2026-11-23). | The export turned on in the Cloud Billing console, `bq` from the Google Cloud CLI, your own `gcloud auth login`, and BigQuery read access to the table. The credits and net cost go in the row's source text |
