# Agentic Carrier — Architecture Walkthrough (present this)

*Everything you need to explain the design in a demo: every step, every tradeoff, the tech
stack and why. Written so you can defend each line to a technical panel.*

## The design in one sentence
**A governed agentic pipeline where a trained model *scores*, an LLM *reasons within guardrails*,
deterministic code *decides*, a human *ratifies*, and every step is sealed into a tamper-evident audit
record — shown live across two screens.** The point: production agentic AI, not a chatbot demo.

## The two big principles (say these first)
1. **The LLM never makes the decision.** It extracts and explains; a deterministic engine decides; a
   human approves. That's what makes it safe for money/adverse-action.
2. **The audit record is a first-class product, not a log.** It's the legal artifact *and* the second
   screen — the same immutable object, so they can't drift.

## The pipeline — 6 steps (what · tech · the tradeoff)
| # | Step | What happens | Tech | The tradeoff (why this way) |
|---|---|---|---|---|
| 1 | **Signal Ingestion** | Pull a small, tokenized account from the Telco-AIX churn set | HF datasets rows API (paged **sample**, not 1M); pin schema + revision SHA | Sample vs full data → demo speed; honesty preserved by pinning the exact schema/SHA into the audit |
| 2 | **Salience Scoring** | Score `P(churn)` from real features | **Reuse the Telco-AIX LightGBM churn server** (don't train) | Reuse a trained model (velocity, credibility) vs train our own (control). Honesty: the label is *static* → report **P(churn), no 30-day horizon** |
| 3 | **Next-Best-Action** | Deterministic eligibility **pre-filter** → candidate offers → **RAG scoped to that set** → **LLM ranks + explains** → **validated `offer_id`** | Mastra agent · pgvector RAG · model router | **The key decision:** LLM-picks-freely (flexible, *hallucinates offers*) vs LLM-ranks-within-a-gated-set (safe). We chose safe — a fabricated or ineligible offer is structurally rejected |
| 4 | **Human Gate** | Recommend-only; an authenticated human ratifies; **fail-closed** | Mastra workflow suspend/resume + durable store | Auto-execute (fast, indefensible) vs human-gate (slower, compliant). Timeout → "expired," never auto-approve |
| 5 | **Evidence** | A projection of steps 1–4 (no new inference) | The `RunState` object | Keeps the evidence *derived*, so it can't contradict the decision |
| 6 | **Outcome Learning** | Feeds back **only if approved** (segregation of duties) | Invariant in the RunState | Prevents the model learning from its own unreviewed outputs (feedback poisoning) |

## The 3 load-bearing decisions (ADR-001) — expect questions on these
1. **Deterministic decision (LLM out of the decision path).** *Why:* 100%-safe financial/adverse-action
   logic; the alternative — an LLM approving spend — is indefensible to a compliance reviewer. *Cost:*
   less "magic," more explicit rules. *This is the strongest thing in the design.*
2. **Audit log ≠ observability trace.** *Why:* OTel/telemetry is sampled + mutable (best-effort); a legal
   record needs **append-only + a hash chain + 100% capture**. We split them: one debug lane, one legal
   lane, linked by `run_id`. *Cost:* two stores. *Payoff:* "immutable / replayable" is *true*, not asserted.
3. **`run_id` RunState + SSE two-screen sync.** *Why:* one object is simultaneously the deterministic
   gate's input, the replayable audit record, and what the second screen subscribes to. *Cost:* design it
   up front. *Payoff:* it unblocks the deterministic decision, the audit, and the "same run" proof at once.

## Tech stack (choice · why · the alternative we rejected)
- **Mastra** (TypeScript agent framework) — native to your Next.js/Vercel/Supabase stack; bundles
  workflows + evals + OTel tracing + MCP + a model router. *Rejected:* LangGraph (Python-first; the one
  graph can be ported if a client standardizes on it). *Tradeoff:* newer/less-known vs stack-fit.
- **Model router** (Claude / OpenAI / Grok behind one interface) — no vendor lock; cheap model phrases,
  strong model ranks. *Cost:* pin model+version per run for replay.
- **pgvector on Supabase/Postgres** — the vector index sits *next to* the relational offer catalog, so we
  validate the LLM's `offer_id` with a plain SQL join. *Rejected:* a dedicated vector DB (over-engineering
  for a few-hundred-item catalog).
- **Append-only Postgres + SHA-256 hash chain** — tamper-evident audit. *Production:* object-lock/WORM
  bucket + retention + DPIA (the "hardening" talking point).
- **Next.js on Vercel** — the Agio Summit shell UI + one-command deploy.
- **SSE / WebSocket** — the two-screen same-run stream (the **aiops-nextgen** pattern, Red Hat-grade).
- **Telco-AIX** (open-experiments / Red Hat) — real churn model+server and a fraud dataset; we reuse, not reinvent.

## What's real vs the pattern (say this — it's the honest scope)
- **Real in the demo:** the deterministic gate, the offer validator, the append-only hash-chained audit
  table, real Telco-AIX data/model, the two-screen sync, the eval numbers.
- **The *pattern* (not shipped):** WORM storage, retention/legal-hold, DPIA, DR. Label the second screen
  **"AgentOps trace + audit-log *pattern*."** In the room: *"here's what production hardening adds."*

## How to narrate it (90 seconds)
"A churn signal comes in. A trained model scores the risk — I don't let an LLM guess a probability.
Deterministic rules produce the *eligible* offers; the LLM ranks and explains within that set and returns
an offer ID I validate against the real catalog, so it can't invent one. Nothing fires — a named human
approves. Every step seals into an append-only, hash-chained record; the right screen is that record,
live. It's recommend-only, human-gated, and replayable." 

## Likely panel questions → your answer
- *"Is this a real agent or a lookup?"* → "The right screen is the live Mastra trace of this run —
  ingest, RAG, model call, gate — keyed by run_id. Not a canned replay."
- *"Does the LLM decide?"* → "No. It ranks and explains within a deterministically-gated set. The engine
  decides; a human approves."
- *"Where's the audit stored, who can edit it, can you prove it wasn't changed?"* → "Append-only store,
  no update/delete grants, each record hash-chains to the last — my eval literally forges a record and the
  chain catches it."
- *"Where'd the data come from?"* → "Telco-AIX, Red Hat's open telecom AI set — a pinned, tokenized
  sample, attributed in the UI and the audit."
