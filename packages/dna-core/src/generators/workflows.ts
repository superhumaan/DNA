import { generateDeliveryWorkflow } from "./delivery-pipeline.js";

export function generateWorkflows(threshold = 80): Record<string, string> {
  return {
    "build.workflow.md": `# Build Workflow

1. Read neuralNetwork for intent routing
2. Load relevant Behaviour and knowledge
3. Check CellularMemory for context
4. Implement changes following coding Behaviour
5. Run \`dna validate\`
6. Update CellularMemory
`,
    "test.workflow.md": `# Test Workflow

1. Read testing.behaviour.md
2. Write unit and integration tests
3. Run test suite
4. Update qa Impressions if strategy changes
5. Record regression risks
`,
    "document.workflow.md": `# Document Workflow

1. Read documentation.behaviour.md
2. Update relevant Impressions files
3. Do not overwrite without review
4. Update CellularMemory project-summary if needed
`,
    "runtime-issue.workflow.md": `# Runtime Issue Workflow

1. Runtime captures error event
2. Immune System classifies issue
3. Compare against Behaviour and CellularMemory
4. Create GitHub issue if severity warrants
5. Update amygdala/repeated-failures.md if repeated
6. Optionally trigger AI repair workflow
`,
    "ai-repair.workflow.md": `# AI Repair Workflow

1. Issue detected and classified
2. Load neuralNetwork, Behaviour, CellularMemory
3. Load relevant code snippets (redacted)
4. Generate diagnosis via AI provider
5. Create fix branch
6. Apply proposed patch
7. Run tests
8. Open PR with explanation
9. Update GitHub issue
10. **Never auto-merge. Never deploy.**
`,
    "rbac.workflow.md": `# RBAC + Zero Trust Workflow

Use when a user requests permissions, roles, or access control.

## Before writing any code

1. Run \`dna plan rbac\` with the user's plain-language requirement
2. Read \`.DNA/plans/rbac-*.md\` — this is the AI briefing
3. Read \`.DNA/CellularMemory/prefrontalCortex/rbac-permission-matrix.md\`
4. Load knowledge: security/rbac-fundamentals, zero-trust, ui-surface-checklist
5. Read security.behaviour.md

## Implementation order (mandatory)

1. **Permission matrix** — agree roles and feature × role grid
2. **Server enforcement** — middleware on every API; default deny
3. **Route guards** — block direct URL navigation
4. **UI surfaces** — hide menus, notifications, buttons, widgets (most commonly missed)
5. **Role management** — document where admins grant access
6. **Verification** — test each role; refresh browser; confirm no forbidden UI flash

## Definition of done

RBAC is NOT complete if a user without permission can still SEE a menu item, notification, or route — even if the API returns 403.

## After completion

- Update DNA/Impressions/security/security-baseline.md
- Update CellularMemory decisions
- Run \`dna validate\`
`,
    "delivery.workflow.md": generateDeliveryWorkflow(threshold),
    "legal.workflow.md": `# Legal Advisor Workflow

Use when a user requests features touching personal data, payments, health records, cross-border operations, or regulated sectors (banking, healthcare, fintech).

**Not legal advice** — DNA provides engineering legal considerations. Engage qualified counsel before production in regulated markets.

## Before writing any code

1. Run \`dna legal advise --quote "<user requirement>"\`
2. Run \`dna plan legal\` with \`--domains\` and \`--jurisdictions\` when launching or entering new markets
3. Read \`.DNA/plans/legal-*.md\` and \`.DNA/CellularMemory/prefrontalCortex/legal-considerations-matrix.md\`
4. Install regional packs: \`dna marketplace install legal/regions/sg-pdpa\` (etc.)
5. Load \`.DNA/knowledge/legal/\` domain and regional checklists
6. Pair with \`dna plan compliance\` for ISO 27001, SOC 2, HIPAA **controls** (legal ≠ compliance alone)

## Intelligence prompts (Cursor / Claude)

| Slash | When |
| --- | --- |
| \`/legal-advise\` | Quick question before a feature decision |
| \`/plan-legal\` | Full legal plan + matrix for launch markets |
| \`/legal-list\` | Browse domains and jurisdictions |
| \`/legal-engineering\` | Sector checklist on a specific flow |

CLI equivalents: \`/dna-legal-advise\`, \`/dna-plan-legal\`, \`/dna-legal-list\`, \`dna context legal\`

## Implementation order (mandatory)

1. **Jurisdictions** — identify launch markets; install regional packs
2. **Domains** — privacy, banking, healthcare, IP, consumer, AI governance
3. **Counsel gates** — block production until matrix rows are counsel-approved
4. **Engineering controls** — consent, retention, PCI scope, PHI isolation, AML/KYC
5. **Compliance plan** — \`dna plan compliance\` for control frameworks
6. **Verification** — legal matrix + compliance matrix both updated

## Automation (Cursor Automations / CI)

Recommended triggers for regulated repos:

- **Feature factory** — Solution Architect step runs \`dna legal advise\` when quote mentions banking, healthcare, payment, PDPA, GDPR, HIPAA
- **Pre-push hook** — advisory; strict mode can require legal matrix exists for \`legal/tiered-standards\` installs
- **Scheduled** — weekly \`dna doctor\` refreshes legal regional packs from project description

## Definition of done

Legal is NOT complete if:
- Regional packs missing for launch jurisdictions
- Legal matrix unchecked for in-scope domains
- Banking/healthcare features ship without sector checklist review
- Output presented as legal advice without counsel disclaimer

## After completion

- Update \`.DNA/CellularMemory/prefrontalCortex/legal-considerations-matrix.md\`
- Update \`.DNA/CellularMemory/prefrontalCortex/decisions.md\` with jurisdiction choices
- Run \`dna context legal\` in AI session before related features
`,
  };
}
