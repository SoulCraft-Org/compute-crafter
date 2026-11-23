// The Claude Console cost reader of the Credits pack: an organization's spend this month, for readUse in credits.mjs.
import { finite, round } from './credits-metrics.mjs';
import { scrub } from './providers.mjs';

const URL_BASE = 'https://api.anthropic.com/v1/organizations/cost_report';
const KEY_VAR = 'ANTHROPIC_ADMIN_KEY';
const TIMEOUT_MS = 20_000;
const MAX_PAGES = 5;

// The organization's Claude API spend this UTC month in USD, which the plan's API credits are spent against. Claude
// Docs, "Usage and Cost API" (https://platform.claude.com/docs/en/manage-claude/usage-cost-api, read 2026-11-23) and
// "Get Cost Report" (https://platform.claude.com/docs/en/api/beta/organization/cost_report/retrieve, read 2026-11-23):
// GET /v1/organizations/cost_report takes starting_at and ending_at (RFC 3339, daily buckets only), limit (at most 31
// buckets) and the next_page cursor as page. Each result's amount is a decimal string in cents, currency always USD.
// The key goes in x-api-key with an anthropic-version header; the page names an Admin API key (sk-ant-admin01-...),
// an org:admin OAuth token or a key not scoped to a workspace, and says workspace keys do not work. Priority Tier cost
// is not in this report, so it is not in the figure. Docs call this endpoint legacy and supported; the newer
// /v1/organizations/analytics/cost is a beta that needs an anthropic-beta header, so this reader stays on the legacy one.
// The cycle is the UTC calendar month; a plan whose billing cycle starts on another day reads a different window.
// No key, a refused call or a malformed amount is a why, never 0. The key is cut from every reason.
export async function readClaudeCost(reader, { env = process.env, fetch = globalThis.fetch, now = new Date() } = {}) {
  const key = String(env[KEY_VAR] ?? '').trim();
  if (!key) return { why: `needs ${KEY_VAR} in a --local collect's environment: an Admin API key (sk-ant-admin...) from a Claude Console organization admin, which a normal API key cannot replace` };
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  try {
    let cents = 0;
    let page = null;
    for (let n = 0; n < MAX_PAGES; n++) {
      const body = await getPage(fetch, key, { starting_at: start.toISOString(), ending_at: end.toISOString(), limit: '31', ...(page && { page }) });
      cents += sumCents(body, start);
      if (!body.has_more) return { used: { value: round(cents / 100, 2), source: costSource(start, now) } };
      if (typeof body.next_page !== 'string' || !body.next_page) throw new Error('has_more is true but the report gave no next_page');
      page = body.next_page;
    }
    throw new Error(`more than ${MAX_PAGES} pages of daily buckets`);
  } catch (err) {
    const text = scrub(String(err?.message ?? err), [key]).trim().split('\n')[0].slice(0, 160);
    return { why: `claude_cost: ${text}` };
  }
}

// One page of the report as JSON; a throw names the status only, with the Admin key hint on a refusal.
async function getPage(fetch, key, query) {
  const url = `${URL_BASE}?${new URLSearchParams(query)}`;
  const res = await fetch(url, { headers: { 'x-api-key': key, 'anthropic-version': '2026-10-21', Accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`GET ${URL_BASE} answered HTTP ${res.status}${[401, 403].includes(res.status) ? `; ${KEY_VAR} must be an Admin API key (sk-ant-admin...), not a normal or workspace key` : ''}`);
  const body = await res.json();
  if (!Array.isArray(body?.data)) throw new Error(`GET ${URL_BASE} gave no data array`);
  return body;
}

// The cents in one page's buckets that start this month; a result that is not USD, or whose amount is not a decimal string ('' and null included), throws.
function sumCents(body, start) {
  let cents = 0;
  for (const bucket of body.data) {
    if (Date.parse(bucket.starting_at) < start.getTime()) continue;
    for (const r of bucket.results ?? []) {
      const amount = typeof r.amount === 'string' && /^-?\d+(\.\d+)?$/.test(r.amount) ? Number(r.amount) : NaN;
      if (r.currency !== 'USD' || !finite(amount)) throw new Error('the cost report gave a result that is not a USD amount');
      cents += amount;
    }
  }
  return cents;
}

function costSource(start, now) {
  return `GET ${URL_BASE}: sum of the daily amounts (cents, as USD) from ${start.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}, the UTC month; Priority Tier cost is not in this report`;
}
