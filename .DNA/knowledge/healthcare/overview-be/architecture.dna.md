# Healthcare Overview — Belgium — Architecture

## When to use
# Healthcare Technology — Belgium

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Data Protection Act**
- **eHealth Platform** — federal health data agency
- **FAMHP** — medical device authority
- **Regional competence** — Flanders, Wallonia, Brussels

## Health system
- **eHealth** — national hub (summer of patients, eHealthBox)
- **Mutualités** — sickness funds
- **AZ Maria Middelares, Epic BE** — hospital systems
- **RSW / Riziv** — reimbursement agency

## Standards & profiles
- **eHealth FHIR** profiles
- **HL7 v2** legacy
- **ICD-10**; **ICPC-2**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
