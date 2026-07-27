# Banking — AML/KYC Engineering

## Programme elements
- Customer identification and verification (KYC)
- Sanctions screening (OFAC, EU, UN lists)
- Transaction monitoring and suspicious activity reports
- Record retention (typically 5–7 years)

## Vendor integration
- Onfido, Jumio, Plaid Identity Verification — ensure DPAs and audit rights
- Never store raw identity documents longer than necessary

## Engineering checklist
- [ ] KYC status gate before financial features
- [ ] Immutable audit log for compliance reviews
- [ ] Geo-block sanctioned jurisdictions at API layer
