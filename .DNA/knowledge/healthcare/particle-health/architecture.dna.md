# Particle Health — Architecture

## When to use
# Particle Health

API-first clinical data platform for apps needing consolidated records.

## Use
- Digital health startups
- Care navigation, prior auth support

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
