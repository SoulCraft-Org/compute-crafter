// The pack loads from its own checkout, with no engine beside it: no file reaches past the pack
// root or to a file it lacks, and every collector file imports. Engine names arrive as lib (collectors/lib/engine.mjs).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
// A relative module path in each shape a file can load one, as Git Crafter's seam.test.mjs reads it.
const SPEC = /(?:\bfrom\s*|\bimport\s*\(\s*|^\s*import\s+|\brequire\s*\(\s*|\.resolve\s*\(\s*)(['"`])(\.{1,2}\/[^'"`$]+)\1/gm;
// An import() whose path is built: only the tests' engine door, and this file's own loop, build one.
const BUILT = /\bimport\s*\(\s*(?!(['"`])[^'"`$]*\1\s*\))/;

const mjs = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? mjs(`${dir}${e.name}/`) : e.name.endsWith('.mjs') ? [`${dir}${e.name}`] : []));
const files = [...mjs('collectors/'), ...mjs('tests/')];

test('pack: every module a file loads by path is a pack file', () => {
  const out = files.flatMap((f) => [...readFileSync(join(ROOT, f), 'utf8').matchAll(SPEC)].map((m) => relative(ROOT, resolve(ROOT, dirname(f), m[2]))).filter((t) => t.startsWith('..') || !existsSync(join(ROOT, t))).map((t) => `${f} -> ${t}`));
  assert.deepEqual(out, []);
});

test('pack: no other file builds an import() path', () => {
  assert.deepEqual(files.filter((f) => BUILT.test(readFileSync(join(ROOT, f), 'utf8'))), ['tests/engine-lib.mjs', 'tests/pack.test.mjs']);
});

// This repo's public pages (quality/config.json, quality/process/config.json) carry the whole pack: each metric in
// quality/targets/credits.json is the pack's own (only params differ, for params.catalog_file), the five that need
// local files read not measured in CI, and the Spend map is maps/spend.json with all its steps.
test('pages: the public page carries the pack metrics and the whole Spend map', () => {
  const read = (f) => JSON.parse(readFileSync(join(ROOT, f), 'utf8'));
  const pack = read('targets/credits.json');
  const page = read('quality/targets/credits.json');
  assert.deepEqual(page.map(({ params, ...d }) => d), pack.map(({ params, ...d }) => d));
  assert.equal(Object.assign({}, ...page.map((d) => d.params ?? {})).catalog_file, 'catalog/plans.json');
  const map = read('maps/spend.json');
  const shown = new Set(page.map((d) => d.id));
  assert.deepEqual(map.steps.filter((s) => !shown.has(s.metric)).map((s) => s.id), [], 'every Spend step scores a metric on the page');
  assert.deepEqual(read('quality/process/config.json').maps.filter((m) => m.id === 'spend'), [map]);
});

test('pack: every collector file imports with no engine beside it', async () => {
  for (const f of files.filter((x) => x.startsWith('collectors/') && !x.endsWith('.test.mjs'))) {
    const mod = await import(pathToFileURL(join(ROOT, f)).href);
    assert.ok(!('collect' in mod) || typeof mod.collect === 'function', f);
  }
});

// tests/engine-tests.sh fidelity, against a local stand-in for Git Crafter at a stand-in source_commit: a moved file
// that is gone fails, even when it is in edited. The script runs only up to fidelity's verdict here.
function fidelity(drop) {
  const tmp = mkdtempSync(join(tmpdir(), 'fidelity-'));
  try {
    const moved = JSON.parse(readFileSync(join(ROOT, 'tests', 'moved.json'), 'utf8'));
    const eng = join(tmp, 'engine');
    const git = (cwd, ...args) => spawnSync('git', ['-c', 'user.name=fidelity', '-c', 'user.email=', '-c', 'commit.gpgsign=false', ...args], { cwd, encoding: 'utf8' });
    mkdirSync(eng);
    git(eng, 'init', '-q');
    for (const [from, to] of moved.files) {
      mkdirSync(dirname(join(eng, from)), { recursive: true });
      const text = readFileSync(join(ROOT, to), 'utf8');
      writeFileSync(join(eng, from), moved.edited.includes(to) ? `${text}\n// engine copy\n` : text);
    }
    git(eng, 'add', '-A');
    git(eng, 'commit', '-q', '-m', 'stand-in');
    const sha = git(eng, 'rev-parse', 'HEAD').stdout.trim();
    const pack = join(tmp, 'pack');
    for (const [, to] of moved.files) if (to !== drop) cpSync(join(ROOT, to), join(pack, to));
    // The script up to and including fidelity's verdict line: the engine install and the pack tests after it need npm.
    const script = readFileSync(join(ROOT, 'tests', 'engine-tests.sh'), 'utf8');
    const verdict = script.indexOf('echo "fidelity:');
    mkdirSync(join(pack, 'tests'), { recursive: true });
    writeFileSync(join(pack, 'tests', 'fidelity.sh'), script.slice(0, script.indexOf('\n', verdict) + 1));
    writeFileSync(join(pack, 'tests', 'moved.json'), JSON.stringify({ ...moved, source_commit: sha }));
    for (const f of ['ci.yml', 'pages.yml']) {
      const yml = readFileSync(join(ROOT, '.github', 'workflows', f), 'utf8').replace(/(git-crafter\/[^@\s]+@)[0-9a-f]{40}/g, `$1${sha}`);
      mkdirSync(join(pack, '.github', 'workflows'), { recursive: true });
      writeFileSync(join(pack, '.github', 'workflows', f), yml);
    }
    mkdirSync(join(tmp, 'runner'));
    const env = { ...process.env, RUNNER_TEMP: join(tmp, 'runner'), GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: `url.file://${eng}.insteadOf`, GIT_CONFIG_VALUE_0: 'https://github.com/SoulCraft-Org/git-crafter' };
    return spawnSync('bash', ['tests/fidelity.sh'], { cwd: pack, env, encoding: 'utf8' });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

test('fidelity: every moved file present passes', () => {
  const out = fidelity(null);
  assert.equal(out.status, 0, out.stdout + out.stderr);
  const moved = JSON.parse(readFileSync(join(ROOT, 'tests', 'moved.json'), 'utf8'));
  const same = moved.files.length - moved.edited.length;
  assert.match(out.stdout, new RegExp(`^fidelity: ${same} files match [0-9a-f]{40}, ${moved.edited.length} edited$`, 'm'));
});

test('fidelity: an edited moved file that is gone fails', () => {
  const out = fidelity('collectors/credits/redact.test.mjs');
  assert.equal(out.status, 1, out.stdout + out.stderr);
  assert.match(out.stdout, /::error::collectors\/credits\/redact\.test\.mjs is listed in tests\/moved\.json but missing/);
  assert.doesNotMatch(out.stdout, /^fidelity:/m);
});
