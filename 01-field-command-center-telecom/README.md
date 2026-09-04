# Field Command Center

Telecom deployment of Agio Summit. Proactive, human-gated next-best-action across field, care, and back office.

**Demo:** https://agio-summit-field-command-center.vercel.app/
**Video:** https://www.loom.com/share/49de41ef90ea4711ade1a7e191b90ae7

## Overview

A carrier sees churn, fraud, and service signals in separate systems. Any AI that acts on those signals directly is a compliance risk. This deployment shows how a regulated operator can put agentic AI into daily work while a trained model owns the score, deterministic rules own the decision, and a human owns the approval.

Seven use cases run on one spine, ranked by value density: control tower, proactive churn save, attach, fraud and collections, proactive care, network operations, back office. The control tower arbitrates across the four customer-scoped domains for one customer at a time.

## How it works

Each run is a single `run_id`-keyed state object that moves through six steps:

1. **Signal ingestion.** A tokenized row from a pinned sample of the open Telco-AIX churn and fraud datasets. Schema and snapshot hash are recorded.
2. **Salience scoring.** A trained LightGBM model returns the churn probability.
3. **Next-best action.** Deterministic eligibility rules produce the candidate offer set. A language model with retrieval ranks and explains within that set. A validator checks the chosen offer against the catalog and the candidate set in SQL and rejects anything else.
4. **Human gate.** The run suspends until a named human ratifies. A model timeout or an empty candidate set produces no recommendation.
5. **Evidence package.** A projection of steps 1 to 4 with no new inference.
6. **Outcome learning.** Gated on an approved decision, so the system cannot feed itself.

The audit record is a SHA-256 hash-chained projection of the run state, written append-only to its own store, separate from the debugging trace. The product screen and the live agent trace subscribe to the same `run_id`.

## Guardrails

- Recommend-only; nothing fires without a named human approval.
- Hallucinated offers are structurally impossible: the model chooses from a pre-filtered set and the validator checks the choice.
- Fail closed on timeout or empty set.
- Audit record carries `content_hash`, `prev_hash`, schema version, dataset snapshot, model ID and version, and a three-way split of raw recommendation, eligibility result, and human action.
- Synthetic and open data only.

## Stack

Next.js on Vercel · Mastra typed workflows · LightGBM model server (Python) · pgvector on Supabase · model router over Claude, OpenAI, and Grok · append-only Postgres audit store · SSE trace stream.

## Limitations

Built and running: the data pipeline, the deterministic gate, the offer validator, the hash-chained audit, the evaluation harness, the LLM next-best-action step, and the two-screen view. Designed but not built: WORM storage and retention policy, a browser-use agent for portal navigation, and a prompt-optimization pass. The trace screen is a pattern demonstration, not a certified legal artifact.

## Documents

| File | Contents |
|------|----------|
| [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | Components, call graph, what is real versus pattern |
| [ADR-001-runstate-audit.md](docs/ADR-001-runstate-audit.md) | Deterministic decision, append-only audit, same-run sync |
| [ARCHITECTURE_TARGET.md](docs/ARCHITECTURE_TARGET.md) | Target production architecture |
| [AGIO_SUMMIT_SHELL_DOCTRINE.md](docs/AGIO_SUMMIT_SHELL_DOCTRINE.md) | Shell reuse rule: fixed brand and layout, per-industry skin |
