# System Architecture — Agio Summit / Agentic Carrier (what calls what)

*Real business problem (telecom churn/fraud) → a production agentic-AI POC that shows **agentic AI +
RAG + LLM** on **real Telco-AIX data with frontier models**, governed and auditable. *

## Design stance
**We use their data AND frontier models — each where it earns its keep.**
- **Data:** real **Telco-AIX** (Red Hat) churn + fraud sets — tokenized, pinned.
- **Frontier LLM (Claude/GPT/Grok via a router):** the **agentic reasoning + RAG synthesis + explanation.**
- **A trained model (LightGBM):** the **risk score** — because a language model should not *guess a
  probability.*
- **Deterministic code + a human:** the **decision** and the **approval.**
That combination *is* "agentic AI, RAG, LLM" done for production — not a chatbot.

## The flow — what calls what
```
[Browser · Agio Summit UI (Next.js)]
    │  POST /run { accountId }
    ▼
[Mastra runtime · churnWorkflow]  ── the agentic orchestrator (the "graph") ──
    │
    ├─1 Ingest ........ read a tokenized row from the PINNED Telco-AIX sample (schema+SHA recorded)
    │
    ├─2 Salience ...... POST features → [Churn model server · LightGBM (Python)] → P(churn)   ← their model, their data
    │
    ├─2b Eligibility .. DETERMINISTIC rules → candidate offer set   (the guardrail)
    │
    ├─3 NBA (agentic) .
    │      ├─ RAG tool → [pgvector on Supabase] similarity over offers + eligibility rules + policy → context
    │      ├─ [Frontier LLM via model router] ranks + explains WITHIN the candidate set → { offer_id, explanation }
    │      └─ Validator → offer_id must exist in catalog AND in candidate set (SQL) → else ABSTAIN
    │
    ├─4 Human Gate .... recommend-only; suspend → a named human ratifies (resume) → nothing auto-fires
    │
    ├─5 Evidence ...... projection of steps 1–4 (no new inference)
    │
    └─6 Seal Audit .... append-only, SHA-256 hash-chained record → [Audit store (own, append-only)]
    │
    ▼  returns RunState + sealed audit
[Browser UI · left screen] renders the 6 steps + the audit record
[Trace stream (SSE) / Mastra Studio · right screen] subscribes by run_id → the LIVE agent trace
```

## Components (what each is · what it calls · the tech)
| # | Component | What it does | Calls | Tech |
|---|---|---|---|---|
| 1 | **UI (product)** | The Agio Summit command center; left screen | the Mastra workflow | Next.js / static HTML, Vercel |
| 2 | **Mastra runtime** | Orchestrates the 6-step workflow (the agent graph) | steps 1–6 | Mastra (TS), typed workflows |
| 3 | **Churn model server** | Scores P(churn) from real features | — | **Telco-AIX LightGBM**, Python/Flask |
| 4 | **RAG** | Retrieves offers + eligibility rules + policy | the vector store | **pgvector / Supabase** |
| 5 | **Frontier LLM** | Ranks + explains within the gated set | via the router | **Claude / OpenAI / Grok** |
| 6 | **Guardrails** | Eligibility pre-filter, offer validation, the decision | — | deterministic TypeScript |
| 7 | **Audit store** | The tamper-evident legal record | — | append-only Postgres + SHA-256 chain |
| 8 | **Trace stream** | The live agent trace = right screen | subscribes to run_id | SSE / Mastra Studio (OTel) |
| 9 | **Data** | The substrate | — | **Telco-AIX** (Red Hat), pinned sample, synthetic |

**Known gaps:** Playwright/browser-use and an explicit DSPy pass and a formal knowledge-graph
store are **designed, not built** in this POC. Everything else is real and running.

## Real in the POC vs the production pattern
- **Real:** Telco-AIX data, the deterministic gate, the offer validator, the SHA-256 tamper-evident
  audit, the eval numbers, the frontier-LLM NBA, the two-screen.
- **Pattern (not shipped):** WORM storage, retention/DPIA, the browser-use agent, DSPy tuning — the
  production-hardening roadmap.
