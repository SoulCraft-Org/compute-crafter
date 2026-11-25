# Compute Crafter

Instructions for every coding agent in this repo. OpenCode reads this file, and Claude Code reads it through `CLAUDE.md` ([OpenCode rules](https://opencode.ai/docs/rules), [Claude Code memory](https://code.claude.com/docs/en/memory), read 2026-11-11).

| Topic | Rule |
| --- | --- |
| What this repo is | Provider guides and a public free-tier and plan catalog for wiring open-source and open-weight compute to Claude Code and OpenCode |
| Build and test | `node --test tests/catalog-pin.test.mjs` (the pin and the sha256 of the catalog copy), and `tools/voice_lint.py` on changed Markdown. CI runs them through Git Crafter's `ci-standard.yml` |
| Private terms | `tools/voice_rules.json` holds generic shapes only. The private names live in the org secret `PRIVATE_TERMS`, which `.github/workflows/private-terms.yml` reads. Never write them in this repo |
| Credits pack tests | `node --test tests/*.test.mjs`, and one collector test at a time: `GIT_CRAFTER=<engine checkout> node --import ./tests/engine-lib.mjs --test collectors/credits/credits.test.mjs`. CI runs `bash tests/engine-tests.sh` (fidelity, then every pack test beside the pinned engine) |
| Moved files | A change to a file in `tests/moved.json` lists it under `edited`. Build output (`quality/data/`, `quality/dist/`) is never committed |
| Shipping | Branch, commit with `git commit -s`, push the branch and open a pull request. Never push to `main` |
| Secrets | Never print, copy or commit a key value. Use each CLI's own login. Commands name env vars, never values |
| Figures | Every free-tier figure cites the vendor's own page and the date it was read. A third-party page never verifies a figure |
| Writing | One idea per sentence, no em dashes. Attribute every figure in its sentence |
| Logins catalog | Edit `catalog/logins.json` by hand. Keys and values follow `FIELDS` in `tests/logins.test.mjs`; run `node --test tests/logins.test.mjs`. Vendor facts only: never an account, an email or progress |
| Catalog | The plan catalog belongs to Colorado-Compute/compute-credits. This repo reads it and pins it, and never edits it by hand: no row, no pull request, no issue there. `catalog/plans.json` is a checked copy of that repo at the commit and sha256 in `catalog/PIN`. Move the pin with `bash catalog/sync.sh --update <sha>` (a full commit SHA), then run `node --test tests/catalog-pin.test.mjs` |
