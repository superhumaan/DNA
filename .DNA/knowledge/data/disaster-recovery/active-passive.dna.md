# DR — Active–Passive

## Hot standby
- Passive region: replica DB **in sync or near-sync**, app tier **running** (maybe scaled down)
- Failover: promote replica → update DNS/GLB → scale app
- **RTO:** minutes if automated; practice runbooks

## Warm standby
- Passive region: DB replica or periodic snapshot; app **deployable** but not running (or min instances)
- Failover: promote/restore DB → deploy/scale app → switch traffic
- **RTO:** 1–4 hours typical

## Checklist
- [ ] Documented promote order (DB before app)
- [ ] Secrets replicated to DR vault
- [ ] Webhook endpoints: dual-region or queue buffer during failover
- [ ] Stripe/Adyen: webhook retry window covers DR RTO
