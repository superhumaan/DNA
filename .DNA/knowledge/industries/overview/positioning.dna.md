# Industry Packs — Overview

DNA industry packs give agencies and product teams **domain fluency** when building for a specific sector.

Each pack includes: overview, influencers, tech stack, latest trends, practices, regulation, agency notes, and UI patterns.

## Sector catalog

| Sector | ID | Description | Activate |
| --- | --- | --- | --- |
| Healthcare | `healthcare` | Clinical systems, patient portals, telehealth, and health data platforms | `dna plan industry healthcare` |
| Fintech & Banking | `fintech` | Payments, banking, lending, wealth, and embedded finance | `dna plan industry fintech` |
| E-commerce & Retail | `ecommerce-retail` | Online stores, marketplaces, omnichannel retail, and D2C brands | `dna plan industry ecommerce-retail` |
| EdTech | `edtech` | Learning platforms, LMS integrations, assessment, and student information systems | `dna plan industry edtech` |
| Government & Public Sector | `gov-public-sector` | Citizen services, procurement portals, and regulated public systems | `dna plan industry gov-public-sector` |
| Travel & Hospitality | `travel-hospitality` | Booking, airlines, hotels, tours, and loyalty platforms | `dna plan industry travel-hospitality` |
| SaaS B2B | `saas-b2b` | Business software, vertical SaaS, and product-led growth tools | `dna plan industry saas-b2b` |
| Logistics & Supply Chain | `logistics-supply-chain` | Freight, warehousing, last-mile delivery, and supply chain visibility | `dna plan industry logistics-supply-chain` |
| Media & Entertainment | `media-entertainment` | Streaming, publishing, gaming platforms, and content rights | `dna plan industry media-entertainment` |
| Real Estate & PropTech | `real-estate-proptech` | Property listings, transactions, property management, and construction tech | `dna plan industry real-estate-proptech` |
| Energy & Utilities | `energy-utilities` | Power, water, oil & gas, renewables, and smart grid platforms | `dna plan industry energy-utilities` |
| Legal Tech | `legal-tech` | Practice management, e-discovery, contract lifecycle, and legal research | `dna plan industry legal-tech` |
| Cybersecurity | `cybersecurity` | Security products, SOC tooling, identity, and vuln management | `dna plan industry cybersecurity` |
| Climate Tech | `climate-tech` | Carbon, energy transition, ESG measurement, and climate risk software | `dna plan industry climate-tech` |
| AgriTech | `agritech` | Farm ops, precision agriculture, supply chain for food producers | `dna plan industry agritech` |
| Aerospace & Defense | `aerospace-defense` | Avionics-adjacent software, defense digital, dual-use platforms | `dna plan industry aerospace-defense` |
| Automotive & Mobility | `automotive-mobility` | Connected vehicles, EV charging, fleet, and mobility marketplaces | `dna plan industry automotive-mobility` |
| Telecom & Connectivity | `telecom` | BSS/OSS adjacent apps, MVNO, network automation portals | `dna plan industry telecom` |
| Crypto & Web3 | `crypto-web3` | Wallets, exchanges, on-chain apps, and custody platforms | `dna plan industry crypto-web3` |
| HR Tech | `hr-tech` | HRIS, payroll-adjacent, recruiting, and people analytics | `dna plan industry hr-tech` |
| MarTech & AdTech | `martech` | CDPs, campaign tools, attribution, and ad platforms | `dna plan industry martech` |
| Biotech & Life Sciences | `biotech` | Lab software, clinical trial ops, and research platforms | `dna plan industry biotech` |
| Construction Tech | `construction-tech` | Jobsite software, BIM-adjacent collaboration, and contractor ops | `dna plan industry construction-tech` |
| Sports & Fitness Tech | `sports-fitness` | Training, fan engagement, wearables, and club ops software | `dna plan industry sports-fitness` |
| Developer Tools | `developer-tools` | Devtools, CI platforms, observability products, and API platforms | `dna plan industry developer-tools` |
| Marketplace Platforms | `marketplace-platforms` | Multi-sided marketplaces and platform businesses | `dna plan industry marketplace-platforms` |
| Nonprofit & Civic Tech | `nonprofit-civic` | Mission-driven software, civic services, and donor platforms | `dna plan industry nonprofit-civic` |
| Gaming | `gaming` | Games, liveops, and player platforms | `dna plan industry gaming` |
| Manufacturing Software | `manufacturing-software` | MES-adjacent, factory ops, and industrial SaaS | `dna plan industry manufacturing-software` |
| InsurTech | `insurtech` | Insurance products, claims, and underwriting software | `dna plan industry insurtech` |

## How to use

1. Set active industry: `dna plan industry <id>`
2. Load context for AI: `dna context industry`
3. Pair with delivery archetype: `dna delivery set --archetype agency`
4. Install linked compliance/legal packs from each sector's `regulation.dna.md`

## Config

```json
{
  "industry": {
    "active": "healthcare",
    "secondary": ["saas-b2b"],
    "clientName": "Acme Health"
  }
}
```

Run `dna doctor` to verify industry pack is installed when `industry.active` is set.
