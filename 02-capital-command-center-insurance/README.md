# Capital Command Center

Life insurance and annuity deployment of Agio Summit. An evidence engine for capital raises, block acquisitions, and transaction diligence.

**Demo:** private. [Request a walkthrough](https://services.roverax.ai/).

## Overview

Before an investment committee commits capital to a life or annuity transaction, three questions decide the outcome: what evidence is missing, who owns the approval gate, and whether the request is ready for pricing diligence. This deployment turns an inbound capital ask into a reconciled evidence graph before anyone spends pricing time on it.

## How it works

The flow is Ask, Evidence, Decision, Learn.

- **Ask.** A capital request arrives as a document. The system parses amount, cohort, tenor, and gate owner, and takes a stance. The default stance is no: "Not yet," "Do not price," or "Narrow it."
- **Evidence.** The request maps to an evidence control table across policy administration, actuarial, reinsurance, investments, finance, and controls. Each row has a source layer, a named owner, a validation check, and a status. Staged evidence is not cleared evidence; only reconciled evidence moves the gate.
- **Decision room.** Same ask, different bar for yes. CEO, CFO, CIO, Chief Actuary, and CTO each get their own questions and an exportable pack that carries the evidence trace and the approval boundary.
- **Learn.** Each raise leaves a checklist, an owner map, and an exception list, so the next raise starts from memory. After close, a post-audit compares realized cash to the approved pack.

Evidence is scoped to a transaction. Files staged for one ask cannot clear a different one.

## Proof-of-concept scope

Four weeks, fixed fee, inside the client's tenancy.

| Week | Focus |
|------|-------|
| 1 | Parse and map the ask; inventory the evidence; agree success criteria |
| 2 | Fit the evidence taxonomy to the client's diligence checklist |
| 3 | Reconcile loop and human gates |
| 4 | Readout with an investment-committee-style pack |

Read-only service accounts. No write paths to systems of record. No training on client data. Out of scope: live policyholder systems, payment paths, journal posts, and autonomous approval. Details in the [POC one-pager](docs/POC_ONE_PAGER.md) and the [security posture](docs/SECURITY_ONE_PAGER.md).

## Guardrails

- Recommend-only. Human approvals are recorded as sign-off events.
- Read-only access, in-tenancy execution, SSO and role-based access.
- Full trace per answer, delivered to the client at readout.
- A pre-publish gate script blocks vendor-deck language and unlabeled claims in the demo. Every illustrative figure is labeled.

## Stack

Demo: static HTML and JavaScript state machine on Vercel. Proposed client path: LangGraph with human-in-the-loop interrupts, document parsing with page-level citations, pgvector in Postgres, read-only feeds from policy administration, actuarial output, and the general ledger, full trace logging, and models through the client's approved boundary (Azure OpenAI or AWS Bedrock).

## Limitations

The demo is synthetic: sample capital ask PDFs and sample evidence files, no client systems, no live model calls in the preview. Readiness and risk scores in the demo are illustrative; in a POC they are computed from evidence completeness and assumption stress results.

## Documents

| File | Contents |
|------|----------|
| [POC_ONE_PAGER.md](docs/POC_ONE_PAGER.md) · [PDF](pdf/Agio_Summit_POC_One_Pager.pdf) | Scope, timeline, success criteria, boundary |
| [SECURITY_ONE_PAGER.md](docs/SECURITY_ONE_PAGER.md) · [PDF](pdf/Agio_Summit_Security_One_Pager.pdf) | Security posture for the POC |
| [publish-quality-gate.sh](docs/publish-quality-gate.sh) | Pre-publish copy gate |
