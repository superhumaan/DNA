# Healthcare Overview — Ireland

# Healthcare Technology — Ireland

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Data Protection Act 2018**
- **HSE** governance for public health data
- **HIQA** — quality and safety standards
- **MDR** via HPRA

## Health system
- **HSE** — Health Service Executive (public)
- **eHealth Ireland** — national digital health programme
- **GP systems** — widely used for primary care records
- Private hospitals: Bon Secours, Mater Private

## Standards & profiles
- **FHIR R4** — Irish eHealth adoption growing
- **IHE** profiles in hospital integrations
- **ICD-10**; **SNOMED CT**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions