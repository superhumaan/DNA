# Malaysia — Healthcare Systems & Integration

# Malaysia — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Malaysia healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| MOH MyHDW | National platform | Health data warehouse | National analytics and HIE direction | — |
| IHH / KPJ hospital EMRs | Hospital / acute EHR | Private groups | Vendor-specific | — |
| ProtectHealth (PEKA) | Payer / insurer | Scheme administrator | Public scheme integrations | — |

## Integration playbook

1. **PDPA 2010** + MOH facility licensing
2. Confirm MOH HIE programme status

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-my` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions