# Healthcare Overview — Brazil — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **RNDS** — integrate as authorized system for citizen data exchange
2. **ANS TISS** — private insurance transactions
3. **AWS sa-east-1** (São Paulo) for residency

## Compliance actions
- Run `dna plan compliance --frameworks lgpd`
- ANVISA if SaMD claims
- Pair with: `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
