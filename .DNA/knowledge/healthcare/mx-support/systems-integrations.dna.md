# Mexico — Healthcare Systems & Integration

# Mexico — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Mexico healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| SINBA / NOM-024 | National platform | EHR certification | NOM-024 compliant systems | — |
| IMSS / ISSSTE | Payer / insurer | Public insurers | Public sector hospital systems | — |
| Hospital Ángeles / FEMSA | Hospital / acute EHR | Private | Hospital-specific | — |

## Integration playbook

1. **NOM-024** for certified EHR
2. **LFPDPPP** privacy

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-mx` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions