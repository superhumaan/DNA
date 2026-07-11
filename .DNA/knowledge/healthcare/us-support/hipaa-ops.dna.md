# United States — HIPAA Operations

## BAA chain
Every vendor touching ePHI needs a signed **BAA** — cloud, email, analytics, AI, support tools.

## Minimum necessary
Scope FHIR reads/writes to required resource types and elements. No blanket `patient/*.read`.

## Breach
Document incident response; 60-day notification rule for breaches affecting 500+ individuals.

## Engineering rules
- Never log PHI or clinical documents
- Field-level minimum necessary in APIs
- Audit all PHI access; document subprocessors in Impressions