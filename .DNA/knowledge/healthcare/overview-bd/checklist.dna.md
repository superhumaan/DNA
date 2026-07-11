# Healthcare Overview — Bangladesh — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. MOHFW health information system programmes
2. Hospital EMR per facility — VPN integrations common
3. **AWS ap-south-1** (Mumbai) — document cross-border if used

## Compliance
- Run `dna plan compliance` with Bangladesh market in quote
- Pair with: `healthcare/overview-apac`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
