# Japan — Healthcare Systems & Integration

# Japan — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Japan healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| Medical Information Network (医療情報ネット) | National platform | National connectivity | MHLW-led interoperability | — |
| FHIR JP Core | National platform | FHIR standard | HL7 Japan profiles | — |
| Fujitsu / IBM Japan / Cerner JP | Hospital / acute EHR | Hospital EMR | Site-specific VPN + HL7 v2/FHIR | `healthcare/cerner-oracle-health` |
| SS-MIX2 | National platform | Storage standard | Legacy standardized storage — transition to FHIR | — |
| M3 / Medley | Ambulatory / GP | Clinic | Clinic management systems | — |

## Integration playbook

1. **FHIR JP Core** for greenfield
2. **Hospital-by-hospital** negotiation common
3. **ap-northeast-1** (Tokyo); APPI consent for data use

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-jp` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions