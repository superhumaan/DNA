# SMART on FHIR — Architecture

## When to use
# SMART on FHIR

Launch clinical apps from Epic/Cerner sandbox with patient context in token.

## Flow
EHR → authorize → your app receives `patient`, `encounter`, `fhirUser` scopes

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
