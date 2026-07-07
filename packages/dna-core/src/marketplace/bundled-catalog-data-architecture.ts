import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

export const DATA_ARCHITECTURE_PACKS: KnowledgePack[] = [
  catalogPack(
    "data/data-hq",
    "Data HQ (Data Headquarters)",
    "disciplines",
    "Primary data region, legal jurisdiction, and why it matters for compliance, latency, and payments",
    [
      {
        path: "data/data-hq/positioning.dna.md",
        content: `# Data HQ — What & Why

**Data HQ** (data headquarters) is the **primary jurisdiction and region** where your system's **authoritative data** lives — the place you designate as source of truth for audits, DPAs, and architecture decisions.

## What Data HQ is
| Dimension | Example decision |
|-----------|------------------|
| **Cloud region** | \`eu-west-2\` (London) primary Postgres |
| **Legal entity** | UK Ltd as data controller |
| **Backup home** | Same sovereignty zone as primary |
| **Analytics** | Aggregated only; raw PII stays in HQ region |

Data HQ is **not** the same as "we use AWS" — it is the **specific region + account + database** documented in Impressions.

## Why it matters

### Compliance
- **GDPR/UK GDPR:** EU/UK data residency promises in DPA must match actual primary region
- **HIPAA:** BAA covers defined regions; ePHI must not drift to non-BAA regions
- **PCI:** Payment data residency may be constrained by acquirer/processor

### Payments
- Stripe/Adyen account country, payout bank, and tax entity should align with commercial Data HQ
- MoR (Paddle/Lemon Squeezy) shifts some obligations — still document where **your** customer PII lives

### Operations
- **Latency:** primary region near majority users or HQ engineers (pick consciously)
- **Support hours:** incident response runbooks reference HQ timezone
- **Disaster recovery:** DR site relationship to HQ (see \`data/disaster-recovery\`)

## How to establish Data HQ

1. **Name it** in \`DNA/Impressions/architecture/data-hq.md\`:
   - Primary region, cloud account ID, database identifiers
   - What categories of data (PII, PHI, payments metadata, logs)
2. **Run** \`dna plan compliance\` before expanding to new regions
3. **Subprocessors** list must match regions (Stripe, email, analytics)
4. **Single writer** default — one primary DB; replicas read-only unless active-active is justified
5. **New region** = change request: legal review + \`data/geo-replication\` design

## Anti-patterns
- "Multi-region" without documented HQ — auditors cannot find source of truth
- US-East default with EU customers and no SCCs/TIAs
- Analytics tools copying raw PII to US by default (Mixpanel/GA configs)
`,
      },
      {
        path: "data/data-hq/decision-matrix.dna.md",
        content: `# Data HQ — Decision Matrix

| Factor | Question |
|--------|----------|
| Customers | Where are majority data subjects? |
| Contract | What does enterprise DPA require? |
| Latency | p95 API target for primary users? |
| Team | Where do engineers operate during incidents? |
| Payments | Processor settlement currency & entity? |
| DR | Acceptable RPO if HQ region fails? |

## Tier guidance
| Tier | Data HQ bar |
|------|-------------|
| Startup | Pick one region; document in Impressions; avoid multi-region complexity |
| SME | Named HQ + backup in-region; subprocessors mapped |
| Corporate | HQ per legal entity; formal residency exceptions approved |
| Enterprise | Multi-region with explicit HQ per data category; legal sign-off on replicas |
`,
      },
    ],
    ["data", "data-hq", "residency"],
  ),
  catalogPack(
    "data/geo-replication",
    "Geo-Replication",
    "disciplines",
    "Why and how to replicate data across regions — read replicas, async sync, and conflict rules",
    [
      {
        path: "data/geo-replication/positioning.dna.md",
        content: `# Geo-Replication — Why

Replicate data geographically for:

1. **Read scaling** — users in APAC read local replica (lower latency)
2. **Disaster recovery** — secondary region has copy if HQ fails
3. **Compliance** — sometimes *avoid* cross-border replication of raw PII

Geo-replication is **not a backup strategy alone** — corrupted deletes replicate too. Pair with point-in-time recovery (PITR) and immutable backups.

## When NOT to geo-replicate writes
- No contractual need and GDPR transfer analysis not done
- Team cannot operate split-brain resolution
- Payment ledger without distributed transaction design
`,
      },
      {
        path: "data/geo-replication/how.dna.md",
        content: `# Geo-Replication — How

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
`,
      },
      {
        path: "data/geo-replication/conflicts.dna.md",
        content: `# Geo-Replication — Conflicts & Consistency

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
`,
      },
    ],
    ["data", "geo-replication", "residency"],
  ),
  catalogPack(
    "data/disaster-recovery",
    "Disaster Recovery Topologies",
    "disciplines",
    "Active-active, active-passive, passive-passive (cold) — RTO, RPO, failover runbooks",
    [
      {
        path: "data/disaster-recovery/positioning.dna.md",
        content: `# Disaster Recovery — Topologies

Define **RTO** (how fast you're back) and **RPO** (how much data you can lose).

| Topology | Also called | RTO | RPO | Cost | Complexity |
|----------|-------------|-----|-----|------|------------|
| **Active–Active** | Multi-active, multi-master* | Minutes | Near-zero* | $$$$ | Very high |
| **Active–Passive (hot)** | Hot standby | Minutes–1h | Seconds–minutes | $$$ | Medium |
| **Active–Passive (warm)** | Warm standby | 1–4h | Minutes | $$ | Medium |
| **Passive–Passive (cold)** | Cold standby, backup-restore | 4–24h+ | Hours | $ | Lower |

*Active-active with multi-writer has conflict caveats — see \`data/geo-replication\`.

## Passive–Passive (cold)
Both sites **not serving production traffic** until disaster — often misnamed; usually means:
- **Primary active** + **DR passive (cold)**: only primary runs; DR has infra-as-code/terraform but scaled to zero or backups only
- True dual-passive is rare (no production) — clarify in docs as **cold DR site**

## DNA default (startup/SME)
**Active–passive warm** + PITR backups:
- Primary region serves traffic
- DR region: terraform ready, DB restore from backup or replica promote playbook
- Test restore **quarterly**
`,
      },
      {
        path: "data/disaster-recovery/active-active.dna.md",
        content: `# DR — Active–Active

## When justified
- Global product with strict uptime SLA (99.99%+)
- Regulatory requirement for in-country processing **and** cross-border redundancy
- Team experienced in distributed systems

## Architecture
- Multi-region load balancing (Route53, Cloudflare Load Balancing, GLB)
- **Prefer:** active-active **reads** + single **write HQ** (not true dual-write)
- True dual-write: shard by \`tenant.region\` — tenant data never writes in two regions

## Payments in active-active
- **One** settlement ledger region (financial Data HQ)
- Payment webhooks land in primary or use global queue with ordering
- Idempotent charge handling across failover

## Failure modes
- Split brain → financial duplicate risk
- Replication lag → user sees inconsistent state
- Requires automated **fencing** on promote
`,
      },
      {
        path: "data/disaster-recovery/active-passive.dna.md",
        content: `# DR — Active–Passive

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
`,
      },
      {
        path: "data/disaster-recovery/passive-passive-cold.dna.md",
        content: `# DR — Passive / Cold (Backup–Restore)

## Pattern
- Production **active** in HQ region only
- DR region holds: IaC templates, **offline backups**, optional idle networking
- On disaster: provision infra → restore latest backup → repoint DNS

## RPO / RTO
- **RPO:** last backup interval (e.g. 1h WAL + nightly snapshot)
- **RTO:** hours — acceptable for startup tier if documented

## Requirements
- Backup encryption + restore tested (not just "backups exist")
- Runbook in \`DNA/Impressions/devops/rollback-plan.md\`
- Communication template for customers

## When to upgrade
Enterprise RFP requires hot standby → move to active-passive warm minimum.
`,
      },
      {
        path: "data/disaster-recovery/runbook.dna.md",
        content: `# DR — Runbook Template

## 1. Detect
- Region health checks failing
- Error budget burn / paging

## 2. Decide
- Confirm region outage vs app bug
- Invoke incident commander; time-box failover decision

## 3. Failover (active-passive hot)
1. Pause writes (maintenance mode) if split-brain risk
2. Promote replica / restore DB in DR
3. Verify data checkpoint
4. Scale DR app tier
5. Switch GLB/DNS
6. Re-enable webhooks; replay from queue

## 4. Communicate
- Status page; customer email if SLA breach

## 5. Post-incident
- Failback plan when HQ healthy
- Update \`amygdala/repeated-failures.md\`
- Schedule game-day follow-up

\`\`\`bash
dna plan compliance --frameworks iso27001,soc2 --tier corporate --quote "DR test evidence"
\`\`\`
`,
      },
    ],
    ["data", "disaster-recovery", "dr", "bcp"],
  ),
];
