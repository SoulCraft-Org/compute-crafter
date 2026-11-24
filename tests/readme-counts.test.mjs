// A count in README.md or catalog/README.md is a claim about the data: it fails when catalog/plans.json or
// catalog/logins.json says otherwise. guides/README.md's claim about the table each guide opens with is checked here too.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(join(ROOT, ...p), 'utf8');
const plans = JSON.parse(read('catalog', 'plans.json'));
const logins = JSON.parse(read('catalog', 'logins.json'));
const numbers = (text, re) => [...text.matchAll(re)].map((m) => Number(m[1]));

test('README.md: every count of plans, lanes, sign-in vendors, verified plans and starters matches the data', () => {
  const text = read('README.md');
  const claims = [
    ['plans', /\b(\d+) plans\b/g, plans.rows.length],
    ['lanes', /\b(\d+) lanes\b/g, plans.lanes.length],
    ['sign-in vendors', /\b(\d+) sign-in vendors\b/g, logins.rows.length],
    ['verified', /\b(\d+) verified\b/g, plans.rows.filter((r) => r.verified).length],
    ['starters', /\b(\d+) starters\b/g, readdirSync(join(ROOT, 'templates'), { withFileTypes: true }).filter((e) => e.isDirectory()).length],
  ];
  for (const [name, re, want] of claims) {
    const got = numbers(text, re);
    assert.ok(got.length > 0, `README.md states no count of ${name}`);
    assert.deepEqual(got.filter((n) => n !== want), [], `README.md ${name}: the data says ${want}`);
  }
});

test('catalog/README.md: the lane table matches plans.json, counted by each row\'s first lane', () => {
  const lines = read('catalog', 'README.md').split('\n');
  // A table row's three counts after its label: rows, verified, price 0.
  const counts = (label) => {
    const line = lines.find((l) => l.startsWith(`| ${label} |`));
    assert.ok(line, `catalog/README.md has no row for ${label}`);
    return line.split('|').slice(2, 5).map((c) => Number(c.replace(/\*/g, '').trim()));
  };
  const tally = (rows) => [rows.length, rows.filter((r) => r.verified).length, rows.filter((r) => r.price_month === 0).length];
  for (const lane of plans.lanes) assert.deepEqual(counts(lane), tally(plans.rows.filter((r) => r.lanes[0] === lane)), lane);
  assert.deepEqual(counts('**All**'), tally(plans.rows), 'All');
  assert.equal(plans.rows.filter((r) => !plans.lanes.includes(r.lanes[0])).length, 0, 'every row has a lane in plans.lanes');
});

test('guides/README.md: the guides that do not open with the provider table are the four it names', () => {
  const PROVIDER = '| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |';
  const readme = read('guides', 'README.md');
  const named = [...readme.split('\n')[2].matchAll(/\]\(([\w-]+\.md)\)/g)].map((m) => m[1]).sort();
  assert.equal(named.length, 4, 'line 3 names four guides');
  const listed = [...readme.matchAll(/^\| \[[^\]]+\]\(([\w-]+\.md)\) \| /gm)].map((m) => m[1]).filter((f) => f !== 'CHECKLIST.md');
  for (const file of readdirSync(join(ROOT, 'guides')).filter((f) => f.endsWith('.md') && !['README.md', 'CHECKLIST.md'].includes(f))) {
    assert.ok(listed.includes(file), `guides/README.md does not list ${file}`);
  }
  // The first table line outside a code fence: a pilot page opens with a diagram, then the provider table.
  const firstTable = (text) => {
    let fenced = false;
    for (const line of text.split('\n')) {
      if (line.startsWith('```')) fenced = !fenced;
      else if (!fenced && line.startsWith('|')) return line;
    }
    return undefined;
  };
  const without = listed.filter((f) => firstTable(read('guides', f)) !== PROVIDER).sort();
  assert.deepEqual(without, named);
});
