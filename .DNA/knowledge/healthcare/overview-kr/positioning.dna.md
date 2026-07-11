# Healthcare Overview — South Korea

# Healthcare Technology — South Korea

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PIPA** — Personal Information Protection Act; strict consent for sensitive data
- **Medical Device Act** — MFDS (식약처) for SaMD
- **National Bioethics Act** — research use of health data
- **MyData** — health data portability initiatives

## Health system
- **NHIS** — National Health Insurance (single payer)
- **HIRA** — claims and review agency
- **EMR** — high adoption; major vendors: EZCaretech, U2Bio, Samsung SDS
- **KONAS** — medical institution codes

## Standards & profiles
- **FHIR KR Core** (KHIS profiles emerging)
- **HL7 v2** widespread
- **KCD** diagnoses; **EDI** claims formats

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions