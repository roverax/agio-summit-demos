# AI-Native Voice Demo

Voice and cross-channel CX deployment of Agio Summit, with a controlled speech-to-speech benchmark.

**Deployment:** https://agio-retell-production.up.railway.app/retell (private, sign-in required). [Request a walkthrough](https://services.roverax.ai/).

## Overview

Customers repeat themselves across email, chat, and voice, and voice agents that sound natural still hand off work they could have finished. This deployment carries one governed session across channels into a live call, and compares two native speech-to-speech providers under identical conditions so that model quality is not confused with integration quality.

## How it works

**Continuity spine.** One session identifier across channels. A continuity packet carries verified facts into the voice leg. Code-level gates sit before consequential actions. Every event is written to an append-only record. The voice vendor sits behind a media-port interface, so the deployed ElevenLabs plane can be replaced by OpenAI or Gemini without changing the workflow.

**Controlled benchmark.** OpenAI Realtime over browser WebRTC against Gemini Live over a persistent browser WebSocket, both native audio-in and audio-out. Held constant across providers: the sealed, hash-verified caller audio, the continuity packet, tools, policies, turn contract, evidence contract, judge, cost method, and promotion rules. Disallowed: external speech-to-text or text-to-speech in the path, complete-response buffering, silent fallback, and provider-generated caller turns.

**Measurement.** A normalized event contract; latency from browser monotonic timestamps; p50 and p95 reporting; cost from provider-returned usage against a versioned price book, marked unavailable when missing. An independent judge, blind to provider, scores six dimensions after each session closes. Judge results are append-only, and a re-judge is a new record linked to its parent.

## Results

Final cohort `v5`, five scenarios by two providers, from the [H3 report](docs/evidence/NATIVE_S2S_H3_EVIDENCE_REPORT.md):

| Measure | Result |
|---------|--------|
| Route-cases completed | 10 of 10; 0 transport errors; 0 tool failures |
| Judge results at the frozen 0.75 minimum | 10 of 10 passed |
| Cost events marked complete | 20 of 20 |
| Total observed provider cost | USD 0.11 |
| Cap enforcement | An 11th route request and an over-budget request both rejected with HTTP 409 before any provider session opened |
| p95 time to first audible audio | Gemini 3.63 s · OpenAI 3.77 s (ten turns each; descriptive, not a ranking) |

Cohorts v1 through v4 are retained in the report. v1 passed transport but failed quality on empty tool evidence; v2 and v3 stopped after one route; v4 passed; v5 re-ran the same cohort after execution-path changes.

## Guardrails

- **Budget guard.** A hard per-run limit throws before the paid call. The unit test simulates 1,000 five-dollar calls and stops at the 40th. Code review rejects unmetered provider calls. See [BILLING_HARD_LIMIT.md](docs/BILLING_HARD_LIMIT.md).
- **Human-in-the-loop gates** before money movement or line cancellation.
- **Benchmark freeze.** No learning is promoted into the production context graph while a cohort runs. Promotion requires recurrence, immutable evidence, ablation, and human approval.
- **ISO/IEC 42001 scope.** A draft management-system scope names the AI systems in play and maps existing controls to Annex A. It is a scoping document, not a certification. See [AIMS_SCOPE_AGIO.md](docs/AIMS_SCOPE_AGIO.md).

## Stack

Next.js web service and Node speech-engine sidecar on Railway · Postgres with append-only triggers · ElevenLabs Speech Engine (deployed plane) · OpenAI Realtime and Gemini Live (benchmark routes) · Twilio SMS and WhatsApp ingress · Claude as the blind judge · Streamlit analytics · Langfuse traces.

## Limitations

Single-operator deployment with a process-local continuity store and sandbox messaging. The benchmark demonstrates fair transport and complete evidence capture on five scenarios; it does not establish that either provider is better. The 100-scenario cohort is blocked at the freeze gate until the acceptance criteria in the plan are met.

## Documents

| File | Contents |
|------|----------|
| [OPENAI_GEMINI_NATIVE_S2S_PRODUCTION_PLAN.md](docs/OPENAI_GEMINI_NATIVE_S2S_PRODUCTION_PLAN.md) | Benchmark architecture, telemetry contract, gates, rollout |
| [evidence/](docs/evidence/) | H1, H2, H3 evidence reports |
| [adr/](docs/adr/) | Live spine, ingress, evidence plane, session graph, Twilio, Railway hosting |
| [ARCHITECTURE_BUILDING_BLOCKS.md](docs/ARCHITECTURE_BUILDING_BLOCKS.md) | Constraints shared by every Agio deployment |
| [BILLING_HARD_LIMIT.md](docs/BILLING_HARD_LIMIT.md) | Fail-closed budget control |
| [AIMS_SCOPE_AGIO.md](docs/AIMS_SCOPE_AGIO.md) | ISO/IEC 42001 scope draft |
