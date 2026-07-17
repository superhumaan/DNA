# Feature Request

_Auto-maintained by DNA. Updated 2026-07-17. The user does not fill this in manually._

## Latest request

> Be consistent and show everything in marketplace and the real number.
> Marketplace currently shows 885 packs while the total displays 910.

## Problem

The public marketplace total and the browsable catalog disagree. DNA-Web
groups packs through a fixed category allowlist that omits methodologies,
most industries, and related categories, so visitors see fewer packs than
the published total. Docs and package claims still say 897 while the
canonical DNA catalog has grown further.

## Current Pain

Operators and visitors cannot trust the marketplace count. Homepage and
marketing copy claim one number; the marketplace browser shows another;
npm/README claims a third. Some packs are invisible in the UI even though
they exist in the catalog.

## Proposed Solution

Treat the canonical DNA bundled catalog length as the single source of
truth. Synchronize that catalog into DNA-Web, render every pack in the
marketplace (no silent category drops), and replace hard-coded totals with
the live deduplicated catalog count everywhere it is shown.

## Users

Marketplace visitors on dna.humaan.app, npm consumers reading package docs,
and maintainers checking catalog parity between DNA and DNA-Web.

## Desired Behaviour

Marketplace browser lists every pack. Displayed total equals unique catalog
IDs. Homepage, marketplace, README, package descriptions, and docs all use
the same real number. No pack category is hidden by an outdated allowlist.

## Edge Cases

Packs matching multiple display categories must still count once in the
total; empty categories; channel filtering; API/catalog asset missing in
serverless deployments; discovery/legal/methodologies/industries packs.

## Success Criteria

- [x] Marketplace unique visible packs == catalog unique pack IDs
- [x] Homepage and marketplace totals use the same live count
- [x] Hard-coded stale counts (897 / mismatched 910 claims) are updated or derived
- [x] DNA-Web catalog is synchronized from DNA’s canonical catalog
- [x] Automated test prevents regressions that hide packs from the browser
- [x] Both repos pass gates and are pushed

---

**Project:** dna-by-humaan
