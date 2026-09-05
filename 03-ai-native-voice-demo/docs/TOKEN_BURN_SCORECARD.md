# Token Burn Scorecard — Agio Continuity Graph

Thesis: **small model × tight graph ≫ frontier × mushy chain.**  
Budget: ~$1000 demo month. Synthetic labeled where stand-in.

| # | Lever | Status | Where |
|---|--------|--------|-------|
| 1 | Deterministic pre-filter | **DONE** | `packages/core/src/gates.ts` `preFilter` |
| 2 | Model cascade | STUB | env `NBA_MODEL` / `JUDGMENT_MODEL`; stand-in reasoner in scenario |
| 3 | Prompt / KV cache | STUB | `cachedPrefixTokens` on continuity path |
| 4 | Context budget | **DONE** | `ContinuityPacket` summary max 1200 — not full dump |
| 5 | Structured I/O | **DONE** | Zod schemas in `session.ts` |
| 6 | RAG precision | TODO | tiny KB tool Phase B |
| 7 | Tool-result dedupe | **DONE** | `createToolMemo()` |
| 8 | Pipeline vs barrier | **DONE** | VAD diamond = intentional barrier |
| 9 | Online ≠ offline | **DONE** | `scenario` vs `apps/agent/src/eval.ts` |
| 10 | Distill AOP → code | **DONE** | WISMO FAQ early-exit |
| 11 | Early exit / confidence | **DONE** | preFilter + confidence gate |
| 12 | Speculative / draft | TODO | Phase C |
| 13 | Cost observability | **DONE** | `CostMeter` + UI $/node |
| 14 | Provider economics | STUB | Modal bakeoff stub |

## Phase A demo proof (must stay green)

```bash
npm install
npm run test -w @agio/core
npm run eval -w @agio/agent
npm run demo -w @agio/agent
npm run dev:web   # http://127.0.0.1:3450
```
