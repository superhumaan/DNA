# GDPR Document Pack — UK Required Documents

DNA ships **85+ scrubbed UK GDPR templates** with placeholders:

- `[Company Name]` — data controller / processor
- `[Product Name]` — your service or platform
- `[Affiliate Entity]` — group companies (intra-group transfers)
- `[UK Hosting Region]` — e.g. Azure UK South

**Never publish templates verbatim** — replace all placeholders and have legal/DPO review.

## Four folders

1. **Governance & Compliance** — policies, ROPA, DPIA, incident, retention
2. **External - Customer-Facing** — privacy policy, DPA, cookies, subprocessors
3. **Technical - Operational Evidence** — data inventory, architecture, control matrix
4. **AI-Specific Documentation** — if your product uses AI (optional by tier)

Plus **Documents/** — Excel registers (DSR log, breach register, RBAC matrix, etc.)

## DNA commands

```bash
dna compliance documents
dna compliance documents --tier sme
dna compliance install-examples
dna plan compliance --frameworks gdpr,uk_gdpr --tier sme --quote "B2B SaaS UK"
```

Templates install to `.DNA/knowledge/compliance/gdpr/examples/`.

## Re-ingest from source .docx

```bash
pnpm gdpr:ingest path/to/GDPR\ Documents
pnpm gdpr:scrub
```

Scrubbing removes vendor-specific names automatically.

## Tier guidance

| Tier | Document focus |
|------|----------------|
| startup | Privacy/cookie/terms, data inventory, breach procedure |
| sme | + ROPA, DPIA template, DPA, subprocessors, DSR procedure |
| corporate | + full governance, pen test, control matrix, BCP/DRP |
| enterprise | + intra-group transfers, full AI pack, all evidence artefacts |
