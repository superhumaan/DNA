# Canvas Medical — Architecture

## When to use
# Canvas Medical

API-first EHR for digital health companies building on shared clinical stack.

## Use
- Primary care / specialty startups wanting EHR backbone

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
