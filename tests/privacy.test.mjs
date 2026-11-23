// The privacy gate on fixture runs: a clean CI run passes, and each seeded
// local value, home path, email or account name fails it.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { localOnlyIds, privacyProblems, termsPattern, textProblems } from './privacy.mjs';

// A targets folder with one local-only metric and one read from GitHub.
function targetsDir() {
  const dir = mkdtempSync(join(tmpdir(), 'privacy-'));
  writeFileSync(join(dir, 'fixture.json'), JSON.stringify([{ id: 'fixture.local', needs: 'local-files' }, { id: 'fixture.gh', needs: 'gh' }]));
  return dir;
}

// A CI run as collect.mjs writes it: the local metric unread, the GitHub one read.
const cleanRun = () => ({
  generated_at: '2026-11-12T00:00:00.000Z',
  mode: 'ci',
  metrics: {
    'fixture.local': { could_not_check: 'read by a --local collect only', source: 'state: ~/.claude/projects, -Users-<user>-Developer' },
    'fixture.gh': { value: 3, source: 'last 20 merged pull requests', read_at: '2026-11-12T00:00:00.000Z' },
  },
});

const localIds = localOnlyIds([targetsDir()]);

test('privacy: the targets name the local-only ids', () => {
  assert.deepEqual([...localIds], ['fixture.local']);
});

test('privacy: a clean CI run passes', () => {
  assert.deepEqual(privacyProblems(cleanRun(), { localIds }), []);
});

test('privacy: a seeded local value fails', () => {
  const run = cleanRun();
  run.metrics['fixture.local'] = { value: 12, source: 'transcripts' };
  assert.deepEqual(privacyProblems(run, { localIds }), ['fixture.local needs local files but carries a value']);
});

test('privacy: a local run fails', () => {
  assert.deepEqual(privacyProblems({ ...cleanRun(), mode: 'local' }, { localIds }), ['run mode is "local", not "ci"']);
});

test('privacy: home paths fail in each form, a redacted one passes', () => {
  for (const path of ['/Users/someone/x', '/home/someone/x', 'C:\\Users\\someone\\x', '-Users-someone-Developer']) {
    const run = cleanRun();
    run.metrics['fixture.gh'].source = path;
    assert.equal(privacyProblems(run, { localIds }).length, 1, path);
  }
  const run = cleanRun();
  run.metrics['fixture.gh'].source = '/home/runner/work/compute-crafter';
  assert.deepEqual(privacyProblems(run, { localIds }), []);
});

test('privacy: an email fails; a git remote and a noreply address pass', () => {
  const run = cleanRun();
  run.metrics['fixture.gh'].source = 'git@github.com:owner/repo noreply@example.com 1+someone@users.noreply.github.com';
  assert.deepEqual(privacyProblems(run, { localIds }), []);
  run.metrics['fixture.gh'].source = 'someone@example.com';
  assert.deepEqual(privacyProblems(run, { localIds }), ['email someone@example.com']);
});

test('privacy: the pack targets name 5 local-only ids, and a seeded one fails', () => {
  const ids = localOnlyIds([fileURLToPath(new URL('../targets/', import.meta.url))]);
  assert.equal(ids.size, 5, 'credits.registry_age_days reads the committed catalog');
  assert.ok(!ids.has('credits.registry_age_days'));
  const run = { mode: 'ci', metrics: { 'credits.highest_used_share': { value: 62, source: 'usage file' } } };
  assert.ok(ids.has('credits.highest_used_share'));
  assert.deepEqual(privacyProblems(run, { localIds: ids }), ['credits.highest_used_share needs local files but carries a value']);
});

test('privacy: a listed account name fails, as a whole word', () => {
  const run = cleanRun();
  run.metrics['fixture.gh'].source = 'read by someone';
  assert.deepEqual(privacyProblems(run, { localIds, names: ['someone'] }), ['account name someone']);
  assert.deepEqual(privacyProblems(run, { localIds, names: ['some', ''] }), []);
});

test('privacy: page text fails on a planted home path and email, and passes without them', () => {
  const page = '<h2>Credits</h2><p class="src">not measured</p><p class="src planted">/Users/example/x someone@example.com</p>';
  assert.deepEqual(textProblems(page), ['home path /Users/example', 'email someone@example.com']);
  assert.deepEqual(textProblems(page.replace(/<p class="src planted">.*?<\/p>/g, '')), []);
});

test('privacy: the gate fails a home path planted in a file under --dist', () => {
  const root = mkdtempSync(join(tmpdir(), 'privacy-dist-'));
  writeFileSync(join(root, 'latest.json'), JSON.stringify(cleanRun()));
  mkdirSync(join(root, 'dist', 'tab'), { recursive: true });
  writeFileSync(join(root, 'dist', 'index.html'), '<p>clean</p>');
  const gate = () => spawnSync(process.execPath, [fileURLToPath(new URL('./privacy.mjs', import.meta.url)), join(root, 'latest.json'), '--dist', join(root, 'dist')], { encoding: 'utf8', env: { PATH: process.env.PATH } });
  assert.equal(gate().status, 0);
  writeFileSync(join(root, 'dist', 'tab', 'page.html'), '<p class="src">/Users/example/project</p>');
  const run = gate();
  assert.equal(run.status, 1);
  assert.match(run.stderr, /page\.html: home path \/Users\/example/);
});

// The gate as CI runs it: PRIVACY_TERMS holds the org secret PRIVATE_TERMS, one regex, and no log line quotes a match.
function gateWith(extra) {
  const root = mkdtempSync(join(tmpdir(), 'privacy-terms-'));
  writeFileSync(join(root, 'latest.json'), JSON.stringify(cleanRun()));
  mkdirSync(join(root, 'dist'), { recursive: true });
  writeFileSync(join(root, 'dist', 'index.html'), '<p>Credits for exampleterm and another</p>');
  const args = [fileURLToPath(new URL('./privacy.mjs', import.meta.url)), join(root, 'latest.json'), '--dist', join(root, 'dist')];
  return spawnSync(process.execPath, args, { encoding: 'utf8', env: { PATH: process.env.PATH, ...extra } });
}

test('privacy: PRIVACY_TERMS reads the PRIVATE_TERMS regex, case-insensitive, with or without a leading (?i)', () => {
  assert.equal(termsPattern(''), null);
  assert.equal(termsPattern(undefined), null);
  for (const value of ['exampleterm', '(?i)EXAMPLETERM', 'other|ExampleTerm']) assert.deepEqual(textProblems('an exampleterm here', [], termsPattern(value)), ['private term'], value);
  assert.deepEqual(textProblems('nothing here', [], termsPattern('exampleterm')), []);
  assert.deepEqual(privacyProblems(cleanRun(), { localIds, terms: termsPattern('fixture') }), ['private term']);
});

test('privacy: the gate fails a private term in a --dist file and prints the file, never the match', () => {
  const run = gateWith({ PRIVACY_TERMS: 'exampleterm|nomatch' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /index\.html: private term/);
  assert.ok(!/exampleterm/.test(run.stderr + run.stdout), 'the log holds no match');
});

test('privacy: with PRIVACY_TERMS unset the gate notes the skip and passes, as a fork or Dependabot pull request needs', () => {
  const run = gateWith({});
  assert.equal(run.status, 0);
  assert.match(run.stdout, /PRIVACY_TERMS is not set/);
});

test('privacy: an invalid PRIVACY_TERMS is a usage error that quotes none of it', () => {
  const run = gateWith({ PRIVACY_TERMS: 'secretname(' });
  assert.equal(run.status, 2);
  assert.match(run.stderr, /PRIVACY_TERMS is not a valid regex/);
  assert.ok(!/secretname/.test(run.stderr + run.stdout));
});
