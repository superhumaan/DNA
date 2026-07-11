# Healthcare Overview — Ireland — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **eHealth Ireland** APIs where available
2. **Hospital PAS** — per-site integration (often HL7 v2)
3. EU data residency — AWS/Azure Ireland regions

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- Pair with: `healthcare/overview-eu`, `healthcare/nhs-fhir` (UK-adjacent patterns)

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
