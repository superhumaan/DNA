# Epic Systems — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
- Register at open.epic.com / App Orchard
- OAuth2 backend + SMART launch
- Customer-specific FHIR base URLs (each health system)
- Rate limits and bulk export policies per organization
- Never scrape MyChart — use sanctioned APIs only

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
