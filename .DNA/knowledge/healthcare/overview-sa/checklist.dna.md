# Healthcare Overview — Saudi Arabia — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **NPHIES** — FHIR-based claims and eligibility
2. **MOH platforms** — integration per programme requirements
3. **AWS me-south-1** (Bahrain) or Azure UAE — document data location

## Compliance actions
- Run `dna plan compliance --frameworks pdpl`
- SFDA if medical device software
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
