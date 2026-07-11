# Wearables & Device Data — Architecture

## When to use
# Wearables & RPM

## Consumer
- **Apple HealthKit** — iOS on-device, user permission per type
- **Google Health Connect** — Android hub

## Clinical RPM
- **Validic**, **Human API** — FDA-regulated device data pipelines

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
