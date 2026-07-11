# Healthcare Overview — Sri Lanka — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. MOH digital health unit specifications
2. Hospital group EMR integrations
3. **AWS ap-south-1** common hosting choice

## Compliance
- Run `dna plan compliance` with Sri Lanka PDPA context
- Pair with: `healthcare/overview-apac`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
