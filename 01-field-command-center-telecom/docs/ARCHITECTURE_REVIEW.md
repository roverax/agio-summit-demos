# Architecture Review + ADR-001 — Agentic Carrier (Agio Summit / Telecom)

*Six of the Chief's skill charters reviewed `ARCHITECTURE_TARGET.md` before build (per skills INDEX
rule). Skills used: **senior-architect, agent-designer, agent-workflow-designer, rag-architect,
senior-data-engineer, observability-designer.** This is the synthesis + the load-bearing decision.*

## Verdict (unanimous)
**Strong governance frame; NOT build-ready as written.** Every lens rated it *needs-work / conditional
pass* — not a redesign. The bones (recommend-only, human-in-the-loop, segregation of duties, a trained
model on the score, LLM confined to reasoning, audit-as-first-class) are correct and well ahead of a
typical demo. But **the four things the "real agent, not a lookup" claim depends on were asserted in
prose, not designed** — and one was an honesty defect I introduced.

## The ONE root object (ADR-001) — everything hangs off this
Five reviewers independently converged on a single coupled decision:

> **A `run_id`-keyed, append-only `RunState` with typed per-stage handoff contracts, where the NBA
> stage returns a validated `offer_id` from a deterministically pre-filtered candidate set — and the
> audit record is a hash-chained projection of that object, separate from the OTel trace, that both
> screens subscribe to by `run_id`.**

That one object simultaneously fixes: (1) the deterministic-decision guarantee, (2) hallucinated
offers, (3) the replayable legal audit record, and (4) the two-screen same-run proof. Write it as
ADR-001 before a line of runtime code.

## Must-fix-before-build (ranked; lenses that flagged it)
1. **Deterministic offer selection.** The LLM must NEVER emit an offer or its terms as free text.
   Deterministic eligibility **pre-filters** the candidate set → RAG is scoped to that set → LLM only
   **ranks + explains** within it → returns a `offer_id` validated against the live catalog (reject on
   miss) → the human sees terms **rendered from the DB row, not LLM prose.** The 3→4 handoff is a
   *structured enumerated* proposal, never prose. *(agent-designer, workflow, rag, senior-architect)*
2. **Split the audit log from the OTel trace.** OTel is best-effort, sampled, mutable — a legal record
   needs **append-only + hash-chain (content_hash + prev_hash) + 100% sampling + transactional outbox
   → its own store + sealed lifecycle + schema_version.** Share `run_id`; neither depends on the other.
   *(observability, senior-architect, senior-data-engineer)*
3. **Typed per-stage contracts + the `run_id` RunState.** No edge is defined today; Mastra steps are
   zod-typed I/O, so a prose-only workflow isn't buildable. Define each stage's input/output; the audit
   record is a projection. *(workflow, senior-architect, agent-designer)*
4. **Two-screen sync via subscription, not polling.** Mint `run_id` at ingest; right screen subscribes
   (SSE) to a `run_events` stream filtered by `run_id`; explicit states: `provisional` → (human gate)
   `suspended:awaiting_approver` → `sealed`. Never render the compliance screen from sampled trace.
   *(all four workflow-adjacent lenses)*
5. **Human-gate suspend/resume, fully specified.** Durable state store (reconciled with the audit DB);
   resume payload (approver authz, ts, decision, reason); **expiry TTL → auto-terminate as
   "expired-no-decision," never auto-approve**; reject branch (loop to next-best, capped N, then
   terminate); single-approver lock. *(workflow)*
6. **Fail-closed / abstain as a first-class outcome.** Model/router/RAG timeout or empty retrieval →
   "no recommendation" / "no eligible offer," NEVER a default action. *(senior-architect, agent-designer,
   workflow, rag)*
7. **Data: two grains, real schema, no skew.** Churn (customer-row, static, ~26% pos, AUC) ≠ Fraud
   (event-row, <1% pos, PR-AUC + threshold) = **two pipelines.** Pull + **pin the actual
   `fenar/telco-aix` schema to a revision SHA FIRST**; one **shared versioned feature-transform module**
   for train+serve; schema-validation gate on the upload path. *(senior-data-engineer)*
8. **Eval + red-team (the design ships ZERO).** Skill rule: every design ends with an eval run. Need:
   retrieval **recall@k** (the safety metric) + **faithfulness** score; churn **reliability curve +
   Brier**; fraud **PR-AUC + threshold**; an **offer-integrity red-team** (fabricated-but-plausible
   offer must be rejected); adapt the deterministic PO-GL harness. *(rag, senior-data-engineer)*
9. **PII-in-logs.** Tokenizing input columns does NOT sanitize the LLM's verbatim explanation or a
   re-identifiable feature vector. Add an output PII scrub; store `doc_ids`+hashes not raw text; RBAC +
   access-logging on the audit store. *(observability, senior-data-engineer)*
10. **Model-router vs reproducibility.** Pin model+version per run; separate "replay the record" (always
    works) from "re-execute the decision" (best-effort, may be a retired version); per-model eval, not
    one number. *(senior-architect, rag)*

## Honesty corrections (the panel caught defects — including mine)
- **"Calibrated P(churn in 30d) = 0.72" is fabricated temporal semantics.** The canonical label is a
  static yes/no flag; there is no 30-day event-time. And "calibrated" is a *measured* property, not a
  raw sigmoid. **Fix:** print "P(churn)" with no horizon (unless the real data carries timestamps);
  show a reliability curve/Brier; use **SHAP local** values for per-account importance, not global.
- **The design shipped no eval numbers** — by the skills' own rule, it isn't done.
- **Tokenization may be "governance theater"** if the Telco-AIX IDs are surrogate keys, not real PII —
  scope it honestly rather than dramatize it.

## The honest demo scoping (for the 12-hour build)
Two of the ten (audit immutability, full production compliance) are *production* obligations, not demo
blockers — IF the claim is scoped honestly. **Demo-ready path:** build the deterministic-offer_id
RunState, real Telco-AIX data, a real append-only audit table with `run_id`, the two-screen SSE sync,
and the eval numbers — and label the right screen **"AgentOps trace + audit-log *pattern*,"** not
"shipped legal artifact." That is buildable, honest, and still demonstrates production agentic AI. The
full WORM/retention/DPIA story is the "what production hardening looks like" talking point.

## Next step
Build the production version on ADR-001 (the RunState object), not on the mock. Start with: (1) pull +
pin the real `fenar/telco-aix` schema, (2) the deterministic eligibility pre-filter + offer_id
validator, (3) the `run_id` RunState + append-only audit table, (4) the SSE two-screen sync. Then the
Mastra workflow types cleanly onto the contracts.
