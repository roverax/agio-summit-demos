# Mastra workflow proxy

This is the public security boundary between the Field Command Center browser and its private Mastra API.

The browser submits only a pinned `workflowId` and synthetic `accountId`. The proxy validates that pair, creates the Mastra run, starts it, and adds the bearer token server-side. It does not accept arbitrary paths, URLs, run IDs, scorer requests, trace requests, or free-form model input.

## Required Vercel environment variables

| Variable | Value |
|---|---|
| `AGIO_MASTRA_DEMO_TOKEN` | Random secret shared with the Mastra server deployment |
| `MASTRA_SERVER_URL` | `https://agiosummit-agentic-carrier.server.mastra.cloud` |
| `DEMO_ALLOWED_ORIGIN` | `https://agio-summit-field-command-center.vercel.app` |

Never place `AGIO_MASTRA_DEMO_TOKEN` in HTML, browser JavaScript, a URL, Git history, screenshots, or documentation.

## Verify

```bash
cd 01-field-command-center-telecom/proxy
npm test
```

The tests cover the workflow/account allowlist, wrong methods and origins, missing configuration, token isolation, generic upstream errors, and bounded upstream calls.

## Deployment order

1. Add this proxy and the three environment variables to the existing Vercel project.
2. Update the browser to call the same-origin `/api/mastra` endpoint.
3. Deploy Vercel and verify the public workflow still runs.
4. Add the same token to the Mastra server environment.
5. Deploy the authenticated Mastra server.
6. Verify direct anonymous Mastra access returns `401` and the browser demo still succeeds.

The endpoint remains publicly callable because the demo is public. The fixed workflow/account allowlist limits what it can execute; production use should also add Vercel rate limiting or WAF controls.
