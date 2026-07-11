# Healthcare Overview — Sweden

# Healthcare Technology — Sweden

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Patient Data Act (PDL)**
- **IVO** — Health and Social Care Inspectorate
- **IMY** — data protection authority
- **MDR** via Läkemedelsverket

## Health system
- **Regions** — 21 regional healthcare providers
- **1177** — national healthcare guide and e-services
- **NPÖ** — National Patient Overview
- **Cambio, Cosmic** — common EMRs

## Standards & profiles
- **FHIR** — HL7 Sweden profiles
- **HL7 v2** in hospitals
- **ICD-10-SE**; **KVÅ** procedures

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions