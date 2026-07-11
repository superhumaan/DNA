# Healthcare Overview — Taiwan

# Healthcare Technology — Taiwan

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPA** — Personal Data Protection Act
- **Medical Care Act** — health record management
- **TFDA** — medical device regulation
- **NHI** — National Health Insurance Administration

## Health system
- **NHI** — single-payer (99% coverage)
- **Smart Healthcare** — national digital health plan
- **Hospital EMRs** — vendor landscape: HTC, Chang Gung, etc.
- **Telemedicine** — regulated during and post-pandemic

## Standards & profiles
- **HL7 v2** dominant
- **FHIR R4** — emerging in Smart Healthcare programme
- **ICD-10**; **NHI drug codes**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions