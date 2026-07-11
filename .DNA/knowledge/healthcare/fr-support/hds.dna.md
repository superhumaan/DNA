# France — HDS Hosting (Hébergeur de Données de Santé)

Health data **must** be hosted with an **HDS-certified** provider when processing French health data at scale.

## Requirements
- Contract only HDS-certified IaaS/PaaS/SaaS for production PHI
- Document certification scope (IaaS vs PaaS) in Impressions subprocessors
- Segregate health workloads from non-health tenants
- Encryption at rest + transit; access logging

## Common certified options
- OVHcloud Health, Azure France (verify HDS scope), Scaleway, Claranet
- Do not assume generic EU region = HDS — verify certificate

## Engineering rules
- Never log PHI or clinical documents
- Field-level minimum necessary in APIs
- Audit all PHI access; document subprocessors in Impressions