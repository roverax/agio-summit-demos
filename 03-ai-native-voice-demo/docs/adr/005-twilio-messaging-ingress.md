# ADR 005 — Twilio messaging ingress (SMS + WhatsApp + voice memo)

**Status:** Accepted  
**Date:** 2026-07-22  
**Deciders:** Nash · Agio continuity demo  

## Context

Final demo surface routes:

| Modality | Processor |
|----------|-----------|
| Live voice | Daily + Pipecat |
| SMS / WhatsApp text / voice memo media | **Twilio** (this ADR) |
| PDF / screenshot OCR | Modal RAGFlow parse (follow-on) |

Bakery / paste-text remain offline companions. Stage claim for messaging is **live Twilio**, not canned `/api/run` scripts.

## Decision

1. **One Messaging webhook** — `POST /api/webhooks/twilio/messaging` handles SMS and WhatsApp (Twilio uses the same form params; WhatsApp `From` is `whatsapp:+E.164`).
2. **Signature required** — validate `X-Twilio-Signature` with `TWILIO_AUTH_TOKEN`. Public URL must match `TWILIO_WEBHOOK_BASE_URL` + path (ngrok/tunnel). Dev-only escape: `TWILIO_SKIP_SIGNATURE=1` when `NODE_ENV !== production`.
3. **Explicit phone bind** — presenter binds customer `From` → `globalSessionId` via `POST /api/twilio/bind` before texting. Unbound numbers get an honest TwiML hint (not a hallucinated session).
4. **Channel map** — SMS → `chat`; WhatsApp text → `whatsapp`; audio media → `voice_memo` via Deepgram batch ASR (same ear as Pipecat). Non-audio media is labeled deferred (Modal RAGFlow), never invent OCR.
5. **Same reasoner** — `reasonLiveWithinGates` + gates/HITL; ContinuityRecord marked `synthetic: false` after first real Twilio turn.
6. **Evidence** — freeze Local Evidence Plane with `channel` + `pathKind: text`; voiceLegId null until Daily attach.

## Consequences

- Twilio Sandbox / purchased number must be configured before rehearsal.
- Phone bind is **file-backed** (`outputs/twilio_binds`, same pattern as Speech Engine pending) so Railway redeploy does not require re-bind when a volume / `AGIO_OUTPUTS_DIR` persists. ContinuityRegistry is still process-local — ingress cold-rehydrates `ses_*` from the bind (prior channel context lost until Continuity SoR is persisted).
- SendGrid email webhook is **not** in this ADR (Twilio email follow-on).
- Do not claim live Meta Cloud API; WhatsApp Sandbox is WhatsApp-**shaped** transport via Twilio.

## Skills that informed this ADR

`agent-workflow-designer` · `adversarial-reviewer` (Twilio-first ship gate)
