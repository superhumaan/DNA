# Healthcare Overview — Singapore

# Healthcare Technology — Singapore

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPA** — Personal Data Protection Act; healthcare sector guidance
- **HCSA** — Healthcare Services Act licensing
- **MOH** — Ministry of Health policy
- **HSA** — Health Sciences Authority (devices)

## Health system
- **MOH** — public hospitals (SingHealth, NHG, NUHS clusters)
- **NEHR** — National Electronic Health Record
- **Healthier SG** — preventive care programme
- Private: Raffles, Parkway Pantai

## Standards & profiles
- **FHIR R4** — NEHR integration specs
- **HL7 v2** in hospitals
- **SNOMED CT**; **ICD-10-AM**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions