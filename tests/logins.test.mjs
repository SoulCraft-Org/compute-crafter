// The logins catalog and starter: every catalog row keeps to the field allowlist and its vocabularies, the starter
// builds a sheet and a board file from it, and no file names a person, an email or a home path.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { textProblems } from './privacy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = join(ROOT, 'catalog', 'logins.json');
const STARTER = join(ROOT, 'templates', 'logins');
const SHEET = join(STARTER, 'sheet.sh');

// The allowlist: a row holds these keys, in this order, and nothing else.
export const FIELDS = ['id', 'name', 'provider', 'family', 'lanes', 'signin', 'passkey', 'twofa', 'own_2fa',
  'recovery_codes', 'link', 'email_change', 'security_url', 'trap', 'source', 'sources_extra', 'checked', 'verified'];
const LANES = new Set(['identity', 'ci', 'cpu', 'gpu', 'inference', 'hosting', 'tools']);
const SIGNIN = new Set(['github', 'apple', 'microsoft', 'google', 'email-password', 'email-link', 'passkey', 'sso', 'other']);
const TWOFA = new Set(['passkey', 'security-key', 'totp', 'push', 'sms', 'email', 'via-provider']);
const PASSKEY = new Set(['signin', '2fa', 'both', 'no']);
const LINK = new Set(['settings', 'email-match', 'no']);
const FAMILY = new Set(['apple', 'google', 'microsoft']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9][a-z0-9.-]*$/;
const HTTPS = /^https:\/\/\S+$/;
const DASH = /[–—]/;
// The same private-term rule the voice lint applies to Markdown, here applied to every other file.
const rule = JSON.parse(readFileSync(join(ROOT, 'tools', 'voice_rules.json'), 'utf8')).patterns.find((p) => p.id === 'private-term');
const PRIVATE = new RegExp(rule.regex.replace(/^\(\?i\)/, ''), 'i');

const list = (v, set) => v === null || (Array.isArray(v) && v.every((x) => set.has(x)) && new Set(v).size === v.length);

// Every problem in one catalog row, as text; [] when clean.
export function rowProblems(row) {
  const p = [];
  if (Object.keys(row).join() !== FIELDS.join()) p.push(`keys must be exactly, in order: ${FIELDS.join(', ')}`);
  if (!ID.test(row.id ?? '')) p.push('id');
  for (const k of ['name', 'provider']) if (typeof row[k] !== 'string' || !row[k]) p.push(k);
  if (row.family !== null && !FAMILY.has(row.family)) p.push('family');
  if (!Array.isArray(row.lanes) || !row.lanes.length || !list(row.lanes, LANES)) p.push('lanes');
  if (!list(row.signin, SIGNIN)) p.push('signin');
  if (!list(row.twofa, TWOFA) || (row.twofa?.includes('via-provider') && row.twofa.length > 1)) p.push('twofa');
  if (row.passkey !== null && !PASSKEY.has(row.passkey)) p.push('passkey');
  for (const k of ['own_2fa', 'recovery_codes', 'email_change']) if (row[k] !== null && typeof row[k] !== 'boolean') p.push(k);
  if (row.link !== null && !LINK.has(row.link)) p.push('link');
  if (row.security_url !== null && !HTTPS.test(row.security_url ?? '')) p.push('security_url');
  if (row.trap !== null && (typeof row.trap !== 'string' || row.trap.trim().split(/\s+/).length > 25)) p.push('trap');
  if (!HTTPS.test(row.source ?? '')) p.push('source');
  if (!Array.isArray(row.sources_extra) || row.sources_extra.some((u) => !HTTPS.test(u))) p.push('sources_extra');
  if (!DATE.test(row.checked ?? '')) p.push('checked');
  if (typeof row.verified !== 'boolean') p.push('verified');
  const text = JSON.stringify(row);
  if (DASH.test(text)) p.push('an em or en dash');
  if (PRIVATE.test(text)) p.push('a private account, person or path');
  p.push(...textProblems(text));
  return p.map((x) => `${row.id}: ${x}`);
}

// Every private item in a text: an email, a home path, a private term or a dash; [] when clean.
export function fileProblems(text) {
  const p = textProblems(text);
  if (PRIVATE.test(text)) p.push('a private account, person or path');
  return p;
}

const good = () => ({ id: 'example', name: 'Example', provider: 'Example Inc', family: null, lanes: ['gpu'],
  signin: ['github', 'email-password'], passkey: '2fa', twofa: ['totp'], own_2fa: true, recovery_codes: true,
  link: 'settings', email_change: true, security_url: 'https://example.com/settings/security', trap: null,
  source: 'https://example.com/docs/login', sources_extra: [], checked: '2026-11-22', verified: true });

test('a clean row passes and each seeded fault fails', () => {
  assert.deepEqual(rowProblems(good()), []);
  const faults = [
    { ...good(), owner: 'someone' },
    { ...good(), signin: ['carrier-pigeon'] },
    { ...good(), twofa: ['via-provider', 'totp'] },
    { ...good(), trap: 'Changing the email — unlinks it.' },
    // Built at run time, so this public file holds no address or home path itself.
    { ...good(), trap: `Write to ${['help', 'example.org'].join('@')} first.` },
    { ...good(), source: 'http://example.com' },
    { ...good(), trap: `Seen in ${['', 'Users', 'someone', 'Desktop'].join('/')}.` },
    { ...good(), name: 'API-Key-Example' },
  ];
  for (const row of faults) assert.notDeepEqual(rowProblems(row), [], JSON.stringify(row));
});

test('the catalog keeps to the allowlist, sorted and canonical', () => {
  const text = readFileSync(CATALOG, 'utf8');
  const cat = JSON.parse(text);
  assert.deepEqual(Object.keys(cat), ['version', 'about', 'checked', 'rows']);
  assert.equal(cat.version, 1);
  assert.ok(cat.rows.length > 0);
  assert.deepEqual(cat.rows.flatMap(rowProblems), []);
  const ids = cat.rows.map((r) => r.id);
  assert.deepEqual(ids, [...ids].sort(), 'rows sorted by id');
  assert.equal(new Set(ids).size, ids.length, 'ids unique');
  assert.equal(cat.checked, cat.rows.map((r) => r.checked).sort().at(-1), 'checked is the newest row date');
  assert.equal(text, `${JSON.stringify(cat, null, 2)}\n`, 'canonical: 2-space JSON and a final newline');
});

test('no starter file or guide names a person, an email or a home path', () => {
  const files = [...readdirSync(STARTER).map((f) => join(STARTER, f)), join(ROOT, 'guides', 'logins.md')];
  for (const f of files) assert.deepEqual(fileProblems(readFileSync(f, 'utf8')), [], f);
});

test('the board loads nothing and writes data as text only', () => {
  const html = readFileSync(join(STARTER, 'board.html'), 'utf8');
  for (const bad of [/\bsrc\s*=\s*["']?https?:/i, /<link[^>]+href\s*=\s*["']?https?:/i, /\bfetch\s*\(/, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/])
    assert.doesNotMatch(html, bad);
});

// A small fixed catalog, so the sheet tests do not move when the real catalog does.
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'logins-'));
  const rows = [
    { ...good(), id: 'acme-gpu', name: 'Acme GPU', signin: ['github', 'google', 'email-password'] },
    { ...good(), id: 'idp', name: 'Identity Co', lanes: ['identity'], signin: ['email-password', 'passkey', 'google'], passkey: 'both' },
    { ...good(), id: 'social-only', name: 'Social Only', signin: ['google'], passkey: 'no', twofa: ['via-provider'], own_2fa: false, recovery_codes: false, link: 'no' },
  ];
  writeFileSync(join(dir, 'catalog.json'), JSON.stringify({ version: 1, about: 'fixture', checked: '2026-11-22', rows }));
  writeFileSync(join(dir, 'sites.json'), JSON.stringify({ version: 1, sites: [
    { id: 'acme', vendor: 'acme-gpu' }, { id: 'idp', vendor: 'idp' }, { id: 'social', vendor: 'social-only' }, { id: 'gone', vendor: 'not-in-catalog' }] }));
  writeFileSync(join(dir, 'status.json'), JSON.stringify({ version: 1, rows: {
    idp: { login_method: 'email-password', email_ok: 'yes', passkey: 'passwords', codes_app: 'passwords', recovery: 'printed', tested: '2026-11-22' },
    acme: { login_method: 'google', email_ok: 'yes', passkey: 'none', codes_app: 'none', recovery: 'missing', tested: null } } }));
  return dir;
}
const sheet = (...args) => spawnSync('bash', [SHEET, ...args], { encoding: 'utf8' });

test('sheet.sh prints one row per site in your order', () => {
  const dir = fixture();
  const out = sheet(join(dir, 'catalog.json'), join(dir, 'sites.json'));
  assert.equal(out.status, 0, out.stderr);
  const lines = out.stdout.trim().split('\n');
  assert.match(lines[0], /^\*\*4 sites\*\*/);
  assert.match(lines[2], /^\| Site \| 🐙 \| 🍎 \| 🪟 \| 🔎 \| ✉️ \| Top \|/);
  assert.equal(lines.filter((l) => l.startsWith('| ') && !l.startsWith('| Site')).length, 4);
  assert.match(out.stdout, /\| Not-in-catalog|not-in-catalog ❔/);
});

test('sheet.sh --json scores each site: the identity provider uses its own passkey, the rest your order', () => {
  const dir = fixture();
  const out = sheet(join(dir, 'catalog.json'), join(dir, 'sites.json'), '--json', join(dir, 'status.json'));
  assert.equal(out.status, 0, out.stderr);
  const by = Object.fromEntries(JSON.parse(out.stdout).map((r) => [r.id, r]));
  assert.equal(by.idp.top, 'passkey');
  assert.equal(by.idp.green, true, JSON.stringify(by.idp.checks));
  assert.equal(by.acme.top, 'github');
  assert.equal(by.acme.checks.top, false);
  assert.equal(by.acme.green, false);
  assert.equal(by.social.codes, 'via-provider');
  assert.equal(by.social.checks.codes, null);
  assert.equal(by.gone.known, false);
});

test('sheet.sh --write replaces only the part between the markers', () => {
  const dir = fixture();
  const readme = join(dir, 'README.md');
  writeFileSync(readme, '# Mine\n\n<!-- sheet:start -->\nold\n<!-- sheet:end -->\n\nkept\n');
  for (let i = 0; i < 2; i++) assert.equal(sheet(join(dir, 'catalog.json'), join(dir, 'sites.json'), '--write', readme).status, 0);
  const text = readFileSync(readme, 'utf8');
  assert.match(text, /^# Mine\n\n<!-- sheet:start -->\n\*\*4 sites\*\*/);
  assert.doesNotMatch(text, /\nold\n/);
  assert.match(text, /<!-- sheet:end -->\n\nkept\n$/);
});

test('the starter example builds against the real catalog', () => {
  const out = sheet(CATALOG, join(STARTER, 'sites.example.json'), '--json', join(STARTER, 'status.example.json'));
  assert.equal(out.status, 0, out.stderr);
  const sites = JSON.parse(readFileSync(join(STARTER, 'sites.example.json'), 'utf8')).sites;
  assert.equal(JSON.parse(out.stdout).length, sites.length);
});
