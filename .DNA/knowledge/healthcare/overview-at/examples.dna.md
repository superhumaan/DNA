# Healthcare Overview — Austria — Examples

## Happy path
1. **ELGA** — national health record integration
2. **e-card** — insurance card system linkage
3. EU hosting (AWS/Azure Frankfurt/Vienna)

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- Pair with: `healthcare/overview-eu`, `healthcare/overview-de`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
