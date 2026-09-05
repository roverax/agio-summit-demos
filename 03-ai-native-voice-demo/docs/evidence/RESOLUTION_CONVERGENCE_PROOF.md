# Proof plan — Retell wins on resolution (not on vibes)

**Purpose:** Defensible experiment showing why **context + continuity + orchestration + resolution contracts** is the CX convergence — and why **Retell’s tool surface** is the strongest place to enforce it.  
**Related:** `docs/PRODUCT_WHY_VOICE_RESOLUTION.md`  
**Status:** experiment design (prove first; implement next)  
**Date:** 2026-07-28

---

## 1. What you are proving (and what you are not)

### Claim (tight)

> On the same narrowed context and the same 20 scenarios, **open-ended realtime S2S without resolution contracts** under-closes closable work (judge exposes the double tax). **Retell orchestration with tight resolution contracts** closes the closable set and escalates the must-escalate set — measured by the same independent judge and harness.

### Not the claim

- Not “Retell’s voice sounds better than OpenAI/Gemini.”  
- Not “native S2S cannot do contracts.” (They can — you chose open prompt as the control.)  
- Not “80% containment in every industry.” (Illustrative mix; experiment uses labeled closeable vs escalate scenarios.)  
- Not “Retell wins because magic.” Retell wins because **functions + transfer + end_call + post-call evidence** make contracts enforceable in the runtime CX leaders already buy.

### Fanboy vs proof

Fanboy: *Retell is best.*  
Proof: *Same judge, same scenarios, same context packet — open realtime fails resolution; contracted Retell passes. Here’s the sealed `ses_*` evidence.*

You sound like a fanboy only if you skip the control arm or hide the confound. This plan removes both.

---

## 2. Experimental confound (fix this or the proof dies)

If you run:

| Arm | Contracts |
|-----|-----------|
| OpenAI | Off |
| Gemini | Off |
| Retell | On |

…then “Retell wins every time” is partly **treatment vs control**, not “Retell model IQ.”

**That is still a valid product story** if you label it honestly:

> **Open realtime without contracts** vs **orchestration + contracts on Retell**  
> — the industry default vs the convergence stack.

**Stronger (recommended) three-arm design:**

| Arm | Media | Resolution contract | Role |
|-----|-------|---------------------|------|
| **A — Open control** | OpenAI Realtime | Off (generic front-desk prompt only) | Industry default: great voice, weak close |
| **B — Open control** | Gemini Live | Off (same prompt) | Second native control (not one lucky model) |
| **C — Contracted orchestration** | Retell Web S2S | **On** (functions + transfer + end_call + sealed results) | Convergence stack |

Optional later (not required for this proof): Arm D — OpenAI *with* contracts — shows contracts transfer; Retell still wins on **operability** (transfer, end_call, post-call, FDE tooling).

**Slide language that survives scrutiny:**

> We are not saying native S2S is bad. We are saying **voice without resolution contracts under-contains**. Retell is where we enforce contracts with production-grade tools — and the judge shows the gap closes.

---

## 3. Cohort — 20 curated scenarios

Freeze this list (from `CURATED_SCENARIOS`). Do not mix in generated 100-domain catalog.

### Closeable set (target: AI should close) — 16

| # | Domain | Scenario ID | Intent (short) |
|---|--------|-------------|----------------|
| 1 | primary-care | physio-knee | Book physio visit |
| 2 | primary-care | primary-reschedule | Reschedule sick-child appointment |
| 3 | medical-aesthetics | medspa-pregnancy | Route to safe clinical path (no diagnosis) |
| 4 | medical-aesthetics | medspa-reaction | Route post-treatment concern |
| 5 | retail-banking | banking-card | Secure card / open case (simulation) |
| 6 | telehealth | telehealth-live | Restore video visit |
| 7 | airlines | airlines-live | Rebook cancelled segment |
| 8 | b2b-saas | b2b-saas-live | Unblock production workflow |
| 9 | mobile-carrier | telecom-roaming | Explain / resolve roaming charge |
| 10 | broadband | telecom-outage | Restore service path |
| 11 | ecommerce | commerce-delivery | Missing delivery recovery |
| 12 | fashion-retail | commerce-return | Exchange wrong size |
| 13 | mens-health | mens-health-screening | Schedule wellness visit |
| 14 | veterinary-care | pet-insurance-claim | Open pet claim |
| 15 | facilities-maintenance | hvac-emergency-dispatch | Dispatch HVAC |
| 16 | student-financial-aid | aid-disbursement-delay | Unblock disbursement path |

### Must-escalate set (target: AI must escalate without fail) — 4

| # | Domain | Scenario ID | Why escalate is success |
|---|--------|-------------|-------------------------|
| 17 | senior-living | urgent-fall | Clinical/safety ownership |
| 18 | senior-living | ltc-memory | Complex care path / specialist |
| 19 | mortgage-servicing | banking-hardship | Regulated hardship / human underwriting |
| 20 | womens-obgyn | obgyn-prenatal-intake | Clinical intake / care team |

**Success definitions (freeze before runs):**

- **Closeable success:** sealed synthetic/action result OR confirmed booking/route with tool evidence + natural close — **no** human transfer.  
- **Escalate success:** explicit transfer/escalation function fired (or harness-equivalent) **with** context attached — **not** “call back later” dump.  
- **Failure (double tax pattern):** agent claims resolution without tool/transfer evidence; or soft-transfers a closable call; or fails to escalate a must-escalate call.

---

## 4. Constant factors (all arms)

| Factor | Rule |
|--------|------|
| Context Arena packet | Same for scenario across OpenAI / Gemini / Retell |
| Human caller | Same sealed TTS scripts (turns 1–3) |
| Turn budget | Same 3-turn demo contract |
| Judge | Same Claude rubric (`agio-cx-transcript-judge-v3`) |
| Harness | Same milestones + `tool.*` / transfer evidence fields |
| Economics | Recorded but **not** the win criterion for this proof |

Only **front-desk control surface** changes: open prompt (A/B) vs Retell contracted tools (C).

---

## 5. Retell resolution contract (what “tight” means)

Map each scenario to Retell’s available control surface ([function calling](https://docs.retellai.com/build/single-multi-prompt/function-calling), [custom functions](https://docs.retellai.com/build/single-multi-prompt/custom-function), transfer, end call, post-call analysis):

| Contract step | Retell capability | Proof signal |
|---------------|-------------------|--------------|
| Act (verify / recover / book / dispatch) | **Custom function** → sealed synthetic API | `tool.*` / function result in get-call |
| Confirm outcome to caller | Speak-after-execution / prompt bound to tool result | Transcript matches sealed result (no free invent) |
| Close closable | **End Call** after tool success | `end_call` + harness `e2e.complete` |
| Escalate must-escalate | **Transfer Call** (or escalation custom fn) | Transfer event present; context in metadata |
| Prove it | **Get Call** + webhooks + post-call analysis | Immutable evidence beside Agio harness |

**OpenAI / Gemini arms (this proof):** no tools registered for these 20; generic front-desk instructions only — same as today’s under-closed event-ticketing pattern.

---

## 6. Metrics (how Retell “wins every time” is scored)

Primary win metric is **not** latency or voice naturalness.

### Per-scenario outcome (binary)

| Label | Closeable scenarios | Escalate scenarios |
|-------|---------------------|--------------------|
| **Pass** | Resolution sealed + no transfer | Transfer/escalation sealed + context kept |
| **Fail** | Promise without action; soft transfer; incomplete | No escalation; false “handled” close |

### Cohort scoreboard

| Metric | OpenAI (A) | Gemini (B) | Retell (C) |
|--------|------------|------------|------------|
| Closeable pass rate ( /16 ) | | | |
| Escalate pass rate ( /4 ) | | | |
| Double-tax fails (promise, no act) | | | |
| Judge: mean resolution_correctness | | | |
| Judge: mean grounding_accuracy | | | |
| Judge: mean convergence_achieved | | | |
| Judge: mean continuity_preservation | | | |
| Judge certainty (mean) | | | interpret as certainty of verdict, not quality |

**Win criterion (pre-commit):**

- Retell closeable pass rate ≥ **14/16**  
- Retell escalate pass rate = **4/4**  
- OpenAI + Gemini closeable pass rate each ≤ **6/16** (or clearly below Retell by ≥ 8 points)  
- Continuity scores can be similar across arms — that strengthens the story: **context alone is not enough**

If OpenAI somehow passes without tools, the proof is invalidated and you investigate leakage (tools wired by mistake, judge too soft, scenario too easy).

---

## 7. Judge story (what you show founders)

### On OpenAI / Gemini (no contracts)

Expect judge language like your event-ticketing run:

- Empty tool evidence  
- Verbal promises (“I’m handling this”)  
- Low resolution / grounding / convergence  
- **High certainty** that the run failed quality  

**Slide line:** *The judge is the design instrument. It is telling you the industry default under-contains.*

### On Retell (with contracts)

Expect:

- Tool / transfer evidence present  
- Transcript grounded in sealed results  
- High resolution / grounding / convergence on closeable  
- Escalate scenarios scored as success when transfer fires (update rubric notes so “escalation done” ≠ resolution failure)

**Slide line:** *Same judge. Contracts + Retell tools closed the closable and escalated the rest.*

---

## 8. Narrative arc (proof, not fanboy)

1. **Context + continuity** — same packet, same harness, three lanes. Continuity can look good on all three.  
2. **OpenAI + Gemini without contracts** — human-like voice; judge shows under-close / false handle. Double tax made visible.  
3. **Retell with resolution contracts** — same scenarios; functions / transfer / end_call enforce close vs escalate.  
4. **Convergence claim:** CX is looking for **context + continuity + orchestration + resolution contracts**. Retell is the orchestration runtime where those contracts become production tools — not a prompt hope.  
5. **Why Retell wins this game:** not because others can’t talk — because Retell’s function/transfer/end-call/post-call surface is built to **operate** containment economics.

---

## 9. Deliverables (evidence pack)

| Artifact | Content |
|----------|---------|
| Cohort freeze file | Exact 20 scenario IDs + closeable/escalate labels |
| Run matrix | 20 × 3 = **60 sealed sessions** (`ses_*`) |
| Scoreboard CSV | Pass/fail + judge dimensions per arm |
| Insights links | One Open fail + one Retell pass per archetype |
| FDE brief | Retell tools used per contract step |
| One-page slide | Numbers from scoreboard only — no adjectives without cells |

---

## 10. Execution order (when coding starts)

1. Freeze cohort + success definitions (this doc).  
2. Disable benchmark / 100-domain noise in demo UI.  
3. Wire Retell resolution contracts for 20 (custom fn stubs + transfer + end_call).  
4. Ensure OpenAI/Gemini arms have **no** tools for this cohort.  
5. Batch run 60 sessions (scripted smoke, not manual click-marathon).  
6. Seal judge on each; build scoreboard.  
7. Only then claim “Retell wins.”

---

## 11. Claim checklist

- [ ] Claim framed as **contracts + orchestration vs open realtime**, not “Retell voice > OpenAI voice”  
- [ ] Continuity held constant — if continuity scores are high on all arms, say so  
- [ ] Escalate success ≠ failed resolution  
- [ ] Confidence ≠ quality average  
- [ ] No cherry-picking 3 green Retell runs vs 3 red OpenAI runs — full 20  
- [ ] If Retell misses closeable, **show it** — then fix the contract (that’s FDE credibility)

---

## Bottom line

Your instinct is right for a Retell-aligned proof: **same 20, open native without contracts, Retell with tight contracts, same judge.**  

To not sound like a fanboy, pre-commit the scoreboard, label the confound as the product thesis, and let sealed sessions do the talking. Retell wins **hands down** when “win” means **containment with intentional escalation** — which is exactly the double-tax problem CX is trying to solve.
