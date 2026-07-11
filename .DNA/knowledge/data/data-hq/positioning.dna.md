# Data HQ — What & Why

**Data HQ** (data headquarters) is the **primary jurisdiction and region** where your system's **authoritative data** lives — the place you designate as source of truth for audits, DPAs, and architecture decisions.

## What Data HQ is
| Dimension | Example decision |
|-----------|------------------|
| **Cloud region** | `eu-west-2` (London) primary Postgres |
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
- **Disaster recovery:** DR site relationship to HQ (see `data/disaster-recovery`)

## How to establish Data HQ

1. **Name it** in `DNA/Impressions/architecture/data-hq.md`:
   - Primary region, cloud account ID, database identifiers
   - What categories of data (PII, PHI, payments metadata, logs)
2. **Run** `dna plan compliance` before expanding to new regions
3. **Subprocessors** list must match regions (Stripe, email, analytics)
4. **Single writer** default — one primary DB; replicas read-only unless active-active is justified
5. **New region** = change request: legal review + `data/geo-replication` design

## Anti-patterns
- "Multi-region" without documented HQ — auditors cannot find source of truth
- US-East default with EU customers and no SCCs/TIAs
- Analytics tools copying raw PII to US by default (Mixpanel/GA configs)
