# APAC — Integration Strategy

1. **National platform** — ABDM (IN), SATUSEHAT (ID), NEHR (SG), MHR (AU) — highest leverage
2. **Hospital group EMR** — Epic/Cerner instances, local vendors — per-contract FHIR/HL7 v2
3. **Integration engine** — Mirth, Rhapsody, Redox when many legacy endpoints
4. **Wellness vs clinical** — consumer wearables are not clinical records without regulatory clarity

## PHI engineering
- Encrypt in transit and at rest; audit PHI access
- Never log clinical documents or identifiers in app logs
- Document subprocessors and data residency in Impressions