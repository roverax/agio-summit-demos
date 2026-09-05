const ALLOWED_ACCOUNTS = new Map([
  ["churnWorkflow", new Set(["C-001", "C-002", "C-003", "C-004", "C-007"])],
  ["attachWorkflow", new Set(["ATT-001", "ATT-002"])],
  ["fraudWorkflow", new Set(["FRD-001", "FRD-002"])],
  ["careWorkflow", new Set(["CARE-001", "CARE-002"])],
  ["networkWorkflow", new Set(["NET-001", "NET-002"])],
  ["backOfficeWorkflow", new Set(["BO-001", "BO-002"])],
]);

export function validateDemoRun(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid proxy request");
  }

  const keys = Object.keys(input).sort();
  if (keys.length !== 2 || keys[0] !== "accountId" || keys[1] !== "workflowId") {
    throw new Error("Invalid proxy request fields");
  }

  const { workflowId, accountId } = input;
  if (typeof workflowId !== "string" || typeof accountId !== "string") {
    throw new Error("Invalid proxy request values");
  }

  if (!ALLOWED_ACCOUNTS.get(workflowId)?.has(accountId)) {
    throw new Error("Workflow and account pair not allowed");
  }

  return { workflowId, accountId };
}
