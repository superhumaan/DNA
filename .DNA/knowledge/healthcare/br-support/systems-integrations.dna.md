# Brazil — Healthcare Systems & Integration

# Brazil — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Brazil healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| RNDS | National platform | National FHIR network | FHIR R4 national exchange | — |
| ANS / TISS | Payer / insurer | Private insurance | TISS transactions for private plans | — |
| Tasy (Philips) / MV | Hospital / acute EHR | Hospital | Common hospital systems | — |

## Integration playbook

1. **RNDS** authorization for national exchange
2. **LGPD** sensitive data

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-br` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions