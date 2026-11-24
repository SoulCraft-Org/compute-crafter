# AMD: guard and set up

What the AMD guide moved out of its page. Traps and sources: [AMD traps and sources](amd-traps.md). The diagram and wiring are in [AMD](../amd.md).

## Guard

| Spend | Stop | Source |
| --- | --- | --- |
| Expiry with no card | The GPU VM is destroyed, and you lose the GPUs and their data | [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24 |
| Credit used up | Access to the GPU, its data and the Developer Cloud ends | [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24 |
| Card on file | AMD says it "will automatically charge" the card once credit is exhausted. That removes the stop | [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24 |
| Rate | A 1x MI300X costs $2.59 an hour, so $100 covers about 38 hours | [DigitalOcean AMD pricing](https://docs.digitalocean.com/products/amd/details/pricing/), read 2026-11-24 |

## Set up

1. Check your GPU and OS in the [ROCm compatibility matrix](https://rocm.docs.amd.com/en/latest/compatibility/compatibility-matrix.html). Its ROCm 10.2.0 page lists Linux and Windows, and no macOS (read 2026-11-24).
2. Install ROCm from the [install page](https://rocm.docs.amd.com/en/latest/install/rocm.html).
3. For cloud time, join the [AMD AI Developer Program](https://www.amd.com/en/developer/ai-dev-program.html) and apply with your use case.
4. Approved credit lands within 3 business days. Opening the emailed link activates it, and the 30-day clock starts at deposit ([AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html), read 2026-11-24). Hold the link until the job is ready.
5. Create one MI300X GPU droplet, run the job and copy results off the VM.
6. Destroy the droplet in the console when the job ends.
