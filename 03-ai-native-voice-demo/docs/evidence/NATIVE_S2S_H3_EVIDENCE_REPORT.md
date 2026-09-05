# Native S2S H3 Evidence Report

**Canonical plan:** `docs/OPENAI_GEMINI_NATIVE_S2S_PRODUCTION_PLAN.md`  
**Checklist:** `docs/ops/NATIVE_S2S_TRANSPORT_EXECUTION_CHECKLIST.md`  
**Final passing cohort:** `agio-native-s2s-h3-paired-2026-07-27-v5`  
**Seed:** `27072026`  
**Judge:** `agio-cx-transcript-judge-v3`  
**Metric contract:** `agio-cx-metrics-v3`  
**Status:** H3 passed on the final transport/economics implementation; the 100 × 2 benchmark remains blocked at the complete-cohort freeze.

## 1. Truthful cohort history

No failed or superseded evidence was overwritten.

### v1 — transport passed, product quality failed

The first ten-route cohort proved the corrected native transport and evidence pipeline, but all scenarios had empty tool evidence. The independent judge correctly scored the interactions as promises rather than verified outcomes. The run was not promoted.

### v2 — stopped after one route

The first provider-neutral action fixture opened the banking escalation but left identity verification incomplete. The OpenAI run scored below the frozen `0.75` minimum. Execution stopped at one of ten routes.

### v3 — stopped after one route

The action fixture included simulated identity verification, but the original free-form judge response returned malformed JSON. The voice route remained sealed and the judge failure was recorded append-only. The judge transport was replaced with a forced structured `record_transcript_judgment` tool call. A judge-only retry succeeded but still scored the one-turn interaction below threshold because explicit caller consent was absent. Execution stopped.

### v4 — passed

H3 was corrected to a provider-neutral two-turn state machine:

1. sealed caller audio states the bounded request;
2. the model acknowledges the existing context and asks one fixed confirmation question;
3. a second sealed caller artifact provides explicit consent;
4. the provider must call exactly one sealed deterministic resolution fixture;
5. the provider speaks the fixture's exact customer-facing confirmation;
6. the independent judge runs only after playback and evidence close.

The threshold was not lowered. Every required score remained frozen at `>= 0.75`.

### v5 — final implementation passed

After v4, actual provider-cost normalization and bounded Gemini session resumption were added. Because those are execution-path changes, the exact five-scenario paired cohort was rerun before any freeze decision. All ten v5 route-cases completed, all twenty turns produced complete calculated-cost evidence, and all ten judge results passed the unchanged threshold.

## 2. Frozen v4 contract controls

- Five scenarios: retail banking, telehealth, airlines, mobile carrier, and B2B SaaS.
- Two providers: OpenAI Realtime and Gemini Live.
- Exactly ten route-cases.
- Provider order alternates by pair:
  - banking: OpenAI, Gemini;
  - telehealth: Gemini, OpenAI;
  - airlines: OpenAI, Gemini;
  - mobile carrier: Gemini, OpenAI;
  - B2B SaaS: OpenAI, Gemini.
- Call cap: `10`.
- Reserved budget cap: `USD 5.00`.
- Reserved route cost: `USD 0.50`.
- Required route failure rate: `0`.
- Minimum required judge score: `0.75` for:
  - resolution correctness;
  - grounding accuracy;
  - context sufficiency;
  - continuity preservation;
  - convergence achieved;
  - policy safety.
- No learning or graph promotion occurred during the cohort.

## 3. Passing v5 sessions

| Pair | Scenario | Provider | Session | Minimum required score |
|---:|---|---|---|---:|
| 1 | Banking | OpenAI | `ses_native_banking_card_ms3nxxgi` | 0.85 |
| 1 | Banking | Gemini | `ses_native_banking_card_ms3nz8wr` | 0.90 |
| 2 | Telehealth | Gemini | `ses_native_telehealth_live_ms3o0dzy` | 0.85 |
| 2 | Telehealth | OpenAI | `ses_native_telehealth_live_ms3o1djm` | 1.00 |
| 3 | Airlines | OpenAI | `ses_native_airlines_live_ms3o2ssy` | 0.90 |
| 3 | Airlines | Gemini | `ses_native_airlines_live_ms3o3z8a` | 0.90 |
| 4 | Mobile carrier | Gemini | `ses_native_telecom_roaming_ms3o4zgy` | 1.00 |
| 4 | Mobile carrier | OpenAI | `ses_native_telecom_roaming_ms3o62qf` | 1.00 |
| 5 | B2B SaaS | OpenAI | `ses_native_b2b_saas_live_ms3o76zx` | 0.90 |
| 5 | B2B SaaS | Gemini | `ses_native_b2b_saas_live_ms3o8d8r` | 1.00 |

## 4. Postgres evidence reconciliation

Railway Postgres contains:

- `10` distinct v5 sessions;
- `10` distributed reservations;
- `USD 5.00` total reserved cost;
- `10` `e2e.complete` events;
- `0` `run.failed` or `transport.error` events;
- `10` `tool.completed` events and `0` `tool.failed`;
- `20` `usage.received` events;
- `20` `cost.calculated` events;
- all `20` cost events marked `complete`;
- `USD 0.11022110` total observed provider cost:
  - OpenAI: `USD 0.05248160`, mean `USD 0.00524816` per turn;
  - Gemini: `USD 0.05773950`, mean `USD 0.00577395` per turn;
- `10` immutable v3 judge results;
- `60` immutable v3 metric observations;
- all ten sessions with all six required session events;
- both turns of all ten sessions with all twelve required turn events;
- one source hash and one transmitted PCM hash per scenario-turn across both providers;
- active append-only triggers on reservations, harness events, judge results, and metric observations.

The real distributed guard rejected:

- an eleventh route request with `409 COHORT_CALL_CAP_REACHED`;
- a request against the exhausted reserved budget with `409 COHORT_BUDGET_CAP_REACHED`.

Neither probe opened a provider session.

## 5. Observed v4 latency

All figures are derived from browser monotonic timestamps using `agio-native-s2s-latency-v1`. Each provider has ten measured turns.

| Provider | Turns | Mean model first audio | Median model first audio | p95 model first audio | Mean audible first audio | p95 audible first audio | p95 total turn |
|---|---:|---:|---:|---:|---:|---:|---:|
| Gemini Live | 10 | 2,195.7 ms | 2,234.1 ms | 3,152.4 ms | 2,716.6 ms | 3,627.5 ms | 19,582.9 ms |
| OpenAI Realtime | 10 | 2,139.2 ms | 2,135.9 ms | 3,267.7 ms | 2,639.6 ms | 3,765.4 ms | 19,265.9 ms |

For every measured turn, first playback preceded response completion. These canary measurements are sufficient to freeze empirical transport thresholds, but they are not a statistically meaningful model-performance conclusion.

## 6. What H3 proves

H3 v5 reconfirms that both providers can execute the same:

- sealed two-turn caller contract;
- continuity packet;
- persistent native audio session;
- provider-neutral consent boundary;
- deterministic tool policy;
- exact terminal confirmation policy;
- normalized event contract;
- independent structured judge contract;
- append-only evidence and metric persistence.

It also proves that the earlier one-turn design was insufficient for governed enterprise actions. The correction is a generalized mechanism: establish context before voice, ask only for the final action authorization, then execute and verify the bounded action.

## 7. Recovery and remaining limits

Gemini session resumption is proven separately by append-only session `ses_native_banking_card_ms3nssoj`. A deterministic `goAway` injection caused the browser adapter to:

- preserve the provider-issued resumption handle;
- wait for the active turn boundary;
- mint one fresh single-use restricted token;
- verify the unchanged provider-configuration hash;
- reconnect with the handle;
- emit `session.resumed`;
- complete and judge the route;
- use exactly one paid reservation and one bounded resumption authorization.

The first injected attempt truthfully failed because the original single-use token was reused. That defect was not hidden. A later H2 injection resumed correctly and reached turn two, then failed separately because Gemini did not invoke the required synthetic tool. The final H1 transport-only injection completed.

The following remain unproven:

- spontaneous provider-generated Gemini `goAway` timing in a long-lived production session;
- final immutable 100 × 2 manifest and implementation commit;
- the full cohort's production hard stop at `200` route-cases and `USD 100`;
- long-duration stability, concurrency behavior, or provider-scale rate limits;
- production graph-learning promotion.

Actual cost is calculated from provider-returned modality usage and the frozen `agio-native-s2s-price-book-2026-07-27-v1`. Missing or unsupported usage still fails closed as `unavailable`; it is never invented.

## 8. Authorization decision

**H3 v5: passed.**

**100 × 2 benchmark: not authorized.**

Authorization remains blocked at Phase 4 until the final implementation commit and complete 100-scenario audio, order, context, tool, and policy manifest are frozen and hashed.
