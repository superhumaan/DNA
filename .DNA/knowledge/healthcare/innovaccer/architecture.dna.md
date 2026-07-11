# Innovaccer — Architecture

## When to use
# Innovaccer

Enterprise data platform ingesting EHR, claims, labs for population health.

## Use
- Large health system data lakes
- Value-based care analytics

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
