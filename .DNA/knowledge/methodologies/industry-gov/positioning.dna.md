# Gov / Public Sector Delivery

Industry overlay for **government digital services**. Pair with a company-size pack (`companies/*`) and a base process (`methodologies/scrum|kanban|shape-up|safe|dna-default`).

## When to load
- Product is regulated or domain-heavy in government digital services
- Agency engagements where `industry.active` = gov
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-gov |
| Compliance | install via `dna plan compliance` / legal packs |

## Domain hooks
- Accessibility, procurement, auditability
- Pair: industries/gov-public-sector, gov/*, compliance/wcag-22

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
