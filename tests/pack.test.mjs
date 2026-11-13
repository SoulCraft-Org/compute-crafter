// The pack loads from its own checkout, with no engine beside it: no file reaches past the pack
// root or to a file it lacks, and every collector file imports. Engine names arrive as lib (collectors/lib/engine.mjs).
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

// This repo's public pages (quality/config.json, quality/process/config.json) show only what CI reads: each
// metric in quality/targets is the pack's own, every pack metric left off needs local files, and the Spend map
// is maps/spend.json less the steps whose metric is off.
test('pages: the public page keeps the pack metrics CI reads, and the Spend map the steps they score', () => {
  const read = (f) => JSON.parse(readFileSync(join(ROOT, f), 'utf8'));
  const pack = new Map(read('targets/credits.json').map(({ params, ...d }) => [d.id, d]));
  const page = read('quality/targets/credits.json');
  for (const { params, ...d } of page) assert.deepEqual(d, pack.get(d.id), d.id);
  const shown = new Set(page.map((d) => d.id));
  assert.deepEqual([...pack.values()].filter((d) => shown.has(d.id) === (d.needs === 'local-files')).map((d) => d.id), []);
  const map = read('maps/spend.json');
  const steps = map.steps.filter((s) => shown.has(s.metric));
  assert.ok(steps.length, 'the Spend map keeps a step');
  assert.deepEqual(read('quality/process/config.json').maps, [{ ...map, critical_path: map.critical_path.filter((id) => steps.some((s) => s.id === id)), steps }]);
});

test('pack: every collector file imports with no engine beside it', async () => {
  for (const f of files.filter((x) => x.startsWith('collectors/') && !x.endsWith('.test.mjs'))) {
    const mod = await import(pathToFileURL(join(ROOT, f)).href);
    assert.ok(!('collect' in mod) || typeof mod.collect === 'function', f);
  }
});
