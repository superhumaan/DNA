# Feature Request

_Auto-maintained by DNA. Updated 2026-07-27._

## Latest request

> Create a new section on the website marketplace for **bundles** that show the stem packs, make it easy to install entire bundles, and ensure AI knows too (rules + injection).

## Problem

Purpose Combos exist in CLI (`combo/…`) but are invisible on DNA-Web marketplace. Users must install packs one-by-one. Stem packs / Cursor·Claude rules are not part of combo install, so AI does not automatically learn the bundle workflow.

## Pain

- Marketplace only lists individual knowledge packs
- Combos not in catalog (0 `combo/` entries)
- No one-command / one-click “install this purpose” UX
- Bundle install does not inject stems + always-on rules

## Users

- Developers browsing dna.humaan.app/marketplace
- AI co-pilots (Cursor / Claude) that need stems + rules after install
- Teams adopting DNA for a purpose (PMF, Next.js fullstack, GDPR, etc.)

## Desired Behaviour

1. Marketplace has a **Bundles** section listing Purpose Combos
2. Each bundle shows: purpose, description, knowledge packs (required/preferred), related **stem packs**, install command
3. `dna marketplace install combo/<id>` installs knowledge packs **and** injects linked stem packs + workbench rules so AI knows
4. Catalog/API exposes bundles for CLI + website
5. Copy-paste install is one command; AI prompt optional for agents

## Acceptance criteria

- [ ] DNA-Web `/marketplace` has Bundles section (or tab) with all purpose combos
- [ ] Bundle cards list knowledge packs + stem packs + copyable install cmd
- [ ] Catalog includes combo metadata (or `/marketplace/api/v1/bundles`)
- [ ] CLI install of `combo/*` installs required+preferred packs and injects stems/rules
- [ ] Tests cover combo→pack resolution and stem injection hook
- [ ] Docs/CHANGELOG updated; preview pushed

## Edge cases

- Offline: bundled catalog must include combo metadata
- Unknown stem id: skip with warning, do not fail whole install
- Healthcare country bundles remain separate; show under Bundles if practical
- DNA-Web may lag DNA package sync — sync script must include combos

## Out of scope

- Paid marketplace / auth for install
- Redesigning the full intelligence stem library page
