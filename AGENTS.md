# Compute Crafter

Instructions for every coding agent in this repo. OpenCode reads this file, and Claude Code reads it through `CLAUDE.md` ([OpenCode rules](https://opencode.ai/docs/rules), [Claude Code memory](https://code.claude.com/docs/en/memory), read 2026-11-11).

| Topic | Rule |
| --- | --- |
| What this repo is | Provider guides and a public free-tier and plan catalog for wiring open-source and open-weight compute to Claude Code and OpenCode |
| Build and test | `python3 -I tools/catalog.py --self-test`, `python3 -I tools/catalog.py --check`, and `tools/voice_lint.py` on changed Markdown. CI runs them through Git Crafter's `ci-standard.yml` |
| Credits pack tests | `node --test tests/*.test.mjs`, and one collector test at a time: `GIT_CRAFTER=<engine checkout> node --import ./tests/engine-lib.mjs --test collectors/credits/credits.test.mjs`. CI runs `bash tests/engine-tests.sh` (fidelity, then every pack test beside the pinned engine) |
| Moved files | A change to a file in `tests/moved.json` lists it under `edited`. Build output (`quality/data/`, `quality/dist/`) is never committed |
| Shipping | Branch, commit with `git commit -s`, push the branch and open a pull request. Never push to `main` |
| Secrets | Never print, copy or commit a key value. Use each CLI's own login. Commands name env vars, never values |
| Figures | Every free-tier figure cites the vendor's own page and the date it was read. A third-party page never verifies a figure |
| Writing | One idea per sentence, no em dashes. Attribute every figure in its sentence |
| Catalog | Edit `catalog/plans.json` by hand or with `tools/catalog.py merge`; keep only `PUBLIC_FIELDS`; run `--format` then `--check` |
