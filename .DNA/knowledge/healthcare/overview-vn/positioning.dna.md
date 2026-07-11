# Healthcare Overview — Vietnam

# Healthcare Technology — Vietnam

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPD 2023** — Personal Data Protection Decree
- **Law on Medical Examination and Treatment** — health records
- **DAV** — drug administration (devices)
- **VSS** — Vietnam Social Security (health insurance)

## Health system
- **MOH** — Ministry of Health
- **National PHR** — electronic health record programme
- **Social health insurance** — ~90% coverage
- **Private** — Vinmec, FV Hospital growing

## Standards & profiles
- **HL7 v2** dominant
- **FHIR R4** — national roadmap
- **ICD-10**; **Vietnamese drug codes**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions