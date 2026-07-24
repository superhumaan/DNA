# DNA Lab — analytics Overview + Sentry-density Issues (v0.6.14)

Release notes for Lab `/labs` operator investigation depth.

**npm:** `@superhumaan/dna-by-humaan@0.6.14`  
**Related:** [v0.6.7 Humaan parity](./lab-ui-humaan-0.6.7.md) · [v0.6.4 Lab + runtime](./lab-and-runtime-0.6.4.md) · [v0.6.13 health](../delivery/current-version-scope.md)

---

## What changed

### Overview — analytics command center

Opening **Monitor → Overview** answers “is the system healthy?” without hopping tabs:

| Zone | Content |
|------|---------|
| KPI strip | Unresolved issues, errors 24h, error rate, slow requests, memory spikes, third-party, coverage, CI/quality |
| Health batteries | Doctor, error health, coverage, quality gate, CI success (ok / warn / bad fill meters) |
| Charts | Event volume (traffic + errors), issue severity mix, quality score trend, slow-endpoint latency |
| Tables | Top issues, slow endpoints, recent CI, recent events — with deep-links into Monitor/Delivery |

### Issues list — dense investigation rows

| Column | Content |
|--------|---------|
| Issue | Severity · category · title · short ID (`DNA-xxxx`) · culprit |
| Last seen | Relative time |
| Age | First → last duration |
| Trend | 24h sparkline from related events |
| Events | Count |
| Users | Distinct user ids when envelopes include `user` / `contexts.user` |

Severity filter pills and search still apply (title, short ID, culprit, fingerprint, …).

### Issue detail — Sentry-class panels

1. Breadcrumb + title + summary + culprit  
2. Hero: Events · Users · First · Last · 24h trend  
3. Events volume chart (per-issue)  
4. Highlights (derived from stack, tags, endpoint, env/release)  
5. Stack Trace (in-app frames emphasized)  
6. Breadcrumbs (capped)  
7. Trace spans (when `spans` present; otherwise empty state)  
8. Tags (searchable key/value table)  
9. Contexts · Packages · Additional Data JSON · Request  
10. Related events  
11. Sidebar: short ID, fingerprint, env, release, suggested fix  

Full envelopes (frames, breadcrumbs, contexts) load via `GET /api/dna/labs/issues/:id/events` so the poll path stays slim.

### Aggregates

`LabIssueSummary` now includes `shortId`, `userCount`, `ageMs`, `trend24h`, `culprit`, and `topTags` (see `packages/dna-core/src/lab/collect-aggregates.ts`).

---

## Files

| Area | Path |
|------|------|
| Aggregates | `packages/dna-core/src/lab/collect-aggregates.ts` |
| Overview metrics helpers | `packages/dna-core/src/lab/overview-metrics.ts` |
| Lab client UI | `packages/dna-core/src/lab/ui/dashboard.ts` |
| Lab CSS | `packages/dna-core/src/lab/ui/styles.ts` |

---

## Upgrade

```bash
npm install @superhumaan/dna-by-humaan@0.6.14   # or latest
# Restart the API that serves /labs, then:
npx @superhumaan/dna-by-humaan lab serve
# or hard-refresh your app's /labs after API restart
```

**Note:** Installing a new version does **not** refresh Lab until the **API process is restarted**. See [lab-ci-billing-blocker — Upgrade](./lab-ci-billing-blocker.md#upgrade-lab-in-a-host-app).

### Verify

- Overview: ≥6 KPIs, batteries, charts, cross-domain tables  
- Issues: sparklines + short IDs on list rows  
- Issue click: hero + Highlights + Stack + Tags + Additional Data (empty states when data missing)  

Honest empties — Lab does not invent users, packages, or spans when the runtime did not send them.
