import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack, pack } from "./bundled-catalog-helpers.js";
import { AGILE_FAMILY_IDS, AGILE_FAMILY_PACKS } from "./bundled-catalog-agile-family.js";
import { METHODOLOGY_EXPANDED_PACKS } from "./bundled-catalog-methodologies-expanded.js";

function methodologyPack(
  id: string,
  name: string,
  desc: string,
  positioning: string,
  hierarchy: string,
  artifacts: string,
  ceremonies: string,
): KnowledgePack {
  return catalogPack(
    `methodologies/${id}`,
    name,
    "methodologies",
    desc,
    [
      { path: `methodologies/${id}/positioning.dna.md`, content: positioning },
      { path: `methodologies/${id}/hierarchy.dna.md`, content: hierarchy },
      { path: `methodologies/${id}/artifacts.dna.md`, content: artifacts },
      { path: `methodologies/${id}/ceremonies.dna.md`, content: ceremonies },
    ],
    ["methodology", id],
  );
}

const CORE_METHODOLOGY_PACKS: KnowledgePack[] = [
  methodologyPack(
    "dna-default",
    "DNA Feature Factory",
    "DNA default delivery — feature request, agent loop, GitHub, Impressions",
    `# DNA Feature Factory

Default DNA delivery model for OSS and small teams.

## Flow
1. User describes goal in plain language
2. \`ai/feature-request.md\` updated automatically
3. Agent loop roles: PA → SA → (approval) → BE → FE → UX → QA → CQ → Refactor → Final
4. Quality gate → docker → github push

## Artifacts
- **Plan:** Solution Architect plan in chat (approval gate)
- **Tickets:** GitHub issues via \`dna github push\` / bug loop
- **Docs:** \`DNA/Impressions/\` updated on architecture changes`,
    `# Hierarchy — DNA Default

\`\`\`
feature → story → task
\`\`\`

| Level | DNA artifact |
|-------|--------------|
| feature | \`ai/feature-request.md\` |
| story | Implementation plan sections |
| task | Commits / PR checklist items |`,
    `# Artifacts — DNA Default

## Feature request
Sections: Problem, Users, Desired behaviour, Edge cases, Success criteria

## Plan
Scope, files, API, security, tests, risks — **no code until approval**

## Close-out
Quality PASS, docker build, github push, manual QA checklist`,
    `# Ceremonies — DNA Default

- **Plan** — Solution Architect produces plan; user approves
- **Implement** — Backend → Frontend → UX
- **Quality gate** — \`dna quality report --feature\`
- **Ship** — docker build + github push`,
  ),
  // Scrum/LeSS/Kanban/SAFe/Shape Up/Spotify → AGILE_FAMILY_PACKS

    pack(
    "methodologies/ticket-writing",
    "Ticket Writing",
    "methodologies",
    "Cross-methodology ticket templates for Jira, Linear, GitHub, Azure DevOps",
    [
      {
        path: "methodologies/ticket-writing/positioning.dna.md",
        content: `# Ticket Writing

DNA loads methodology + ticket system before writing work items.

## Rule
**Never default to GitHub issues** unless \`delivery.ticketSystem\` is \`github\`.

Read \`delivery.behaviour.md\` and custom profile for field overrides.`,
      },
      {
        path: "methodologies/ticket-writing/ticket-templates.dna.md",
        content: `# Ticket Templates by System

## Jira
\`\`\`
Summary: [verb] [object] — [outcome]
Issue type: Story | Bug | Epic | Spike
Description:
  ## Context
  ## Acceptance criteria
  ## Technical notes
Labels: tribe-*, squad-*
Components: [service name]
Story points: [if scrum]
Sprint: [if scrum]
\`\`\`

## Linear
\`\`\`
Title: concise imperative
Description: markdown with AC checklist
Priority: urgent | high | medium | low
Labels: [team labels]
Project: [cycle or team]
Estimate: [points if used]
\`\`\`

## GitHub Issues
\`\`\`
Title: feat|fix|docs: summary
Body: ## Problem / ## Solution / ## Acceptance criteria
Labels: enhancement | bug
Milestone: [if used]
\`\`\`

## Azure DevOps
\`\`\`
Work item type: User Story | Bug | Feature
Title, Description, Acceptance Criteria field
Area Path, Iteration Path
Story Points
\`\`\``,
      },
    ],
  ),
  pack(
    "methodologies/document-writing",
    "Document Writing",
    "methodologies",
    "Cross-methodology spec and design doc templates",
    [
      {
        path: "methodologies/document-writing/positioning.dna.md",
        content: `# Document Writing

Specs and design docs must match \`delivery.docSystem\` and methodology.

## Systems
- **impressions** — \`DNA/Impressions/\` markdown (DNA default)
- **confluence** — page hierarchy, macros, labels
- **notion** — database properties, linked pages
- **google-docs** — comment-based review, suggesting mode`,
      },
      {
        path: "methodologies/document-writing/document-templates.dna.md",
        content: `# Document Templates

## PRD (product)
1. Problem & context
2. Goals & non-goals
3. Users & personas
4. Requirements (MoSCoW)
5. Success metrics
6. Risks & dependencies
7. Open questions

## Design doc (engineering)
1. Summary (1 paragraph)
2. Background
3. Goals / Non-goals
4. Proposed design
5. Alternatives considered
6. Security & privacy
7. Rollout plan
8. Test plan

## RFC (cross-team)
1. Motivation
2. Detailed design
3. Drawbacks
4. Unresolved questions

## ADR (architecture decision)
1. Status, Context, Decision, Consequences

## Shape Up pitch
See \`methodologies/shape-up/positioning.dna.md\` and templates in that pack's \`assets/\`

## Scrum epic brief
Problem, outcome, stories list, success metrics, target PI/sprint`,
      },
    ],
  ),
];

/** Core + expanded (deduped) + rich agile family. */
export const METHODOLOGY_PACKS: KnowledgePack[] = [
  ...CORE_METHODOLOGY_PACKS,
  ...METHODOLOGY_EXPANDED_PACKS.filter((p) => !AGILE_FAMILY_IDS.has(p.id)),
  ...AGILE_FAMILY_PACKS,
];
