# Healthcare Overview — Switzerland — Architecture

## When to use
# Healthcare Technology — Switzerland

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **nFADP** (rev. 2023) — new Federal Act on Data Protection
- **HFG** — Federal Health Insurance Act
- **Swissmedic** — medical device regulation (MDR-aligned)
- **E-ID** — electronic identity rollout

## Health system
- **LAMal/KVG** — mandatory basic insurance (26 cantons)
- **eHealth Suisse** — national coordination
- **EPD** — electronic patient dossier (cantonal rollout)
- Hospital systems: KISIM, Cerner CH

## Standards & profiles
- **CH Core FHIR** profiles (eHealth Suisse)
- **HL7 v2** in acute care
- **ICD-10-GM** (German influence); **SNOMED CT**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
