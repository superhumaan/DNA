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
  };
}
