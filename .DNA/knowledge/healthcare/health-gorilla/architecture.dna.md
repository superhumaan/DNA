# Health Gorilla — Architecture

## When to use
# Health Gorilla

Query-based network for **aggregated clinical records** (HIE-style).

## Use
- Patient-mediated record retrieval
- Payer / life sciences with consent

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
