# B2B SaaS Delivery

Industry overlay for **multi-tenant B2B products**. Pair with a company-size pack (`companies/*`) and a base process (`methodologies/scrum|kanban|shape-up|safe|dna-default`).

## When to load
- Product is regulated or domain-heavy in multi-tenant B2B products
- Agency engagements where `industry.active` = saas-b2b
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-saas-b2b |
| Compliance | install via `dna plan compliance` / legal packs |

## Domain hooks
- Tenancy, RBAC, billing, enterprise SSO
- Pair: industries/saas-b2b, combo/saas-billing, combo/auth-rbac

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
