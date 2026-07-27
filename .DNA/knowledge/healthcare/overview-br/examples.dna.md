# Healthcare Overview — Brazil — Examples

## Happy path
1. **RNDS** — integrate as authorized system for citizen data exchange
2. **ANS TISS** — private insurance transactions
3. **AWS sa-east-1** (São Paulo) for residency

## Compliance actions
- Run `dna plan compliance --frameworks lgpd`
- ANVISA if SaMD claims
- Pair with: `healthcare/fhir-r4`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
