# GDPR — Engineering & Organisational Controls

## Lawful bases (pick one per purpose)
- Consent (withdrawable)
- Contract
- Legal obligation
- Vital interests
- Public task
- Legitimate interests (document LIA)

## Data subject rights
| Right | Engineering response |
|-------|---------------------|
| Access | Export API or manual JSON export |
| Erasure | Soft-delete + purge job; cascade subprocessors |
| Rectification | Profile edit + audit |
| Portability | Machine-readable export |
| Object / restrict | Flag on account; stop processing |

## Technical measures (Art. 32)
- Pseudonymisation where possible
- Encryption in transit and at rest
- Confidentiality, integrity, availability
- Regular testing of security measures

## Breach notification
- **72 hours** to supervisory authority if risk to rights
- Document: what, when, impact, remediation, DPO decision

## DPIA triggers
- Systematic profiling with legal effect
- Large-scale special category data
- Systematic monitoring of public areas
- New technology with high risk

## Subprocessors
Maintain list in Impressions; DPA with each; customer notification if required by contract.
