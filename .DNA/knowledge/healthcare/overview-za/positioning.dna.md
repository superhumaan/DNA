# Healthcare Overview — South Africa

# Healthcare Technology — South Africa

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **POPIA** — Protection of Personal Information Act
- **National Health Act** — health record confidentiality
- **SAHPRA** — medical device regulator
- **HPCSA** — telemedicine guidelines

## Health system
- **Public/private mix** — NHI bill progressing
- **District health** — provincial delivery
- **Discovery Health**, **Netcare**, **Mediclinic** private
- **EMR** — fragmented; Health Information System (HIS) upgrades

## Standards & profiles
- **FHIR R4** — adoption early stage
- **HL7 v2** common
- **ICD-10**; **SNOMED CT** (growing)

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions