# ADR 004 — Continuity Session Graph

**Status:** Accepted  
**Date:** 2026-07-21  
**Skills staffing:** senior-architect · agent-workflow-designer · database-designer · observability-designer · ai-security · named-persona-adversarial-review (Cagan/Jobs) · project charters `agents/cx-continuity-founder.md` · `agents/voice-continuity-researcher.md`

## Context

Demo UI minted independent IDs for `/api/run` (bakery) and `/api/voice/session` (Daily/Pipecat). Companion bakery after Live Call minted a third. BudgetGuards were separate, so `$200/run` was not a true continuity envelope. Cost waterfall showed nodes but not which **channel** burned spend.

## Decision

1. **`sessionId` on `SessionState` / ContinuityPacket = `globalSessionId`** — root of the evidence graph.
2. **Voice Daily/Pipecat = `voiceLegId` (`vleg_*`)** — channel leg; worker callbacks and turn lookup key by leg.
3. **One shared `BudgetGuard` + `CostMeter` per global session** — bakery + voice deplete the same $200.
4. **Every cost row carries optional `channel` (+ `legId` for voice)** — Insights expose `byChannel` and `byNode`.
5. **Local evidence + Langfuse metadata** always include `{ globalSessionId, voiceLegId?, channel, pathKind }`.
6. **Process-local `ContinuityRegistry`** holds the shared budget/meter (SQLite persistence is follow-on).

## Consequences

- UI must show global + voice leg together; never a lone voice ID as “the session.”
- Companion `/api/run` with `globalSessionId` reuses the id and returns shared budget rollups (no orphan third mint).
- Ship-gate fails if local evidence lacks `globalSessionId`.
- Browser still never receives vendor keys or worker `callbackToken`.

## Alternatives rejected

- Separate voice budget “for demo dollars” — breaks product narrative of one journey.
- Reminting `sessionId` on Start live demo — breaks continuity graph.
