// The Google Cloud billing reader of the Credits pack: a billing account's cost and credits this invoice month, for readUse in credits.mjs.
import { finite, round } from './credits-metrics.mjs';
import { scrub } from './providers.mjs';

// A project, dataset and table id, joined by dots. The table goes between backticks in the query, so nothing else passes.
const TABLE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_]+\.[A-Za-z0-9_]+$/;

// The month's cost before credits, in the export's currency. Cloud Billing has no REST call for a month's cost; Google's
// documented path is the Cloud Billing export to BigQuery. Google Cloud Docs, "Cloud Billing data export to BigQuery"
// (https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery, read 2026-11-23): the standard usage cost
// table is gcp_billing_export_v1_<BILLING_ACCOUNT_ID>; a reader needs bigquery.dataViewer on it and bigquery.jobUser on
// the project that runs the query; a multi-region dataset (US or EU) backfills the previous month, a regional one
// starts when the export is turned on. "Standard usage cost data schema"
// (https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery-tables/standard-usage, read 2026-11-23): cost
// is a float, credits a repeated struct whose amount is added to cost (credits are negative, so the sum lowers it), and
// invoice.month is YYYYMM, the field that matches an invoice. Google's own net-cost query unnests credits in a subquery,
// as below. "Run parameterized queries" (https://docs.cloud.google.com/bigquery/docs/parameterized-queries, read
// 2026-11-23): bq query --use_legacy_sql=false --parameter=name:TYPE:value, with @name in the SQL. "bq command-line
// tool reference" (https://docs.cloud.google.com/bigquery/docs/reference/bq-cli-reference, read 2026-11-23): the global
// flags --format=json, --project_id, --quiet and --headless.
// bq runs on the owner's own gcloud login in a --local collect, so no key is read. The figure is cost before credits,
// the gross the credit is spent against (as the GitHub and Modal readers do); credits and net cost go in the source text.
// The invoice month is the UTC month of `now`; usage near a month's edge can land in the neighbouring invoice month.
// A first usage after the 1st means the export began mid-month (a regional dataset is not backfilled), so the month
// is partial and not measured; one on or before the 1st is whole. A missing bq, a table that cannot be read, no rows
// for the month or several currencies is a why, never 0. The table's
// name is cut from every reason, because the text is published and the table id holds the billing account id.
export async function readGcpBilling(reader, exec, now) {
  const table = String(reader.gcp_billing_export ?? '');
  if (!TABLE.test(table)) return { why: 'gcp_billing_export must name the standard export table as <project>.<dataset>.<table>, such as one beginning gcp_billing_export_v1_' };
  const month = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  const sql = `SELECT currency, FORMAT_TIMESTAMP('%Y-%m-%d', MIN(usage_start_time), 'UTC') AS first_usage, SUM(cost) AS cost, SUM(IFNULL((SELECT SUM(c.amount) FROM UNNEST(credits) AS c), 0)) AS credits FROM \`${table}\` WHERE invoice.month = @month GROUP BY currency`;
  const args = ['--headless', '--quiet', '--format=json', `--project_id=${table.split('.')[0]}`, 'query', '--use_legacy_sql=false', `--parameter=month:STRING:${month}`, sql];
  try {
    return rowsToUse(JSON.parse(await exec('bq', args)), month);
  } catch (err) {
    const names = [table, table.replace('.', ':'), ...table.split('.')];
    const text = err?.code === 'ENOENT' ? 'the bq CLI is not installed (it comes with the Google Cloud CLI)' : scrub(String(err?.stderr || err?.message || err), names).trim().split('\n')[0].slice(0, 160);
    return { why: `gcp_billing_export: ${text}; needs the owner's own gcloud login with BigQuery read access to the export table` };
  }
}

// { used } from the query's rows (currency, cost, credits), or a why.
function rowsToUse(rows, month) {
  if (!Array.isArray(rows) || !rows.length) return { why: `gcp_billing_export: the table has no cost rows for invoice month ${month}; the export may not have reached it yet` };
  if (rows.length > 1) return { why: `gcp_billing_export: ${rows.length} currencies in invoice month ${month}, so no one total` };
  const [{ currency, first_usage: first, cost: c, credits: k }] = rows;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(first))) return { why: 'gcp_billing_export: the query gave no first usage date' };
  if (first > `${month.slice(0, 4)}-${month.slice(4)}-01`) return { why: `gcp_billing_export: not measured: the first usage in the export for invoice month ${month} is ${first}, so the month is partial (a regional dataset starts when the export is turned on)` };
  const [cost, credits] = [Number(c), Number(k ?? 0)];
  if (!finite(cost) || !finite(credits)) return { why: 'gcp_billing_export: the query gave no numeric cost' };
  const net = round(cost + credits, 2);
  return { used: { value: round(cost, 2), source: `bq query on the billing export table, invoice month ${month}: cost before credits in ${currency}, credits applied ${round(credits, 2)}, net cost ${net}` } };
}
