# Banking & Financial Services — Legal Engineering

## Typical regulatory touchpoints
- **Licensing** — payment institution, e-money, lending may need licences
- **AML/KYC** — customer due diligence, transaction monitoring, SAR filing
- **Open banking** — PSD2 (EU), UK Open Banking, local equivalents
- **PCI DSS** — card data scope minimisation
- **Consumer credit** — disclosures, affordability, fair lending

## Engineering checklist
- [ ] Card data never touches your servers if avoidable (Stripe Elements, etc.)
- [ ] KYC vendor contracts include AML data processing terms
- [ ] Audit trail for financial transactions (immutable, time-synced)
- [ ] Segregate financial PII from general user profile where possible
- [ ] Geo-fence features unavailable in unlicensed jurisdictions

## Counsel triggers
- Holding customer funds
- Issuing cards or wallets
- Cross-border remittance
- Crypto/fiat on-ramps
