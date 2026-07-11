# Waystar — Architecture

## When to use
# Waystar

RCM platform for hospitals and practices.

## Use
- Claims scrubbing and denial management integrations

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
