# Lab depth pass — visual + data pages

Aligns `/labs` with [dna.humaan.app](https://dna.humaan.app) and fills Delivery / Quality pages with real data.

## Visual

- Fonts: **DM Sans** (UI) + **Syne** (titles)
- Dark mint tokens (`#07080c` / `#4ade9a`)
- **16px** gap under page header bars
- Shimmer skeletons on first dashboard load

## Visit probes (not live monitoring)

`GET /api/dna/labs/probe` — one-shot Lab self-route checks; TTL default **5 hours** (`lab.probeTtlHours`).

## New / deepened APIs

| Endpoint | Purpose |
|----------|---------|
| `/coverage` | Full coverage detail (files, packages, distribution) |
| `/apis` | Mini OpenAPI explorer + live/probe traffic |
| `/releases` | GitHub Releases + Lab store |
| `/probe` | Visit-gated probes |
| `/intelligence` | Impressions / CellularMemory inventory |

## Source maps

Scanned and registered on `dna lab install` / `ensureLabAssets` and full `dna doctor`.

## Releases

Pulled from GitHub when `github.owner` / `repo` are configured (`gh api`).
