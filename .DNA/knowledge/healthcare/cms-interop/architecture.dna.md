# CMS Interoperability Rules — Architecture

## When to use
# CMS Interoperability (US)

Rules pushing FHIR APIs for Medicare Advantage, ACA plans, hospitals.

## Impact
- Patient access API
- Provider access API
- Payer-to-payer exchange

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
