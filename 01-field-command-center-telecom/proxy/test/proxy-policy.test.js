import assert from "node:assert/strict";
import test from "node:test";

let policy;
let loadError;

try {
  policy = await import("../lib/proxy-policy.js");
} catch (error) {
  loadError = error;
}

test("the proxy accepts only the demo's pinned workflow and account pairs", () => {
  assert.ifError(loadError);

  const allowed = [
    ["churnWorkflow", "C-001"],
    ["churnWorkflow", "C-007"],
    ["attachWorkflow", "ATT-002"],
    ["fraudWorkflow", "FRD-002"],
    ["careWorkflow", "CARE-002"],
    ["networkWorkflow", "NET-002"],
    ["backOfficeWorkflow", "BO-002"],
  ];

  for (const [workflowId, accountId] of allowed) {
    assert.deepEqual(policy.validateDemoRun({ workflowId, accountId }), {
      workflowId,
      accountId,
    });
  }

  const blocked = [
    { workflowId: "offer-grounding", accountId: "C-001" },
    { workflowId: "churnWorkflow", accountId: "ATT-001" },
    { workflowId: "churnWorkflow", accountId: "C-999" },
    { workflowId: "../../scores", accountId: "C-001" },
    { workflowId: "churnWorkflow", accountId: "C-001", path: "/api/scores" },
    { workflowId: "churnWorkflow" },
    null,
  ];

  for (const input of blocked) {
    assert.throws(() => policy.validateDemoRun(input), /not allowed|invalid/i);
  }
});
