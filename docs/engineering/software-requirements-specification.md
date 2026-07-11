# Software requirements specification

High-level SRS for DNA by Humaan — the open-source project intelligence platform.

---

## 1. Purpose

DNA provides TypeScript teams with:

- Structured project intelligence for AI tools
- Runtime error observation and classification
- Knowledge marketplace (897 packs)
- Tiered compliance coordination
- GitHub automation and AI-assisted repair

---

## 2. Scope

### In scope

- CLI (`dna` command) for project scaffolding, analysis, planning, context export
- Runtime observer subpath for Node.js API frameworks
- Marketplace install/search/update with offline fallback
- Platform catalog feature plans from production reference apps
- Behaviour validation and project health checks

### Out of scope

- Hosted multi-tenant SaaS (self-hosted only)
- Auto-merge of PRs or autonomous deployment
- Storage of secrets in config files

---

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-01 | `dna init` shall scaffold `.DNA/` and `DNA/Impressions/` |
| FR-02 | `dna context` shall export AI-ready context per target tool |
| FR-03 | Runtime shall capture exceptions and HTTP errors to `.DNA/runtime/` |
| FR-04 | Immune system shall classify issues by severity, category, discipline |
| FR-05 | Marketplace shall install packs to `.DNA/knowledge/` |
| FR-06 | `dna plan feature` shall generate phased implementation plans |
| FR-07 | `dna plan compliance` shall generate tier-appropriate control matrices |
| FR-08 | GitHub integration shall create issues for high/critical runtime events |
| FR-09 | AI repair shall default to dry-run mode |

---

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Node.js 20+ support |
| NFR-01 | Offline marketplace fallback via bundled catalog |
| NFR-03 | MIT license, open source |
| NFR-04 | No secrets in committed config |
| NFR-05 | CLI response < 5s for `scan` on typical projects |

---

## 5. External interfaces

| Interface | Protocol |
|-----------|----------|
| npm | `@superhumaan/dna-by-humaan` |
| GitHub API | Issues, PRs, push (token via env) |
| AI providers | Configurable (mock default) |
| Marketplace API | HTTPS (optional) |

---

## Related

- [Architecture overview](./architecture/overview.md)
- [CLI reference](./cli-reference.md)
