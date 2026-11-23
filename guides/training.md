# Training an open model on free and subscription credits

How to fine-tune an open-weight model with LoRA, then improve it with reinforcement learning such as GRPO, without a pay-per-use bill. Every figure below is from the vendor's own page, read on 2026-11-23, unless a cell says otherwise. The plan rows are in [catalog/plans.json](../catalog/plans.json).

The rule: use a lane that stops at its limit, or a lane whose card you can keep off the account. A lane that bills past its credit is listed under [Avoid](#avoid).

## Jobs by GPU size

Memory sizes are the vendor's listed GPU memory. Which job fits which size is a rule of thumb, not a vendor figure: check your own model, context length and batch size.

| Job | GPU memory | Hardware on a lane below | Notes |
| --- | --- | --- | --- |
| Evaluation, small-model smoke tests | 24 GB | 1x L4 24 GB, $0.80 an hour on Hugging Face Jobs ([Jobs pricing](https://huggingface.co/docs/hub/jobs-pricing)) | Run the eval before and after every training run |
| LoRA on a mid-size model | 48 to 80 GB | L40S 48 GB $1.80 an hour, A100 large 80 GB $2.50 an hour on Hugging Face Jobs ([Jobs pricing](https://huggingface.co/docs/hub/jobs-pricing)). L40S, A100 80 GB and H100 per-second prices on [Modal](https://modal.com/pricing) | Use a 4-bit or 8-bit base to stay in the smaller card |
| Single-GPU RL (GRPO) | 80 GB | A100 large 80 GB, $2.50 an hour ([Jobs pricing](https://huggingface.co/docs/hub/jobs-pricing)). A100 80 GB at $0.000694 a second on [Modal](https://modal.com/pricing) | RL holds the policy, the rollouts and often a reference model at once, so give it the largest card you have |
| A 27B model | 96 GB or more | RTX PRO 6000 96 GB, $2.75 an hour ([Jobs pricing](https://huggingface.co/docs/hub/jobs-pricing)). H200 141 GB, $5.00 an hour (same page) | At these prices a monthly credit buys about an hour. Plan for one short run |

## Lanes that give GPU time for free or inside a flat plan

| Lane | How much | Commercial use | Your data trains their models | How the card stays uncharged |
| --- | --- | --- | --- | --- |
| [Hugging Face Jobs](https://huggingface.co/docs/hub/jobs-pricing) with PRO ($9 a month) | PRO lists $2 of monthly usage ([PRO](https://huggingface.co/pro), read 2026-11-23). The PRO docs say the included monthly credits can be spent on Jobs ([PRO docs](https://huggingface.co/docs/hub/pro), read 2026-11-23). That is about 2.5 hours on one L4 (derived) | Not stated on the pages read | Not stated on the pages read | Jobs need a positive credit balance, bill by the minute only while Starting or Running, and the default timeout is 30 minutes. Never add prepaid credit. Pass `--timeout` on every run |
| [Modal](https://modal.com/pricing) Starter | $30 of compute credit a month. Early-stage startups can ask for credits, and academics for up to $10k, with no amount stated for startups ([Modal pricing](https://modal.com/pricing), read 2026-11-23) | Not stated on the pages read | Not stated on the pages read | Using a GPU needs a payment method on file, and past the credit Modal bills. Set the workspace spend limit before the first run ([Budgets](https://modal.com/docs/guide/budgets), read 2026-11-23). See [Modal](modal.md) |
| Google AI Pro, for Colab | 200 Colab compute units a month, plus $10 a month of Google Cloud credit ([Google AI plans](https://one.google.com/about/google-ai-plans/), read 2026-11-23). Google publishes no per-GPU unit rate on the pages read | Not stated on the pages read | Colab's FAQ says Google uses data from its generative AI features to develop its machine learning technologies, and human reviewers may read it ([Colab FAQ](https://research.google.com/colaboratory/faq.html), read 2026-11-23). It does not say this covers your notebook data | A paid user whose units run out reverts to the free tier, so nothing bills. Never buy Pay As You Go units ([Colab FAQ](https://research.google.com/colaboratory/faq.html), read 2026-11-23). Units expire after 90 days |
| [Lightning AI](https://lightning.ai/pricing) Free | Up to 30 credits to start, about 50 GPU hours on interruptible machines. 5 at registration and 25 more for adding a card ([Lightning pricing](https://lightning.ai/pricing), read 2026-11-23). A100, H100 and H200 sessions are capped at 4 hours. Credits expire in 12 months. A phone number is required | Not stated on the page | Not stated on the page | Start without a card and skip the 25-credit card step. Additional credits are pay as you go, and the page does not say what happens at zero credits. Treat Lightning as unverified until its billing docs are readable |
| [AMD Developer Cloud](https://www.amd.com/en/developer/resources/technical-articles/2026/how-to-claim-amd-cloud-credits.html) | Free credit for AMD AI Developer Program members, requested through Member Perks and approved in 2 to 3 business days. It runs on bare-metal Instinct GPUs. Credits expire 30 days after activation ([AMD article](https://www.amd.com/en/developer/resources/technical-articles/2026/how-to-claim-amd-cloud-credits.html), read 2026-11-23). The amount is on the [AMD guide](amd.md) | Not stated on the pages read | Not stated on the pages read | With no payment method on file the VM and its data are destroyed at expiry. A card on file means billing after the credit ([AMD guide](amd.md), read 2026-11-12). Needs a ROCm build of your trainer |
| [Kaggle Notebooks](https://www.kaggle.com/docs/efficient-gpu-usage) | 30 GPU hours a week, on one P100 or two T4 GPUs (16 GB each class), 12 hours a session ([Kaggle GPU docs](https://www.kaggle.com/docs/efficient-gpu-usage), read 2026-11-02) | No. Kaggle's terms limit use to internal, personal, non-commercial use ([Kaggle terms](https://www.kaggle.com/terms), read 2026-11-02, not re-read: the page needs JavaScript) | Not stated on the pages read | No card is involved. Use it for learning and evaluation of small models only |
| [Hugging Face ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu) | 5 minutes a day on a free account, 40 minutes on PRO, on half an RTX PRO 6000 (48 GB) ([ZeroGPU docs](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-23) | Not stated on the page | Not stated on the page | A free account has no way past the quota. It is for Gradio Spaces, with 60 seconds a call by default. Use it to demo or evaluate a model, not to train one |

## Avoid

| Lane | Why |
| --- | --- |
| [Tinker](https://thinkingmachines.ai/tinker/pricing/) | Per-token billing for LoRA training, from $0.396 per million tokens for GPT-OSS-20B to $32.00 for Kimi-K3.1-Pro. The pages read name no free credit, no card rule and no data terms ([Tinker models](https://tinker-docs.thinkingmachines.ai/tinker/models/), read 2026-11-23) |
| Modal Model APIs, and Modal past its credit | Model APIs are not covered by the plan credit and bill from the first request ([Modal pricing](https://modal.com/pricing), read 2026-11-23, see [Modal](modal.md)) |
| Hugging Face prepaid credit and Colab Pay As You Go | Both turn a capped plan into a metered one. Past quota, ZeroGPU costs $1 per 10 minutes from prepaid credit ([ZeroGPU docs](https://huggingface.co/docs/hub/spaces-zerogpu), read 2026-11-23) |
| Google Cloud's free trial | $300 for 90 days, a card is required, and you cannot add GPUs to VM instances while on the trial ([Free cloud features](https://docs.cloud.google.com/free/docs/free-cloud-features), read 2026-11-23). A budget that disables billing is not a cap: "Following the steps in this example doesn't guarantee that you won't spend more than your budget", and it shuts down every resource in the project ([Disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications), read 2026-11-23) |
| Any lane with a card on file and no spend limit | Lightning, AMD and Modal each bill once a card is attached and the credit is gone. Detach the card or set the limit first |
| Kaggle for commercial work | Its terms limit use to non-commercial work |

## Order of work

1. Evaluate the base model on the 24 GB lane and keep the score.
2. Train a LoRA adapter on a 48 to 80 GB card. Save the adapter to the Hugging Face Hub at each step, since a lane can end a session without warning.
3. Run GRPO from that adapter on an 80 GB card, with short rollouts.
4. Evaluate again and compare with step 1.
5. Cancel the Job or stop the app the same day. See the Traps tables in [Modal](modal.md) and [AMD](amd.md).

## Sources

| Page | Read |
| --- | --- |
| [Hugging Face Jobs pricing](https://huggingface.co/docs/hub/jobs-pricing) | 2026-11-23 |
| [Hugging Face PRO](https://huggingface.co/pro) and [PRO docs](https://huggingface.co/docs/hub/pro) | 2026-11-23 |
| [Hugging Face ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu) | 2026-11-23 |
| [Modal pricing](https://modal.com/pricing) | 2026-11-23 |
| [Google AI plans](https://one.google.com/about/google-ai-plans/) | 2026-11-23 |
| [Colab FAQ](https://research.google.com/colaboratory/faq.html) | 2026-11-23 |
| [Lightning pricing](https://lightning.ai/pricing) | 2026-11-23 |
| [AMD cloud credits](https://www.amd.com/en/developer/resources/technical-articles/2026/how-to-claim-amd-cloud-credits.html) | 2026-11-23 |
| [Google Cloud free features](https://docs.cloud.google.com/free/docs/free-cloud-features) | 2026-11-23 |
| [Google Cloud disable billing](https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications) | 2026-11-23 |
| [Tinker pricing](https://thinkingmachines.ai/tinker/pricing/) and [models](https://tinker-docs.thinkingmachines.ai/tinker/models/) | 2026-11-23 |
| [Kaggle GPU docs](https://www.kaggle.com/docs/efficient-gpu-usage) and [terms](https://www.kaggle.com/terms) | 2026-11-02 |
