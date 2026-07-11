# Taiwan — Healthcare Systems & Integration

# Taiwan — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Taiwan healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| NHI MediCloud | National platform | Cloud + data | NHI digital health initiatives | — |
| NHI insurer systems | Payer / insurer | Single payer | 99% coverage; NHI billing codes | — |
| Hospital EMRs (HTC, Chang Gung) | Hospital / acute EHR | Hospital | Per-facility VPN integration common | — |

## Integration playbook

1. **NHI codes** for billing integration
2. Smart Healthcare FHIR roadmap — verify current IG

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-tw` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions