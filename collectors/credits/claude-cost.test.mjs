// node --test collectors/credits/claude-cost.test.mjs
// Offline: every call is a fake fetch, and the key is a made-up string. The cost report is read with the key present,
// missing and refused; no key is ever in a reason or a source, and nothing reads as 0 when it could not be read.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readUse } from './credits.mjs';

const KEY = 'fake-admin-key-value-1234';
const now = new Date('2026-11-12T09:30:00Z');
const reader = { claude_cost: true };
const day = (d, ...amounts) => ({ starting_at: `2026-11-${d}T00:00:00Z`, ending_at: `2026-11-${d}T23:59:59Z`, results: amounts.map((amount) => ({ amount, currency: 'USD', description: null })) });

// A fetch that answers each call with the next page and records the URL and headers.
const pages = (list, calls = []) => async (url, init) => {
  calls.push({ url: String(url), headers: init?.headers });
  const page = list[calls.length - 1];
  return page.status ? new Response(JSON.stringify({ echo: KEY }), { status: page.status }) : new Response(JSON.stringify(page));
};
const read = (fetch, env = { ANTHROPIC_ADMIN_KEY: KEY }) => readUse(reader, { now, providers: { env, fetch } });

test('claude_cost: sums the cents of this month across pages into USD, the key in x-api-key only', async () => {
  const calls = [];
  const r = await read(pages([
    { data: [day('01', '1234.5', '100'), day('02')], has_more: true, next_page: 'page_abc' },
    { data: [day('03', '0.5')], has_more: false, next_page: null },
  ], calls));
  assert.equal(r.used.value, 13.35, '1234.5 + 100 + 0.5 cents is 1335 cents');
  assert.match(r.used.source, /cost_report: sum of the daily amounts .* from 2026-11-01 to 2026-11-12/);
  const first = new URL(calls[0].url);
  assert.equal(first.origin + first.pathname, 'https://api.anthropic.com/v1/organizations/cost_report');
  assert.equal(first.searchParams.get('starting_at'), '2026-11-01T00:00:00.000Z');
  assert.equal(first.searchParams.get('ending_at'), '2026-11-13T00:00:00.000Z', 'through the end of today, so today counts');
  assert.equal(new URL(calls[1].url).searchParams.get('page'), 'page_abc');
  assert.equal(calls[0].headers['x-api-key'], KEY);
  for (const c of calls) assert.ok(!c.url.includes(KEY), 'no key in a URL');
  assert.doesNotMatch(JSON.stringify(r), /fake-admin/);
});

test('claude_cost: a month with no cost is a read 0; a bucket before this month is left out', async () => {
  assert.equal((await read(pages([{ data: [day('01')], has_more: false }]))).used.value, 0);
  const old = { starting_at: '2026-10-31T00:00:00Z', results: [{ amount: '5000', currency: 'USD' }] };
  assert.equal((await read(pages([{ data: [old, day('02', '250')], has_more: false }]))).used.value, 2.5);
});

test('claude_cost: with no key it names the env var and an Admin key, and makes no call', async () => {
  const calls = [];
  for (const env of [{}, { ANTHROPIC_ADMIN_KEY: '  ' }]) {
    const r = await read(pages([], calls), env);
    assert.equal(r.used, undefined);
    assert.match(r.why, /^needs ANTHROPIC_ADMIN_KEY in a --local collect's environment: an Admin API key \(sk-ant-admin\.\.\.\)/);
  }
  assert.equal(calls.length, 0);
});

test('claude_cost: a refusal, an offline call, a bad amount or endless pages is not read, and no key is printed', async () => {
  const refused = await read(pages([{ status: 403 }]));
  assert.match(refused.why, /^claude_cost: GET .*cost_report answered HTTP 403; ANTHROPIC_ADMIN_KEY must be an Admin API key/);
  const offline = await read(async () => { throw new TypeError(`fetch failed, auth ${KEY}`); });
  assert.equal(offline.why, 'claude_cost: fetch failed, auth [key]');
  assert.match((await read(pages([{ data: [day('02', 'abc')], has_more: false }]))).why, /not a USD amount/);
  for (const amount of ['', null, undefined, 12, ' 5', '1e3']) {
    assert.match((await read(pages([{ data: [{ starting_at: '2026-11-02T00:00:00Z', results: [{ amount, currency: 'USD' }] }], has_more: false }]))).why, /not a USD amount/, `amount ${JSON.stringify(amount)}`);
  }
  assert.match((await read(pages([{ data: [day('02', '1')], has_more: true, next_page: null }]))).why, /has_more is true but the report gave no next_page/);
  const calls = [];
  assert.match((await read(pages([{ data: [day('02', '1')], has_more: true }], calls))).why, /no next_page/);
  assert.equal(calls.length, 1, 'page 1 is not read again');
  assert.match((await read(pages([{ data: [{ starting_at: '2026-11-02T00:00:00Z', results: [{ amount: '1', currency: 'EUR' }] }], has_more: false }]))).why, /not a USD amount/);
  assert.match((await read(pages([{ nope: 1 }]))).why, /no data array/);
  const endless = Array.from({ length: 9 }, () => ({ data: [day('02', '1')], has_more: true, next_page: 'p' }));
  assert.match((await read(pages(endless))).why, /more than 5 pages/);
  for (const r of [refused, offline]) assert.doesNotMatch(JSON.stringify(r), /fake-admin/);
});

const TOKEN = 'fake-bearer-token-value-5678';

test('claude_cost: ANTHROPIC_AUTH_TOKEN goes in the Authorization header as a bearer and wins over the Admin key; no x-api-key', async () => {
  const calls = [];
  const r = await read(pages([{ data: [day('02', '250')], has_more: false }], calls), { ANTHROPIC_AUTH_TOKEN: TOKEN, ANTHROPIC_ADMIN_KEY: KEY });
  assert.equal(r.used.value, 2.5);
  assert.equal(calls[0].headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(calls[0].headers['x-api-key'], undefined, 'one credential per call');
  assert.equal(calls[0].headers['anthropic-version'], '2026-10-21');
  assert.ok(!calls[0].url.includes(TOKEN), 'no token in a URL');
  assert.doesNotMatch(JSON.stringify(r), /fake-bearer|fake-admin/);
});

test('claude_cost: the Admin key alone still goes in x-api-key, never as a bearer', async () => {
  const calls = [];
  await read(pages([{ data: [], has_more: false }], calls), { ANTHROPIC_ADMIN_KEY: KEY, ANTHROPIC_AUTH_TOKEN: '  ' });
  assert.equal(calls[0].headers['x-api-key'], KEY);
  assert.equal(calls[0].headers.Authorization, undefined);
});

test('claude_cost: a refused or failing token call names the token variable and never prints the token', async () => {
  const vars = { ANTHROPIC_AUTH_TOKEN: TOKEN };
  const refused = await read(pages([{ status: 401 }]), vars);
  assert.match(refused.why, /answered HTTP 401; ANTHROPIC_AUTH_TOKEN must be an OAuth bearer token with the org:admin scope/);
  const offline = await read(async () => { throw new TypeError(`fetch failed, auth Bearer ${TOKEN}`); }, vars);
  assert.equal(offline.why, 'claude_cost: fetch failed, auth Bearer [key]');
  for (const r of [refused, offline]) assert.doesNotMatch(JSON.stringify(r), /fake-bearer/);
});
