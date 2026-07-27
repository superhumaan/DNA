# Healthcare Overview — Australia — Examples

## Happy path
1. **My Health Record** — NASH PKI, conformance testing for upload/view
2. **State clinical portals** — per-jurisdiction APIs
3. **GP software** — Best Practice, MedicalDirector via accredited integration
4. Host in **ap-southeast-2** (Sydney) where residency required

## Compliance actions
- Run `dna plan compliance --frameworks privacy_act_au`
- TGA classification if clinical decision support
- Pair with: `healthcare/fhir-r4`, `healthcare/phi-engineering`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
