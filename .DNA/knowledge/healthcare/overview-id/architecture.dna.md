# Healthcare Overview — Indonesia — Architecture

## When to use
# Healthcare Technology — Indonesia

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDP Law 2022** — Personal Data Protection
- **Ministry of Health Regulation** — SATUSEHAT mandate
- **BPOM** — medical device registration
- **BPJS Kesehatan** — national health insurer

## Health system
- **SATUSEHAT** — national health platform (FHIR-native)
- **BPJS** — covers ~80% of population
- **Private** — Siloam, Mayapada hospitals
- **Telemedicine** — Permenkes 20/2019

## Standards & profiles
- **FHIR R4** — SATUSEHAT mandated standard
- **KFA** — national drug and medical device coding
- **ICD-10**

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
