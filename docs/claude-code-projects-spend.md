# Claude Code Projects spend guards

A Claude Code Project runs many cloud sessions on one flat plan. This page lists what draws on the plan and the switches that keep the bill flat.

```mermaid
flowchart LR
  P[Plan: Pro, Max or Ultra] --> T[Coordinator and threads]
  T --> L{Plan limit}
  L -->|Usage credits off| W[Threads wait, then continue at reset]
  L -->|Usage credits on| B[Billed per use: set a limit first]
  T --> U[Ultrareview]
  U -->|Runs 1 to 3| F[Free]
  U -->|Run 4 on| B
```

## What draws on the plan

| Item | Draws | Source |
| --- | --- | --- |
| Running threads | Each thread is a full session, and several run at once. The enforced limit is 500 new threads a day | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| The coordinator | Its own tokens, reading what threads report | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| A thread watching a pull request | An idle thread wakes when CI fails or a review comment arrives | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| A thread idle over an hour | The cache lasts an hour on Pro, Max and Ultra within plan limits. After that the thread re-reads its whole conversation | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| The monthly API credit | Threads never spend it. They draw on the plan's usage limits. What the credit pays for: [Claude API](../guides/claude-api.md) | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25; [Credits](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans), read 2026-11-25 |

## Guards

| Guard | Do | Source |
| --- | --- | --- |
| Usage credits | Leave them off, or set a monthly spend limit before turning them on. They bill anything past the plan limit | [Claude Code docs, costs](https://code.claude.com/docs/en/costs), read 2026-11-25 |
| Continue after a limit | Project settings, General, "Continue threads automatically when usage limits reset" is on by default. Turn it off to stop work from spilling into the next window | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| Ultrareview | Three free runs on Pro, Max and Ultra. Later runs bill as usage credits, so decline the paid prompt | [Claude Code docs, ultrareview](https://code.claude.com/docs/en/ultrareview), read 2026-11-25 |
| Model and effort | Pick a smaller model or a lower effort level for threads that do not need the largest model | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| Pull request watching | Ask the thread to stop watching once the pull request merges | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| New work | Start a fresh thread instead of reviving a large old one | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |

## Plans

The Claude pricing page lists Pro at $20 a month, or $17 a month billed yearly, Max at $100 and Ultra at $200 ([Claude pricing](https://claude.com/pricing), read 2026-11-25). It gives Max five times and Ultra ten times Pro's weekly usage, so every tier costs $20 per Pro-sized unit. The upgrade buys capacity, Fable access and API credits, not a cheaper unit. The credits and their limits are in the [Claude API guide](../guides/claude-api.md).

## Hosts

| Host | Projects | Source |
| --- | --- | --- |
| OpenCode Desktop App | ➖ Not available. Threads run with Anthropic as the model provider | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| Claude Desktop App, Code tab | ✅ Projects are in the Code tab of the desktop app and at claude.ai/code | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |
| Claude Desktop App, Cowork | ❔ Not confirmed. The page names the Code tab, the website and the mobile app | [Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25 |

Projects are a beta on Pro, Max and Ultra. They are not offered on Team or Enterprise plans yet ([Claude Code docs, Projects](https://code.claude.com/docs/en/claude-projects), read 2026-11-25).
