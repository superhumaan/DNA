# Firely Server — Architecture

## When to use
# Firely

Commercial FHIR server + excellent .NET SDK.

## When
- .NET health stack
- Strict profile validation

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
