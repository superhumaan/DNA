# Mirth Connect (NextGen) — Architecture

## When to use
# Mirth / NextGen Connect

Self-hosted integration engine for HL7 v2, FHIR, DICOM routing.

## When
- Hospital wants on-prem interfaces
- You operate managed Mirth for clients

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
