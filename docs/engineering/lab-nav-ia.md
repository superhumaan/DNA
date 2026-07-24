# Lab nav IA expansion

Lab `/labs` sidebar no longer forces a single accordion group open.

## Sections (default: all open)

| Section | Pages |
|---------|--------|
| **Monitor** | Overview · Issues · Events · Performance |
| **Delivery** | Releases · Source maps |
| **Quality** | Reports · Coverage · CI · APIs |
| **Project** | Doctor · Installs |
| **Intelligence** | Impressions · Cellular Memory |

## Behaviour

- Toggle any section without closing others
- Navigating to a page opens that page’s section only
- Legacy `quality` tab id redirects to `reports`

## APIs

| Path | Notes |
|------|--------|
| `GET /api/dna/labs/data` | Poll path — still strips file trees |
| `GET /api/dna/labs/intelligence` | On-demand Impressions + CellularMemory inventory |
| `GET /api/dna/labs/installs` | Install scan (also on bootstrap) |

## Files

- `packages/dna-core/src/lab/ui/dashboard.ts`
- `packages/dna-core/src/lab/collect-intelligence.ts`
- `packages/dna-core/src/lab/server.ts`
