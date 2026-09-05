# AIMS scope — Agio Summit / Roverax Inc.

**Standard:** ISO/IEC 42001:2023 (AI management system)  
**Date:** 2026-08-26  
**Status:** Draft Clause 4.3 statement — **not certified, not Stage-1 ready**  
**Owner:** Nash Vedula (operator / candidate AIMS owner)  
**Purpose:** name every AI system in scope, then overlay Annex A on the live spine first.

Scope note: Railway web + Speech Engine is a **production-deployed demo spine**. Continuity SoR is still process-local unless a shared store (ADR 009) lands. Do not publish this as an ISO 42001 certificate or as multi-instance enterprise SoR.

---

## 1. Organizational context (Clause 4.1–4.2)

| Item | Statement |
|------|-----------|
| Organization | Roverax Inc. / Agio Summit™ (conversational CX continuity) |
| Intended use | Cross-channel CX (email-shaped / chat / voice) with governed `ses_*` session graph |
| Interested parties | Founder-operator, demo audiences (voice-platform and enterprise prospects), vendors, and external **reviewers of evidence**, not as customers of a certified AIMS |
| In scope | AI systems listed in §2 that Agio **provides**, **deploys**, or **substantially modifies** |
| Out of scope | Non-product repositories, empty GRC folders, unpublished personal essays, third-party GPAI **training** (xAI / Anthropic / ElevenLabs train their own models) |

---

## 2. AI systems in scope (Clause 4.3)

Duplicate git trees of the same product are **one system**, not three.

| ID | System | Workspace | Registered | Provider / deployer |
|----|--------|---------------------|-------------|---------------------|
| AS-01 | Continuity brain (Grok NBA + code gates + BudgetGuard) | `(local workspace)` | **Not registered** | Provider |
| AS-02 | ElevenLabs Speech Engine sidecar (Railway WSS) | same repo, `voice/speech-engine` | same | Deployer of EL; provider of bind/turn glue |
| AS-03 | LAB Pipecat / Daily media plane | same repo, `VoiceMediaPort` | same | Provider of plane selection |
| AS-04 | Twilio SMS / WhatsApp / voice-memo ingress + Deepgram | same repo, ADR 005 | same | Deployer of Twilio / Deepgram |
| AS-05 | HITL judge (Claude on consequential gates) | same repo, `gateAction` | same | Deployer of Anthropic; provider of oversight path |
| AS-06 | Agio FDE workbench (`/agio/fde`) | FDE workbench workspace (two git trees) | one tree registered | Provider of demo surface |
| AS-07 | Enterprise insurance / GL Agio Summit demo | enterprise demo workspace (+ GL demo) | **No** | Provider of customer-shaped demo |
| AS-08 | Supplier GPAI / media models | not a repo — register | n/a | Suppliers: xAI, Anthropic, ElevenLabs, Deepgram, Daily, Twilio, Railway |

**Do not add to AIMS scope**

- `(local workspace)` — unrelated career track  
- `(local workspace)` — empty; use later as **evidence workbench**, not an AI system  

**Adjacent workspaces (not AS-01)**

- `AgioVoice` — trusted local project (graph / FDE sibling)  
- capital-raise demo workspace — GTM adjacent  
- `Ashby_roverax_AI services` — commercial packaging unless it hosts a model  

---

## 3. AI policy commitments (Clause 5.2 / Annex A.2.2) — required four

Until a signed one-pager exists, Stage 1 fails. Draft commitments for the overlay:

1. **Lawful use** — Agio processes only demo / synthetic or operator-consented traffic; no covert recording; Twilio sandbox is labeled sandbox.  
2. **Beneficial purpose** — continuity and safer handoff across channels; not social scoring, emotion recognition at work, or biometric ID.  
3. **Human oversight** — `gateAction` + HITL before money / cancel-whole-line; humans hold consequential approvals.  
4. **Continual improvement** — `docs/ops/ERROR_INTELLIGENCE.md` is the CAPA log; new prod-class errors get a row, not chat-only fixes.

Engineering rules in the repository are **not** a substitute for this policy.

---

## 4. Existing controls vs Annex A (hook, do not rebuild)

| Control already in Agio | Annex A analogue | Overlay action |
|-------------------------|------------------|----------------|
| MGR-I1 no second `ses_*` | A.6.2 life-cycle integrity | Cite in Statement of Applicability; keep red test |
| MGR-I2 warm voice needs prior continuity | A.8.2 conditions of use | Treat deny as AI incident |
| MGR-I8 evidence freeze requires `ses_*` | A.8.4 event logs | Add retention + unfreeze authority |
| `gateAction` + HITL | Human oversight | Name override roles |
| BudgetGuard fail-closed | Risk treatment / resource limit | Document as control objective |
| `VoiceMediaPort` / `MediaPlaneNotReady` | Fail closed; no silent mock audio | Supplier fallback policy |
| Market packs (not hardcoded locale) | Intended use / A.7 | Intended-use row per pack |
| ERROR_INTELLIGENCE | Monitoring / nonconformity | Tag rows `AIMS-NC` |

Residual risks that **must** appear on the register: process-local SoR, vendor model drift, WhatsApp sandbox vs production messaging, synthetic vs live labeling, single-operator independence for Clause 9.2.

---

## 5. Six AIMS questions — current verdict

| # | Question | Verdict |
|---|----------|---------|
| 1 | Scope names every AI system? | **Fail until this file is adopted** |
| 2 | Policy has four commitments? | **Fail** — draft only |
| 3 | Risk register mapped to Annex A? | **Partial** — MGR is real, register is not |
| 4 | Re-assess after material model change? | **Partial** — no 6.1.2 record on Grok/EL/Deepgram bumps |
| 5 | Clause 9.2 plan + auditor independence? | **Fail** |
| 6 | Integrated with ISMS/QMS? | **Partial** — no 27001; reuse ERROR_INTELLIGENCE as the one CAPA loop |

**Overall:** close criticals first. Not Stage-1 ready. Do not claim A+ / attach-ready AIMS.

---

## 6. Public artifacts (career, not certification)

Safe to publish with the scope note:

1. This scope + AI-system register  
2. SoA showing **present vs planned** on AS-01–AS-08  
3. Voice HITL case (gate before money) using synthetic bakery — no real PII  
4. Supplier register (deployer obligations)

Not safe: “ISO 42001 certified,” “enterprise multi-replica SoR,” “we block all jailbreaks.”
