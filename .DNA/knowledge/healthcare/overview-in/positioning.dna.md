# Healthcare Overview — India

# Healthcare Technology — India

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **DPDP Act 2023** — Digital Personal Data Protection
- **DISHA** (proposed) — digital health authority framework
- **ABDM** — Ayushman Bharat Digital Mission (active programme)
- **CDSCO** — medical device rules (including software)

## Health system
- **ABDM** — national health stack (ABHA ID, HIE-CM, HFR, HPR)
- **Mixed public/private** — Ayushman Bharat insurance, private chains (Apollo, Fortis)
- **EMR fragmentation** — hospital-specific; ABDM aims to unify
- **Telemedicine guidelines** — MoHFW 2020

## Standards & profiles
- **FHIR R4** — ABDM recommended standard
- **ABHA** — 14-digit health ID
- **SNOMED CT** (India extension); **LOINC**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions