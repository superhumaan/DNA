# Healthcare Delivery

Industry overlay for **clinical / health-tech**. Pair with a company-size pack (`companies/*`) and a base process (`methodologies/scrum|kanban|shape-up|safe|dna-default`).

## When to load
- Product is regulated or domain-heavy in clinical / health-tech
- Agency engagements where `industry.active` = healthcare
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-healthcare |
| Compliance | install via `dna plan compliance` / legal packs |

## Domain hooks
- PHI boundaries, clinical safety, audit logs
- Pair: healthcare/*, compliance/hipaa-depth, combo/healthcare-us

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
