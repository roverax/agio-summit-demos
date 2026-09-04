# 01 · Field Command Center — telecom

**Live demo:** https://agio-summit-field-command-center.vercel.app/
**Video walkthrough:** https://www.loom.com/share/49de41ef90ea4711ade1a7e191b90ae7
**Built:** July 2026 · **Status:** public synthetic demo, production pattern documented

## The problem

A carrier's field, care, and back-office teams see churn, fraud, and service signals in separate systems, and any AI that acts on those signals directly is a compliance risk. The question this instance answers is: *should we save this account?* and, more broadly, how does a regulated operator put agentic AI into daily work without letting a language model make a consequential decision.

## What was built

One governed six-step spine, run for seven field use cases ranked by value density:

1. **Signal ingestion** from a pinned, tokenized sample of the open Telco-AIX churn and fraud datasets. Schema and snapshot hash recorded.
2. **Salience scoring** by a trained LightGBM model. The probability comes from a model, never from a language model's guess.
3. **Next-best action.** Deterministic eligibility rules set the candidate offer set. A frontier LLM with retrieval ranks and explains *within* that set. A validator rejects any offer not in the catalog and the candidate set. Otherwise the agent abstains.
4. **Human gate.** Recommend-only. The run suspends until a named human ratifies. Any model timeout or empty candidate set produces no recommendation, never a default action.
5. **Evidence package.** A projection of steps 1 to 4, with no new inference.
6. **Outcome learning.** Gated on an approved decision so the system cannot feed itself.

Every run is a single `run_id`-keyed state object whose audit record is a SHA-256 hash-chained, append-only projection kept separately from the debugging trace. The seven use cases: control tower, proactive churn save, attach, fraud and collections, proactive care, network operations, back office. The control tower arbitrates across the four customer-scoped domains for one customer at a time.

## Evidence and measures

- Deterministic decision: hallucinated offers are structurally impossible, because the LLM can only choose from a pre-filtered set and the validator checks the choice in SQL.
- Tamper-evident audit: `content_hash` plus `prev_hash`, schema version, dataset snapshot, model ID and version, and a three-way split of raw recommendation, eligibility result, and human action.
- Same-run proof: the product screen and the live agent trace subscribe to the same `run_id`, so the legal record and the demo cannot drift.
- Adoption strategy described in the video: start with low-risk back-office tasks to build organizational trust, then move toward customer-facing actions.

## Governance controls

Recommend-only · named human approval · fail-closed on timeout or empty set · deterministic eligibility as the guardrail · append-only hash-chained audit separate from telemetry · outcome learning gated on approval (segregation of duties) · synthetic data only, no live carrier or customer data.

## Stack

Next.js UI on Vercel · Mastra typed workflows as the agent graph · LightGBM churn model server (Python) · pgvector on Supabase for retrieval · frontier LLM via a model router (Claude, OpenAI, Grok) · append-only Postgres audit store · SSE trace stream.

## Honesty line

Real and running: the data, the deterministic gate, the offer validator, the hash-chained audit, the evaluation numbers, the LLM next-best action, the two-screen view. Designed but not built in this POC: WORM storage and retention policy, the browser-use agent, and a prompt-optimization pass. The second screen is labeled an agent-ops trace and audit-log *pattern*, not a shipped legal artifact.

## Documents

| File | What it is |
|------|------------|
| [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | What calls what, component by component |
| [docs/ADR-001-runstate-audit.md](docs/ADR-001-runstate-audit.md) | The decision that made the run deterministic and the audit append-only |
| [docs/ARCHITECTURE_WALKTHROUGH.md](docs/ARCHITECTURE_WALKTHROUGH.md) | Step-by-step explanation with tradeoffs |
| [docs/ARCHITECTURE_TARGET.md](docs/ARCHITECTURE_TARGET.md) | Target production architecture |
| [docs/ARCHITECTURE_REVIEW.md](docs/ARCHITECTURE_REVIEW.md) | The six-charter architecture review that produced ADR-001 |
| [docs/AGIO_SUMMIT_SHELL_DOCTRINE.md](docs/AGIO_SUMMIT_SHELL_DOCTRINE.md) | The reuse rule: one fixed shell, one implementation skin per industry |
