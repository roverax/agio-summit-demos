# Native S2S H2 Evidence Report

**Status:** H2 multi-turn transport, sealed synthetic action, and independent-judge gate passed  
**Benchmark authorization:** BLOCKED  
**Evidence date:** 2026-07-27  
**Scope:** Two deterministic caller turns on one persistent provider session

## 1. Frozen H2 contract

| Contract | Value |
|---|---|
| Scenario | Retail Banking / Card Security |
| Caller state machine | `agio-native-s2s-caller-state-machine-v3` |
| Continuity packet SHA-256 | `1a90a3d21b1301438246d608e0f942e9ed1ae9f92eb14ea3a31efe543546f6d6` |
| H2 configuration SHA-256 | `f2dbbd6ce81e4319d273fbc6e3ce4e8bd7ec4d9528751380381f1a8643c13810` |
| Tool contract | `agio-native-s2s-banking-tool-v1` |
| Tool | `execute_simulated_card_security_case` |
| Turn 1 source | `banking-card-turn-1.wav` |
| Turn 2 branches | `verification-consent` or `action-confirmation` |
| Maximum caller turns | 2 |
| Provider-generated caller speech | Forbidden |
| Next-turn barrier | Prior `response.done` and `playback.done` |

The state machine classifies only a branch ID from the sealed provider transcript. It cannot rewrite caller content. An unclassifiable response invalidates the route-case.

## 2. Final valid multi-turn sessions

| Provider | Session | Turn 2 branch | Trace |
|---|---|---|---|
| OpenAI Realtime | `ses_native_banking_card_ms3jqfcs` | `verification-consent` | Pass, 35 events, 2 turns |
| Gemini Live | `ses_native_banking_card_ms3ju1zk` | `verification-consent` | Pass, 36 events, 2 turns |

The two sessions above are the original transport-only H2 proof. The final production-schema proof was repeated with Postgres-backed append-only evidence and the independent Claude judge:

| Provider | Postgres-backed session | Judge | Metric observations |
|---|---|---|---:|
| OpenAI Realtime | `ses_native_banking_card_ms3kkn5r` | `claude-sonnet-5`, rubric `agio-cx-transcript-judge-v2` | 6 under `agio-cx-metrics-v2` |
| Gemini Live | `ses_native_banking_card_ms3ksten` | `claude-sonnet-5`, rubric `agio-cx-transcript-judge-v2` | 6 under `agio-cx-metrics-v2` |

Both routes:

- retained one provider session across both turns;
- preserved the same continuity and configuration hashes;
- used a permitted sealed audio artifact for each caller turn;
- emitted one complete normalized turn trace per turn;
- waited for provider completion and local playback drain before turn 2;
- captured actual provider usage per turn;
- marked cost explicitly unavailable;
- emitted one ordered `tool.requested` → `tool.started` → `tool.completed` trace on turn two;
- recorded the provider payload hash and identical sealed synthetic result hash without credentials;
- produced one concise terminal sentence that explicitly identifies the result as a simulation;
- used no provider or legacy fallback.

The Postgres-backed Gemini run also recorded four `session.resumption.updated` events. This proves that resumption handles are being preserved; it does **not** prove real `goAway` recovery because no `goAway` event occurred.

## 3. Observed transport metrics

These are two-turn canary observations, not benchmark conclusions.

| Provider | Turn | First audible audio | Turn completion |
|---|---:|---:|---:|
| OpenAI | 1 | 784.3 ms | 15,196.9 ms |
| OpenAI | 2 | 1,690.8 ms | 12,257.8 ms |
| Gemini | 1 | 839.1 ms | 14,304.3 ms |
| Gemini | 2 | 1,313.2 ms | 11,348.2 ms |

## 4. Interruption parity

Final valid interruption evidence:

| Provider | Session | `turn.interrupted` | `session.closed` | Transport error | Fallback |
|---|---|---:|---:|---:|---|
| OpenAI | `ses_native_banking_card_ms3j0085` | 1 | 1 | 0 | false |
| Gemini | `ses_native_banking_card_ms3j0prm` | 1 | 1 | 0 | false |

Both interruption traces use reason `operator-stop`. Output queues/transports close, the UI reaches `Stopped`, and no post-close normalized provider event is accepted.

The interruption work exposed and corrected:

- a concurrent close race that emitted `session.closed` twice;
- OpenAI’s one-shot media-element `playing` event, which could not identify turn-2 playback;
- transcript deltas arriving after an operator stop.

OpenAI now detects the first audible sample from the live remote stream on every turn.

## 5. Sealed action result

The H2 action boundary is now complete.

The tool result is immutable and explicitly synthetic:

- `simulationOnly: true`
- `status: simulated_success`
- `cardStatus: blocked_in_simulation`
- `fraudCaseStatus: opened_in_simulation`
- `caseReference: SIM-FRAUD-BANKING-CARD-V1`

No real bank, card, or fraud system is called. Calls with the wrong tool name, missing explicit confirmation, execution before turn two, duplicate execution, pre-tool speech, or a non-synthetic/verbose terminal outcome fail closed.

Failed attempts remain in the append-only ledger, including unrecognized caller branches, pre-tool speech, an OpenAI intermediate-response ordering race, and a Gemini constrained-token field-mask rejection. None were overwritten or promoted.

## 6. Remaining gates before H3

1. Observe and validate a real Gemini `goAway` session resumption.
2. Distributed rate, retry, call-count, and paid-budget caps remain open. Missing-credential, expired/near-expiry browser credential, and unexpected transport-disconnect injections now pass for both provider routes.
3. Add distributed rate, retry, call-count, and paid-budget caps.
4. Freeze and run the five-scenario paired H3 canary.

**H3 and the 100 × 2 benchmark remain blocked.**

## 7. Independent judge and append-only evidence

The production-schema validation on 2026-07-27 established:

- exactly one v2 judge row for each Postgres-backed H2 session;
- exactly six v2 metric observations for each session;
- active immutable-update/delete triggers on `agio_harness_events`, `agio_transcript_judge_results`, and `agio_metric_observations`;
- no duplicate v2 judge rows;
- no overwritten judge history.

The OpenAI session intentionally retains an earlier `judge.failed`, one superseded v1 judge row, and the corrected v2 row. That is valid append-only history. The v2 correction removed a duplicated terminal transcript line and taught the rubric to evaluate a disclosed synthetic tool against its sealed simulated result rather than demand a real banking side effect.

Observed v2 judge scores:

| Metric | OpenAI | Gemini |
|---|---:|---:|
| Resolution correctness | 0.90 | 0.85 |
| Grounding accuracy | 0.90 | 0.85 |
| Context sufficiency | 0.85 | 0.80 |
| Continuity preservation | 0.80 | 0.75 |
| Convergence achieved | 0.90 | 0.85 |
| Policy and safety | 0.80 | 0.70 |
| Interruption recovery | unavailable | unavailable |

The judge identified a shared design gap rather than a transport failure: the regulated banking transcript references upstream verification but does not visibly demonstrate the verification step. This remains evidence for scenario/rubric refinement before H3; it is not grounds to alter H2 results after the fact.
