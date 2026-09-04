# Agentic Carrier (Agio Summit / Telecom) — TARGET production architecture (for skill review)

*The current `web/index.html` is a deterministic visual mock. This is the production design it must
become. Under review by the Chief's skill charters before build (per skills INDEX rule).*

## Goal
A production agentic telecom demo on the fixed Agio Summit shell, shown as **two screens**:
- **Left — product (Agio Summit UI):** pick a scenario; the 6-step spine + evidence + human gate render.
- **Right — Mastra, live:** the same run's ingestion → retrieval → model/router inference → workflow
  trace → **compliance/legal audit log**. Proof it is a real agent, not a lookup.

## Data (kills the "illustrative fields" problem)
- Source: **Telco-AIX** (Telco AI eXperiments; Red Hat community) — churn + fraud datasets on
  HuggingFace (`fenar/telco-aix`). Real features, real labels.
- Ingest: load account rows; **tokenize PII** at the trust boundary; feature set = the dataset's real
  columns (not 5 invented fields). Feature importance from a trained model, shown to the user.

## The pipeline (the 6-step spine, productionized)
1. **Signal Ingestion** — real Telco-AIX features for an account (or an uploaded file), tokenized.
2. **Salience Scoring** — a **trained churn/fraud model** outputs a *calibrated probability*; salience =
   risk × account value. The score means "P(churn in 30d) = 0.72", not a rule-sum.
3. **Next-Best-Action** — a **Mastra agent**: **RAG** over the offer catalog + eligibility rules + policy
   docs (pgvector), then a **model/router inference** call (model-agnostic: Claude/OpenAI/Grok) that
   *reasons* the best action + a plain-language explanation via tool-calling. NOT a static if/else.
4. **Human Gate** — deterministic eligibility guardrail; **recommend-only**; a named human ratifies.
   No auto-offer, credit, contact, or account action.
5. **Evidence Package** — why-panel: signals, retrieved rules, model + version, confidence.
6. **Outcome Learning** — the human's decision + result feed back; the loop never self-feeds an
   unratified recommendation into training (segregation of duties).

## Runtime & platform
- **Mastra** — agents, workflows (typed control flow), built-in evals, OpenTelemetry tracing.
- **Model router** — one interface over Claude/OpenAI/Grok (no single-vendor lock).
- **RAG** — pgvector / Supabase for the offer + policy corpus.
- **Deploy** — `web/` static to Vercel; Mastra runtime deployed; Mastra Platform for hosted traces.

## Compliance / legal audit log (the 2nd-screen payload)
Every run emits an immutable record: input signals (tokenized), retrieved context, model + version,
the recommendation, the eligibility decision, the human approver + timestamp, and the outcome. This is
the legal/compliance artifact and the AgentOps trace — surfaced on the right screen.

## Governance (non-negotiable)
Recommend-only · human-in-the-loop · full audit trail · segregation of duties · no automated adverse
action. Synthetic/tokenized data only; no live carrier or customer data.

## Open questions for the review panel
1. Which Telco-AIX features actually drive churn/fraud, and how do we show importance honestly?
2. Churn model (classifier) vs the LLM's role (NBA reasoning) — clean separation, or does the LLM
   touch the decision? (Deterministic-decision principle from the PO-GL build.)
3. RAG corpus design: what's in the offer/eligibility/policy index, and how do we prevent hallucinated
   offers?
4. Audit-log schema: what fields make it legally defensible + replayable?
5. PII / tokenization boundary: where, and what leaves it?
6. Eval + red-team strategy for a probabilistic pipeline (vs the deterministic PO-GL harness).
7. The two-screen sync: how does the right screen show the *same run's* trace in real time?
