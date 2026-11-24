// The Wiring map (site/map.html) reads site/wiring.json. Offline: every guide has a node, every path in the data is a
// real file, every wire names a known host and kind, and the page loads nothing from the network but its own data file.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { textProblems } from './privacy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = readFileSync(join(ROOT, 'site', 'wiring.json'), 'utf8');
const data = JSON.parse(raw);
const page = readFileSync(join(ROOT, 'site', 'map.html'), 'utf8');

// README.md is the index and CHECKLIST.md is a blank form to copy: neither is a guide. guides/detail/ is a folder.
const NOT_GUIDES = new Set(['README.md', 'CHECKLIST.md']);
const guides = readdirSync(join(ROOT, 'guides'), { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith('.md') && !NOT_GUIDES.has(e.name))
  .map((e) => `guides/${e.name}`);
const ids = (list) => new Set(list.map((x) => x.id));

test('every guide page has exactly one node', () => {
  const nodeGuides = data.nodes.map((n) => n.guide).sort();
  assert.deepEqual(nodeGuides, [...guides].sort());
});

test('no node points to a missing guide, and every link in the data is a file in the repo', () => {
  for (const n of data.nodes) {
    assert.ok(existsSync(join(ROOT, n.guide)), `${n.id}: ${n.guide} does not exist`);
    if (n.detail !== null) assert.ok(existsSync(join(ROOT, n.detail)), `${n.id}: ${n.detail} does not exist`);
  }
  assert.match(data.repo, /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/blob\/main\/$/);
});

test('node ids are unique and each node carries the card fields', () => {
  assert.equal(ids(data.nodes).size, data.nodes.length);
  for (const n of data.nodes) {
    for (const f of ['id', 'name', 'tagline', 'free', 'signin', 'key']) assert.ok(String(n[f] ?? '').trim(), `${n.id}: ${f} is empty`);
    assert.ok(n.lanes.length > 0, `${n.id}: no lane`);
    assert.deepEqual(Object.keys(n.wires).sort(), data.hosts.map((h) => h.id).sort(), `${n.id}: wires must name every host`);
  }
});

test('every lane, host and wire kind a node names is defined', () => {
  const lanes = ids(data.lanes);
  const kinds = ids(data.kinds);
  for (const n of data.nodes) {
    for (const lane of n.lanes) assert.ok(lanes.has(lane), `${n.id}: unknown lane ${lane}`);
    for (const [host, wire] of Object.entries(n.wires)) {
      if (wire === null) continue;
      assert.ok(kinds.has(wire.kind), `${n.id} to ${host}: unknown kind ${wire.kind}`);
      assert.ok(wire.how.trim(), `${n.id} to ${host}: no description`);
    }
  }
  assert.deepEqual(data.hosts.map((h) => h.id), ['opencode', 'claude'], 'OpenCode first, Claude Code second');
});

test('a figure names its source and read date; the data holds no dash, home path, email or private shape', () => {
  for (const n of data.nodes) {
    if (/\d/.test(n.free)) assert.match(n.free, /\(.+, read \d{4}-\d{2}-\d{2}\)/, `${n.id}: figure without a source and date`);
  }
  assert.doesNotMatch(raw, /[–—]/, 'no em dash or en dash');
  assert.deepEqual(textProblems(raw), []);
  assert.deepEqual(textProblems(page), []);
});

test('the page reads only its own wiring.json and loads nothing from the network', () => {
  assert.match(page, /fetch\('wiring\.json'/);
  assert.doesNotMatch(page, /\b(?:src|srcset)\s*=\s*["']?(?:https?:)?\/\//i, 'no remote script or image');
  assert.doesNotMatch(page, /<link\b[^>]*\bhref\s*=\s*["']?(?:https?:)?\/\//i, 'no remote stylesheet or font');
  assert.doesNotMatch(page, /@import|url\(\s*["']?(?:https?:)?\/\//i, 'no remote CSS');
  assert.doesNotMatch(page, /fetch\(\s*['"`]https?:/, 'no remote fetch');
  assert.doesNotMatch(page, /\b(?:XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/, 'no other network call');
});

test('the page keeps its promises: a viewport, dark mode, reduced motion and a focus style', () => {
  assert.match(page, /name="viewport"/);
  assert.match(page, /prefers-color-scheme:\s*dark/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /:focus-visible/);
});
