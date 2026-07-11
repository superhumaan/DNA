# DR — Active–Active

## When justified
- Global product with strict uptime SLA (99.99%+)
- Regulatory requirement for in-country processing **and** cross-border redundancy
- Team experienced in distributed systems

## Architecture
- Multi-region load balancing (Route53, Cloudflare Load Balancing, GLB)
- **Prefer:** active-active **reads** + single **write HQ** (not true dual-write)
- True dual-write: shard by `tenant.region` — tenant data never writes in two regions

## Payments in active-active
- **One** settlement ledger region (financial Data HQ)
- Payment webhooks land in primary or use global queue with ordering
- Idempotent charge handling across failover

## Failure modes
- Split brain → financial duplicate risk
- Replication lag → user sees inconsistent state
- Requires automated **fencing** on promote
