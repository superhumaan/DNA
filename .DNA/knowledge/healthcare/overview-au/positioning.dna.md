# Healthcare Overview — Australia

# Healthcare Technology — Australia

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **Privacy Act 1988** — APPs; health data is sensitive
- **My Health Records Act 2012** — national shared record
- **TGA** — Therapeutic Goods Administration for SaMD
- **State health records acts** — e.g. HRIP Act (NSW)

## Health system
- **Medicare** — universal coverage via PBS
- **My Health Record (MHR)** — opt-out national record
- **State health systems** — NSW Health, Queensland Health, etc.
- Major EHRs: Cerner, Epic, Best Practice (GP), MedicalDirector

## Standards & profiles
- **FHIR R4** with **AU Base** Implementation Guide
- **ADHA** specifications for MHR integration
- **SNOMED CT AU Edition**; **LOINC**; **ICD-10-AM**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions