# Billing hard limit — NON-NEGOTIABLE

## Code (enforced)

| Control | Value |
|---------|-------|
| Hard limit per run | **`$200`** (`BUDGET_HARD_LIMIT_USD`) |
| Warn | `$150` (`BUDGET_WARN_USD`) |
| Behavior | **Fail-closed** — `BudgetExceededError` thrown *before* the paid call |
| Entry point | `authorizePaidCall()` / `CostMeter` with `BudgetGuard` / `recordVendor()` |

```ts
const { budget, meter } = newMeteredRun();
// every LLM/vendor estimate goes through meter → budget.authorize()
// runaway loop → throws at the call that would exceed $200
```

Must-go-red proof:

```bash
npm run test -w @agio/core
# includes budget.test.ts — simulates 1000 × $5 calls → stops at 40 ($200)
```

## Provider dashboards (defense in depth — set these too)

Even with code limits, set **account-level** caps/alerts:

| Provider | Where |
|----------|--------|
| Anthropic | Console → billing spend limits / alerts |
| OpenAI | Settings → Limits → monthly budget |
| xAI | Console budget alerts |
| Deepgram | Billing usage alerts |
| Cartesia | Billing alerts |
| Daily | Dashboard → Billing notifications |
| Modal | Workspace **spending limits** (hard cap) |
| Langfuse | Plan limits |

Registry in code: `packages/core/src/cost/providers.ts`

## Rule for contributors

**No raw `fetch` to a billed API outside `authorizePaidCall` / `CostMeter.recordVendor`.**  
PR review rejects unmetered provider calls.
