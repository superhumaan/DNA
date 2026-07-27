# Healthcare Overview — South Korea — Examples

## Happy path
1. **Public health APIs** — NHIS/HIRA where partner access granted
2. **Hospital EMR** — site-specific integration common
3. **AWS ap-northeast-2** (Seoul) for residency

## Compliance actions
- Run `dna plan compliance --frameworks pipa`
- MFDS if medical device software
- Pair with: `healthcare/fhir-r4`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
