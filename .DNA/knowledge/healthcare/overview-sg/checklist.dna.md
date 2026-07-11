# Healthcare Overview — Singapore — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **NEHR** — accredited system integration via IHiS
2. **SingPass** — national digital identity for citizens
3. **AWS ap-southeast-1** (Singapore) hosting

## Compliance actions
- Run `dna plan compliance --frameworks pdpa`
- HCSA licence if providing clinical services
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
