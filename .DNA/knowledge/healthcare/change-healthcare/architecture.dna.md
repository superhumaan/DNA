# Change Healthcare (Optum) — Architecture

## When to use
# Change Healthcare / Optum

Massive US healthcare clearinghouse. X12 EDI for claims and remittance.

## Use
- Revenue cycle, eligibility checks
- Not for clinical FHIR-first apps unless hybrid

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
