# Thailand — Healthcare Systems & Integration

# Thailand — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Thailand healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NHSO | Payer / insurer | Universal coverage | UC scheme claims | — |
| MOPH / HDC | National platform | Health data centre | National health data programmes | — |
| BDMS / Bumrungrad EMRs | Hospital / acute EHR | Private hospital groups | Hospital-specific APIs | — |

## Integration playbook

1. **PDPA 2022** for health data
2. Confirm MOH/HDC current FHIR specs

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-th` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions