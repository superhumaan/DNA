# Healthcare Overview — Germany — Examples

## Happy path
1. **Gematik FHIR APIs** — ePA, eRezept, eAU (sick note)
2. **Practice systems (PVS)** — via certified TI gateway — not direct scraping
3. **Hospital IS** — ORBIS, i.s.h.med, Epic/Cerner DE instances
4. **DiGA** pathway if qualifying as prescribed app

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- DiGA/BfArM if reimbursable digital health app
- Pair with: `healthcare/overview-eu`, `healthcare/mdr-eu`

## Verify
Exercise the primary flow in staging; confirm logs omit secrets.
