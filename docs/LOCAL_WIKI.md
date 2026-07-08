# Wiki (local Docusaurus)

DNA has **one** wiki: a local Docusaurus site under `.local-wiki/`. `docs/` in this repo is the source of truth.

## Commands

```bash
pnpm run wiki:init      # once — scaffolds .local-wiki
pnpm run wiki:refresh   # kill server → sync → restart in background (preferred)
pnpm run wiki:sync      # copy docs/ only (no restart)
pnpm run wiki:kill      # stop dev server on port 3000
pnpm run wiki:build     # production build
```

**URL:** http://localhost:3000/docs/  
**Log:** `.local-wiki/.wiki-dev.log`

After editing `docs/`, run **`pnpm run wiki:refresh`**.

## Structure

| Section | Contents |
|---------|----------|
| Business | Strategy, audience, open-source model |
| Product | Concept, features, marketplace, compliance, platform catalog |
| Design | Naming, Impressions structure, documentation standards |
| Delivery | Feature factory, IVF, daily workflow, version scope |
| Engineering | Architecture, CLI, runtime, integrations, SRS |
| Quality Assurance | Testing, doctor, quality reports |

Index: [docs/README.md](./README.md)
