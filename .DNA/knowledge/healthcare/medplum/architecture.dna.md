# Medplum — Architecture

## When to use
# Medplum ★

Code-first FHIR backend (TypeScript). Good for greenfield clinical apps **with compliance program**.

## Stack
Medplum server + @medplum/react + Bots (lambda-style FHIR triggers)

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
