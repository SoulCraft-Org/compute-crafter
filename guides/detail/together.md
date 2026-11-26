# Together AI: guard and set up

What the Together AI guide moved out of its page. The diagram and wiring are in [Together AI](../together.md).

## Guard

| Item | Figure | Source |
| --- | --- | --- |
| First purchase | At least $15; later ones at least $5 | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Expiry | Prepaid credits have no expiration date | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Zero balance | "API access is suspended until you add credits" | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24 |
| Auto-recharge | Needs a card as the default payment method. It "does not cap spend" | [Billing and credits](https://docs.together.ai/docs/billing-credits), read 2026-11-24; [Spend controls](https://docs.together.ai/docs/billing-spend-controls), read 2026-11-12 |

## Set up

| Step | What |
| --- | --- |
| 1. Sign in | At [api.together.ai](https://api.together.ai/signin). Pick the provider you will keep |
| 2. Balance | Buy the smallest balance you need, with auto-recharge off. A purchase is spend: clear it under your own money rule first |
| 3. Key | Create it in Together's settings and keep it in a password manager |
| 4. OpenCode | Paste the key at the hidden prompt ([OpenCode 2](../README.md#opencode-2)). Other tools use base URL `https://api.together.ai/v1` ([OpenAI compatibility](https://docs.together.ai/docs/openai-api-compatibility), read 2026-11-12) |

Traps and sources: [Together AI traps and sources](together-traps.md).
