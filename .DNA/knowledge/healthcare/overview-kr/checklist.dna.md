# Healthcare Overview — South Korea — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Public health APIs** — NHIS/HIRA where partner access granted
2. **Hospital EMR** — site-specific integration common
3. **AWS ap-northeast-2** (Seoul) for residency

## Compliance actions
- Run `dna plan compliance --frameworks pipa`
- MFDS if medical device software
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
