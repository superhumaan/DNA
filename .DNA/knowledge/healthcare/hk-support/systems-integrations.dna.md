# Hong Kong — Healthcare Systems & Integration

# Hong Kong — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Hong Kong healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| eHRSS | National platform | Record sharing | Opt-in sharing; HCP registration | — |
| Hospital Authority HA EMR | Hospital / acute EHR | Public hospitals | Majority of acute care; HA partner APIs | — |
| Private hospitals (Matilda, HKSH) | Hospital / acute EHR | Private | Vendor-specific | — |

## Integration playbook

1. **eHRSS participation agreement** for sharing
2. **HA** partner programme for public hospital data

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-hk` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions