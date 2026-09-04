# ADR-001 — The RunState object: deterministic decision + append-only audit + same-run sync

**Status:** accepted (from the 6-charter architecture review). **Date:** 2026-07-19.

## Context
The mock demo was a static lookup. The review (senior-architect, agent-designer, agent-workflow-designer,
rag-architect, senior-data-engineer, observability-designer) converged on ONE root object that unblocks
the four things the "real agent, not a lookup" claim depends on: the deterministic decision, hallucinated
offers, the replayable legal audit, and the two-screen same-run proof.

## Decision
Every run is a single **`run_id`-keyed `RunState`** with **typed per-stage contracts**:

1. **Signal Ingestion** → tokenized account features from a **pinned Telco-AIX sample** (schema + snapshot SHA recorded).
2. **Salience Scoring** → a **trained model** (the Telco-AIX churn LightGBM server in prod; a documented
   stand-in offline) emits a score. Reported as **P(churn)** — *no fabricated time horizon* (the label is static).
3. **Next-Best-Action** → **deterministic eligibility PRE-FILTER** produces the candidate offer set →
   the LLM only **ranks + explains within it** and returns a **validated `offer_id`** that must exist in
   the catalog (reject on miss). The LLM never authors an offer, its terms, or the decision.
4. **Human Gate** → recommend-only; a named, authenticated human ratifies. Fail-closed: any model/RAG
   timeout or empty candidate set → **no recommendation**, never a default action.
5. **Evidence** → a projection of 1–4 (no new inference).
6. **Outcome Learning** → gated on `decision == approved` (segregation of duties; no self-feed).

The **audit record is a hash-chained projection** of the RunState (`content_hash` + `prev_hash`,
`schema_version`, `dataset_snapshot`, `model_id`+`version`, `transform_version`, three-way decision split
[`raw_recommendation` / `eligibility_result` / `human_action`], `approver`, `retention_class`), written
**append-only** to its **own store** — separate from the OTel/Mastra debug trace. The `run_id` is the key
both screens subscribe to (SSE/WebSocket, per the aiops-nextgen event-streaming pattern).

## Consequences
- The decision is genuinely deterministic; hallucinated offers are structurally impossible.
- The audit record is tamper-evident and replayable (replay the record always works; re-execute is
  best-effort against the pinned model+version).
- The same object is the legal artifact AND the screen-2 payload — they cannot drift.
- **Demo honesty:** screen 2 is labeled "AgentOps trace + audit-log **pattern**," not "shipped legal
  artifact." WORM/retention/DPIA is the "production hardening" talking point.

## Resolves (from the review)
Deterministic offer selection · audit≠OTel split · typed contracts · run_id sync · fail-closed ·
data-honesty (no 30-day, PR/reliability metrics) · replayability · PII-in-logs scoping.
