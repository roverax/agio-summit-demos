# Agio Summit

Governed agentic AI for regulated operations. One shell, deployed per industry.

[Roverax Inc.](https://services.roverax.ai/) · [roverax.ai](https://roverax.ai) · info@roverax.ai

## Overview

Agio Summit runs the same spine in every deployment: a signal comes in, agents prepare a recommendation inside deterministic gates, a named human approves, and every step is written to an append-only audit record. The agents never approve, move money, contact a customer, or change an account on their own.

This repository holds the architecture documents, decision records, evidence reports, and one-pagers for three deployments. Application source is not published.

## Deployments

| | Deployment | Industry | Demo |
|---|---|---|---|
| 01 | [Field Command Center](01-field-command-center-telecom/) | Telecom | [Live](https://agio-summit-field-command-center.vercel.app/) · [Video](https://www.loom.com/share/49de41ef90ea4711ade1a7e191b90ae7) |
| 02 | [Capital Command Center](02-capital-command-center-insurance/) | Life insurance and annuities | [Live](https://agio-summit-capital-command-center.vercel.app/) |
| 03 | [AI-Native Voice Demo](03-ai-native-voice-demo/) | Voice and cross-channel CX | [Private deployment](https://agio-retell-production.up.railway.app/retell), sign-in required · [request a walkthrough](https://services.roverax.ai/) |

## Common design

- **Recommend-only.** Consequential actions require a human approval that is enforced in code, not in a prompt.
- **Deterministic guardrails.** Eligibility, budgets, and validation are rules. Language models rank and explain inside the set the rules allow.
- **Append-only evidence.** Every run is recorded. Failed runs are kept. Illustrative figures are labeled as such.
- **Fail closed.** Missing configuration, an unavailable media plane, or a budget breach stops the run before any paid call.
- **One shell, one skin per industry.** Brand, layout, and legal block are fixed. Only the industry content changes. See the [shell guide](01-field-command-center-telecom/docs/AGIO_SUMMIT_SHELL_DOCTRINE.md).

## Scope

All three deployments run on synthetic or open data. None uses client, customer, policyholder, or investor data. They are demo spines with production patterns documented, not certified or multi-tenant systems.

## License

See [NOTICE.md](NOTICE.md). Documents are published for review. Agio Summit and Roverax are trademarks of Roverax Inc.
