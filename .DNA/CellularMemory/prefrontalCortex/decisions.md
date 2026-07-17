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
