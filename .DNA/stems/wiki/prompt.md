> **DNA Prompt Stem:** `wiki` — read `.DNA/stems/wiki/` (all files) before proceeding.

# Wiki

Scope: $ARGUMENTS

## Evidence bootstrap (run first)

```bash
npx dna analyze
npx dna scan
```

Load `.DNA/neuralNetwork.json`, relevant `.DNA/behaviour/`, CellularMemory (system-map, decisions, blockers), and this stem's contextLoads. Mark stub Impressions as STUB — do not cite them as truth.

## Preconditions

Find the wiki already in this repository (docs site config, sidebars, existing pages). If none exist and the user did not ask to create one, **stop**. If they asked to create one, reuse the docs tool and visual theme already used elsewhere in the repo — do not invent a new brand.

## Checklist

- [ ] Page lives in the existing sidebar or nav
- [ ] Steps match the product's real screens and labels
- [ ] Theme, type, and layout tokens come from the existing wiki — no new palette
- [ ] Screenshots only via the repo's screenshot script, if it has one
- [ ] No internal hostnames, customer names, or secrets
- [ ] A reader can finish the task without reading source code

## Artifacts

| Artifact | Path |
|----------|------|
| Wiki page | path inside the existing docs tree |
| Outline | `.DNA/plans/wiki.md` when more than one page |

## Failure modes

| Mode | Response |
|------|----------|
| No wiki and user did not ask to start one | Stop |
| Screen label unknown | Mark **assumption** or ask once |
| Engineering-only detail | Move it out of the wiki page |

## Failure modes (must address)

| Mode | Response |
|------|----------|
| Surface missing | Stop; name what is absent; do not scaffold a new product unless asked |
| Ambiguous scope | One clarifying question, then proceed with stated assumptions |
| Secrets required | Never print them; list env var or keychain names only |
| Quality gate FAIL | Fix blockers or report FAIL with paths — do not claim PASS |
