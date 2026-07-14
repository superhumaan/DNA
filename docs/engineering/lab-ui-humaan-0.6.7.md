# DNA Lab UI — Humaan admin parity (v0.6.7)

Release notes for Lab `/labs` UI alignment with Humaan Operations admin patterns.

**npm:** `@superhumaan/dna-by-humaan@0.6.7`  
**Related:** [v0.6.4 Lab + runtime](./lab-and-runtime-0.6.4.md) · [v0.6.3 Lab + ARL](./lab-and-repair-0.6.3.md)

---

## What changed

### Brand & chrome

- Sidebar / auth mark: **DNA helix icon only** (no “by Humaan”, no “Lab” tag)
- Removed env pill (`development` / `production`) and “Updated just now” from the page header
- Base font size: **16px**

### Humaan admin controls

- **Primary buttons** — 48px pill CTAs (`border-radius: 999px`, brand `#5b21b6`) matching `HumaanPagePrimaryButton`
- **Tabs** — large filled brand pills (ProductStyleTabBar-style) instead of small Soli chips
- **Refresh** uses the Humaan primary pill in the title bar

### List pages

Every data-table page uses:

1. **Search** (client-side filter)
2. **Tabs / filters** below search (where applicable)
3. **Table always rendered** (`thead` + `tbody`); empty message lives in a table row — never replaces the table

Applies to: Issues, Events, Performance, Releases, Quality (Reports / CI / APIs tabs).

### Sidebar accordion

- **Monitor** and **Delivery** groups collapse
- **One group open at a time**
- Navigating to a page opens that page’s group

---

## Files

| Area | Path |
|------|------|
| Lab client UI | `packages/dna-core/src/lab/ui/dashboard.ts` |
| Lab CSS | `packages/dna-core/src/lab/ui/styles.ts` |

---

## Verify

```bash
npm install @superhumaan/dna-by-humaan@0.6.7   # or latest
# Restart the API that serves /labs, then:
npx @superhumaan/dna-by-humaan lab serve
# or open your app's http://localhost:<vite>/labs after API restart
```

Check: icon-only logo, no env/updated meta, pill Refresh, Issues search → severity pills → table headers when empty, sidebar accordion.

**Note:** `npx @superhumaan/dna-by-humaan@x.y.z` alone does not upgrade Lab in a running host app — install into `node_modules` and **restart the API**. See [lab-ci-billing-blocker — Upgrade](./lab-ci-billing-blocker.md#upgrade-lab-in-a-host-app).
