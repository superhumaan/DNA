# Disaster Recovery — Topologies

Define **RTO** (how fast you're back) and **RPO** (how much data you can lose).

| Topology | Also called | RTO | RPO | Cost | Complexity |
|----------|-------------|-----|-----|------|------------|
| **Active–Active** | Multi-active, multi-master* | Minutes | Near-zero* | $$$$ | Very high |
| **Active–Passive (hot)** | Hot standby | Minutes–1h | Seconds–minutes | $$$ | Medium |
| **Active–Passive (warm)** | Warm standby | 1–4h | Minutes | $$ | Medium |
| **Passive–Passive (cold)** | Cold standby, backup-restore | 4–24h+ | Hours | $ | Lower |

*Active-active with multi-writer has conflict caveats — see `data/geo-replication`.

## Passive–Passive (cold)
Both sites **not serving production traffic** until disaster — often misnamed; usually means:
- **Primary active** + **DR passive (cold)**: only primary runs; DR has infra-as-code/terraform but scaled to zero or backups only
- True dual-passive is rare (no production) — clarify in docs as **cold DR site**

## DNA default (startup/SME)
**Active–passive warm** + PITR backups:
- Primary region serves traffic
- DR region: terraform ready, DB restore from backup or replica promote playbook
- Test restore **quarterly**
