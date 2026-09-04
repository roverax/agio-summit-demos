# Agio Summit — governed agentic AI demos and evidence

**Roverax Inc.** · [roverax.ai](https://roverax.ai) · Contact: Nash Vedula, info@roverax.ai

Agio Summit is one governed agentic-AI shell, deployed as an implementation skin per industry. Each instance keeps the same spine: a signal comes in, agents prepare a recommendation inside deterministic gates, a human approves, and every step is sealed into an audit record. Nothing here approves, moves money, contacts a customer, or changes an account on its own.

This repository publishes the **documentation and evidence** for three instances built between July and August 2026. Source code is not published; the architecture docs, decision records, evidence reports, and one-pagers are.

| # | Instance | Industry | What it proves | Live |
|---|----------|----------|----------------|------|
| 01 | [Field Command Center](01-field-command-center-telecom/) | Telecom | Seven field use cases on one governed six-step spine; recommend-only with a human gate and a tamper-evident record | [Public demo](https://agio-summit-field-command-center.vercel.app/) · [Video walkthrough](https://www.loom.com/share/49de41ef90ea4711ade1a7e191b90ae7) |
| 02 | [Capital Command Center](02-capital-command-center-insurance/) | Life insurance and annuities | A capital ask becomes a reconciled evidence graph with named gate owners and role-based decision packs; scoped four-week private POC | Private deployment; walkthrough on request |
| 03 | [AI-Native Voice Demo](03-ai-native-voice-demo/) | Frontier-lab audio: cross-channel customer experience | Controlled native speech-to-speech benchmark (OpenAI Realtime vs Gemini Live) with append-only evidence, a blind independent judge, and a fail-closed budget guard | Private deployment on Railway; walkthrough on request |

## How to read this repository

Each instance folder has a `README.md` with the same shape: the problem, what was built, the evidence with numbers and the report they came from, the governance controls, the stack, an honesty line stating what the instance is and is not, and links. The `docs/` folder under each holds the source documents as they were written during the build, lightly redacted to remove client and counterparty names.

## What is constant across all three

- **Recommend-only.** Agents prepare; humans hold every consequential approval. The gate is a code-level control, not a prompt instruction.
- **Evidence first.** Every run writes an append-only record. Failed runs are kept, never overwritten. Numbers that are illustrative are labeled illustrative.
- **Fail closed.** Missing configuration, a missing media plane, or a budget breach stops the run before a paid call is made.
- **One shell, many skins.** The brand, the navy control-tower shell, and the legal block are fixed. Only the industry content changes. See the [shell doctrine](01-field-command-center-telecom/docs/AGIO_SUMMIT_SHELL_DOCTRINE.md).
- **Adversarial review before outreach.** Each instance was reviewed by an isolated reviewer working from a written brief, and the review is published alongside the build.

## Honesty bound

These are production-deployed demo spines built on synthetic data. They are not certified systems, not multi-tenant enterprise deployments, and no client or customer data was used. The ISO/IEC 42001 scope document in instance 03 records its own verdict: not Stage 1 ready.

## Notice

See [NOTICE.md](NOTICE.md). Documents are published for review. Agio Summit and Roverax are trademarks of Roverax Inc.
