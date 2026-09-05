# Agio Summit — architecture building blocks (universal)

**Purpose:** Reusable constraints for every Agio implementation (ElevenLabs, Retell, lab).  

| Layer | Location |
|-------|----------|
| Phase-1 review learnings (do not repeat) | `elevenlabs/05-PHASE1-REVIEW-LEARNINGS.md` |
| Speech Engine contract | `elevenlabs/adr/002-speech-engine-interface.md` |
| Core primitives | `packages/core` — `live/mediaPlane`, `live/continuityInvariants`, `live/stageDefaults` |

## One-sentence system

Agio = continuity & control plane (`ses_*`, gates, evidence, evals, budget).  
Vendors = media plane (LAB Pipecat today; Speech Engine / Agents / others via `VoiceMediaPort`).

**Why LAB vs SE for local demos:** LAB keeps brain traffic on-box (no public WSS). Speech Engine requires EL to dial *your* `/ws` — local development uses ngrok as ingress only.

## Planes (not glossary L0–L5)

`TRANSPORT → MEDIA → CONTINUITY → CONTROL → OPS`

## Non-negotiables (testable)

1. Flag planes — never comment-out swap.  
2. MGR = production deny + red test.  
3. No SoR leg until media start OK.  
4. Config owns path/market/locale/mode (I13).  
5. Fail loud on unimplemented modes.  
6. Findings → SoT edit | OPEN | reject.

## Adding a country (not an env var)

Add a row to `MARKET_PACKS` in `packages/core/src/live/marketPacks.ts` (or later a config service).  
UI/API select `marketPackId`. Never `AGIO_PATH_INDIA=1`-style env sprawl.
