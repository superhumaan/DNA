# ASC 606 Revenue Recognition — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
Deferred revenue schedules. Performance obligations. Audit trail.

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
