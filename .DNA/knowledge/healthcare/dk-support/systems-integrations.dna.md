# Denmark — Healthcare Systems & Integration

# Denmark — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Denmark healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Denmark MOH / national health programme | National platform | Public health | Confirm current FHIR/API specs with ministry | — |
| Regional hospital EMRs | Hospital / acute EHR | Acute | HL7 v2 common; FHIR emerging — per-facility contracts | — |
| Redox / Mirth | Integration platform | Integration | When direct FHIR unavailable | `healthcare/redox` |

## Integration playbook

1. Load `healthcare/overview-dk` for regulation
2. **National programme first** — highest leverage
3. **Interface engine** for legacy HL7 v2
4. Pair with `healthcare/fhir-r4` and `healthcare/redox`

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-dk` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions