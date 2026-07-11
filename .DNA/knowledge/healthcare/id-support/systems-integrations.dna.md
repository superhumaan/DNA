# Indonesia — Healthcare Systems & Integration

# Indonesia — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Indonesia healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| SATUSEHAT | National platform | National FHIR platform | Mandatory FHIR R4; OAuth; HIP registration | — |
| BPJS Kesehatan | Payer / insurer | National insurer | ~80% population; claims via accredited path | — |
| Siloam / Mayapada EMRs | Hospital / acute EHR | Private chains | SATUSEHAT integration required | — |

## Integration playbook

1. **SATUSEHAT certification** for clinical exchange
2. **ap-southeast-3** (Jakarta)

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-id` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions