# Payments — PCI Scope

## SAQ A (preferred)
Card data goes browser → processor. Your server only handles **tokens** and **payment intent IDs**.

## Never store
- PAN (full card number), CVV/CVC, magnetic stripe, PIN

## Always
- Webhook signatures verified (Stripe `constructEvent`, Adyen HMAC)
- Idempotent webhook handlers (store event ID)
- Secrets in vault — `STRIPE_SECRET_KEY`, `WEBHOOK_SECRET`
- Subprocessor DPA + list in privacy policy

See `compliance/frameworks/pci_dss.dna.md`.
