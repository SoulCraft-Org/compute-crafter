// node --test collectors/credits/claude-cost.test.mjs
// Offline: every call is a fake fetch, and the key and token are made-up strings. The cost report is read with the key
// or the token present, missing and refused; neither is ever in a reason or a source, and nothing reads as 0 when it
// could not be read.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readUse } from './credits.mjs';

const KEY = 'fake-admin-key-value-1234';
const TOKEN = 'fake-bearer-token-value-5678';
const BETA = 'analytics-usage-cost-2026-08-24';
const now = new Date('2026-11-12T09:30:00Z');
const reader = { claude_cost: true };
const row = (amount, currency = 'USD') => ({ cost: { amount, currency, list_amount: amount, requests: 3 }, group: {}, starting_at: '2026-11-01T00:00:00Z', ending_at: '2026-11-12T09:00:00Z' });
const page = (rows, more = {}) => ({ data: rows, data_refreshed_at: '2026-11-12T08:00:00Z', has_more: false, next_page: null, ...more });

// A fetch that answers each call with the next page and records the URL and headers.
const pages = (list, calls = []) => async (url, init) => {
  calls.push({ url: String(url), headers: init?.headers });
  const next = list[calls.length - 1];
  return next.status ? new Response(JSON.stringify({ echo: `${KEY} ${TOKEN}` }), { status: next.status }) : new Response(JSON.stringify(next));
};
const read = (fetch, env = { ANTHROPIC_ADMIN_KEY: KEY }, at = now) => readUse(reader, { now: at, providers: { env, fetch } });
const params = (call) => new URL(call.url).searchParams;

test('claude_cost: sums the cents of every row and page for this month into USD, the key in x-api-key only', async () => {
  const calls = [];
  const r = await read(pages([page([row('1234.500000'), row('100')], { has_more: true, next_page: 'page_abc' }), page([row('0.5')])], calls));
  assert.equal(r.used.value, 13.35, '1234.5 + 100 + 0.5 cents is 1335 cents');
  assert.match(r.used.source, /analytics\/cost: sum of cost\.amount .* from 2026-11-01 to 2026-11-12T09h, data refreshed 2026-11-12T08:00:00Z/);
  const first = new URL(calls[0].url);
  assert.equal(first.origin + first.pathname, 'https://api.anthropic.com/v1/organizations/analytics/cost');
  assert.equal(params(calls[0]).get('starting_at'), '2026-11-01T00:00:00.000Z');
  assert.equal(params(calls[0]).get('ending_at'), '2026-11-12T09:00:00.000Z', 'now rounded down to the hour');
  assert.equal(params(calls[0]).get('limit'), '1000');
  assert.equal(params(calls[0]).has('group_by[]'), false, 'no grouping: the range is one row');
  assert.equal(params(calls[1]).get('page'), 'page_abc');
  assert.equal(calls[0].headers['x-api-key'], KEY);
  assert.equal(calls[0].headers['anthropic-beta'], BETA, 'the analytics beta only, on the key path');
  assert.equal(calls[0].headers['anthropic-version'], '2026-10-21');
  assert.equal(calls[0].headers.Authorization, undefined);
  for (const c of calls) assert.ok(!c.url.includes(KEY), 'no key in a URL');
  assert.doesNotMatch(JSON.stringify(r), /fake-admin/);
});

test('claude_cost: right after the month starts, the range is the first hour, never empty', async () => {
  const calls = [];
  await read(pages([page([])], calls), { ANTHROPIC_ADMIN_KEY: KEY }, new Date('2026-11-01T00:10:00Z'));
  assert.equal(params(calls[0]).get('starting_at'), '2026-11-01T00:00:00.000Z');
  assert.equal(params(calls[0]).get('ending_at'), '2026-11-01T01:00:00.000Z');
});

test('claude_cost: empty data with a refresh time is a read 0; with a null refresh time it is not read, never 0', async () => {
  assert.equal((await read(pages([page([])]))).used.value, 0);
  const none = await read(pages([page([], { data_refreshed_at: null })]));
  assert.equal(none.used, undefined);
  assert.match(none.why, /^claude_cost: not read: the cost report has no data yet for this month \(data_refreshed_at is null\)/);
});

test('claude_cost: with no credential it names both env vars and an Admin key, and makes no call', async () => {
  const calls = [];
  for (const env of [{}, { ANTHROPIC_ADMIN_KEY: '  ', ANTHROPIC_AUTH_TOKEN: '' }]) {
    const r = await read(pages([], calls), env);
    assert.equal(r.used, undefined);
    assert.match(r.why, /^needs ANTHROPIC_ADMIN_KEY in a --local collect's environment: an Admin API key \(sk-ant-admin\.\.\.\).*ANTHROPIC_AUTH_TOKEN/);
  }
  assert.equal(calls.length, 0);
});

test('claude_cost: a refusal, an offline call, a bad row or a bad cursor is not read, and no key is printed', async () => {
  const refused = await read(pages([{ status: 403 }]));
  assert.match(refused.why, /^claude_cost: GET .*analytics\/cost answered HTTP 403; ANTHROPIC_ADMIN_KEY must be an Admin API key/);
  const offline = await read(async () => { throw new TypeError(`fetch failed, auth ${KEY}`); });
  assert.equal(offline.why, 'claude_cost: fetch failed, auth [key]');
  for (const amount of ['abc', '', null, undefined, 12, ' 5', '1e3']) {
    assert.match((await read(pages([page([row(amount)])]))).why, /not a USD amount/, `amount ${JSON.stringify(amount)}`);
  }
  assert.match((await read(pages([page([row('1', 'EUR')])]))).why, /not a USD amount/);
  assert.match((await read(pages([page([{ cost: null }])]))).why, /not a USD amount/);
  assert.match((await read(pages([{ nope: 1 }]))).why, /no data array/);
  const calls = [];
  assert.match((await read(pages([page([row('1')], { has_more: true })], calls))).why, /has_more is true but the report gave no next_page/);
  assert.equal(calls.length, 1, 'page 1 is not read again');
  const endless = Array.from({ length: 9 }, () => page([row('1')], { has_more: true, next_page: 'p' }));
  assert.match((await read(pages(endless))).why, /more than 5 pages/);
  for (const r of [refused, offline]) assert.doesNotMatch(JSON.stringify(r), /fake-admin/);
});

test('claude_cost: ANTHROPIC_AUTH_TOKEN is a bearer with both beta values in one header, wins over the Admin key, sends no x-api-key', async () => {
  const calls = [];
  const r = await read(pages([page([row('250')])], calls), { ANTHROPIC_AUTH_TOKEN: TOKEN, ANTHROPIC_ADMIN_KEY: KEY });
  assert.equal(r.used.value, 2.5);
  assert.equal(calls[0].headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(calls[0].headers['anthropic-beta'], `${BETA},oauth-2025-04-20`);
  assert.equal(calls[0].headers['x-api-key'], undefined, 'one credential per call');
  assert.ok(!calls[0].url.includes(TOKEN), 'no token in a URL');
  assert.doesNotMatch(JSON.stringify(r), /fake-bearer|fake-admin/);
});

test('claude_cost: a refused or failing token call names the token variable and never prints the token', async () => {
  const vars = { ANTHROPIC_AUTH_TOKEN: TOKEN };
  const refused = await read(pages([{ status: 401 }]), vars);
  assert.match(refused.why, /answered HTTP 401; ANTHROPIC_AUTH_TOKEN must be an OAuth bearer token with the org:admin scope/);
  const offline = await read(async () => { throw new TypeError(`fetch failed, auth Bearer ${TOKEN}`); }, vars);
  assert.equal(offline.why, 'claude_cost: fetch failed, auth Bearer [key]');
  for (const r of [refused, offline]) assert.doesNotMatch(JSON.stringify(r), /fake-bearer/);
});
