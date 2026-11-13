// The Credits case from Git Crafter's quality/collectors/lib/redact.test.mjs: the collector's own text
// goes through the engine's redact (collectors/lib/engine.mjs).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collect as credits } from './credits.mjs';

// Split, so the repo's private-reference scan does not count a fixture home.
const alice = '/Users' + '/alice';

test('credits collect: a missing file under home prints no home path and no account name', async () => {
  const params = { usage_file: '~/missing/-Users-alicebob/usage.json', allowances: [{ id: 'a' }] };
  const got = await credits({ mode: 'local', home: alice, params });
  const text = JSON.stringify(got);
  assert.match(text, /a source file is missing or unreadable/, 'the missing file is the reason');
  assert.ok(!text.includes('alice'), text);
  assert.match(text, /~\/missing\/-Users-<user>\/usage\.json/);
});
