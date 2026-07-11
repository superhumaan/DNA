# Vietnam — Healthcare Systems & Integration

# Vietnam — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Vietnam healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| MOH National PHR | National platform | Electronic health record | National PHR programme | — |
| VSS Social Health Insurance | Payer / insurer | Insurance | ~90% coverage | — |
| Vinmec / FV Hospital EMRs | Hospital / acute EHR | Private | Hospital-specific | — |
| VNPT / Viettel Health IT | Integration platform | Health IT vendors | Common hospital IT providers | — |

## Integration playbook

1. **PDPD 2023** compliance
2. MOH specs per programme

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-vn` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions