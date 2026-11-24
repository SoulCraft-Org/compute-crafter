// catalog/plans.json is a checked copy of Colorado-Compute/compute-credits. catalog/PIN names the commit and the sha256 of
// that commit's file; catalog/sync.sh moves or restores the copy. Offline: sync.sh runs against a fake gh, never the network.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const [pinLine, pinHash] = readFileSync(join(ROOT, 'catalog', 'PIN'), 'utf8').split('\n');
const PIN_SHA = pinLine.split('@')[1];
const BODY = '{"rows":[{"id":"x"}]}\n';

// A scratch copy of catalog/ with a fake gh on PATH. The fake logs each call, answers the commit lookup with the SHA it was
// asked for, and answers the contents call with `body`.
function sandbox({ pin = readFileSync(join(ROOT, 'catalog', 'PIN'), 'utf8'), body = BODY } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'catalog-pin-'));
  mkdirSync(join(root, 'catalog'));
  mkdirSync(join(root, 'bin'));
  copyFileSync(join(ROOT, 'catalog', 'sync.sh'), join(root, 'catalog', 'sync.sh'));
  writeFileSync(join(root, 'catalog', 'PIN'), pin);
  writeFileSync(join(root, 'catalog', 'plans.json'), 'old\n');
  writeFileSync(join(root, 'body'), body);
  writeFileSync(join(root, 'bin', 'gh'), [
    '#!/bin/sh',
    `echo "$@" >> "${root}/gh.log"`,
    'case "$2" in',
    `  */commits/*) echo "\${2##*/commits/}" ;;`,
    `  */contents/*) cat "${root}/body" ;;`,
    'esac',
    '',
  ].join('\n'));
  chmodSync(join(root, 'bin', 'gh'), 0o755);
  const run = (...args) => spawnSync('bash', [join(root, 'catalog', 'sync.sh'), ...args], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${join(root, 'bin')}:${process.env.PATH}` },
  });
  const plans = () => readFileSync(join(root, 'catalog', 'plans.json'), 'utf8');
  const ghCalls = () => { try { return readFileSync(join(root, 'gh.log'), 'utf8'); } catch { return ''; } };
  return { root, run, plans, ghCalls, pin: () => readFileSync(join(root, 'catalog', 'PIN'), 'utf8') };
}

test('catalog/PIN: owner/name@40-hex SHA, then a 64-hex sha256', () => {
  assert.match(pinLine, /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+@[0-9a-f]{40}$/);
  assert.match(pinHash, /^[0-9a-f]{64}$/);
  assert.equal(readFileSync(join(ROOT, 'catalog', 'PIN'), 'utf8').split('\n').length, 3, 'two lines and a final newline');
});

test('catalog/plans.json: its sha256 equals the hash in catalog/PIN', () => {
  assert.equal(sha256(readFileSync(join(ROOT, 'catalog', 'plans.json'))), pinHash);
});

test('sync.sh refuses a branch name and a short SHA, before it calls gh', () => {
  const s = sandbox();
  try {
    for (const ref of ['main', 'refs/heads/main', PIN_SHA.slice(0, 7), PIN_SHA.slice(0, 39), PIN_SHA.toUpperCase(), '']) {
      const r = s.run('--update', ref);
      assert.notEqual(r.status, 0, `--update ${ref} must fail`);
      assert.match(r.stderr, /full 40-character/);
    }
    assert.notEqual(s.run('main').status, 0, 'a bare ref is not an argument');
    assert.notEqual(s.run('--update').status, 0, '--update needs a SHA');
    assert.equal(s.ghCalls(), '', 'gh was never called');
    assert.equal(s.plans(), 'old\n');
  } finally { rmSync(s.root, { recursive: true, force: true }); }
});

test('sync.sh refuses a PIN that holds a branch name or a short SHA', () => {
  for (const bad of [`Colorado-Compute/compute-credits@main\n${pinHash}\n`, `Colorado-Compute/compute-credits@${PIN_SHA.slice(0, 7)}\n${pinHash}\n`]) {
    const s = sandbox({ pin: bad });
    try {
      const r = s.run();
      assert.notEqual(r.status, 0);
      assert.equal(s.ghCalls(), '');
    } finally { rmSync(s.root, { recursive: true, force: true }); }
  }
});

test('sync.sh refuses a hash mismatch and writes nothing', () => {
  const s = sandbox({ pin: `Colorado-Compute/compute-credits@${PIN_SHA}\n${pinHash}\n`, body: 'not the pinned file\n' });
  try {
    const r = s.run();
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /catalog\/PIN says/);
    assert.equal(s.plans(), 'old\n');
  } finally { rmSync(s.root, { recursive: true, force: true }); }
});

test('sync.sh writes the file when the hash matches, and --update moves the pin', () => {
  const s = sandbox({ pin: `Colorado-Compute/compute-credits@${PIN_SHA}\n${sha256(BODY)}\n` });
  try {
    const r = s.run();
    assert.equal(r.status, 0, r.stderr);
    assert.equal(s.plans(), BODY);
    assert.match(s.ghCalls(), new RegExp(`commits/${PIN_SHA}`));
    const next = 'a'.repeat(40);
    const u = s.run('--update', next);
    assert.equal(u.status, 0, u.stderr);
    assert.equal(s.pin(), `Colorado-Compute/compute-credits@${next}\n${sha256(BODY)}\n`);
  } finally { rmSync(s.root, { recursive: true, force: true }); }
});
