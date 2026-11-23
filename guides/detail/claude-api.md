# Claude API: traps and sources

What goes wrong with the Claude API, and the pages this guide read. The steps are in [Claude API](../claude-api.md).

## Traps

| Trap | What happens |
| --- | --- |
| A leftover key | `ANTHROPIC_API_KEY` sits above the federation settings, so a key left in the environment silently overrides federation ([WIF](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation), read 2026-11-23). The same holds for the action's `anthropic_api_key` and `claude_code_oauth_token` inputs ([Setup](https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md), read 2026-11-23) |
| Plan credits and Claude Code | The plan credits do not cover Claude Code. A Claude Code session on an organization that holds only these credits shows `Credit balance too low` ([API credits](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers), read 2026-11-23) |
| One organization per plan | A plan links to one Console organization and you cannot change it yourself. Link the one you build in ([API credits](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers), read 2026-11-23) |
| One shared balance | Every key and workspace in the linked organization draws from the same balance. Give a project its own workspace and set that workspace's spend limit ([API credits](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers), read 2026-11-23) |
| Bought credits | They expire one year after purchase, and the date cannot be extended ([Pay for API usage](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage), read 2026-11-23) |
| Single-use tokens | A JWT with a `jti` claim exchanges once. A retry loop that presents it again fails with `jti_reused` ([WIF](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation), read 2026-11-23) |
| Token lifetime | The WIF page gives the rule a range of 60 to 86,400 seconds, default 3,600 ([WIF](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation), read 2026-11-23). The SDK refreshes before expiry |
| Workspace ID | A rule that covers more than one workspace needs the workspace ID in each exchange. A key with no workspace scope needs the `anthropic-workspace-id` header. Without it the API returns 400 ([Authentication](https://platform.claude.com/docs/en/manage-claude/authentication), read 2026-11-23) |
| Inline comment classification | The action's `classify_inline_comments` needs `anthropic_api_key`. With federation it is skipped ([Setup](https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md), read 2026-11-23) |
| Expiry is set once | A key's expiry is fixed at creation. An expired key returns 401 and cannot be reactivated ([Authentication](https://platform.claude.com/docs/en/manage-claude/authentication), read 2026-11-23) |
| Message Batches | The credits page lists four covered products. It names Message Batches only as a way to spend less, at 50 percent off ([API credits](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers), read 2026-11-23). Check the Billing page before a large batch |

## Sources

<details>
<summary>Pages read and their dates</summary>

| Page | Read |
| --- | --- |
| [Workload identity federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation) | 2026-11-23 |
| [Authentication](https://platform.claude.com/docs/en/manage-claude/authentication) | 2026-11-23 |
| [API credits for Max, Ultra and Team plans](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers) | 2026-11-23 |
| [How do I pay for my Claude API usage](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage) | 2026-11-23 |
| [claude-code-action setup](https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md) | 2026-11-23 |
| [models.dev provider catalog](https://models.dev/api.json) | 2026-11-23 |

</details>
