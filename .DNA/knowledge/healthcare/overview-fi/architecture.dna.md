# Healthcare Overview — Finland — Architecture

## When to use
# Healthcare Technology — Finland

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **GDPR** + **Data Protection Act**
- **Act on Electronic Prescriptions** — national e-prescription
- **Valvira** — social/health care regulator
- **MDR** via Fimea

## Health system
- **Kela** — social insurance (reimbursements)
- **Wellbeing services counties** — 21 regions (2023 reform)
- **Kanta** — national digital health services (PHR, prescriptions)
- **Apotti, Epic** — hospital systems

## Standards & profiles
- **FHIR** — THL (Institute for Health and Welfare) profiles
- **HL7 v2** in hospitals
- **ICD-10**; **Finnish national codes**

## PHI baseline (all country overviews)
- Classify data: PHI / PII / de-identified / synthetic
- Minimum necessary — field-level API scoping
- Never log PHI, prompts, or raw clinical documents
- Encrypt in transit (TLS 1.2+) and at rest
- Audit every PHI access; document subprocessors in Impressions

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
