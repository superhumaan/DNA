# Tiered Compliance Overview

DNA bands compliance maturity across **four organisation tiers**. The same framework (e.g. GDPR) has different **depth** at each tier — not different rules, but proportionate implementation.

| Tier | Typical org | Compliance posture |
|------|-------------|-------------------|
| **startup** | 1–25 people | Baselines: encrypt, auth, privacy notice, data inventory |
| **sme** | 25–250 | Policies, access reviews, DPIA template, SOC 2 Type I prep |
| **corporate** | 250–5K | GRC, pen tests, ISO/SOC certification, formal privacy programme |
| **enterprise** | 5K+ / regulated | CISO, continuous monitoring, multi-framework mapping, global programme |

## Commands
```bash
dna compliance list
dna plan compliance --frameworks gdpr,iso27001 --tier sme --quote "B2B SaaS in EU"
dna context compliance
```

## Tier inference
If `--tier` is omitted, DNA infers from `config.dna.json` stage:
- new/mvp → startup
- scaling → sme
- enterprise → enterprise
- legacy_modernisation / audit_remediation → corporate

## Golden rule
**Never claim certification you do not hold.** Implement controls; let auditors attest.
