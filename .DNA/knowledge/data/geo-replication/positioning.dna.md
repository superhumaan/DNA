# Geo-Replication — Why

Replicate data geographically for:

1. **Read scaling** — users in APAC read local replica (lower latency)
2. **Disaster recovery** — secondary region has copy if HQ fails
3. **Compliance** — sometimes *avoid* cross-border replication of raw PII

Geo-replication is **not a backup strategy alone** — corrupted deletes replicate too. Pair with point-in-time recovery (PITR) and immutable backups.

## When NOT to geo-replicate writes
- No contractual need and GDPR transfer analysis not done
- Team cannot operate split-brain resolution
- Payment ledger without distributed transaction design
