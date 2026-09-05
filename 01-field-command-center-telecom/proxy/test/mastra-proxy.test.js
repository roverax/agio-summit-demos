import assert from "node:assert/strict";
import test from "node:test";

let proxyModule;
let loadError;

try {
  proxyModule = await import("../api/mastra.js");
} catch (error) {
  loadError = error;
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("the proxy runs an allowlisted workflow without exposing its Mastra token", async () => {
  assert.ifError(loadError);

  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    const body = calls.length === 1
      ? { runId: "run-created-by-mastra" }
      : { status: "success", steps: { ingest: { output: { account: { id: "C-001" } } } } };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const handler = proxyModule.createMastraProxy({
    fetchImpl,
    env: {
      AGIO_MASTRA_DEMO_TOKEN: "server-only-token",
      MASTRA_SERVER_URL: "https://mastra.example",
      DEMO_ALLOWED_ORIGIN: "https://demo.example",
    },
  });
  const request = {
    method: "POST",
    headers: { origin: "https://demo.example" },
    body: { workflowId: "churnWorkflow", accountId: "C-001" },
  };
  const response = createResponse();

  await handler(request, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    status: "success",
    steps: { ingest: { output: { account: { id: "C-001" } } } },
  });
  assert.equal(response.headers["cache-control"], "no-store");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://mastra.example/api/workflows/churnWorkflow/create-run");
  assert.equal(calls[0].options.headers.authorization, "Bearer server-only-token");
  assert.equal(calls[0].options.signal instanceof AbortSignal, true);
  assert.equal(calls[1].url, "https://mastra.example/api/workflows/churnWorkflow/start-async?runId=run-created-by-mastra");
  assert.deepEqual(JSON.parse(calls[1].options.body), { inputData: { accountId: "C-001" } });
  assert.equal(calls[1].options.signal instanceof AbortSignal, true);
  assert.equal(JSON.stringify(response.body).includes("server-only-token"), false);
});

test("the proxy rejects unsafe or incomplete requests before contacting Mastra", async () => {
  const baseEnvironment = {
    AGIO_MASTRA_DEMO_TOKEN: "server-only-token",
    MASTRA_SERVER_URL: "https://mastra.example",
    DEMO_ALLOWED_ORIGIN: "https://demo.example",
  };
  const cases = [
    {
      name: "wrong method",
      request: {
        method: "GET",
        headers: { origin: "https://demo.example" },
        body: { workflowId: "churnWorkflow", accountId: "C-001" },
      },
      environment: baseEnvironment,
      status: 405,
    },
    {
      name: "wrong origin",
      request: {
        method: "POST",
        headers: { origin: "https://attacker.example" },
        body: { workflowId: "churnWorkflow", accountId: "C-001" },
      },
      environment: baseEnvironment,
      status: 403,
    },
    {
      name: "unapproved workflow",
      request: {
        method: "POST",
        headers: { origin: "https://demo.example" },
        body: { workflowId: "../../scores", accountId: "C-001" },
      },
      environment: baseEnvironment,
      status: 400,
    },
    {
      name: "missing secret",
      request: {
        method: "POST",
        headers: { origin: "https://demo.example" },
        body: { workflowId: "churnWorkflow", accountId: "C-001" },
      },
      environment: {
        MASTRA_SERVER_URL: "https://mastra.example",
        DEMO_ALLOWED_ORIGIN: "https://demo.example",
      },
      status: 503,
    },
  ];

  for (const testCase of cases) {
    let upstreamCalls = 0;
    const handler = proxyModule.createMastraProxy({
      fetchImpl: async () => {
        upstreamCalls += 1;
        return new Response("{}", { status: 200 });
      },
      env: testCase.environment,
    });
    const response = createResponse();

    await handler(testCase.request, response);

    assert.equal(response.statusCode, testCase.status, testCase.name);
    assert.equal(upstreamCalls, 0, `${testCase.name} must not reach Mastra`);
  }
});

test("the proxy returns a generic error when Mastra cannot create a run", async () => {
  let upstreamCalls = 0;
  const handler = proxyModule.createMastraProxy({
    fetchImpl: async () => {
      upstreamCalls += 1;
      return new Response(JSON.stringify({ internal: "upstream diagnostic details" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    },
    env: {
      AGIO_MASTRA_DEMO_TOKEN: "server-only-token",
      MASTRA_SERVER_URL: "https://mastra.example",
      DEMO_ALLOWED_ORIGIN: "https://demo.example",
    },
  });
  const response = createResponse();

  await handler({
    method: "POST",
    headers: { origin: "https://demo.example" },
    body: { workflowId: "churnWorkflow", accountId: "C-001" },
  }, response);

  assert.equal(response.statusCode, 502);
  assert.deepEqual(response.body, { error: "upstream_unavailable" });
  assert.equal(upstreamCalls, 1);
  assert.equal(JSON.stringify(response.body).includes("diagnostic"), false);
  assert.equal(JSON.stringify(response.body).includes("server-only-token"), false);
});
