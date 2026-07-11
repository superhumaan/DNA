# InterSystems HealthShare / IRIS — Architecture

## When to use
# InterSystems

IRIS for HL7/FHIR messaging at hospital scale. HealthShare for HIE.

## Use
- On-prem or hosted integration hub
- National HIE projects

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
