# ADR 008 — Production hosting (Railway, replace ngrok)

**Status:** Accepted  
**Date:** 2026-07-23  

## Context

Speech Engine requires ElevenLabs to dial a **public** `wss://…/ws`. Ngrok/Cloudflare tunnels are hire-tape only (laptop-bound, rotating URLs). Production needs always-on services with stable domains, health checks, and secret injection.

## Decision

| Service | Host | Role |
|---------|------|------|
| **agio-web** | Railway (Docker) | Next brain · Twilio webhooks · ContinuityRegistry · `/api/voice/*` |
| **agio-speech-engine** | Railway (Docker) | EL upstream `/ws` · calls `AGIO_BRAIN_URL` |
| Analytics | Local Streamlit | Not hosted on Railway |

**Replicas:** `numReplicas = 1` on both services until ContinuityRegistry is moved off process-local memory (shared Redis/Postgres follow-on).

**Not chosen as primary:** Vercel for SE (no long-lived WS upstream). Fly.io is an acceptable alternate for the same topology.

## Trust / env

- Secrets only in Railway variables (never in image layers).
- Production SE **fails closed** if `AGIO_BRAIN_URL` is missing or localhost.
- Twilio `TWILIO_WEBHOOK_BASE_URL` = public Next domain (no tunnel).
- EL Speech Engine resource `wsUrl` = `wss://<se-domain>/ws`.

## Consequences

- Cutover runbook: [`docs/ops/PRODUCTION.md`](../ops/PRODUCTION.md)
- Local demos may still use Cloudflare/ngrok; production path is Railway.
- Multi-region / multi-replica Continuity SoR is **out of scope** until ADR 009.
