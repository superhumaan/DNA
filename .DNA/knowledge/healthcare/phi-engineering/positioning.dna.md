# PHI Engineering Patterns

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