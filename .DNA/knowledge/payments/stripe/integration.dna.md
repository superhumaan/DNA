# Stripe — Integration

## Server (mandatory pattern)
```ts
// Create PaymentIntent or Subscription server-side only
const intent = await stripe.paymentIntents.create({ amount, currency, customer });
// Return client_secret to frontend — never secret key to browser
```

## Webhooks
- `POST /webhooks/stripe` — raw body + `stripe-signature` header
- Handle: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `charge.dispute.created`
- Idempotency: upsert by `event.id`

## Testing
- Test keys `sk_test_` / `pk_test_`; stripe-cli listen for local webhooks
- Clock for subscription time travel in test mode