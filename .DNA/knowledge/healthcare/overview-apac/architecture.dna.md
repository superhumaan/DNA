# Healthcare Overview — Asia-Pacific — Architecture

## When to use
# Healthcare Technology — Asia-Pacific (Regional)

Regional stem pack for **Asia-Pacific and Oceania**. Install before or with a country pack (`healthcare/overview-au`, `healthcare/overview-sg`, etc.).

## Regional themes
- **FHIR R4** adoption accelerating — AU Base, JP Core, KR Core, SATUSEHAT (ID), NEHR (SG)
- **Data residency** — most markets require in-region hosting (ap-southeast-*, ap-northeast-*, ap-south-1)
- **National health IDs** — ABHA (IN), NHI (NZ), MyNumber linkage (JP), SingPass (SG)
- **Public + private mix** — rarely single national EHR; integrate per programme or hospital group
- **English clinical models** — AU, NZ, SG, IN, PH use ICD-10-AM or ICD-10 variants; SNOMED CT national editions

## Country packs (install one+)
| Market | Pack |
|--------|------|
| Australia | `healthcare/overview-au` |
| New Zealand | `healthcare/overview-nz` |
| Canada *(Americas)* | `healthcare/overview-ca` |
| Japan | `healthcare/overview-jp` |
| South Korea | `healthcare/overview-kr` |
| Singapore | `healthcare/overview-sg` |
| India | `healthcare/overview-in` |
| Indonesia | `healthcare/overview-id` |
| Thailand | `healthcare/overview-th` |
| Vietnam | `healthcare/overview-vn` |
| Philippines | `healthcare/overview-ph` |
| Malaysia | `healthcare/overview-my` |
| Hong Kong | `healthcare/overview-hk` |
| Taiwan | `healthcare/overview-tw` |
| China | `healthcare/overview-cn` |
| Bangladesh | `healthcare/overview-bd` |
| Pakistan | `healthcare/overview-pk` |
| Sri Lanka | `healthcare/overview-lk` |
| Nepal | `healthcare/overview-np` |
| Cambodia | `healthcare/overview-kh` |
| Myanmar | `healthcare/overview-mm` |

```bash
dna marketplace install healthcare/overview-apac
dna marketplace install healthcare/overview-au   # example
```

## System boundaries
- Document integration points in Impressions: `architecture/system-boundaries.md`
- List data categories processed (PII, payments, PHI) and subprocessors
- Define failure modes: vendor outage, rate limits, webhook delays

## DNA alignment
- Pair with `disciplines/security` and `compliance/tiered-standards`
- Run `dna plan compliance` when regulated data is involved
