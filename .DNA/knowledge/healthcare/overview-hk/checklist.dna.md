# Healthcare Overview — Hong Kong — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **eHRSS** — opt-in sharing; HCP registration required
2. **HA API** — partner programmes for public hospital data
3. **AWS ap-east-1** (Hong Kong)

## Compliance actions
- Run `dna plan compliance --frameworks pdpo`
- eHRSS participation agreement for data sharing
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
