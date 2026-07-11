# Geo-Replication — Conflicts & Consistency

## CAP trade-off
Cross-region multi-writer forces **eventual consistency** somewhere. Name which consistency you sell:

- **Strong** (single HQ writer): simplest
- **Session / sticky user**: user always hits home region
- **Eventual**: document stale UI states

## Split brain
Two regions both think they are primary → duplicate charges, duplicate IDs.

**Prevention:**
- etcd/Consul lease-based leader election
- Cloud failover manager with fencing (STONITH)
- **Never** auto-failover without quorum if dual-write possible

## Idempotency
All cross-region workers must use idempotency keys (especially webhooks + payment settlement).
