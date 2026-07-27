# Healthcare Overview — Finland — Examples

## Happy path
1. **Kanta services** — prescription, PHR, archive APIs
2. **Regional EMR** — Apotti in Helsinki Uusimaa
3. **AWS eu-north-1** (Helsinki)

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- Pair with: `healthcare/overview-eu`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
