# Healthcare Overview — Malaysia — Examples

## Happy path
1. **MOH HIE** — confirm current national integration programme
2. **Hospital EMR** — vendor-specific
3. **AWS ap-southeast-1** / Azure Singapore

## Compliance actions
- Run `dna plan compliance --frameworks pdpa_my`
- MDA if medical device
- Pair with: `healthcare/fhir-r4`, `healthcare/overview-sg`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
