# Philippines — Healthcare Systems & Integration

# Philippines — Healthcare Systems & Integration

**This is the integration game-changer.** Real software systems Philippines healthcare uses — and how to connect.

## Systems catalog

| System | Type | Segment | How to integrate | DNA pack |
|--------|------|---------|------------------|----------|
| PhilHealth | Payer / insurer | National insurance | E-Claims accreditation; case rate billing | — |
| DOH eHealth | National platform | Public health IT | Facility reporting and programmes | — |
| MWell / Maxicare networks | Ambulatory / GP | HMO + telehealth | Private payer integration | — |

## Integration playbook

1. **PhilHealth accreditation** for claims APIs
2. **DPA 2012** sensitive personal information rules

## DNA vendor packs (auto-installed with country bundle when applicable)

Run `dna marketplace install healthcare/overview-ph` — relevant vendor packs from the table above install automatically.

## Engineering rules

- **Never scrape** EMR portals — use sanctioned APIs, accreditation, or integration platforms
- **Validate FHIR** against national IG (US Core, UK Core, AU Base, CI-SIS, etc.)
- **Interface engine** (`healthcare/mirth`) when hospital only speaks HL7 v2
- **Redox** (`healthcare/redox`) when you need one API to many EHRs without per-vendor certification
- Document subprocessors and **data residency** in Impressions