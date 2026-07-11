# European Union — Healthcare Systems & Integration

# European Union — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems European Union healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| eHDSI / MyHealth@EU | National platform | Cross-border | Patient summary exchange EU-wide | — |
| EHDS | National platform | Health data space | Emerging primary/secondary use framework | — |
| Epic / Cerner EU instances | Hospital / acute EHR | Acute | US Core + national IG overlays | `healthcare/epic` |
| Dedalus / CompuGroup / CGM | Hospital / acute EHR | Acute + ambulatory | Dominant EU vendors | — |
| openEHR | Integration platform | Data layer | Used in several national programmes | — |

## Integration playbook

1. Install **country pack** (DE/FR/NL…) — EU pack is cross-border only
2. **GDPR Art. 9** + **MDR** for SaMD
3. **National IG** always overrides generic FHIR

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-eu` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions