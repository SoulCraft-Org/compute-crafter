// node --test collectors/credits/gcp-billing.test.mjs
// Offline: every bq call is a fake exec and the table is a made-up id. The billing export is read with the table
// readable, bq missing and the table refused; nothing reads as 0 when it could not be read, and the table's name never
// reaches a reason or a source.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readUse } from './credits.mjs';

const TABLE = 'fake-proj-1234.billing_data.gcp_billing_export_v1_AAAAAA_BBBBBB_CCCCCC';
const now = new Date('2026-11-12T09:30:00Z');
const reader = { gcp_billing_export: TABLE };
const rows = (...r) => JSON.stringify(r);
const read = (exec, r = reader) => readUse(r, { exec, now });
const failing = (props) => async () => {
  throw Object.assign(new Error('bq failed'), props);
};

test('gcp_billing_export: cost before credits this invoice month, credits and net in the source, one bq query on the user login', async () => {
  const calls = [];
  const r = await read(async (cmd, args) => (calls.push({ cmd, args }), rows({ currency: 'USD', cost: '301.456', credits: '-300.1' })));
  assert.equal(r.used.value, 301.46);
  assert.match(r.used.source, /invoice month 202611: cost before credits in USD, credits applied -300.1, net cost 1.36$/);
  assert.equal(calls.length, 1);
  const { cmd, args } = calls[0];
  assert.equal(cmd, 'bq');
  assert.ok(args.includes('--format=json') && args.includes('--project_id=fake-proj-1234') && args.includes('--use_legacy_sql=false'));
  assert.ok(args.includes('--parameter=month:STRING:202611'), 'the month is a query parameter, not text in the SQL');
  const sql = args.at(-1);
  assert.match(sql, /FROM `fake-proj-1234\.billing_data\.gcp_billing_export_v1_AAAAAA_BBBBBB_CCCCCC`/);
  assert.match(sql, /UNNEST\(credits\)/);
  assert.match(sql, /WHERE invoice\.month = @month/);
  assert.doesNotMatch(JSON.stringify(r), /fake-proj|AAAAAA|billing_data/, 'the published source holds no table id');
});

test('gcp_billing_export: a month with no credits column value reads cost alone', async () => {
  const r = await read(async () => rows({ currency: 'USD', cost: '12.5', credits: null }));
  assert.equal(r.used.value, 12.5);
  assert.match(r.used.source, /credits applied 0, net cost 12.5/);
});

test('gcp_billing_export: bq missing, a refused table, or a bad answer is not read, and the table name is cut', async () => {
  assert.match((await read(failing({ code: 'ENOENT' }))).why, /^gcp_billing_export: the bq CLI is not installed \(it comes with the Google Cloud CLI\); needs the owner's own gcloud login/);
  const denied = await read(failing({ stderr: `BigQuery error in query operation: Access Denied: Table fake-proj-1234:billing_data.gcp_billing_export_v1_AAAAAA_BBBBBB_CCCCCC: User does not have access\nmore` }));
  assert.match(denied.why, /^gcp_billing_export: BigQuery error in query operation: Access Denied: Table \[key\]/);
  assert.doesNotMatch(denied.why, /fake-proj|AAAAAA|billing_data/);
  assert.match((await read(async () => 'not json')).why, /^gcp_billing_export: /);
  assert.match((await read(async () => rows({ currency: 'USD', cost: 'x', credits: '0' }))).why, /no numeric cost/);
});

test('gcp_billing_export: no rows for the month, or several currencies, is not read, never 0', async () => {
  assert.match((await read(async () => '[]')).why, /no cost rows for invoice month 202611/);
  assert.match((await read(async () => rows({ currency: 'USD', cost: '1', credits: '0' }, { currency: 'EUR', cost: '2', credits: '0' }))).why, /2 currencies in invoice month 202611/);
});

test('gcp_billing_export: a name that is not project.dataset.table, or has a backtick, never reaches bq', async () => {
  const calls = [];
  const exec = async (...a) => (calls.push(a), '[]');
  for (const bad of ['only.two', 'a.b.c`; DROP', 'a b.c.d', true]) {
    assert.match((await read(exec, { gcp_billing_export: bad })).why, /must name the standard export table as <project>\.<dataset>\.<table>/, String(bad));
  }
  assert.equal(calls.length, 0);
});
