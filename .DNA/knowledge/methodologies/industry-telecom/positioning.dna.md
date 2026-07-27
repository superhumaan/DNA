# Telecom Delivery

Industry overlay for **telecom BSS/OSS adjacent products**. Pair with a company-size pack (`companies/*`) and a base process (`methodologies/scrum|kanban|shape-up|safe|dna-default`).

## When to load
- Product is regulated or domain-heavy in telecom BSS/OSS adjacent products
- Agency engagements where `industry.active` = telecom
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-telecom |
| Compliance | install via `dna plan compliance` / legal packs |

## Domain hooks
- Idempotent provisioning, rating, NOC UX
- Pair: industries/telecom

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
