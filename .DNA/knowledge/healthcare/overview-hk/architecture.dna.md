# Healthcare Overview — Hong Kong — Architecture

## When to use
# Healthcare Technology — Hong Kong

Country-specific stem pack. Pair with `healthcare/overview` (router) and `healthcare/fhir-r4`.

## Regulation
- **PDPO** — Personal Data (Privacy) Ordinance
- **Electronic Health Record Sharing System Ordinance**
- **MDACS** — medical device administrative control system
- **DH** — Department of Health

## Health system
- **eHRSS** — electronic Health Record Sharing System
- **Hospital Authority** — public hospitals (majority)
- **Private hospitals** — Matilda, Hong Kong Sanatorium
- **HA EMR** — enterprise-wide clinical system

## Standards & profiles
- **HL7 v2** in HA
- **FHIR** — eHRSS interoperability specs
- **ICD-10**; **Read codes** legacy in primary care

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
