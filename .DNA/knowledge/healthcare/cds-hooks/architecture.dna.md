# CDS Hooks — Architecture

## When to use
# CDS Hooks

EHR calls your `POST /cds-services` with `hook` + `context` (patientId, userId).

## Hooks
`patient-view`, `order-select`, `order-sign`, medication-prescribe, etc.

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
