# Tiered Compliance (ISO, GDPR, HIPAA, SOC 2)

DNA coordinates **proportionate** compliance implementation across four organisation tiers. The same regulation applies to everyone — but a startup implements **baselines** while an enterprise runs a **certified GRC programme**.

## Organisation tiers

| Tier | Size | Posture |
|------|------|---------|
| **startup** | 1–25 | TLS, secrets hygiene, auth/MFA, privacy notice, data inventory |
| **sme** | 25–250 | Policies, access reviews, DPIA template, SOC 2 Type I prep |
| **corporate** | 250–5K | GRC, pen tests, ISO/SOC certification, formal privacy office |
| **enterprise** | 5K+ / regulated | CISO, continuous monitoring, multi-framework mapping |

### Tier inference

If you omit `--tier`, DNA infers from `config.dna.json` **stage**:

| Stage | Tier |
|-------|------|
| `new`, `mvp` | startup |
| `scaling` | sme |
| `enterprise` | enterprise |
| `legacy_modernisation`, `audit_remediation` | corporate |

## Frameworks supported

| ID | Framework |
|----|-----------|
| `gdpr` | EU GDPR |
| `uk_gdpr` | UK GDPR |
| `hipaa` | US HIPAA (PHI) |
| `iso27001` | ISO/IEC 27001 ISMS |
| `soc2` | SOC 2 Type I/II |
| `pci_dss` | PCI DSS (prefer SAQ A via Stripe) |

## Commands

```bash
# Browse tiers and frameworks
dna compliance list
dna compliance tiers

# Generate implementation plan + control matrix
dna plan compliance \
  --frameworks gdpr,iso27001 \
  --tier sme \
  --quote "B2B SaaS selling to EU mid-market"

dna plan compliance --framework hipaa --tier startup --quote "Avoid PHI unless necessary"

# Load knowledge for AI
dna context compliance
dna context compliance --tier corporate --frameworks gdpr,hipaa,soc2
```

## Outputs

| File | Purpose |
|------|---------|
| `.DNA/plans/compliance-<frameworks>-<tier>.md` | Full AI implementation brief |
| `.DNA/CellularMemory/prefrontalCortex/compliance-control-matrix.md` | Control × status × evidence |

## Knowledge pack

Auto-installs `compliance/tiered-standards` with:

- Per-tier guides (`startup` → `enterprise`)
- Framework engineering docs (GDPR, HIPAA, ISO, SOC 2, PCI)
- Control domain matrix
- **GDPR document pack** — 85+ scrubbed UK GDPR templates with `[Company Name]` / `[Product Name]` placeholders

### GDPR document pack

```bash
dna compliance documents              # Required UK GDPR document types
dna compliance documents --tier sme   # Filter by org tier
dna compliance install-examples     # Install templates into .DNA/knowledge/
```

Re-ingest from updated source `.docx` files:

```bash
export DNA_GDPR_SOURCE_DOCS=~/Downloads/GDPR\ Documents
pnpm gdpr:ingest
node scripts/scrub-gdpr-branding.mjs
```

```bash
dna marketplace install compliance/tiered-standards
```

## Cross-cutting control domains

Every framework builds on these domains (depth varies by tier):

1. Governance & policies  
2. Identity & access  
3. Data protection  
4. Application security  
5. Logging & monitoring  
6. Vendor & subprocessors  
7. Incident response  
8. Privacy rights & consent  
9. Availability & DR  
10. AI & automated processing  

## Typical workflow with AI

1. Set compliance in `dna init` (or `config.dna.json`)
2. `dna plan compliance --frameworks <ids> --quote "..."`  
3. `dna context compliance` → paste into Cursor/Claude  
4. AI implements controls; updates matrix with evidence  
5. Pair with `dna plan rbac` when access control is involved  
6. `dna validate` before release  

## Golden rules

- **Do not claim certification** you have not achieved (ISO, SOC 2, HIPAA “compliance” without assessment).
- **Prefer scope reduction** — Stripe for PCI; avoid PHI unless the product requires it.
- **No regulated data in AI prompts** without DPA/BAA and legal approval.
- **Tier up** when enterprise customers send security questionnaires or regulators enter scope.

See also: [RBAC](./rbac.md), [Platform](./platform.md), [Marketplace](./marketplace.md).
