# China — Healthcare Systems & Integration

# China — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems China healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NHSA (National Healthcare Security Admin) | National platform | Insurance + DRG | Payment reform; hospital connectivity | — |
| Neusoft / Winning / iFlytek Health | Hospital / acute EHR | Hospital EMR | Dominant domestic vendors; per-hospital | — |
| Internet Hospital platforms | National platform | Regulated telehealth | Platform licence required | — |
| WeChat / Alipay health mini-programs | Ambulatory / GP | Patient engagement | Not clinical systems of record | — |

## Integration playbook

1. **In-country data only** — PIPL/DSL
2. **Local entity** often required
3. **National standards** differ from FHIR — engage local SI

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-cn` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions