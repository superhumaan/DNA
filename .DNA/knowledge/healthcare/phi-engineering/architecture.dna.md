# PHI Engineering Patterns — Architecture

## When to use
# PHI Engineering

## Data model
- Separate `phi` schema or column-level classification
- Tokenized patient IDs in logs
- Break-glass access audited

## AI
- **No PHI in LLM prompts** unless BAA-covered deployment (Azure OpenAI with HIPAA, etc.)
- De-identify for analytics (expert determination or safe harbor)

## HIPAA baseline (all healthcare packs)
- BAA with every vendor touching PHI
- Minimum necessary — field-level scoping in APIs
- Never log PHI, prompts, or raw clinical documents
- Encrypt ePHI in transit (TLS 1.2+) and at rest
- Audit every PHI access; run `dna plan compliance --frameworks hipaa`

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
