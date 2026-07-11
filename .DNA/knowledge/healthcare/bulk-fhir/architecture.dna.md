# Bulk FHIR Export — Architecture

## When to use
# Bulk FHIR

`GET [base]/$export` with _type filters. Async: Content-Location polling.

## Use
Payer, population health, de-identified analytics pipelines

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
