# Healthcare Overview — Spain — Architecture

## When to use
# Healthcare Technology — Spain

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **LOPDGDD**
- **Ley 41/2002** — patient autonomy and clinical history
- **AES** — Agencia Española de Medicamentos (devices)
- **Ministry of Health** — national strategy

## Health system
- **NHS** — National Health System (regional autonomous communities)
- **Historia Clínica Digital** — national EHR push
- **Sistema Nacional de Salud** — 17 regional systems
- Hospital vendors: Cerner ES, SAP for hospitals

## Standards & profiles
- **FHIR R4** — HCIS interoperability roadmap
- **HL7 CDA** legacy
- **CIE-10** diagnoses

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
