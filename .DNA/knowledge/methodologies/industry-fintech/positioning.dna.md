# Fintech Delivery

Industry overlay for **payments / banking / lending**. Pair with a company-size pack (`companies/*`) and a base process (`methodologies/scrum|kanban|shape-up|safe|dna-default`).

## When to load
- Product is regulated or domain-heavy in payments / banking / lending
- Agency engagements where `industry.active` = fintech
- Roadmaps must reflect domain risk, not generic SaaS velocity

## Pairing
| Layer | Pack |
|-------|------|
| Size | companies/startup … companies/enterprise |
| Process | scrum / kanban / shape-up / safe / dna-default |
| Industry | methodologies/industry-fintech |
| Compliance | install via `dna plan compliance` / legal packs |

## Domain hooks
- Ledger correctness, PCI/AML/KYC gates
- Pair: payments/*, industries/fintech, combo/fintech-open-banking

## Grounding (mandatory)
1. Run DNA CLI analyze/scan before recommending upgrades
2. Read CellularMemory debt/blockers for this domain
3. Impression Guard — stub policies ≠ implemented controls
