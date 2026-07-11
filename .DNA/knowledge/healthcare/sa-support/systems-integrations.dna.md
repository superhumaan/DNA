# Saudi Arabia — Healthcare Systems & Integration

# Saudi Arabia — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Saudi Arabia healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NPHIES | National platform | Insurance exchange | FHIR R4 mandated for claims/eligibility | — |
| Seha Virtual Hospital | National platform | Telehealth | National virtual hospital platform | — |
| MOH platforms | National platform | Public health | Programme-specific APIs | — |
| Dr. Sulaiman Al Habib / Saudi German | Hospital / acute EHR | Private | Hospital EMR programmes | — |

## Integration playbook

1. **NPHIES FHIR** for payer-facing workflows
2. **PDPL** + NCA cybersecurity

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-sa` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions