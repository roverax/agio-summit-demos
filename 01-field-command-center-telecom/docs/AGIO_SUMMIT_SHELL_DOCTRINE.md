# Agio Summit Shell — Brand & Reuse Doctrine

> **Codified after a mistake:** a demo was built that renamed the product to "Agentic Carrier" and
> swapped the logo. That is forbidden. This doctrine is the rule for **every** RoverAX demo.

## The rule (non-negotiable)
**Agio Summit is the product. Its identity is FIXED across every demo and every industry.**

**NEVER changes, in any demo:**
- The **logo** (`brand/logo-agio-mountain-agio.png`, the mountain/AGIO mark) + favicon.
- The **wordmark** — `Agio Summit™`.
- The **navy control-tower shell** (tokens, topbar, hero structure, workbench/tabs, footer structure).
- The **Roverax legal/trademark block** — "A Roverax technology… product IP managed by Roverax Inc.",
  "PROPRIETARY TECHNOLOGY… proprietary IP of Roverax Inc.", "© Roverax Inc.", "Roverax and Agio Summit
  are trademarks of Roverax Inc."

**CHANGES per demo (the "implementation skin") — and ONLY these:**
| Slot | Telecom (this demo) | Insurance (production) |
|---|---|---|
| Header **subtitle** | "Agentic Carrier · Field Command Center · a Roverax product" | "Capital Raise Evidence Engine" |
| **Hero** kicker/h1/lead + demo-note | "Should we save this account?" | "Can this raise close?" |
| **Pillars** | Signal · Salience · Recommend · Human Gate · Evidence | Read · Map · Reconcile · Govern · Audit |
| Footer **"Implementation:"** line | Agentic Carrier / Field Command Center for telecom | (insurance description) |
| **Inner content / orchestration** | 6-step spine + 7 telecom use cases | capital-raise tabs |
| Synthetic-demo disclaimer names | major US carriers (illustrative) | Summit Ridge / Cedar Harbor |

**Accent color:** production is gold `#b8922e`. An approved per-demo recolor is allowed for the
**accent only** (telecom uses carrier magenta `#e20074`). The **navy base is fixed.**

## Source of truth & governance (for any Agio Summit prod work, point Claude at these)
- **Commit `0afbcd0`** — the production source of truth.
- **`NLG_agentic_ai_capital_raise/CLAUDE_FABLE5_PROJECT_REVIEW_BRIEF.md`** — the review brief.
- **Parent `NLG_NTT_AgenticAI_PM Role/CLAUDE.md`** — guardrails (brand-lock is codified there).
- **There is NO `capital_raise`-level `CLAUDE.md`** — do not look for one.

Production shell file: `NLG_agentic_ai_capital_raise/outputs/ui/agio-agentic-command-center-preview.html`.
Live: https://agio-summit-capital-command-center.vercel.app/ · brand assets in the Agio repo `web/brand/`.

## How to build a NEW industry demo (retail · CPG · PE · VC · telecom)
1. Copy the shell (this file's `web/` is the telecom instance; keep the head, tokens, topbar, hero
   structure, workbench, footer, and `brand/` assets).
2. Keep the FIXED list above untouched — logo, "Agio Summit™", Roverax legal.
3. Swap only the implementation skin: subtitle, hero copy, pillars, footer "Implementation:" line,
   synthetic-demo names, accent color, and the inner content/orchestration for that industry.
4. Deploy `web/` as static to Vercel (Framework: Other, no build) — same as Agio production.

## Planned instances
telecom ✅ (this) · retail · CPG · PE · VC — each an implementation skin on the one fixed Agio Summit shell.
