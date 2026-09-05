# ADR 001 — Live spine (frontier · voice · observability · Modal)

## Status

Accepted — 2026-07-21

## Context

Phase A was synthetic end-to-end. Ship is blocked until a live turn proves paid providers under BudgetGuard.

## Decision

1. **Brain stays TypeScript** (`/api/voice/turn`) — Pipecat is audio I/O only.
2. **NBA = xAI Grok** (`NBA_MODEL`); **judgment = Claude** only on HITL/warm_handoff.
3. **Code owns `gateAction`** — model proposals never auto-approve money.
4. **Every paid hop** goes through `authorizePaidCall` / `recordVendor` before network.
5. **Langfuse** ingest per turn (soft-fail recorded in ship-gate evidence).
6. **Modal** `vad_bakeoff` is batch-only; enqueue required for ship-gate (metered).
7. **Ingress** = Daily WebRTC first; PSTN deferred.

## Consequences

- `LIVE_MODE=live` required for voice session API.
- Demo UI **Live Call** tab starts session + text turn (same turn API as bot).
- Public Vercel ship remains blocked until `shipGate.ok` on a live turn.
