# PCI DSS

## Scope reduction (preferred)
Use Stripe, Adyen, or similar — **SAQ A** if card data never touches your servers.

## If card data on your systems
- Never store CVV/CVC after authorisation
- Tokenise PAN; encrypt if stored
- Segment cardholder data environment (CDE)
- Quarterly ASV scans; annual assessment per merchant level
