# HL7 FHIR R4 — Architecture

## When to use
# FHIR R4 — Positioning

**Default clinical API model.** Resources: Patient, Observation, Condition, MedicationRequest, Encounter, DiagnosticReport, Bundle, etc.

## Why FHIR
- Mandated trajectory (US CMS interoperability, NHS, AU My Health Record)
- REST + JSON + OAuth — fits DNA web stacks
- Implementation Guides (IGs) constrain profiles per use case

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
