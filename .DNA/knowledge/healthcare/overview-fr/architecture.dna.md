# Healthcare Overview — France — Architecture

## When to use
# Healthcare Technology — France

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Loi Informatique et Libertés**
- **HDS** (Hébergeur de Données de Santé) — mandatory certification for health hosting
- **CNIL** — health data guidance and DPIA templates
- **MDR** — ANSM national competent authority

## Health system
- **Assurance Maladie** — national health insurance
- **DMP** — shared medical record (Mon Espace Santé)
- **INS** — national health identity (NIR)
- Hospital systems: DxCare, Epic France, regional platforms

## Standards & profiles
- **CI-SIS** FHIR profiles (ANS)
- **HL7 CDA** legacy in hospitals
- **CCAM** procedures; **CIM-10** diagnoses

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
