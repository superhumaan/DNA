# Redox — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
- Redox dev portal: environments (Development, Staging, Production)
- Webhook verification + idempotent processing
- Map `Meta.Source.ID` to your tenant/customer
- Data models: PatientAdmin, Clinical Summary, Orders, Results
- BAA with Redox; they maintain EHR-side BAAs where applicable

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
