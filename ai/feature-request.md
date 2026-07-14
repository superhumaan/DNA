# Feature Request

_Auto-maintained by DNA. Updated 2026-07-14T06:21:00.000Z._

## Latest request

> Fix DNA Lab pairing so paste works when `pairing/init` never reaches production (302 / edge login). User approved: do the fixes.

## Problem

`dna register lab` generates a valid Pairing ID + 148-digit code locally, but `POST /api/dna/labs/pairing/init` never reaches DNA Lab on hosts behind a gateway. Verify then returns "Pairing not found" even though the user correctly pastes the CLI output.

## Desired Behaviour

1. Browser paste of Pairing ID + code verifies without a prior successful `pairing/init`
2. CLI still attempts init (for callback / `--wait`) but does not require it for Lab account creation
3. Honest messaging when init fails — paste still works

## Status

Implementing (user approved).
