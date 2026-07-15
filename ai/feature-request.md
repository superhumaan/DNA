# Feature Request

_Auto-maintained by DNA. Updated 2026-07-15. The user does not fill this in manually._

## Latest request

> Fix npm ERESOLVE when installing `@superhumaan/dna-by-humaan` into Express 5 apps — widen optional peer `express` to `^4.18.0 || ^5.0.0`.

## Problem

Host apps on Express 5 cannot install DNA with default npm peer resolution.

## Current Pain

AIStudio and Express 5 stacks hit ERESOLVE; must use `--legacy-peer-deps`.

## Proposed Solution

Widen Express peerDependencies on dna-cli + dna-runtime (same pattern as Fastify). Publish 0.6.12.

## Users

Developers installing DNA into Express 5 Node apps.

## Desired Behaviour

- `npm i @superhumaan/dna-by-humaan` succeeds alongside `express@^5` without flags
- Express 4 hosts remain valid

## Edge Cases

- Optional peer when no express installed
- npm / pnpm / yarn peer resolution

## Success Criteria

- [x] peerDependencies accept Express 4 and 5
- [ ] Published to npm
- [ ] Install works with express 5

---

**Project:** dna-by-humaan
