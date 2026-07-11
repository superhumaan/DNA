import type { PromptStemPackDef } from "./types.js";

const METHODOLOGY_GROUND = {
  must: [
    "Run `npx dna context methodology` before writing tickets or specs",
    "Load `.DNA/behaviour/delivery.behaviour.md` and custom profile if present",
    "Match delivery profile hierarchy — never default to GitHub unless ticketSystem is github",
    "Respond in plain English with copy-paste-ready artifacts",
  ],
  never: [
    "Invent org hierarchy different from config delivery profile",
    "Skip methodology packs when user works at a large org",
    "Replace DNA code quality gates with methodology ceremony",
  ],
};

export const METHODOLOGY_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "methodology-setup",
    name: "Methodology setup",
    category: "methodology",
    slash: "methodology-setup",
    summary: "Configure how your team plans, documents, and tickets work.",
    tags: ["methodology", "setup", "delivery"],
    copyVariants: [
      "We work in Scrum with Jira — configure DNA for that",
      "Set up DNA for tribe/squad delivery like Agoda",
      "Configure methodology for Shape Up",
    ],
    prompt: `# Methodology setup

Configure DNA delivery profile for how this team actually works.

User context: $ARGUMENTS

## Run

\`\`\`bash
npx dna methodology show
npx dna methodology set --methodology <scrum|kanban|less|safe|spotify-model|shape-up|dna-default> \\
  --archetype <travel-scale-up|big-tech|research-lab|agency|startup|none> \\
  --ticket-system <jira|linear|github|azure-devops|none> \\
  --doc-system <confluence|notion|impressions|google-docs|github-wiki>
npx dna plan methodology
\`\`\`

## Output

1. Restate detected or chosen methodology in plain English
2. Show hierarchy and ceremonies
3. Confirm knowledge packs installed
4. Point user to \`/create-ticket\` and \`/write-spec\` stems`,
    guidelines: METHODOLOGY_GROUND,
    expectations: [
      "Delivery profile configured or confirmed",
      "Methodology + archetype explained",
      "Custom profile path noted",
      "Next stem suggested (create-ticket or write-spec)",
    ],
    contextLoads: [".DNA/config.dna.json", ".DNA/behaviour/delivery.behaviour.md", ".DNA/delivery/profile.md"],
    cliCommands: ["npx dna methodology show", "npx dna methodology set", "npx dna plan methodology"],
    examples: [
      {
        userSays: "We're Agoda-style tribes with Jira",
        goodResponse:
          "Set methodology to spotify-model, archetype travel-scale-up, ticket jira. Hierarchy: initiative → epic → story. Run create-ticket when ready.",
      },
    ],
    workflow: ["create-ticket", "write-spec"],
  },
  {
    id: "create-ticket",
    name: "Create ticket",
    category: "methodology",
    slash: "create-ticket",
    summary: "Write work items in org-correct format (Jira, Linear, GitHub, Azure DevOps).",
    tags: ["methodology", "ticket", "jira", "linear"],
    copyVariants: [
      "Write Jira tickets for this feature",
      "Create stories for the checkout epic",
      "Draft Linear issues for this work",
    ],
    prompt: `# Create ticket

Write work item(s) matching this team's delivery profile.

Scope: $ARGUMENTS

## Before writing

\`\`\`bash
npx dna context methodology
\`\`\`

Read \`methodologies/ticket-writing\` and active methodology pack.

## Output format

- Use correct hierarchy level (epic/story/task/etc.)
- Use ticket system field names (Jira vs Linear vs GitHub)
- Include acceptance criteria and labels from custom profile
- Copy-paste ready — user should paste directly into their tool`,
    guidelines: METHODOLOGY_GROUND,
    expectations: [
      "Tickets match delivery.ticketSystem",
      "Hierarchy levels correct",
      "AC and DoD included when methodology requires",
      "Labels/components from custom profile if set",
    ],
    contextLoads: [
      ".DNA/behaviour/delivery.behaviour.md",
      ".DNA/knowledge/methodologies/ticket-writing/",
      ".DNA/delivery/profile.md",
    ],
    cliCommands: ["npx dna context methodology", "npx dna methodology show"],
    examples: [
      {
        userSays: "Write Jira stories for payment retry",
        goodResponse:
          "3 stories with Summary, AC, tribe-checkout label, 5/3/2 points — formatted for Jira paste.",
      },
    ],
  },
  {
    id: "write-spec",
    name: "Write spec",
    category: "methodology",
    slash: "write-spec",
    summary: "Write PRD, design doc, RFC, or pitch per methodology and doc system.",
    tags: ["methodology", "spec", "prd", "design-doc"],
    copyVariants: [
      "Write a design doc for this feature",
      "Draft a PRD for the admin portal",
      "Shape Up pitch for search improvements",
    ],
    prompt: `# Write spec

Write specification document matching methodology and doc system.

Scope: $ARGUMENTS

## Before writing

\`\`\`bash
npx dna context methodology
\`\`\`

Read \`methodologies/document-writing\` and active methodology artifacts.

## Output

- Correct doc type for methodology (PRD, design doc, pitch, epic brief)
- Sections from document-templates pack
- Confluence/Notion formatting hints if docSystem requires`,
    guidelines: METHODOLOGY_GROUND,
    expectations: [
      "Doc type matches methodology (pitch for Shape Up, design doc for big-tech, etc.)",
      "Required sections present",
      "Goals and non-goals explicit",
      "Risks and dependencies listed",
    ],
    contextLoads: [
      ".DNA/behaviour/delivery.behaviour.md",
      ".DNA/knowledge/methodologies/document-writing/",
      "DNA/Impressions/",
    ],
    cliCommands: ["npx dna context methodology"],
    examples: [
      {
        userSays: "Design doc for OAuth migration",
        goodResponse:
          "Design doc with Summary, Background, Goals/Non-goals, Proposed design, Security, Rollout — ready for Confluence.",
      },
    ],
  },
  {
    id: "break-down-work",
    name: "Break down work",
    category: "methodology",
    slash: "break-down-work",
    summary: "Decompose initiative/epic into stories or scopes per methodology hierarchy.",
    tags: ["methodology", "breakdown", "epic", "planning"],
    copyVariants: [
      "Break this epic into stories",
      "Split the initiative into squad work",
      "Decompose for sprint planning",
    ],
    prompt: `# Break down work

Decompose work using the team's hierarchy from delivery profile.

Scope: $ARGUMENTS

## Run

\`\`\`bash
npx dna context methodology
\`\`\`

## Output

Tree: initiative → epic → story (or bet → scope → task for Shape Up)

Each leaf item:
- Title, one-line outcome
- Suggested owner (squad/role if archetype applies)
- Dependencies between items
- Sizing hint (points, appetite, or t-shirt) per methodology`,
    guidelines: METHODOLOGY_GROUND,
    expectations: [
      "Hierarchy matches config",
      "Leaf items independently deliverable",
      "Dependencies explicit",
      "Sizing approach matches methodology",
    ],
    contextLoads: [".DNA/behaviour/delivery.behaviour.md", ".DNA/config.dna.json"],
    cliCommands: ["npx dna context methodology", "npx dna methodology show"],
    examples: [
      {
        userSays: "Break down checkout initiative for 3 squads",
        goodResponse:
          "Initiative → 2 epics → 8 stories with squad owners and cross-squad dependency on payments API.",
      },
    ],
    workflow: ["create-ticket", "write-spec"],
  },
  {
    id: "align-delivery",
    name: "Align delivery",
    category: "methodology",
    slash: "align-delivery",
    summary: "Audit a plan or artifact against how this team actually works.",
    tags: ["methodology", "audit", "alignment"],
    copyVariants: [
      "Does this plan match how we work?",
      "Check if these tickets fit our Scrum process",
      "Align this spec with our tribe model",
    ],
    prompt: `# Align delivery

Audit plan, tickets, or spec against delivery profile.

Artifact: $ARGUMENTS

## Run

\`\`\`bash
npx dna context methodology
npx dna methodology show
\`\`\`

## Report

| Check | Pass/Fail | Fix |
|-------|-----------|-----|
| Hierarchy | | |
| Ticket fields | | |
| Ceremony fit | | |
| Doc template | | |
| Custom profile rules | | |

End with concrete edits — not generic agile advice.`,
    guidelines: METHODOLOGY_GROUND,
    expectations: [
      "Pass/fail table against delivery profile",
      "Specific mismatches cited",
      "Concrete fix suggestions",
      "Distinguishes code gates (DNA) from planning artifacts (methodology)",
    ],
    contextLoads: [".DNA/behaviour/delivery.behaviour.md", ".DNA/delivery/profile.md"],
    cliCommands: ["npx dna context methodology", "npx dna methodology show"],
    examples: [
      {
        userSays: "Are these GitHub issues right for our Jira Scrum team?",
        goodResponse:
          "Fail — ticketSystem is jira. Rewrite as stories with sprint, points, AC. Keep GitHub for PRs only.",
      },
    ],
  },
];
