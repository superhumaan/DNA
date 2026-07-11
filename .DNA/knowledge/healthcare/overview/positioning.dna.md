# Healthcare Technology Overview

# Healthcare Tech — Overview (Country Router)

DNA default for clinical and health-adjacent products: **FHIR-first**, compliance-aware, integration-platform aware.

## Install your country stem pack

Always pair this router with **one** country overview (`healthcare/overview-{iso}`):

| Region | Pack | Regulation highlight |
|--------|------|----------------------|
| United States | `healthcare/overview-us` | HIPAA, CMS interoperability |
| United Kingdom | `healthcare/overview-uk` | UK GDPR, NHS DSPT, UK Core |
| Canada | `healthcare/overview-ca` | PIPEDA, provincial health laws |
| Australia | `healthcare/overview-au` | Privacy Act, My Health Record |
| European Union | `healthcare/overview-eu` | GDPR, EU MDR, EHDS |
| Germany | `healthcare/overview-de` | Gematik, DiGA, ePA |
| France | `healthcare/overview-fr` | HDS hosting, DMP |
| Japan | `healthcare/overview-jp` | APPI, FHIR JP Core |
| India | `healthcare/overview-in` | ABDM, DPDP |
| Brazil | `healthcare/overview-br` | LGPD, RNDS |
| Singapore | `healthcare/overview-sg` | PDPA, NEHR |
| Saudi Arabia | `healthcare/overview-sa` | PDPL, NPHIES |
| UAE | `healthcare/overview-ae` | Malaffi, NABIDH |
| + 26 more | `healthcare/overview-*` | See marketplace catalog |

```bash
dna marketplace install healthcare/overview
dna marketplace install healthcare/overview-us   # example
dna marketplace install healthcare/fhir-r4
```

## Universal stack recommendation
- API: FastAPI/NestJS/Next route handlers with strict auth
- Clinical data: FHIR R4 server (Medplum, HAPI, Firely) or EHR integration via Redox/Health Gorilla
- Never build custom clinical record storage without compliance sign-off

## Integration strategy tiers
1. **Direct EHR FHIR** (Epic, Cerner, NHS) — app approval, sandbox, production keys
2. **Health data networks** (Redox, Zus, Health Gorilla, Particle) — faster time-to-market
3. **Standards-only** (HL7 v2, X12) — legacy hospital interfaces

## HIPAA baseline (all healthcare packs)
- BAA with every vendor touching PHI
- Minimum necessary — field-level scoping in APIs
- Never log PHI, prompts, or raw clinical documents
- Encrypt ePHI in transit (TLS 1.2+) and at rest
- Audit every PHI access; run `dna plan compliance --frameworks hipaa`