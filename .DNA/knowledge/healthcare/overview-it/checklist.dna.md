# Healthcare Overview — Italy — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. **Regional FSE** — Lombardia, Toscana, etc. have distinct APIs
2. **PagoPA** — not clinical but common in public sector apps
3. EU data residency

## Compliance actions
- Run `dna plan compliance --frameworks gdpr`
- Regional compliance checks for FSE integration
- Pair with: `healthcare/overview-eu`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
