import { validateDemoRun } from "../lib/proxy-policy.js";

export function createMastraProxy({ fetchImpl = globalThis.fetch, env = process.env } = {}) {
  return async function mastraProxy(request, response) {
    response.setHeader("Cache-Control", "no-store");

    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return response.status(405).json({ error: "method_not_allowed" });
    }

    const token = env.AGIO_MASTRA_DEMO_TOKEN;
    const serverUrl = env.MASTRA_SERVER_URL;
    const allowedOrigin = env.DEMO_ALLOWED_ORIGIN;
    if (!token || !serverUrl || !allowedOrigin) {
      return response.status(503).json({ error: "proxy_unavailable" });
    }

    if (request.headers.origin !== allowedOrigin) {
      return response.status(403).json({ error: "origin_not_allowed" });
    }

    let demoRun;
    try {
      demoRun = validateDemoRun(request.body);
    } catch {
      return response.status(400).json({ error: "invalid_demo_request" });
    }

    const { workflowId, accountId } = demoRun;
    const baseUrl = serverUrl.replace(/\/$/, "");
    const headers = {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };

    try {
      const createResponse = await fetchImpl(
        `${baseUrl}/api/workflows/${workflowId}/create-run`,
        { method: "POST", headers, body: "{}", signal: AbortSignal.timeout(5_000) },
      );
      if (!createResponse.ok) {
        return response.status(502).json({ error: "upstream_unavailable" });
      }

      const created = await createResponse.json();
      if (!created || typeof created.runId !== "string" || !created.runId) {
        return response.status(502).json({ error: "upstream_unavailable" });
      }

      const runResponse = await fetchImpl(
        `${baseUrl}/api/workflows/${workflowId}/start-async?runId=${encodeURIComponent(created.runId)}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ inputData: { accountId } }),
          signal: AbortSignal.timeout(35_000),
        },
      );
      if (!runResponse.ok) {
        return response.status(502).json({ error: "upstream_unavailable" });
      }

      const result = await runResponse.json();
      return response.status(200).json(result);
    } catch {
      return response.status(502).json({ error: "upstream_unavailable" });
    }
  };
}

export default createMastraProxy();
