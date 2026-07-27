# Architecture

Client → Checkout Session → Stripe → webhook → fulfill  
Idempotency keys on money moves. Store `stripeCustomerId` / subscription status locally.
