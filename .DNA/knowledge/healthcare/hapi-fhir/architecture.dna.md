# HAPI FHIR — Architecture

## When to use
# HAPI FHIR

Reference-grade OSS FHIR server in Java.

## When
- Enterprise needs self-hosted FHIR repo
- Custom IG enforcement

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
