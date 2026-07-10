# Sponsors

DNA is **MIT licensed** and free for everyone. [GitHub Sponsors](https://github.com/sponsors/superhumaan) funds open-source maintenance — hosting, security updates, marketplace catalog, and community support.

Commercial implementation help is separate: [Commercial services](./commercial-services.md).

---

## Baseline benefit (every sponsor)

Every sponsor — at any tier — appears in the **public sponsor ledger**:

| Surface | Location |
|---------|----------|
| **Website** | [dna.humaan.app/sponsors](https://dna.humaan.app/sponsors) |
| **Repository** | [README sponsors section](https://github.com/superhumaan/DNA#sponsors) |
| **npm package** | `dna credits` and `npm fund @superhumaan/dna-by-humaan` after install |
| **Bundled docs** | `CREDITS.md` and `SPONSORS.md` in `@superhumaan/dna-by-humaan` |

Company-tier sponsors with a logo also rotate on the **homepage spotlight** each calendar month.

---

## Tiers

| Tier | $/mo | Extra benefits |
|------|------|----------------|
| **Supporter** | $5 | GitHub Sponsor badge |
| **Developer** | $25 | Linked name in README ledger, sponsor release updates |
| **Team** | $100 | Team name + link, priority triage, quarterly roadmap update |
| **Company** | $500 | Homepage logo rotation, featured README, security line, pack input, quarterly call |

Full tier copy lives in [`sponsors.json`](../../sponsors.json) at the repository root.

---

## Monthly goal

**$500/month** — keeps dna.humaan.app online, maintains the marketplace catalog, funds security updates, and supports community issue triage.

---

## Maintainer workflow

Canonical data: [`sponsors.json`](../../sponsors.json)

```bash
# Edit sponsors.json, then sync all surfaces
pnpm sponsors:sync
```

The sync script updates:

- `README.md` sponsor ledger (root + `packages/dna-cli`)
- `packages/dna-cli/package.json` → `funding` + `contributors`
- `packages/dna-cli/SPONSORS.md` and `CREDITS.md`
- `packages/dna-cli/assets/sponsors.json` (bundled for `dna credits`)
- `DNA-Web/apps/web/src/data/sponsors.json` (when `DNA - Web` is alongside the monorepo)

`scripts/publish-npm.sh` runs `sponsors:sync` before publish.

### Adding a sponsor

```json
{
  "name": "Acme Corp",
  "url": "https://acme.com",
  "tier": "company",
  "logoUrl": "/sponsors/logos/acme.svg",
  "since": "2026-07"
}
```

Place logo files in DNA-Web `apps/web/public/sponsors/logos/`.

---

## Related

- [Commercial services](./commercial-services.md)
- [Open-source model](./open-source-model.md)
