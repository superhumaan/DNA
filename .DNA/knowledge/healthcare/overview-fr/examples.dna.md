# Healthcare Overview — France — Examples

## Happy path
1. **Mon Espace Santé / DMP** — ANS interoperability specs
2. **HDS-certified** cloud — required for health data hosting
3. **MSSanté** — secure health messaging
4. **Pro Santé Connect** — clinician authentication

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- HDS certification for infrastructure provider
- Pair with: `healthcare/overview-eu`, `healthcare/mdr-eu`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
