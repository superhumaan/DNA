# Cost & capacity — AWS Overview

## Capacity model
Document expected load for **AWS Overview** (RPS, storage growth, token/spend budgets, connection pools).

## Scaling levers
1. Vertical (size up) vs horizontal (replicas/shards) — pick intentionally
2. Caching / batching before adding hardware
3. Backpressure and load shedding on overload
4. Quotas per tenant when multi-tenant

## Cost controls
- Budgets + alerts on the billable dimension (compute, storage, AI tokens, egress)
- Kill switches / feature flags for expensive paths
- Review top 10 cost drivers monthly

## DNA
Do not invent capacity numbers from stub Impressions — measure staging load tests and production metrics.
