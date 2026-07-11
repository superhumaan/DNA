# Geo-Replication — How

## Patterns (simplest → hardest)

### 1. Read replicas (single writer)
- **HQ primary** accepts all writes
- **Regional replicas** async replication (Postgres logical/physical, MySQL binlog)
- App routes reads by region; writes always to HQ
- **Lag:** monitor replication delay; stale reads acceptable or use "read your writes" routing

### 2. Active-passive secondary (hot)
- Secondary region has replica **promotable** to primary
- DNS/global load balancer failover after promotion
- Runbooks: break replication, promote, repoint apps

### 3. Active-active (multi-writer)
- Writes in multiple regions — **hard**
- Requires: conflict resolution (CRDTs, last-write-wins with vector clocks, or shard-by-region so no cross-region writes on same row)
- Payments/ledger: **avoid** naive active-active — use single financial HQ

## Implementation checklist
- [ ] Document RPO = max replication lag tolerated
- [ ] Encryption in transit between regions (TLS/VPN/private link)
- [ ] IAM: replication service principals least privilege
- [ ] Alerts on replication stopped / lag > threshold
- [ ] Game-day: measure actual promote time

## Cloud examples
| Stack | Mechanism |
|-------|-----------|
| Postgres (RDS/Cloud SQL) | Cross-region read replica; Aurora global database |
| Supabase | Primary + read replica region (check plan) |
| MongoDB | Global clusters with zone preferences |
| S3 | Cross-region replication (CRR) for objects — versioning on |
| Redis | Global datastore / active-active vendor features — know consistency model |
