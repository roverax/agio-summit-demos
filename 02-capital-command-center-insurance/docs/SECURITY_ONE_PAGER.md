# Agio Summit — POC security posture

**Contact:** Nash Vedula · info@roverax.ai  
**Scope:** Private POC only · posture statements, not certification claims

## Where it runs
- Client tenancy (Azure or AWS)
- Nothing production-sensitive on vendor infrastructure
- The public demo is synthetic-only and never hosts client data

## Data handling
- Anonymized documents for the POC
- Read-only service accounts
- No write paths to client systems of record
- Retention: deleted at POC end with written confirmation

## Models
- Client-approved boundary only: Azure OpenAI or AWS Bedrock
- No training on client data
- No data leaves the tenant for model use outside the approved boundary

## Access
- SSO / RBAC
- Least privilege
- Named users for the POC workspace

## Audit
- Full trace per answer
- Approval gates recorded as signoff events
- Logs delivered to the client at readout

## Out of scope (by design)
- Production systems of record
- Live policyholder data
- Payment, cash movement, or journal-entry paths
- Autonomous approval of any capital, pricing, or accounting action
