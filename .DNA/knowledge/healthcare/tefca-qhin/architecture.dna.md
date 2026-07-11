# TEFCA & QHIN — Architecture

## When to use
# TEFCA / QHIN

Federal framework for nationwide HIE via Qualified Health Information Networks.

## Use
- Apps needing broad record access with TEFCA legal footing

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
