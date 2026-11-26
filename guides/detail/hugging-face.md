# Hugging Face: free tier, guard and set up

What the Hugging Face guide moved out of its page. Traps and sources: [Hugging Face traps and sources](hugging-face-traps.md). The diagram and wiring are in [Hugging Face](../hugging-face.md).

## Free tier

| Item | Figure | Source |
| --- | --- | --- |
| ZeroGPU signed out | 2 minutes a day | [ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12 |
| ZeroGPU Spaces on a free account | Up to 2 hosted | [ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12 |
| CPU Basic | 2 vCPU, 16 GB, free | [Spaces overview](https://huggingface.co/docs/hub/spaces-overview), read 2026-11-12 |
| Inference Providers credit | None for free users, $2.00 for PRO | [Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12 |

## Guard

| Spend | Stop | Source |
| --- | --- | --- |
| Free ZeroGPU | Stops at the daily quota | [ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12 |
| PRO past quota | Buying credits removes the stop: it bills "$1 per 10 minutes" automatically | [ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12 |
| Routed calls | Need a credit purchase first | [Pricing and Billing](https://huggingface.co/docs/inference-providers/pricing), read 2026-11-12 |

## Set up

| Step | What |
| --- | --- |
| 1. Log in | `uvx hf auth login` in the browser. `uvx` runs the latest `hf` with no install; `brew install hf` installs it ([CLI guide](https://huggingface.co/docs/huggingface_hub/guides/cli), read 2026-11-12). The login saves a token that other Hugging Face tools on the machine read |
| 2. OpenCode | Make a fine-grained token at [Access Tokens](https://huggingface.co/settings/tokens), then paste it at the hidden prompt ([OpenCode 2](../README.md#opencode-2)). Hugging Face's page shows `opencode auth login` ([HF: OpenCode](https://huggingface.co/docs/inference-providers/integrations/opencode), read 2026-11-24) |
| 3. ZeroGPU Space | Pick the Gradio SDK and ZeroGPU hardware, then decorate each GPU function with `@spaces.GPU`. The default `large` size is half an RTX Pro 6000 Blackwell, 48 GB ([ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-12) |
