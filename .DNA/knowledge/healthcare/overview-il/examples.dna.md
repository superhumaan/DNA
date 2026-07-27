# Healthcare Overview — Israel — Examples

## Happy path
1. **Sick fund APIs** — partner agreements required
2. **Hospital EMR** — per-facility integration
3. **AWS/Azure** — EU or local hosting; document transfers

## Compliance actions
- Run `dna plan compliance --frameworks israel_privacy`
- AMAR if medical device
- Pair with: `healthcare/fhir-r4`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
