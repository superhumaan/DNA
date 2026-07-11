# SMART on FHIR — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
- Register app in EHR developer portal (Epic App Orchard, Cerner CODE)
- PKCE for public clients
- Scope minimization: `patient/Observation.read` not blanket `patient/*.read`
- Test with open sandbox patients before production review

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
