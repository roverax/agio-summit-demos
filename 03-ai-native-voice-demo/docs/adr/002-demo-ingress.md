# ADR 002 — Demo ingress (one-click Daily + hosted Pipecat)

## Status

Accepted — 2026-07-21

## Context

Lab path required exporting `AGIO_SESSION_ID`, pasting Daily tokens, and running `python bot.py` in a third terminal. That is not practical or secure for a production demo.

## Decision

1. **Presenter surface:** Start live demo → Join call (mic) → speak. No terminals on stage.
2. **Session API** mints short-lived Daily meeting tokens (caller + bot) and **spawns** the voice worker (`MODAL_VOICE_WORKER_URL` or local Pipecat child).
3. **Browser never receives** vendor API keys — only `sessionId`, caller `joinUrl`, and public worker status.
4. **Worker callback** uses a session-scoped `callbackToken` via `POST /api/voice/worker` (`joining` → `in_room` → `ready`).
5. **Langfuse** remains the system-of-record turn graph (ADR 001). Vendor consoles are secondary proof of audio I/O.
6. **Honest ship-gate:** `audio_path` (Pipecat `sttSource=pipecat`) requires Deepgram+Cartesia metered; `text_path` (UI fallback) does not claim them.
7. **Mastra** stays offline bakery/agent scaffolding — not the live metering boundary.

## Consequences

- `VOICE_WORKER_MODE=auto|modal|local|none`; deploy `modal/voice_worker.py` for Modal host.
- Local demo needs `voice/pipecat/.venv` so session spawn can start `bot.py`.
- Text-path **Run text-path turn** remains the stage fallback when Daily/worker fails.
- Rehearse one green **audio** turn before external demos.
