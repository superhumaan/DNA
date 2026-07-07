import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

function paymentPack(
  id: string,
  name: string,
  description: string,
  positioning: string,
  integration: string,
): KnowledgePack {
  return catalogPack(
    `payments/${id}`,
    name,
    "platforms",
    description,
    [
      { path: `payments/${id}/positioning.dna.md`, content: positioning },
      { path: `payments/${id}/integration.dna.md`, content: integration },
    ],
    ["payments", id],
  );
}

export const PAYMENT_PACKS: KnowledgePack[] = [
  catalogPack(
    "payments/overview",
    "Payments Overview",
    "platforms",
    "Choosing payment processors, PCI scope reduction, and global billing patterns",
    [
      {
        path: "payments/overview/positioning.dna.md",
        content: `# Payments — Overview

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
\`\`\`bash
dna plan compliance --frameworks pci_dss,gdpr --tier sme --quote "B2B SaaS billing EU+US"
dna marketplace install payments/stripe
\`\`\`

Document processor + **Data HQ region** in Impressions (\`data/data-hq\`). Pair with \`data/disaster-recovery\` for billing uptime.
`,
      },
      {
        path: "payments/overview/pci-scope.dna.md",
        content: `# Payments — PCI Scope

## SAQ A (preferred)
Card data goes browser → processor. Your server only handles **tokens** and **payment intent IDs**.

## Never store
- PAN (full card number), CVV/CVC, magnetic stripe, PIN

## Always
- Webhook signatures verified (Stripe \`constructEvent\`, Adyen HMAC)
- Idempotent webhook handlers (store event ID)
- Secrets in vault — \`STRIPE_SECRET_KEY\`, \`WEBHOOK_SECRET\`
- Subprocessor DPA + list in privacy policy

See \`compliance/frameworks/pci_dss.dna.md\`.
`,
      },
    ],
    ["payments", "overview"],
  ),
  paymentPack(
    "stripe",
    "Stripe",
    "Global payments — cards, subscriptions, Connect, Billing, Tax",
    `# Stripe — Positioning

**Default choice** for DNA SaaS projects. Excellent DX, global cards, Billing for subscriptions, Connect for marketplaces.

## Products map
| Product | Use |
|---------|-----|
| Checkout / Payment Element | One-off + saved cards |
| Billing | Subscriptions, trials, proration |
| Customer Portal | Self-serve cancel/upgrade |
| Connect | Marketplace payouts |
| Tax | Stripe Tax when nexus complexity warrants |

## Regions
Stripe account country affects payout currency and some compliance. **Data HQ:** Stripe stores data per their DPA — document in subprocessors list.`,
    `# Stripe — Integration

## Server (mandatory pattern)
\`\`\`ts
// Create PaymentIntent or Subscription server-side only
const intent = await stripe.paymentIntents.create({ amount, currency, customer });
// Return client_secret to frontend — never secret key to browser
\`\`\`

## Webhooks
- \`POST /webhooks/stripe\` — raw body + \`stripe-signature\` header
- Handle: \`checkout.session.completed\`, \`invoice.paid\`, \`customer.subscription.updated\`, \`charge.dispute.created\`
- Idempotency: upsert by \`event.id\`

## Testing
- Test keys \`sk_test_\` / \`pk_test_\`; stripe-cli listen for local webhooks
- Clock for subscription time travel in test mode`,
  ),
  paymentPack(
    "adyen",
    "Adyen",
    "Enterprise omnichannel — global payment methods, platforms, unified commerce",
    `# Adyen — Positioning

Pick when you need **many local payment methods** (iDEAL, Bancontact, UPI, etc.) or unified online+POS.

## When over Stripe
- Enterprise procurement already on Adyen
- Single vendor for web + in-store + platforms
- Complex split settlements (Adyen for Platforms)`,
    `# Adyen — Integration

- Sessions API or Drop-in — client from \`/sessions\` server endpoint
- Webhooks: HMAC verify \`HmacSignature\`
- Balance Platform for marketplaces
- Store \`pspReference\` as idempotency key in your ledger`,
  ),
  paymentPack(
    "paypal-braintree",
    "PayPal & Braintree",
    "PayPal wallet, Pay Later, Braintree card vault (PayPal stack)",
    `# PayPal / Braintree — Positioning

Users expect PayPal button on consumer checkout. Braintree (PayPal) for card vault when already in PayPal ecosystem.

## Notes
- PayPal Commerce Platform for unified integration
- Strong buyer protection — dispute flows differ from Stripe`,
    `# PayPal — Integration

- Orders API v2 or Braintree SDK
- Webhook verification via cert id + transmission signature
- Capture vs authorize — document two-step for physical goods`,
  ),
  paymentPack(
    "paddle",
    "Paddle",
    "Merchant of record — SaaS tax/VAT handled by Paddle",
    `# Paddle — Positioning

**Merchant of Record (MoR)** — Paddle is seller of record; they handle global sales tax/VAT. You sell licenses to Paddle.

## When to use
- Small team cannot manage global tax compliance
- B2C SaaS worldwide

## Trade-off
- Less control than Stripe + own tax engine (Anrok, TaxJar)`,
    `# Paddle — Integration

- Paddle Billing API; overlay checkout or inline
- Webhooks: subscription lifecycle, \`transaction.completed\`
- No PCI scope on your side for card entry (Paddle hosted)`,
  ),
  paymentPack(
    "lemon-squeezy",
    "Lemon Squeezy",
    "MoR for indie SaaS — subscriptions, license keys, simple tax",
    `# Lemon Squeezy — Positioning

MoR like Paddle, popular with indie/micro-SaaS. Fast setup, license keys built-in.

Pair with \`platforms/marketing-website\` for checkout links.`,
    `# Lemon Squeezy — Integration

- API + webhooks for \`subscription_created\`, \`order_created\`
- Store \`custom_data\` for tenant mapping
- Test mode store separate from production`,
  ),
  paymentPack(
    "square",
    "Square",
    "Retail + online — POS, invoices, online checkout",
    `# Square — Positioning

Omnichannel for SMB retail + online. Less common for pure B2B SaaS than Stripe.

## When to use
- Physical locations + online store same catalog`,
    `# Square — Integration

- Square Web Payments SDK — tokenize client, charge server
- Webhooks from Square Developer dashboard
- OAuth for multi-merchant if building apps on Square`,
  ),
  paymentPack(
    "checkout-com",
    "Checkout.com",
    "Enterprise card processing — high volume, local acquirers",
    `# Checkout.com — Positioning

Enterprise alternative to Adyen/Stripe at scale. Strong in MENA and UK/EU enterprise.

## When to use
- Enterprise RFP specifies Checkout.com
- Custom reconciliation with multiple entities`,
    `# Checkout.com — Integration

- Flow API or Frames (hosted fields)
- Webhook \`cko-signature\` HMAC
- Processing channels per merchant entity`,
  ),
  paymentPack(
    "mollie",
    "Mollie",
    "European payments — iDEAL, Bancontact, SEPA, cards",
    `# Mollie — Positioning

EU-focused, developer-friendly. Strong Benelux payment methods.

## When to use
- Primary customers in NL/BE/DE
- SEPA direct debit via Mollie`,
    `# Mollie — Integration

- Mollie API create payment → redirect or embedded
- Webhooks: idempotent on \`id\`
- Profiles per website in Mollie dashboard`,
  ),
  paymentPack(
    "gocardless",
    "GoCardless",
    "Bank debits — Bacs, SEPA Direct Debit, ACH",
    `# GoCardless — Positioning

**Recurring bank debits**, not cards. B2B subscriptions where customers prefer invoice/DD.

## When to use
- UK Bacs / EU SEPA mandate subscriptions
- Lower fees than cards for high-value B2B`,
    `# GoCardless — Integration

- Billing Requests + Mandates API
- Webhooks: \`payments.confirmed\`, \`mandates.active\`
- Mandate reference stored per customer — required for retries`,
  ),
  paymentPack(
    "razorpay",
    "Razorpay",
    "India payments — UPI, cards, netbanking, subscriptions",
    `# Razorpay — Positioning

Default for India market. RBI compliance handled via Razorpay licensing.

## Data HQ
Indian customer data residency rules — confirm Razorpay data handling and your entity structure.`,
    `# Razorpay — Integration

- Orders API + Checkout
- Webhook signature \`X-Razorpay-Signature\`
- Subscriptions API for recurring; UPI autopay mandates`,
  ),
  paymentPack(
    "apple-google-pay",
    "Apple Pay & Google Pay",
    "Wallet payments via Stripe, Adyen, or native platform APIs",
    `# Apple Pay & Google Pay — Positioning

Wallets reduce friction — card tokenised by device, not your form.

## Implementation
- **Web:** Payment Request API or Stripe Payment Element with wallets enabled
- **iOS:** PassKit + Stripe/Adyen native SDK
- **Android:** Google Pay API + processor tokenization

Domain verification required for Apple Pay on web.`,
    `# Wallets — Integration Checklist

- [ ] Apple Pay: \`apple-developer-merchantid-domain-association\` on HTTPS
- [ ] Google Pay: merchant ID in Google Pay Business Console
- [ ] Never log wallet tokens — treat as single-use payment credentials
- [ ] Test on real devices — simulators incomplete for biometrics`,
  ),
];
