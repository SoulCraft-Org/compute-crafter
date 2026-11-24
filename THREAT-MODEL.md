# Threat model

| Read | Covers |
|---|---|
| 2026-11-24 | Every asset below, against `main`; [Microsoft SDL](https://www.microsoft.com/en-us/securityengineering/sdl/practices) practice 3 |
| Each PR | Adds a row for a new asset, secret, write scope or hook |

```mermaid
flowchart LR
  C[Contributor or fork] -->|PR| W[Workflows] --> P[Pages]
  W -->|OIDC, no key| A[Claude cost API]
  W -->|read token| G[GitHub API]
  K[Credits collectors] --> W
  D[Catalog and sign-in facts] --> W
  P -->|public| V[Reader]
```

## Assets

| Asset | Why it matters |
|---|---|
| Catalog data | `catalog/plans.json` is public; a private field would leak |
| Sign-in facts | `catalog/logins.json` holds vendor facts, never an account |
| Credits collectors | They read spend figures and could print a credential |
| Claude cost read | A federated bearer token reads organization cost |
| Pages | The one public surface, rebuilt on each merge |

## Threats

| Asset | Threat | Control | Gap |
|---|---|---|---|
| Catalog data | Private name or field ships | `tests/privacy.mjs`, `private-terms.yml`, a field allowlist | The private-terms list is a secret only CI sees |
| Sign-in facts | An account or email is committed | `FIELDS` check in `tests/logins.test.mjs` | None known |
| Credits collectors | Key lands in a log or page | Redaction tests; keys named by variable, never value | No gitleaks gate here; the org's covers other repo kinds. A new collector may skip redaction |
| Claude cost read | Token theft or reuse | Workload identity federation: no stored key, a short-lived token. The Console rule pins the workflow file | A merged workflow edit can widen the claim |
| Pages | Raw reading reaches the page | Privacy gate on the run file and the build folder | A collector bug |
| Workflows | Fork code gets secrets | Read-only default token; write on one job; no `pull_request_target` | `catalog-reread.yml` holds `contents: write` |
| Workflows | Action tag moves | Full-SHA pins in `actions.lock`; 14-day cooldown | `ossf/scorecard-action` pulls its image by tag |
| `main` | Unreviewed change lands | PR rulesets, `ci / ci-ok`, DCO sign-off | One human |

Report findings: [SECURITY.md](SECURITY.md).
