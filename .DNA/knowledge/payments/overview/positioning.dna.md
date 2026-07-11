# Payments — Overview

## Golden rule
**Never let card data touch your servers** unless you are prepared for full PCI DSS scope. Use processor-hosted fields (Stripe Elements, Adyen Drop-in) → **SAQ A**.

## Decision matrix
| Need | Typical choice |
|------|----------------|
| Global SaaS subscription | Stripe, Paddle, Lemon Squeezy |
| Enterprise + many payment methods | Adyen, Checkout.com |
| EU direct debit / SEPA | GoCardless, Mollie |
| India | Razorpay |
| In-person + online | Square |
| Marketplace / split payouts | Stripe Connect, Adyen for Platforms |
| Mobile wallets only layer | Apple Pay / Google Pay via Stripe or Adyen |

## DNA workflow
```bash
dna plan compliance --frameworks pci_dss,gdpr --tier sme --quote "B2B SaaS billing EU+US"
dna marketplace install payments/stripe
```

Document processor + **Data HQ region** in Impressions (`data/data-hq`). Pair with `data/disaster-recovery` for billing uptime.
