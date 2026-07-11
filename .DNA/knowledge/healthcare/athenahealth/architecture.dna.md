# athenahealth — Architecture

## When to use
# athenahealth

Ambulatory/outpatient focus. REST APIs for scheduling, charts, orders.

## When
- Outpatient clinic integrations
- Practice management + clinical combined

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
