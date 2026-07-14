# Feature Request

_Auto-maintained by DNA. Updated 2026-07-14T05:50:00.000Z._

## Latest request

> clean everything up, update documents and push to NPM and github

## Problem

Local DNA tree had unreleased Lab CI billing + cleanup work, junk (`actionlint` binary, accidental `packages/dna-cli/` scaffolds), and host apps that ran `npx …@0.6.7` without restarting the API still saw old Lab UI.

## Desired Behaviour

1. Ship billing blocker + cleanup as **v0.6.8** with docs
2. Document install vs API restart clearly
3. Remove junk; push GitHub + publish npm
4. Point Humaan at the new package and restart API

## Status

Shipping v0.6.8.
