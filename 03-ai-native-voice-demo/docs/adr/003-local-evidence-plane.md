# ADR 003 — Local Evidence Plane (stage SoR)

## Status

Accepted — 2026-07-21

## Context

Langfuse cloud ingest works, but the cloud UI is too slow for production demos. Mastra is the wrong replacement (orchestration, not an instant evidence surface). Phoenix remains an evaluate-later option.

## Decision

1. **Local Evidence Plane is the system of record for stage** — every `/api/voice/turn` freezes `outputs/last_live_turn.json` and appends `outputs/live_turns.jsonl`.
2. **Live Call UI** shows Latest turn (session, path, spans, ship-gate) from that payload immediately.
3. **Langfuse is async secondary** — ingest still attempted under BudgetGuard; `live_langfuse_trace_id` never blocks ship; cloud link labeled optional/slow.
4. **Ship-gate hard check:** `live_local_evidence_written` (file exists + sessionId matches).
5. **Mastra** stays offline bakery scaffolding; **Phoenix** deferred until a second UI is needed.

## Consequences

- Demo line: “Evidence is local and instant. Langfuse is the cloud archive.”
- `GET /api/voice/evidence` returns the latest freeze for agents/rehearsal.
- Do not wait on Langfuse tabs during live voice section.
