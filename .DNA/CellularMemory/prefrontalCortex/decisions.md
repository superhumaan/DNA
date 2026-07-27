# Decisions

## 2026-07-11: DNA Initialisation

- Accepted DNA recommendation: yes
- Compliance: none
- AI tools: cursor, claude_code

## 2026-07-17: Production health and evidence

- Preserve zero-config file state for local/single-instance Lab use.
- Require an explicit healthy shared adapter before allowing multiple Lab instances.
- Enforce 80% on a documented product-critical coverage scope; report broader
  inventory separately so generated catalogs do not distort safety evidence.
- CI must be strict only after every required gate passes on a clean runner.
- Publish one sanitized, versioned health schema to GitHub, npm documentation,
  and DNA-Web; never expose raw paths, runtime events, or secrets.
- Use `/health` as the canonical public route and redirect `/Health` for compatibility.

## 2026-07-24: Knowledge packs zero-stubs + strategy grounding (APPROVED)

- Marketplace knowledge packs must reach **0% stubs**; richness bar includes
  docs + `assets/` (diagrams, images, documents, templates, fixtures, references).
- Purpose **Combos** install linked packs for one purpose (required / preferred /
  recommended); healthcare country bundles are the precedent.
- Strategy stems **must** run DNA CLI → CellularMemory → Impression Guard before
  any product strategy text; stub Impressions = EMPTY.
- Strategy stems emit `diagnosis.md`, `competitor_map.md`, `upgrades.md` then
  `STRATEGY_COMPLETE` → Feature Factory; **no application code mutation** in the
  strategy stem.
- Canvas `knowledge-pack-advancement.canvas.tsx` is the review source of truth
  for per-pack advancement columns.
