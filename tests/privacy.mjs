// The privacy gate: Compute Crafter's public page holds no reading from a
// maintainer's machine. It reads the run file the page is drawn from, and
// every file under each --dist folder, the folder the deploy uploads.
//
//   node tests/privacy.mjs <run.json> [targets folder ...] [--dist <folder> ...]
//
// A finding is any of these:
//   the run's mode is not ci          a --local run is never uploaded
//   a local-only metric has a value   needs "local-files" in a targets folder
//   a home path                       /Users/<name>, /home/<name>, C:\Users\<name>, -Users-<name>
//   an email address                  git@ remotes and noreply addresses pass
//   a name in PRIVACY_NAMES           comma separated, for a local check
//   a match of PRIVACY_TERMS          one regex, the org secret PRIVATE_TERMS that CI passes
// A --dist file is text, so only the last four apply to it.
// A PRIVACY_TERMS finding prints the file only, never the match: a public repo's Actions log is public too.
// An unset PRIVACY_TERMS is skipped, with a notice, only on a pull_request from a fork or Dependabot, which GitHub gives
// no secret (the rule of tools/private_terms.py). Anywhere else, a push to main included, it is exit 2.
// Exit 0 clean, 1 findings (each printed), 2 usage error.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// A redacted home prints as ~ or -Users-<user>; a CI runner's own home is no person's.
const HOME_PATHS = [/\/Users\/[A-Za-z0-9._-]+/g, /\/home\/(?!runner\b)[A-Za-z0-9._-]+/g, /[A-Za-z]:(?:\\)+Users(?:\\)+[A-Za-z0-9._-]+/g, /-Users-(?!<user>)[A-Za-z0-9_]+/g];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const EMAIL_OK = (e) => /^git@/.test(e) || /^noreply@/i.test(e) || /@users\.noreply\.github\.com$/i.test(e);

// The ids whose targets entry needs local files, from every *.json in each folder.
export function localOnlyIds(dirs) {
  const ids = new Set();
  for (const dir of dirs) {
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      for (const def of JSON.parse(readFileSync(join(dir, file), 'utf8'))) if (def.needs === 'local-files') ids.add(def.id);
    }
  }
  return ids;
}

// Every file under a folder, depth first, as paths.
export function filesUnder(dir) {
  return readdirSync(dir).sort().flatMap((f) => (statSync(join(dir, f)).isDirectory() ? filesUnder(join(dir, f)) : [join(dir, f)]));
}

// PRIVACY_TERMS as a case-insensitive RegExp, as tools/private_terms.py reads PRIVATE_TERMS; null when empty. Throws when invalid.
export function termsPattern(value) {
  const text = String(value ?? '').trim();
  return text ? new RegExp(text.replace(/^\(\?i\)/, ''), 'i') : null;
}

// Whether GitHub withholds secrets from this run by design: a pull_request whose head is a fork, or Dependabot's.
export function noSecretsByDesign(env = process.env) {
  if (env.GITHUB_EVENT_NAME !== 'pull_request') return false;
  if (env.GITHUB_ACTOR === 'dependabot[bot]') return true;
  try {
    const head = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')).pull_request.head.repo.full_name;
    return head !== env.GITHUB_REPOSITORY;
  } catch {
    return false;
  }
}

// Every home path, email, listed name or private term in a text; [] when clean. A term hit never names the match.
export function textProblems(text, names = [], terms = null) {
  const found = [];
  for (const re of HOME_PATHS) for (const hit of new Set(text.match(re) ?? [])) found.push(`home path ${hit}`);
  for (const hit of new Set((text.match(EMAIL) ?? []).filter((e) => !EMAIL_OK(e)))) found.push(`email ${hit}`);
  for (const name of names.map((n) => n.trim()).filter(Boolean)) {
    if (new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)) found.push(`account name ${name}`);
  }
  if (terms?.test(text)) found.push('private term');
  return found;
}

// Every finding in one run, as text; [] when clean.
export function privacyProblems(run, { localIds = new Set(), names = [], terms = null } = {}) {
  const found = [];
  if (run?.mode !== 'ci') found.push(`run mode is ${JSON.stringify(run?.mode)}, not "ci"`);
  for (const [id, m] of Object.entries(run?.metrics ?? {})) {
    if (localIds.has(id) && (m?.value != null || m?.detail?.length)) found.push(`${id} needs local files but carries a value`);
  }
  const text = textProblems(JSON.stringify(run), names, terms);
  if (text.includes('private term')) {
    // Where, never what: the ids of the metrics (or top-level keys) whose JSON holds the match.
    const where = [
      ...Object.entries(run?.metrics ?? {}).filter(([, m]) => terms.test(JSON.stringify(m))).map(([id, m]) => `metric ${terms.test(id) ? '(id)' : id} (${termPaths(m, terms).slice(0, 4).join(', ')})`),
      ...Object.entries(run ?? {}).filter(([k, v]) => k !== 'metrics' && terms.test(JSON.stringify(v))).map(([k]) => `key ${terms.test(k) ? '(key)' : k}`),
    ];
    if (where.length) found.push(`private term in ${where.slice(0, 8).join(', ')}`);
  }
  return [...found, ...text];
}

// The key paths inside a value whose string (key or leaf) holds a private term, with the match's offset and the string's length, such as detail[2].title at 4 of 30; never the match.
export function termPaths(value, terms, path = '') {
  if (typeof value === 'string') return terms.test(value) ? [`${path || '(value)'} at ${value.search(terms)} of ${value.length}`] : [];
  if (value === null || typeof value !== 'object') return [];
  const out = [];
  for (const [k, v] of Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value)) {
    const p = Array.isArray(value) ? `${path}[${k}]` : `${path ? path + '.' : ''}${terms.test(k) ? '(key)' : k}`;
    out.push(...termPaths(v, terms, p));
  }
  return out;
}

// Where a private term sits in a page: the id of the nearest element that opens before it, never the match.
export function termWhere(html, terms) {
  const at = terms ? html.search(terms) : -1;
  if (at < 0) return null;
  const ids = [...html.slice(0, at).matchAll(/\sid="([^"]+)"/g)];
  return ids.length ? `near #${ids[ids.length - 1][1]}` : 'before any element id';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const dists = [];
  for (let i = args.indexOf('--dist'); i !== -1; i = args.indexOf('--dist')) dists.push(args.splice(i, 2)[1]);
  const [file, ...dirs] = args;
  if (!file || dists.includes(undefined)) {
    console.error('usage: node tests/privacy.mjs <run.json> [targets folder ...] [--dist <folder> ...]');
    process.exit(2);
  }
  const names = (process.env.PRIVACY_NAMES ?? '').split(',');
  let run, localIds, pages, terms;
  try {
    terms = termsPattern(process.env.PRIVACY_TERMS);
  } catch {
    // The regex error message can quote part of the secret, so the log gets none of it.
    console.error('privacy: PRIVACY_TERMS is not a valid regex');
    process.exit(2);
  }
  try {
    run = JSON.parse(readFileSync(file, 'utf8'));
    localIds = localOnlyIds(dirs);
    pages = dists.flatMap(filesUnder);
  } catch (err) {
    console.error(`privacy: ${err.message}`);
    process.exit(2);
  }
  if (!terms) {
    if (!noSecretsByDesign()) {
      console.error('::error::privacy: PRIVACY_TERMS is empty; set the org secret PRIVATE_TERMS for this repo (only a fork or Dependabot pull request may run without it)');
      process.exit(2);
    }
    console.log('::notice::privacy: PRIVACY_TERMS is not available to this pull request; the push to main runs the check');
  }
  const found = privacyProblems(run, { localIds, names, terms });
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    for (const f of textProblems(html, names, terms)) found.push(`${page}: ${f}${f === 'private term' ? ` (${termWhere(html, terms)})` : ''}`);
  }
  for (const f of found) console.error(`::error::privacy: ${f}`);
  console.log(`privacy: ${Object.keys(run.metrics ?? {}).length} metrics, ${localIds.size} local-only ids, ${pages.length} dist files, ${found.length} findings`);
  process.exit(found.length ? 1 : 0);
}
