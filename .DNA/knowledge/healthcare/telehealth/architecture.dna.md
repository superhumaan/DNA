# Telehealth Platforms — Architecture

## When to use
# Telehealth

## Platforms
- **Twilio Video** / **LiveKit** — embed in your app (BAA required)
- **Doxy.me** — standalone provider links
- **Zoom for Healthcare** — HIPAA tier

## Requirements
- Informed consent documented
- State licensure for clinicians (varies US)
- Waiting room and access control

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
