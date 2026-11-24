// The Claude Console cost reader of the Credits pack: an organization's spend this month, for readUse in credits.mjs.
import { finite, round } from './credits-metrics.mjs';
import { scrub } from './providers.mjs';

const URL_BASE = 'https://api.anthropic.com/v1/organizations/analytics/cost';
const LEGACY_URL = 'https://api.anthropic.com/v1/organizations/cost_report';
const ANALYTICS_FROM = Date.UTC(2026, 0, 1);
const KEY_VAR = 'ANTHROPIC_ADMIN_KEY';
const TOKEN_VAR = 'ANTHROPIC_AUTH_TOKEN';
const BETA = 'analytics-usage-cost-2026-08-24';
const OAUTH_BETA = 'oauth-2025-04-20';
const HOUR = 3_600_000;
const TIMEOUT_MS = 20_000;
const MAX_PAGES = 5;

// The organization's Claude API spend this UTC month in USD, which the plan's API credits are spent against. Claude Docs,
// "Get Cost By Dimension" (https://platform.claude.com/docs/en/api/beta/organization/analytics/cost/list) and "Usage and Cost
// Analytics API" (https://platform.claude.com/docs/en/manage-claude/usage-cost-analytics-api), read 2026-11-24: GET
// /v1/organizations/analytics/cost takes starting_at (no earlier than 2026-01-01) and ending_at (exclusive, at most 31 days
// on), both rounded down to the hour; with no group_by and no time_bucket_width the range is one row. A row's cost.amount is
// a decimal string in fractional cents, after discounts and before credits, cost.currency always USD. Paging is
// page=<next_page> while has_more, limit 1 to 1000. data_refreshed_at is null, with empty data, until an export covers the
// range. It needs anthropic-beta analytics-usage-cost-2026-08-24 and anthropic-version; an Admin API key goes in x-api-key.
// Claude Docs, "Admin API" (https://platform.claude.com/docs/en/manage-claude/admin-api, read 2026-11-23): an org:admin
// OAuth bearer token (ANTHROPIC_AUTH_TOKEN, from Workload Identity Federation in a keyless run) goes in `authorization:
// Bearer`. A raw bearer call also sends anthropic-beta oauth-2025-04-20 in the same comma-separated header: the claude-api
// skill's Authentication section says so, the endpoint page's curl example omits it, and a keyless run got HTTP 403 from the
// legacy report with the bearer alone (#151), so both are sent. The legacy GET /v1/organizations/cost_report (daily buckets,
// cents) has no date floor and is used only when the month starts before 2026-01-01. The token wins over the Admin key. The
// cycle is the UTC calendar month. No credential, no data yet, a refused call or a malformed amount is a why, never 0. The
// key and the token are cut from every reason.
export async function readClaudeCost(reader, { env = process.env, fetch = globalThis.fetch, now = new Date() } = {}) {
  const cred = credential(env);
  if (!cred) return { why: `needs ${KEY_VAR} in a --local collect's environment: an Admin API key (sk-ant-admin...) from a Claude Console organization admin, which a normal API key cannot replace; or ${TOKEN_VAR}, an org:admin OAuth bearer token` };
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const legacy = start.getTime() < ANALYTICS_FROM;
  const url = legacy ? LEGACY_URL : URL_BASE;
  const end = legacy ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)) : new Date(Math.max(Math.floor(now.getTime() / HOUR) * HOUR, start.getTime() + HOUR));
  try {
    let cents = 0;
    let page = null;
    let refreshed = null;
    for (let n = 0; n < MAX_PAGES; n++) {
      const body = await getPage(fetch, cred, url, legacy, { starting_at: start.toISOString(), ending_at: end.toISOString(), limit: legacy ? '31' : '1000', ...(page && { page }) });
      if (n === 0) refreshed = body.data_refreshed_at ?? null;
      if (n === 0 && !legacy && !body.data.length && refreshed === null) return { why: 'claude_cost: not read: the cost report has no data yet for this month (data_refreshed_at is null)' };
      cents += legacy ? sumBuckets(body, start) : sumCents(body);
      if (!body.has_more) return { used: { value: round(cents / 100, 2), source: costSource(url, start, end, refreshed) } };
      if (typeof body.next_page !== 'string' || !body.next_page) throw new Error('has_more is true but the report gave no next_page');
      page = body.next_page;
    }
    throw new Error(`more than ${MAX_PAGES} pages of rows`);
  } catch (err) {
    const text = scrub(String(err?.message ?? err), [cred.secret]).trim().split('\n')[0].slice(0, 160);
    return { why: `claude_cost: ${text}` };
  }
}

// The credential the environment holds: the bearer token when set, else the Admin key, or null. headers is what it sends.
function credential(vars) {
  const token = String(vars[TOKEN_VAR] ?? '').trim();
  if (token) return { secret: token, oauth: true, headers: { Authorization: `Bearer ${token}` }, hint: `${TOKEN_VAR} must be an OAuth bearer token with the org:admin scope` };
  const key = String(vars[KEY_VAR] ?? '').trim();
  return key ? { secret: key, headers: { 'x-api-key': key }, hint: `${KEY_VAR} must be an Admin API key (sk-ant-admin...), not a normal or workspace key` } : null;
}

// One page of the report as JSON, with the beta values the endpoint needs; a throw names the status only, with the credential's hint on a refusal.
async function getPage(fetch, cred, base, legacy, query) {
  const beta = [legacy ? '' : BETA, cred.oauth ? OAUTH_BETA : ''].filter(Boolean).join(',');
  const headers = { ...cred.headers, ...(beta && { 'anthropic-beta': beta }), 'anthropic-version': '2026-10-21', Accept: 'application/json' };
  const res = await fetch(`${base}?${new URLSearchParams(query)}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`GET ${base} answered HTTP ${res.status}${[401, 403].includes(res.status) ? `; ${cred.hint}` : ''}`);
  const body = await res.json();
  if (!Array.isArray(body?.data)) throw new Error(`GET ${base} gave no data array`);
  return body;
}

// The cents in one page's rows; a row that is not USD, or whose amount is not a decimal string ('' and null included), throws.
function sumCents(body) {
  let cents = 0;
  for (const row of body.data) {
    const amount = typeof row?.cost?.amount === 'string' && /^-?\d+(\.\d+)?$/.test(row.cost.amount) ? Number(row.cost.amount) : NaN;
    if (row?.cost?.currency !== 'USD' || !finite(amount)) throw new Error('the cost report gave a row that is not a USD amount');
    cents += amount;
  }
  return cents;
}

// The legacy report's cents for the daily buckets that start this month, before 2026-01-01 only.
function sumBuckets(body, start) {
  return body.data.filter((b) => Date.parse(b.starting_at) >= start.getTime()).reduce((sum, b) => sum + sumCents({ data: (b.results ?? []).map((r) => ({ cost: r })) }), 0);
}

function costSource(url, start, end, refreshed) {
  const day = (d) => d.toISOString().slice(0, 10);
  if (url === LEGACY_URL) return `GET ${url}: sum of the daily amounts (cents, as USD) from ${day(start)} to ${day(end)}, the UTC month`;
  return `GET ${url}: sum of cost.amount (fractional cents, after discounts, before credits, as USD) for the UTC month from ${day(start)} to ${end.toISOString().slice(0, 13)}h, data refreshed ${refreshed ?? 'at an unknown time'}`;
}
