# OpenEMR — Architecture

## When to use
# OpenEMR

Self-hosted clinic EHR. Common in resource-limited settings.

## Use
- Brownfield clinic IT
- Not greenfield SaaS default

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
