# Healthcare Overview — Pakistan — Implementation Checklist

## Before production
- [ ] API keys in environment / secrets manager — never in repo
- [ ] Webhook signatures verified (HMAC, JWT, or vendor-specific)
- [ ] Idempotency keys on writes and payment-like operations
- [ ] Rate limits, retries with backoff, and circuit breakers
- [ ] Structured logging without secrets or regulated payloads
- [ ] Monitoring alerts on error rate and latency SLOs

## Integration steps
1. Provincial health department integrations vary
2. NADRA identity linkage for insurance schemes
3. Data residency — prefer Middle East or APAC region with legal review

## Compliance
- Document cross-border hosting carefully
- Pair with: `healthcare/overview-apac`, `healthcare/fhir-r4`

## Verify
- [ ] Staging sandbox tested end-to-end
- [ ] Rollback plan documented in Impressions
