# RunPod

RunPod rents GPU pods and Serverless endpoints by the second, and its MCP server lets Claude Code or OpenCode manage them.

| Account | Free tier | Login or key | Claude connector | OpenCode | Guard |
| --- | --- | --- | --- | --- | --- |
| Anyone with a verified email. A pod needs a payment method and purchased credits first ([Get started](https://docs.runpod.io/get-started), read 2026-11-12) | Not published. Billing is prepaid credit, charged per second for compute and storage ([Billing](https://docs.runpod.io/accounts-billing/billing), read 2026-11-12) | MCP: OAuth "Sign in with Runpod". CLI: `runpodctl doctor` prompts for a key; else `RUNPOD_API_KEY` | `https://mcp.runpod.io/`: `claude mcp add --transport http runpod -s user https://mcp.runpod.io/`. Docs server: `https://docs.runpod.io/mcp` | Not a built-in provider. A Serverless vLLM endpoint is OpenAI-compatible at `https://api.runpod.ai/v2/<ENDPOINT_ID>/openai/v1` | Prepaid credit with auto-pay off: at zero balance RunPod stops running pods. Default spend limit $80 per hour ([Billing](https://docs.runpod.io/accounts-billing/billing), read 2026-11-12). Turning on auto-pay with a saved card removes the stop. [Git Crafter compute rules](https://github.com/SoulCraft-Org/git-crafter/blob/main/rules/compute.md) |

```mermaid
flowchart LR
  S[Sign up, MFA on] --> A[Auto-pay off,<br/>low-balance email] --> C[Add credit for one run] --> K[MCP by OAuth<br/>or a restricted key] --> R[Run on a pod] --> D[Stop and delete the pod]
```

## Set up

1. Sign up at https://console.runpod.io/signup and verify your email. Turn on multi-factor auth in account settings.
2. Leave auto-pay off. Set a low-balance email in billing instead; it works without auto-pay ([Billing](https://docs.runpod.io/accounts-billing/billing), read 2026-11-12).
3. Add credit only for the run you plan. Deploying a pod needs at least one hour of credit for its configuration ([Billing](https://docs.runpod.io/accounts-billing/billing), read 2026-11-12).
4. Connect the MCP server with OAuth. The browser flow issues a session-scoped key, and nothing goes to disk ([MCP servers](https://docs.runpod.io/get-started/mcp-servers), read 2026-11-12).

   ```bash
   claude mcp add --transport http runpod -s user https://mcp.runpod.io/
   claude mcp add runpod-docs --scope user --transport http https://docs.runpod.io/mcp
   ```

   In Claude Code, run `/mcp`, pick **runpod** and sign in. For OpenCode:

   ```bash
   opencode mcp add runpod --global --url https://mcp.runpod.io/
   opencode mcp list
   ```

5. For the CLI, open **Credentials**, the **API Keys** tab, then **Create API Key**. Pick **Restricted** and grant only what the work needs. RunPod does not store the key, so save it in your password manager at once ([API keys](https://docs.runpod.io/get-started/api-keys), read 2026-11-12).
6. Install `runpodctl` and let `doctor` read the key at its prompt. It writes `~/.runpod/config.toml` with mode 0600 ([runpodctl README](https://github.com/runpod/runpodctl), read 2026-11-12).

   ```bash
   brew install runpod/runpodctl/runpodctl
   runpodctl doctor
   ```

7. Stop and delete each pod when the run ends.

   ```bash
   runpodctl pod stop <pod_id>
   runpodctl pod delete <pod_id>
   ```

8. For ComfyUI on a pod, use the [ComfyUI Base installer](https://github.com/SoulCraft-Org/comfyui-base). Its README lists RunPod as proven on live pods.

Traps and sources: [RunPod traps and sources](detail/runpod.md).
