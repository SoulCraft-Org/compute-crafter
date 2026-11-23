// The GitHub billing reader of the Credits pack: an org's use of a product this month, for readUse in credits.mjs.
import { finite, round } from './credits-metrics.mjs';

// The org's use of a product this month, in gross USD, less the lines of public repositories. GitHub Docs, "GitHub
// Actions billing" (https://docs.github.com/en/billing/concepts/product-billing/github-actions, read 2026-11-23):
// standard GitHub-hosted runners in public repositories are free and never draw on the plan's included minutes, and
// larger runners in public repositories are billed, not drawn from them, so no line of a public repository is use of
// the allowance. A larger runner in a private repository can draw from it (Team and Enterprise Cloud), so it counts.
// The usage report spells the product in lower case (actions, code_quality, copilot), the summary as Actions, so the
// product is compared without case. Usage lines name their repository (https://docs.github.com/en/rest/billing/usage, read 2026-11-23); that endpoint
// takes year, month and day and no page parameter, so one call is the whole month. The repository lists are paged.
// A line whose repository is in neither list (renamed, deleted, or none named) is counted, never dropped. A failed
// read of any call, or an empty private list beside lines that are not public, is a why, never a guess.
export async function readBilling(reader, exec, now) {
  const product = reader.product ?? 'Actions';
  const [year, month] = [now.getUTCFullYear(), now.getUTCMonth() + 1];
  const usageApi = `/organizations/${reader.github_billing}/settings/billing/usage?year=${year}&month=${month}`;
  let api = usageApi;
  try {
    const items = (JSON.parse(await exec('gh', ['api', usageApi])).usageItems ?? []).filter((x) => String(x.product).toLowerCase() === product.toLowerCase() && finite(x.grossAmount));
    if (!items.length) return { why: `gh api ${api} lists no ${product} usage this month` };
    const lists = {};
    for (const visibility of ['public', 'private']) {
      api = `orgs/${reader.github_billing}/repos?type=${visibility}`;
      lists[visibility] = new Set((await exec('gh', ['api', api, '--paginate', '--jq', '.[].name'])).split('\n').map((s) => s.trim()).filter(Boolean)); // names, paged
    }
    const repoOf = (x) => String(x.repositoryName ?? '').split('/').pop();
    const counted = items.filter((x) => !lists.public.has(repoOf(x)));
    if (counted.length && !lists.private.size) return { why: `gh api ${api} lists no private repositories, yet ${counted.length} ${product} lines are not public` };
    const unlisted = counted.filter((x) => !lists.private.has(repoOf(x))).length;
    return { used: { value: round(counted.reduce((a, x) => a + x.grossAmount, 0), 2), source: billingSource(reader, { product, year, month, usageApi, items, counted, unlisted }) } };
  } catch (err) {
    return { why: `gh api ${api} failed (${firstLine(err)})` };
  }
}

// The first line of what a failed gh call said, cut to 160 characters.
const firstLine = (err) => String(err?.stderr || err?.message || err).trim().split('\n')[0].slice(0, 160);

// What a billing read counted, for the row's source text. A repository name is never printed: the text is published.
function billingSource(reader, { product, year, month, usageApi, items, counted, unlisted }) {
  const lost = unlisted ? `, ${unlisted} of them in no repository list (renamed or deleted, or none named)` : '';
  return `gh api ${usageApi}, repository lists from gh api orgs/${reader.github_billing}/repos: ${product} grossAmount, ${year}-${String(month).padStart(2, '0')}: ${counted.length} SKUs counted${lost}; ${items.length - counted.length} SKUs of public repositories left out (free, never drawn from the included minutes)`;
}
