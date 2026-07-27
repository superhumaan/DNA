# Healthcare Overview — South Africa — Examples

## Happy path
1. **Provincial DOH** systems where applicable
2. **Medical aid schemes** — HL7/FHIR payer integration emerging
3. **AWS af-south-1** (Cape Town) for residency

## Compliance actions
- Run `dna plan compliance --frameworks popia`
- SAHPRA if SaMD
- Pair with: `healthcare/fhir-r4`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
