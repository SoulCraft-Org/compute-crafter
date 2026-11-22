# Contributing

| Change | How |
| --- | --- |
| A figure moved | Read the vendor's own page. Update the row in `catalog/plans.json` or the guide, with the page and today's date. Set `verified` to `true` only when you read every figure in the row there |
| A new provider | Copy the table shape of any file in [guides/](guides/), and add a row to [guides/README.md](guides/README.md). The Guard column names the vendor's own stop at the free limit, and what removes it |
| A new plan | Add a row with every key in `PUBLIC_FIELDS` ([catalog/README.md](catalog/README.md)), then run `python3 -I tools/catalog.py --format` |
| A sign-in fact moved | Read the vendor's own page. Update its row in `catalog/logins.json` with the page and today's date, keys in the order of `FIELDS` in `tests/logins.test.mjs`. Never add an account, an email or a screenshot |
| Every commit | Sign off with `git commit -s` ([DCO](https://developercertificate.org/)) |
| Every pull request | `ci / ci-ok` must pass. It runs the catalog self-test, the catalog check and the voice lint |
