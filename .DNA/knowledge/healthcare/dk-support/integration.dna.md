# Denmark — Integration Patterns

- Default to **FHIR R4** with national IG where published
- Use integration platform (Redox, Mirth) when hospital APIs unavailable
- Document data residency and subprocessors

## Engineering rules
- Never log PHI or clinical documents
- Field-level minimum necessary in APIs
- Audit all PHI access; document subprocessors in Impressions