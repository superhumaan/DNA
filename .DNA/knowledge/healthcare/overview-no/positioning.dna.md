# Healthcare Overview — Norway

# Healthcare Technology — Norway

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Personal Data Act**
- **Helsepersonelloven** — health personnel law (confidentiality)
- **Helsedirektoratet** — Directorate of Health
- **MDR** via Statens legemiddelverk

## Health system
- **Helse-Norge** — national health portal
- **4 regional health authorities**
- **Kjernejournal** — core patient record
- **DIPS** — dominant hospital EMR

## Standards & profiles
- **FHIR** — Norwegian eHealth standards
- **HL7 v2** legacy
- **ICD-10**; **ICPC-2** primary care

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions