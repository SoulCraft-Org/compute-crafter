// The four public starters in templates/: the quality starter's example files measure all six Credits metrics in a local
// collect, the process starter draws the Spend map's five steps, the compute-list tools build a sheet and copy the catalog
// at a commit, and every starter README links only to files that exist and names every file in its folder.
// No test here starts a network call: sync.sh runs against a stand-in gh.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { collect } from '../collectors/credits/credits.mjs';
import { textProblems } from './privacy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATES = join(ROOT, 'templates');
const STARTERS = ['compute-list', 'logins', 'process', 'quality'];
const CATALOG = join(ROOT, 'catalog', 'plans.json');
const read = (...p) => readFileSync(join(ROOT, ...p), 'utf8');
const json = (...p) => JSON.parse(read(...p));
// The same private-term rule the voice lint applies to Markdown, here applied to every other file.
const rule = json('tools', 'voice_rules.json').patterns.find((p) => p.id === 'private-term');
const PRIVATE = new RegExp(rule.regex.replace(/^\(\?i\)/, ''), 'i');

// Every file under a folder, as paths relative to it.
const filesUnder = (dir, base = dir) => readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
  .flatMap((e) => (e.isDirectory() ? filesUnder(join(dir, e.name), base) : [relative(base, join(dir, e.name)).split('\\').join('/')]));
const packTargets = () => json('targets', 'credits.json');
const noFences = (text) => text.replace(/```[\s\S]*?```/g, '');

test('the starters are the four folders in templates/, each with a README', () => {
  assert.deepEqual(readdirSync(TEMPLATES).sort(), STARTERS);
  for (const s of STARTERS) assert.ok(existsSync(join(TEMPLATES, s, 'README.md')), s);
});

test('no starter file names a person, an email, a home path, a private term or a dash', () => {
  for (const s of STARTERS) {
    for (const f of filesUnder(join(TEMPLATES, s))) {
      const text = readFileSync(join(TEMPLATES, s, f), 'utf8');
      assert.deepEqual(textProblems(text), [], `${s}/${f}`);
      assert.doesNotMatch(text, PRIVATE, `${s}/${f}`);
      assert.doesNotMatch(text, /[–—]/, `${s}/${f}`);
    }
  }
});

test('every starter README links only to files that exist, and names every file in its folder', () => {
  const readmes = [join(ROOT, 'README.md'), ...STARTERS.map((s) => join(TEMPLATES, s, 'README.md'))];
  for (const file of readmes) {
    const text = readFileSync(file, 'utf8');
    for (const m of noFences(text).matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
      assert.ok(existsSync(resolve(dirname(file), target.split('#')[0])), `${relative(ROOT, file)} links ${target}, which does not exist`);
    }
  }
  for (const s of STARTERS) {
    const text = readFileSync(join(TEMPLATES, s, 'README.md'), 'utf8');
    for (const f of filesUnder(join(TEMPLATES, s)).filter((x) => x !== 'README.md')) assert.ok(text.includes(f), `templates/${s}/README.md does not name ${f}`);
  }
  const front = read('README.md');
  for (const s of STARTERS) assert.ok(front.includes(`templates/${s}/README.md`), `README.md does not link templates/${s}`);
});

// ---- quality starter -------------------------------------------------------------------------------------------------------

test('quality starter: the pin is one full commit SHA and the one tab is the pack\'s', () => {
  const config = json('templates', 'quality', 'config.json');
  assert.deepEqual(config.tabs, ['credits']);
  assert.equal(config.packs.length, 1);
  assert.match(config.packs[0], /^SoulCraft-Org\/compute-crafter@[0-9a-f]{40}$/);
  assert.deepEqual(json('pack.json').tabs.map(([id]) => id), ['credits']);
});

// The starter laid out as a user's repo has it: quality/ beside .code-os-packs/SoulCraft-Org/compute-crafter, the pack's checkout.
function userRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'quality-starter-'));
  const kit = join(dir, '.code-os-packs', 'SoulCraft-Org', 'compute-crafter');
  mkdirSync(join(kit, 'catalog'), { recursive: true });
  copyFileSync(CATALOG, join(kit, 'catalog', 'plans.json'));
  cpSync(join(TEMPLATES, 'quality'), join(dir, 'quality'), { recursive: true });
  // Git Crafter merges a targets file's params key by key, the pack's first and the repo's over them (quality/overlay.mjs).
  const params = Object.assign({}, ...packTargets().map((t) => t.params ?? {}), ...JSON.parse(readFileSync(join(dir, 'quality', 'targets', 'credits.json'), 'utf8')).map((t) => t.params ?? {}));
  return { dir, kit, params };
}
const run = ({ dir, kit, params }, mode) => collect({ mode, params, kit, home: dir, now: new Date('2026-11-23T12:00:00Z'), lib: { redact: (v) => v } });

test('quality starter: the example files give 6 of 6 Credits metrics measured in a local collect', async () => {
  const repo = userRepo();
  const out = await run(repo, 'local');
  const ids = packTargets().map((t) => t.id);
  assert.equal(ids.length, 6);
  assert.deepEqual(Object.keys(out).sort(), [...ids].sort());
  for (const id of ids) {
    assert.equal(out[id].could_not_check, undefined, `${id}: ${out[id].could_not_check}`);
    assert.equal(typeof out[id].value, 'number', id);
  }
  // The fake data: CI 1450 of 2000 minutes (the pool), GPU 12 of 30 USD, one free tier unclaimed, two of three use figures read.
  assert.equal(out['credits.actions_pool_used'].value, 72.5);
  assert.equal(out['credits.highest_used_share'].value, 40);
  assert.equal(out['credits.unclaimed_free'].value, 1);
  assert.equal(out['credits.usage_read_share'].value, 66.7);
  assert.equal(out['credits.idle_replaceable'].value, 0);
});

test('quality starter: a CI collect reads no file of yours, so only the age of the catalog is measured', async () => {
  const out = await run(userRepo(), 'ci');
  for (const [id, m] of Object.entries(out)) {
    if (id === 'credits.registry_age_days') assert.equal(typeof m.value, 'number', id);
    else assert.ok(m.could_not_check, id);
  }
});

test('quality starter: the README metric table matches the pack\'s targets', () => {
  const rows = [...read('templates', 'quality', 'README.md').matchAll(/^\| `(credits\.[a-z_]+)` \| (\w+) \| (.+) \| (local|CI and local) \|$/gm)];
  const defs = new Map(packTargets().map((d) => [d.id, d]));
  assert.deepEqual(rows.map((m) => m[1]).sort(), [...defs.keys()].sort());
  for (const [, id, kind, files, runs] of rows) {
    assert.equal(kind, defs.get(id).kind, id);
    assert.equal(runs, defs.get(id).needs === 'local-files' ? 'local' : 'CI and local', id);
    for (const f of files.match(/`inputs\/[^`]+`/g) ?? []) assert.ok(existsSync(join(TEMPLATES, 'quality', f.slice(1, -1))), `${id}: ${f}`);
  }
});

test('quality starter: every input file is fake, from example.com', () => {
  for (const f of filesUnder(join(TEMPLATES, 'quality', 'inputs'))) {
    const text = read('templates', 'quality', 'inputs', f);
    assert.match(text, /Fake example data/, f);
    for (const url of text.match(/https?:\/\/[^\s"]+/g) ?? []) assert.match(url, /^https:\/\/example\.com(?:\/|$)/, `${f}: ${url}`);
  }
});

// ---- process starter -------------------------------------------------------------------------------------------------------

test('process starter: the Spend map\'s five steps, each scored by a Credits metric the quality starter measures', () => {
  const config = json('templates', 'process', 'config.json');
  assert.deepEqual(config.maps, [{ use: 'spend' }]);
  assert.equal(config.docs.maps, 'quality/process/config.json');
  const map = json('maps', 'spend.json');
  assert.deepEqual(map.steps.map((s) => s.id), ['fresh', 'free', 'read', 'pool', 'idle']);
  assert.deepEqual(map.critical_path, map.steps.map((s) => s.id));
  const ids = new Set(packTargets().map((t) => t.id));
  const readme = read('templates', 'process', 'README.md');
  for (const s of map.steps) {
    assert.ok(ids.has(s.metric), `${s.id}: ${s.metric}`);
    assert.ok(readme.includes(`\`${s.metric}\``), `README does not name ${s.metric}`);
    assert.ok(readme.includes(s.name), `README does not name step ${s.name}`);
  }
});

// ---- compute-list starter --------------------------------------------------------------------------------------------------

const LIST = join(TEMPLATES, 'compute-list');
const sheet = (...args) => spawnSync('bash', [join(LIST, 'sheet.sh'), ...args], { encoding: 'utf8' });
const fixture = (mine) => {
  const dir = mkdtempSync(join(tmpdir(), 'compute-list-'));
  const rows = [
    { id: 'acme-free', name: 'Acme Free', provider: 'Acme', lanes: ['ci'], price_month: 0, currency: 'USD', resets: 'monthly', card: false, overage: 'stops', checked: '2026-11-22', verified: true, source: 'https://example.com/pricing' },
    { id: 'acme-gpu', name: 'Acme GPU', provider: 'Acme', lanes: ['gpu', 'inference'], price_month: 20, currency: 'USD', resets: 'monthly', card: true, overage: 'bills', checked: '2026-11-20', verified: false, source: 'https://example.com/gpu' },
  ];
  writeFileSync(join(dir, 'plans.json'), JSON.stringify({ version: 1, rows }));
  writeFileSync(join(dir, 'mine.json'), JSON.stringify({ version: 1, plans: mine }));
  return dir;
};

test('compute-list: sheet.sh prints one row per plan in your order, and flags an id that is not in the catalog', () => {
  const dir = fixture([
    { id: 'acme-gpu', have: true, status: 'use', notes: 'a | b' },
    { id: 'no-such-plan', have: true, status: 'idle' },
    { id: 'acme-free', have: false, status: 'want' },
  ]);
  const out = sheet(join(dir, 'plans.json'), join(dir, 'mine.json'));
  assert.equal(out.status, 0, out.stderr);
  const lines = out.stdout.trim().split('\n');
  assert.match(lines[0], /^\*\*3 plans\*\* · ✅ have 2 · 🟢 use 1 · 💤 idle 1 · 🆓 free 1 · ❔ not in the catalog 1$/);
  const body = lines.filter((l) => l.startsWith('| ') && !l.startsWith('| Plan'));
  assert.equal(body.length, 3);
  assert.match(body[0], /^\| Acme GPU \| gpu, inference \| USD 20 \| 💸 bills \| 💳 \| ✅ \| 🟢 use \| a {3}b \| 2026-11-20 \|$/);
  assert.match(body[1], /^\| ❔ no-such-plan \| not in the catalog \|/);
  assert.match(body[2], /^\| Acme Free \| ci \| free \| 🛑 stops \| · \| · \| ⭐ want \| {2}\| 2026-11-22 ✅ \|$/);
  const json = JSON.parse(sheet(join(dir, 'plans.json'), join(dir, 'mine.json'), '--json').stdout);
  assert.deepEqual(json.map((r) => [r.id, r.known]), [['acme-gpu', true], ['no-such-plan', false], ['acme-free', true]]);
});

test('compute-list: the starter example builds against the real catalog, every id known', () => {
  const out = sheet(CATALOG, join(LIST, 'mine.example.json'), '--json');
  assert.equal(out.status, 0, out.stderr);
  const plans = JSON.parse(read('templates', 'compute-list', 'mine.example.json')).plans;
  const rows = JSON.parse(out.stdout);
  assert.equal(rows.length, plans.length);
  assert.deepEqual(rows.filter((r) => !r.known).map((r) => r.id), []);
});

test('compute-list: sheet.sh --write replaces only the part between the markers, and a note cannot forge one', () => {
  const dir = fixture([{ id: 'acme-free', have: true, status: 'use', notes: '<!-- sheet:end --> sneaky' }]);
  const readme = join(dir, 'README.md');
  writeFileSync(readme, '# Mine\n\n<!-- sheet:start -->\nold\n<!-- sheet:end -->\n\nkept\n');
  for (let i = 0; i < 2; i++) assert.equal(sheet(join(dir, 'plans.json'), join(dir, 'mine.json'), '--write', readme).status, 0);
  const text = readFileSync(readme, 'utf8');
  assert.match(text, /^# Mine\n\n<!-- sheet:start -->\n\*\*1 plans\*\*/);
  assert.doesNotMatch(text, /\nold\n/);
  assert.match(text, /<!-- sheet:end -->\n\nkept\n$/);
  assert.equal(text.match(/<!-- sheet:end -->/g).length, 1);
  assert.equal(text.match(/<!-- sheet:start -->/g).length, 1);
  assert.deepEqual(readdirSync(dir).filter((f) => f.startsWith('.')), [], 'no temp folder is left beside FILE');
});

test('compute-list: sheet.sh --write keeps the file\'s mode and leaves no temp folder after a refusal', () => {
  const dir = fixture([{ id: 'acme-free' }]);
  const readme = join(dir, 'README.md');
  writeFileSync(readme, '# Mine\n<!-- sheet:start -->\n<!-- sheet:end -->\n');
  chmodSync(readme, 0o600);
  assert.equal(sheet(join(dir, 'plans.json'), join(dir, 'mine.json'), '--write', readme).status, 0);
  assert.equal(statSync(readme).mode & 0o777, 0o600);
  writeFileSync(readme, 'no markers\n');
  assert.equal(sheet(join(dir, 'plans.json'), join(dir, 'mine.json'), '--write', readme).status, 2);
  assert.deepEqual(readdirSync(dir).filter((f) => f.startsWith('.')), []);
});

test('compute-list: sheet.sh --write exits 2 on missing, repeated or reversed markers and leaves FILE as it was', () => {
  const dir = fixture([{ id: 'acme-free' }]);
  const readme = join(dir, 'README.md');
  const cases = [
    '# Mine\n<!-- sheet:end -->\nnotes 1\n<!-- sheet:start -->\nnotes 2\nkept?\n',
    '# Mine\n<!-- sheet:start -->\nold\n<!-- sheet:end -->\n<!-- sheet:start -->\nkept?\n',
    '# Mine\n<!-- sheet:start -->\nold\n<!-- sheet:end -->\nnotes\n<!-- sheet:end -->\nkept?\n',
    '# Mine\n<!-- sheet:start --> <!-- sheet:end -->\nkept?\n',
    '# Mine\n<!-- sheet:start -->\nnever closed\n',
    '# Mine\nno markers\n',
  ];
  for (const before of cases) {
    writeFileSync(readme, before);
    const out = sheet(join(dir, 'plans.json'), join(dir, 'mine.json'), '--write', readme);
    assert.equal(out.status, 2, before);
    assert.match(out.stderr, /needs one <!-- sheet:start --> line before one <!-- sheet:end --> line/);
    assert.equal(readFileSync(readme, 'utf8'), before);
  }
});

test('compute-list: sheet.sh exits 2 on a missing file, a mine.json with no plans list, a plan with no id, or no mode', () => {
  const dir = fixture([{ id: 'acme-free' }]);
  const plans = join(dir, 'plans.json');
  assert.equal(sheet(plans, join(dir, 'absent.json')).status, 2);
  writeFileSync(join(dir, 'bad1.json'), JSON.stringify({ rows: [] }));
  writeFileSync(join(dir, 'bad2.json'), JSON.stringify({ plans: [{ have: true }] }));
  assert.equal(sheet(plans, join(dir, 'bad1.json')).status, 2);
  assert.equal(sheet(plans, join(dir, 'bad2.json')).status, 2);
  assert.equal(sheet(join(dir, 'mine.json'), join(dir, 'mine.json')).status, 2);
  assert.equal(sheet(plans, join(dir, 'mine.json'), '--nonsense').status, 2);
});

test('compute-list: sheet.sh exits 2 with a clear message when a status or an overage is not a string', () => {
  const dir = fixture([{ id: 'acme-free' }]);
  writeFileSync(join(dir, 'mine-bad.json'), JSON.stringify({ plans: [{ id: 'acme-free', status: 5 }] }));
  const bad = sheet(join(dir, 'plans.json'), join(dir, 'mine-bad.json'));
  assert.equal(bad.status, 2);
  assert.match(bad.stderr, /status to be a string/);
  const catalog = JSON.parse(readFileSync(join(dir, 'plans.json'), 'utf8'));
  catalog.rows[0].overage = { not: 'a string' };
  writeFileSync(join(dir, 'plans-bad.json'), JSON.stringify(catalog));
  for (const mode of [[], ['--json']]) {
    const out = sheet(join(dir, 'plans-bad.json'), join(dir, 'mine.json'), ...mode);
    assert.equal(out.status, 2);
    assert.match(out.stderr, /overage to be a string/);
  }
});

// A stand-in gh on PATH: it answers the two calls sync.sh makes, and logs every call.
function syncRun({ args = [], env = {}, sha = '0123456789abcdef0123456789abcdef01234567', catalog = readFileSync(CATALOG, 'utf8') } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sync-'));
  const bin = join(dir, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), [
    '#!/usr/bin/env bash',
    'echo "$*" >> "$STUB_LOG"',
    'case "$2" in',
    '  repos/*/commits/*) echo "$STUB_SHA" ;;',
    '  repos/*/contents/catalog/plans.json*) cat "$STUB_CATALOG" ;;',
    '  *) exit 1 ;;',
    'esac',
    '',
  ].join('\n'));
  chmodSync(join(bin, 'gh'), 0o755);
  mkdirSync(join(dir, 'list'));
  copyFileSync(join(LIST, 'sync.sh'), join(dir, 'list', 'sync.sh'));
  writeFileSync(join(dir, 'catalog.json'), catalog);
  const out = spawnSync('bash', [join(dir, 'list', 'sync.sh'), ...args], { encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, STUB_LOG: join(dir, 'log'), STUB_SHA: sha, STUB_CATALOG: join(dir, 'catalog.json'), ...env } });
  const at = (f) => (existsSync(join(dir, 'list', 'vendor', f)) ? readFileSync(join(dir, 'list', 'vendor', f), 'utf8') : null);
  return { out, dir, plans: at('plans.json'), pin: at('PIN'), log: existsSync(join(dir, 'log')) ? readFileSync(join(dir, 'log'), 'utf8') : '' };
}

test('compute-list: sync.sh resolves the commit, copies the catalog at that commit and writes vendor/PIN', () => {
  const sha = '0123456789abcdef0123456789abcdef01234567';
  const r = syncRun();
  assert.equal(r.out.status, 0, r.out.stderr);
  assert.equal(r.pin, `SoulCraft-Org/compute-crafter@${sha}\n`);
  assert.equal(r.plans, readFileSync(CATALOG, 'utf8'));
  assert.deepEqual(readdirSync(join(r.dir, 'list', 'vendor')).sort(), ['PIN', 'plans.json'], 'no temp file is left in vendor/');
  const calls = r.log.trim().split('\n');
  assert.deepEqual(calls, [
    'api repos/SoulCraft-Org/compute-crafter/commits/main -q .sha',
    `api repos/SoulCraft-Org/compute-crafter/contents/catalog/plans.json?ref=${sha} -H Accept: application/vnd.github.raw`,
  ]);
  assert.match(r.out.stdout, new RegExp(`from SoulCraft-Org/compute-crafter at ${sha}`));
});

test('compute-list: sync.sh takes a REF and a REPO, and writes nothing when the answer is not a full SHA or a catalog', () => {
  const ref = syncRun({ args: ['v1.0.0'], env: { REPO: 'someone/fork' } });
  assert.equal(ref.out.status, 0, ref.out.stderr);
  assert.match(ref.log, /^api repos\/someone\/fork\/commits\/v1\.0\.0 -q \.sha$/m);
  assert.match(ref.pin, /^someone\/fork@[0-9a-f]{40}\n$/);
  const short = syncRun({ sha: 'abc123' });
  assert.equal(short.out.status, 1);
  assert.equal(short.pin, null);
  assert.equal(short.plans, null);
  const bad = syncRun({ catalog: '{"rows": []}' });
  assert.equal(bad.out.status, 1);
  assert.equal(bad.pin, null);
  assert.equal(bad.plans, null);
});

test('compute-list: sync.sh refuses a REF that starts with a dash, holds odd characters or `..`, and a REPO that is not owner/name, holds `..` or starts a part with a dot', () => {
  for (const args of [['--evil'], ['a b'], ['x;y'], ['..'], ['a/../b'], ['feature..x'], ['../../user']]) {
    const r = syncRun({ args });
    assert.equal(r.out.status, 2, args.join(' '));
    assert.equal(r.log, '', 'no gh call');
  }
  for (const REPO of ['noslash', 'a/b/c', '/b', 'a/', 'a/..', '../b', 'a..b/c', '.a/b', 'a/.b', '.hidden/repo']) {
    const r = syncRun({ env: { REPO } });
    assert.equal(r.out.status, 2, REPO);
    assert.equal(r.log, '', 'no gh call');
  }
});

test('compute-list and logins: each board loads nothing and writes data as text only', () => {
  for (const s of ['compute-list', 'logins']) {
    const html = read('templates', s, 'board.html');
    for (const bad of [/\bsrc\s*=\s*["']?https?:/i, /<link[^>]+href\s*=\s*["']?https?:/i, /\bfetch\s*\(/, /XMLHttpRequest/, /innerHTML|outerHTML|insertAdjacentHTML|document\.write/])
      assert.doesNotMatch(html, bad, s);
  }
});

// ---- logins starter --------------------------------------------------------------------------------------------------------

test('logins starter: status.example.json has one fake row for each of the seven example sites', () => {
  const sites = json('templates', 'logins', 'sites.example.json').sites.map((s) => s.id).sort();
  const status = json('templates', 'logins', 'status.example.json');
  assert.equal(sites.length, 7);
  assert.deepEqual(Object.keys(status.rows).sort(), sites);
  for (const [id, row] of Object.entries(status.rows)) assert.ok([null, '2000-01-01'].includes(row.tested), `${id}: tested ${row.tested}`);
  assert.match(status.comment, /^Fake example data/);
});

test('logins starter: the README names status.example.json, and its steps and commands use one name for the catalog', () => {
  const text = read('templates', 'logins', 'README.md');
  assert.ok(text.includes('status.example.json'));
  const steps = text.slice(text.indexOf('| Step | Do |'), text.indexOf('\n\n', text.indexOf('| Step | Do |')));
  const commands = [...text.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
  const names = [...`${steps}\n${commands}`.matchAll(/[\w./-]*logins\.json/g)].map((m) => m[0]);
  assert.ok(names.length >= 3);
  assert.deepEqual([...new Set(names)], ['logins.json']);
});
