# Redox — Architecture

## When to use
# Redox — Integration Platform ★

**Most common DNA shortcut** to Epic/Cerner/athena without per-EHR certification hell.

## Model
Normalized JSON over HTTPS; Redox translates to EHR-specific protocols.

## Use when
- Need ADT, orders, results, scheduling across heterogeneous hospitals

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
