import type { PromptStemPackDef } from "./types.js";

const DISCOVERY_GROUND = {
  must: [
    "Run `npx dna context discovery` before product shaping, research plans, or UX work",
    "Load `.DNA/behaviour/discovery.behaviour.md` and Impressions product artifacts",
    "Sync findings with `dna sync discovery` — do not leave insights only in chat",
    "Hand off validated opportunities via `ai/feature-request.md` before engineering",
  ],
  never: [
    "Jump to Solution Architect / code without discovery handoff when stage requires validation",
    "Invent lifecycle stage different from config discovery profile",
    "Skip assumption tracking for high-risk bets",
  ],
};

export const DISCOVERY_STEM_DEFS: PromptStemPackDef[] = [
  {
    id: "discovery-setup",
    name: "Discovery setup",
    category: "discovery",
    slash: "discovery-setup",
    summary: "Configure product discovery — lifecycle, team model, methods, and processes.",
    tags: ["discovery", "setup", "product"],
    copyVariants: [
      "Set up DNA for continuous discovery",
      "We're an innovation lab — configure discovery",
      "Configure discovery for dual-track agile",
    ],
    prompt: `# Discovery setup

Configure DNA discovery profile for how this team shapes products.

User context: $ARGUMENTS

## Run

\`\`\`bash
npx dna discovery show
npx dna discovery set --lifecycle <ideation|problem-validation|solution-validation|pmf|growth|scale> \\
  --team <innovation-lab|discovery-squad|embedded-triad|dual-track|design-ops|none> \\
  --processes continuous-discovery,double-diamond \\
  --methods user-interviews,usability-testing \\
  --events design-sprint,research-readout
npx dna plan discovery
\`\`\`

## Output

1. Restate lifecycle stage and team model in plain English
2. List installed discovery packs
3. Scaffold Impressions if needed
4. Suggest next stem: plan-research or synthesize-research`,
    guidelines: DISCOVERY_GROUND,
    expectations: [
      "Discovery profile configured or confirmed",
      "Lifecycle + team explained",
      "Impressions paths noted",
    ],
    contextLoads: [".DNA/config.dna.json", ".DNA/behaviour/discovery.behaviour.md", ".DNA/discovery/profile.md"],
    cliCommands: ["npx dna discovery show", "npx dna discovery set", "npx dna plan discovery"],
    examples: [
      {
        userSays: "We run continuous discovery with a dedicated squad",
        goodResponse:
          "Set lifecycle to solution-validation, team discovery-squad, process continuous-discovery. Run plan-research when ready.",
      },
    ],
    workflow: ["plan-research", "synthesize-research"],
  },
  {
    id: "plan-research",
    name: "Plan research",
    category: "discovery",
    slash: "plan-research",
    summary: "Plan a user research study using the correct method pack.",
    tags: ["discovery", "research", "ux"],
    copyVariants: [
      "Plan user interviews for checkout abandonment",
      "Design a usability test for the new onboarding",
      "How should we run a PMF survey?",
    ],
    prompt: `# Plan research

Plan a research study matching discovery profile and lifecycle stage.

Scope: $ARGUMENTS

## Run

\`\`\`bash
npx dna context discovery
npx dna plan research <method> --quote "<research question>"
\`\`\`

Methods: user-interviews, usability-testing, surveys, prototype-testing, jobs-to-be-done, analytics-review, etc.

## Output

- Research question and hypothesis
- Method justification (generative vs evaluative)
- Participant criteria and n
- Script / task outline
- Success criteria
- DNA sync checklist`,
    guidelines: DISCOVERY_GROUND,
    expectations: ["Study plan with artifacts", "Method pack referenced", "Sync checklist included"],
    contextLoads: [".DNA/behaviour/discovery.behaviour.md", "DNA/Impressions/product/discovery-log.md"],
    cliCommands: ["npx dna plan research", "npx dna context discovery"],
    examples: [
      {
        userSays: "Plan interviews about checkout abandonment",
        goodResponse: "User interviews, n=8, problem-validation stage. Script + recruitment plan + sync checklist.",
      },
    ],
    workflow: ["synthesize-research"],
  },
  {
    id: "synthesize-research",
    name: "Synthesize research",
    category: "discovery",
    slash: "synthesize-research",
    summary: "Turn raw research into opportunities and update DNA Impressions.",
    tags: ["discovery", "synthesis", "insights"],
    copyVariants: [
      "Synthesise our interview findings",
      "Cluster insights into opportunities",
      "What did we learn from last week's research?",
    ],
    prompt: `# Synthesize research

Cluster findings into themes and opportunities. Update DNA artifacts.

Input: $ARGUMENTS

## Run

\`\`\`bash
npx dna context discovery
npx dna sync discovery --quote "<summary of synthesis>"
\`\`\`

## Output

1. Themes with supporting evidence (quotes / metrics)
2. Opportunities for opportunity-tree.md
3. Assumption updates for assumptions-risks.md
4. Recommended next test or handoff`,
    guidelines: DISCOVERY_GROUND,
    expectations: ["Themes and opportunities", "Impressions update guidance", "Next step clear"],
    contextLoads: ["DNA/Impressions/product/research-insights.md", "DNA/Impressions/product/opportunity-tree.md"],
    cliCommands: ["npx dna sync discovery", "npx dna context discovery"],
    examples: [
      {
        userSays: "Synthesise our 6 interview transcripts",
        goodResponse: "3 themes, 2 new opportunities on OST, 4 assumptions updated. Run sync discovery next.",
      },
    ],
    workflow: ["prioritize-opportunities", "handoff-to-engineering"],
  },
  {
    id: "prioritize-opportunities",
    name: "Prioritize opportunities",
    category: "discovery",
    slash: "prioritize-opportunities",
    summary: "Rank opportunities on the OST using ICE, RICE, or team framework.",
    tags: ["discovery", "prioritization", "ost"],
    copyVariants: [
      "Prioritise our discovery backlog",
      "Which opportunity should we pursue next?",
      "Rank these opportunities for next quarter",
    ],
    prompt: `# Prioritize opportunities

Rank opportunities from opportunity-tree.md for the next cycle.

Context: $ARGUMENTS

## Before prioritising

\`\`\`bash
npx dna context discovery
\`\`\`

Read \`DNA/Impressions/product/opportunity-tree.md\`.

## Output

- Scored/ranked opportunity list with rationale
- Top pick with evidence
- Experiments or research still needed
- Update instructions for opportunity-tree.md`,
    guidelines: DISCOVERY_GROUND,
    expectations: ["Ranked list with rationale", "Top opportunity identified"],
    contextLoads: ["DNA/Impressions/product/opportunity-tree.md"],
    cliCommands: ["npx dna context discovery"],
    examples: [
      {
        userSays: "Which opportunity should we build next quarter?",
        goodResponse: "Ranked 5 opportunities by evidence × impact. Top: reduce onboarding drop-off.",
      },
    ],
    workflow: ["plan-research", "handoff-to-engineering"],
  },
  {
    id: "pmf-check",
    name: "PMF check",
    category: "discovery",
    slash: "pmf-check",
    summary: "Review product–market fit signals and recommend persevere, pivot, or kill.",
    tags: ["discovery", "pmf", "metrics"],
    copyVariants: [
      "Do we have product market fit?",
      "Review our PMF signals",
      "Run a Sean Ellis survey analysis",
    ],
    prompt: `# PMF check

Review product–market fit using discovery packs and Impressions.

Context: $ARGUMENTS

## Run

\`\`\`bash
npx dna context discovery
\`\`\`

Read \`discovery/product-market-fit\` and \`DNA/Impressions/product/pmf-signals.md\`.

## Output

- Qualitative + quantitative signal summary
- Sean Ellis interpretation if available
- Recommendation: persevere / pivot / kill
- Updates for pmf-signals.md`,
    guidelines: DISCOVERY_GROUND,
    expectations: ["Signal summary", "Clear recommendation", "pmf-signals.md updates"],
    contextLoads: ["DNA/Impressions/product/pmf-signals.md", ".DNA/knowledge/discovery/product-market-fit/"],
    cliCommands: ["npx dna context discovery", "npx dna discovery set --lifecycle pmf"],
    examples: [
      {
        userSays: "Do we have PMF yet?",
        goodResponse: "Sean Ellis 32% — below 40% threshold. Retention improving. Recommend persevere with onboarding bet.",
      },
    ],
    workflow: ["handoff-to-engineering"],
  },
  {
    id: "handoff-to-engineering",
    name: "Handoff to engineering",
    category: "discovery",
    slash: "handoff-to-engineering",
    summary: "Move a validated opportunity into feature factory and delivery.",
    tags: ["discovery", "handoff", "feature-factory"],
    copyVariants: [
      "This opportunity is validated — start building",
      "Hand off checkout fix to engineering",
      "Turn this discovery into a feature request",
    ],
    prompt: `# Handoff to engineering

Bridge validated discovery work to DNA feature factory.

Opportunity: $ARGUMENTS

## Checklist (discovery/handoff-to-delivery)

- [ ] Opportunity validated with evidence in opportunity-tree.md
- [ ] Assumptions tested or explicitly accepted
- [ ] Success metrics defined

## Run

\`\`\`bash
npx dna context discovery
\`\`\`

Update \`ai/feature-request.md\` with Problem, Users, Desired behaviour, Success criteria from discovery artifacts.

## Output

- Draft feature-request.md sections
- Feature-map.md row
- Reminder: Solution Architect plan → **user approval** before code`,
    guidelines: DISCOVERY_GROUND,
    expectations: ["feature-request.md draft", "Handoff checklist complete", "Approval gate stated"],
    contextLoads: ["ai/feature-request.md", "DNA/Impressions/product/opportunity-tree.md"],
    cliCommands: ["npx dna context discovery", "npx dna context methodology"],
    examples: [
      {
        userSays: "Validated checkout fix — start building",
        goodResponse: "Updated feature-request.md from opportunity-tree evidence. Solution Architect plan next — approval before code.",
      },
    ],
    workflow: ["role-product-analyst", "agent-loop-full"],
  },
];
