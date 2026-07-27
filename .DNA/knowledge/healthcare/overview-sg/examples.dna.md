# Healthcare Overview — Singapore — Examples

## Happy path
1. **NEHR** — accredited system integration via IHiS
2. **SingPass** — national digital identity for citizens
3. **AWS ap-southeast-1** (Singapore) hosting

## Compliance actions
- Run `dna plan compliance --frameworks pdpa`
- HCSA licence if providing clinical services
- Pair with: `healthcare/fhir-r4`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
