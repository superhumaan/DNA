# Healthcare Overview — New Zealand — Examples

## Happy path
1. **Te Whatu Ora** interoperability programme
2. **GP integration** — via accredited practice management vendors
3. **AWS ap-southeast-2** (Sydney) or local NZ cloud

## Compliance actions
- Run `dna plan compliance --frameworks privacy_act_nz`
- HIPC compliance for all health apps
- Pair with: `healthcare/fhir-r4`, `healthcare/overview-au`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
