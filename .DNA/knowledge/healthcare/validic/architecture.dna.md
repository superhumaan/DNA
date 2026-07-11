# Validic — Architecture

## When to use
# Validic

Ingests patient-generated health data from hundreds of devices/apps.

## Use
- Remote patient monitoring programs
- Clinical trials digital endpoints

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
