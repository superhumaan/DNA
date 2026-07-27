# Feature Request

_Auto-maintained by DNA. Updated 2026-07-27._

## Latest request

> in labs, for the apis, we should add every single api we have, then a description of what it does, then it's usage, received, sent  
> **Approved: implement.** Continue: ship with open Lab auth fix + OWASP audit clean.

## Problem

Lab **APIs** tab was a thin contract list. Also PR #28 OWASP gate failed (postcss / brace-expansion).

## Desired behaviour

1. Every Lab HTTP API with Description, Usage, Received, Sent.
2. Ship with `requireAuthInProduction: false` open-auth fix.
3. Clean high+ audit for CI.

## Acceptance criteria

- [x] Catalog includes all Lab routes
- [x] Expandable Description / Usage / Received / Sent
- [x] Unit tests
- [ ] CI green (OWASP) + npm publish
