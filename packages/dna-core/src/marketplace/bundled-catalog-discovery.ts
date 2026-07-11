import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "./bundled-catalog-helpers.js";

interface DiscoveryPackDef {
  id: string;
  name: string;
  desc: string;
  when: string;
  steps: string;
  artifacts: string;
  events?: string;
  sync: string;
  tags?: string[];
}

function discoveryPack(def: DiscoveryPackDef): KnowledgePack {
  const files = [
    { path: `${def.id}/positioning.dna.md`, content: `# ${def.name}\n\n${def.when}` },
    { path: `${def.id}/process.dna.md`, content: `# ${def.name} — Process\n\n${def.steps}` },
    { path: `${def.id}/artifacts.dna.md`, content: `# ${def.name} — Artifacts\n\n${def.artifacts}` },
    {
      path: `${def.id}/events.dna.md`,
      content: `# ${def.name} — Events\n\n${def.events ?? "See process.dna.md for ceremony timing."}`,
    },
    { path: `${def.id}/dna-sync.dna.md`, content: `# ${def.name} — DNA Sync\n\n${def.sync}` },
  ];
  return catalogPack(def.id, def.name, "discovery", def.desc, files, def.tags ?? ["discovery"]);
}

function subPack(prefix: string, def: Omit<DiscoveryPackDef, "id"> & { slug: string }): KnowledgePack {
  return discoveryPack({
    id: `${prefix}/${def.slug}`,
    name: def.name,
    desc: def.desc,
    when: def.when,
    steps: def.steps,
    artifacts: def.artifacts,
    events: def.events,
    sync: def.sync,
    tags: def.tags,
  });
}

const FOUNDATION_PACKS: KnowledgePack[] = [
  discoveryPack({
    id: "discovery/overview",
    name: "Product Discovery Overview",
    desc: "Product lifecycle, dual-track agile, discovery ↔ delivery handoff",
    when: `# Product Discovery Overview

DNA supports shaping products **before** engineering via discovery packs, Impressions, and CLI.

## Lifecycle stages
\`ideation\` → \`problem-validation\` → \`solution-validation\` → \`pmf\` → \`growth\` → \`scale\`

## Dual-track
- **Discovery track** — reduce risk, validate opportunities (this catalog)
- **Delivery track** — build and ship validated work (\`dna context methodology\`)

## CLI
\`\`\`bash
dna discovery show
dna plan discovery
dna context discovery
dna sync discovery
\`\`\``,
    steps: `1. Set lifecycle: \`dna discovery set --lifecycle <stage>\`
2. Install methods: \`dna discovery set --methods user-interviews,usability-testing\`
3. Plan research: \`dna plan research <method>\`
4. Sync findings: \`dna sync discovery --quote "..."\`
5. Hand off: \`/handoff-to-engineering\` → \`ai/feature-request.md\``,
    artifacts: `## Impressions
- \`DNA/Impressions/product/discovery-log.md\`
- \`DNA/Impressions/product/opportunity-tree.md\`
- \`DNA/Impressions/product/assumptions-risks.md\`
- \`DNA/Impressions/product/research-insights.md\`
- \`DNA/Impressions/product/pmf-signals.md\``,
    events: `| Event | When |
|-------|------|
| Weekly discovery | Continuous touchpoints |
| Readout | After each study |
| Prioritization | Before delivery planning |`,
    sync: `After any discovery activity update Impressions. Run \`dna sync discovery\`.`,
    tags: ["discovery", "foundation"],
  }),
  discoveryPack({
    id: "discovery/continuous-discovery",
    name: "Continuous Discovery",
    desc: "Teresa Torres — weekly touchpoints, OST, assumption tests",
    when: `# Continuous Discovery

Weekly customer touchpoints + Opportunity Solution Trees. Pair with \`discovery/opportunity-solution-tree\`.`,
    steps: `1. Define outcome on OST
2. Interview or test with customers weekly (at least one activity)
3. Map insights → opportunities → solutions
4. Run smallest assumption test before building
5. Update Impressions after each cycle`,
    artifacts: `## Weekly cadence
- 1+ customer touchpoint
- OST update
- 1 assumption test in flight or completed

## Interview snapshot template
- Participant segment
- Key quote
- Opportunity implied`,
    events: `| Ceremony | Cadence |
|----------|---------|
| Customer touchpoint | Weekly |
| Triad sync | Weekly |
| Assumption test review | Bi-weekly |`,
    sync: `Log touchpoints in \`discovery-log.md\`. Move opportunities in \`opportunity-tree.md\`.`,
    tags: ["discovery", "foundation", "process"],
  }),
  discoveryPack({
    id: "discovery/opportunity-solution-tree",
    name: "Opportunity Solution Tree",
    desc: "OST framework — outcomes, opportunities, solutions, experiments",
    when: `# Opportunity Solution Tree (OST)

Visual map: **Outcome** → **Opportunities** → **Solutions** → **Experiments**.`,
    steps: `1. Write single measurable desired outcome
2. Brainstorm opportunities (customer needs/pain) from research
3. Generate multiple solutions per opportunity — do not commit to one
4. Design experiments to test riskiest assumptions
5. Prioritise one opportunity + solution slice per cycle`,
    artifacts: `## OST table (in opportunity-tree.md)
| Outcome | Opportunity | Solution | Experiment | Status |

## Prioritisation prompts
- Which opportunity has strongest evidence?
- Which assumption is riskiest if wrong?`,
    sync: `Maintain \`DNA/Impressions/product/opportunity-tree.md\` as source of truth.`,
    tags: ["discovery", "foundation"],
  }),
  discoveryPack({
    id: "discovery/product-market-fit",
    name: "Product–Market Fit",
    desc: "PMF signals, Sean Ellis test, retention benchmarks",
    when: `# Product–Market Fit

Stage where retention and satisfaction prove the product meets a real market need.`,
    steps: `1. Define PMF metric for your model (B2B vs B2C differs)
2. Run Sean Ellis survey: "How disappointed if product went away?" (target ≥40% very disappointed)
3. Track retention cohorts (D7, D30)
4. Review qualitative love/hate patterns
5. Decide: persevere, pivot, or kill`,
    artifacts: `## Sean Ellis survey
- Very disappointed / Somewhat / Not disappointed
- Why? (open text)
- Alternative used today?

## pmf-signals.md
Document scores, retention, NPS, and decision.`,
    events: `| Event | Purpose |
|-------|---------|
| PMF review | Monthly at pmf stage |
| Pivot review | When signals weak |`,
    sync: `Update \`DNA/Impressions/product/pmf-signals.md\` after each PMF review.`,
    tags: ["discovery", "foundation", "pmf"],
  }),
  discoveryPack({
    id: "discovery/ux-research-foundations",
    name: "UX Research Foundations",
    desc: "When to use qual/quant, ethics, recruitment basics",
    when: `# UX Research Foundations

Choose methods by **research question** and **lifecycle stage**.`,
    steps: `| Question type | Research type | Example methods |
|---------------|---------------|-----------------|
| What problem? | Generative | interviews, JTBD |
| Will they use it? | Evaluative | usability, prototype |
| How do they feel? | Attitudinal | surveys |
| What do they do? | Behavioral | analytics, diary |

Always: consent, privacy (link GDPR if EU), debrief synthesis within 48h.`,
    artifacts: `## Study plan sections
1. Research question
2. Method + why
3. Participants (n, segment)
4. Script / tasks
5. Success criteria
6. Timeline`,
    events: `Recruitment lead time: typically 1–2 weeks for B2B; 2–5 days for B2C panels.`,
    sync: `Log in \`discovery-log.md\`. Insights in \`research-insights.md\`. Link compliance packs if PII collected.`,
    tags: ["discovery", "foundation", "ux"],
  }),
  discoveryPack({
    id: "discovery/handoff-to-delivery",
    name: "Handoff to Delivery",
    desc: "Bridge validated opportunities to feature factory and engineering",
    when: `# Handoff to Delivery

Discovery is "done enough" when assumptions are tested and stakeholders agree to build.`,
    steps: `1. Opportunity marked **validated** on OST with evidence links
2. Write \`ai/feature-request.md\` — Problem, Users, AC from discovery artifacts
3. Run feature factory — Product Analyst reads \`dna context discovery\`
4. Solution Architect plan — **approval gate** before code
5. Delivery uses \`dna context methodology\` for tickets`,
    artifacts: `## Handoff checklist
- [ ] Opportunity has evidence (research refs)
- [ ] Assumptions tested or explicitly accepted
- [ ] Success metrics defined
- [ ] Non-goals listed
- [ ] \`ai/feature-request.md\` updated
- [ ] \`feature-map.md\` row added`,
    sync: `Update \`feature-map.md\` with discovery evidence column. Archive completed assumptions.`,
    tags: ["discovery", "foundation", "handoff"],
  }),
];

const TEAM_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  {
    slug: "innovation-lab",
    name: "Innovation Lab",
    desc: "Central lab exploring bets, prototypes, and new markets",
    when: "Dedicated team exploring 0→1 bets separate from core delivery.",
    steps: "Portfolio of bets; kill fast; spin out winners to product teams.",
    artifacts: "Bet brief: hypothesis, appetite, kill criteria, experiment ID.",
    sync: "Log bets in opportunity-tree.md; use research-lab archetype for delivery tone.",
    tags: ["discovery", "team"],
  },
  {
    slug: "discovery-squad",
    name: "Discovery Squad",
    desc: "Cross-functional squad owning continuous discovery",
    when: "PM + design + research embedded on a product area.",
    steps: "Weekly touchpoints; OST per outcome; feeds delivery squad backlog.",
    artifacts: "Squad charter, outcome OKRs, discovery backlog.",
    sync: "hippocampus/research-backlog.md for upcoming studies.",
    tags: ["discovery", "team"],
  },
  {
    slug: "embedded-triad",
    name: "Embedded Triad",
    desc: "PM + design + engineering triad in delivery teams",
    when: "Discovery happens inside delivery teams — dual responsibilities.",
    steps: "Triad owns discovery and delivery for slice; timebox discovery spikes.",
    artifacts: "Triad working agreement; definition of validated.",
    sync: "Assumptions in assumptions-risks.md owned by triad.",
    tags: ["discovery", "team"],
  },
  {
    slug: "dual-track-squad",
    name: "Dual-Track Squad",
    desc: "Parallel discovery and delivery tracks with handoffs",
    when: "Separate discovery and delivery cadences with explicit handoff.",
    steps: "Discovery track validates; delivery track builds last validated slice.",
    artifacts: "Handoff doc per cycle; WIP limits per track.",
    sync: "handoff-to-delivery pack at each cycle boundary.",
    tags: ["discovery", "team"],
  },
  {
    slug: "design-ops",
    name: "Design Ops",
    desc: "Design operations enabling research and systems at scale",
    when: "Design ops supports multiple squads with research ops and design system.",
    steps: "Templates, recruitment pipeline, research repository, quality bar.",
    artifacts: "Research ops playbook; component audit cadence.",
    sync: "Standardise artifacts.dna.md templates across squads.",
    tags: ["discovery", "team"],
  },
];

const LIFECYCLE_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  { slug: "ideation", name: "Ideation", desc: "Explore problems and strategic bets", when: "Early exploration — breadth over depth.", steps: "Landscape, JTBD, competitive scan, opportunity mapping.", artifacts: "Opportunity brief; problem statements.", sync: "opportunity-tree.md outcomes and raw opportunities." },
  { slug: "problem-validation", name: "Problem Validation", desc: "Confirm problem is real and painful", when: "Before building solutions.", steps: "Interviews, surveys, analytics on problem frequency.", artifacts: "Problem validation scorecard.", sync: "assumptions-risks.md — problem assumptions tested." },
  { slug: "solution-validation", name: "Solution Validation", desc: "Test if solutions solve the problem", when: "After problem validated.", steps: "Prototypes, usability, concept tests.", artifacts: "Test results matrix.", sync: "research-insights.md with solution learnings." },
  { slug: "pmf", name: "PMF Stage", desc: "Measure product–market fit", when: "Live product seeking fit.", steps: "Sean Ellis, retention, sales velocity.", artifacts: "pmf-signals.md dashboard.", sync: "pmf-signals.md after each review." },
  { slug: "growth", name: "Growth", desc: "Optimise acquisition and expansion", when: "Post-PMF scaling.", steps: "Experimentation, funnel analysis, pricing tests.", artifacts: "Growth experiment log.", sync: "Link experiments to feature-map.md." },
  { slug: "scale", name: "Scale", desc: "Portfolio discovery at scale", when: "Multiple segments or products.", steps: "Horizon scanning, platform bets, new markets.", artifacts: "Portfolio roadmap.", sync: "prefrontalCortex decisions for major bets." },
];

const RESEARCH_TYPE_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  { slug: "generative", name: "Generative Research", desc: "Explore problems and opportunities", when: "When you don't know the problem yet.", steps: "Open-ended interviews, ethnography, JTBD.", artifacts: "Affinity map, journey map.", sync: "research-insights.md themes." },
  { slug: "evaluative", name: "Evaluative Research", desc: "Test specific solutions", when: "When you have a hypothesis to test.", steps: "Usability, prototype, concept tests.", artifacts: "Task success rates, severity ratings.", sync: "assumptions-risks.md status updates." },
  { slug: "attitudinal", name: "Attitudinal Research", desc: "What people say they think/feel", when: "Preferences, satisfaction, positioning.", steps: "Surveys, interviews on attitudes.", artifacts: "Survey results, sentiment themes.", sync: "pmf-signals.md qualitative section." },
  { slug: "behavioral", name: "Behavioral Research", desc: "What people actually do", when: "Usage patterns, funnels, experiments.", steps: "Analytics, A/B tests, diary studies.", artifacts: "Funnel charts, experiment results.", sync: "pmf-signals.md quantitative section." },
  { slug: "mixed-methods", name: "Mixed Methods", desc: "Combine qual and quant", when: "Triangulate findings.", steps: "Sequence qual → quant or parallel tracks.", artifacts: "Mixed methods matrix.", sync: "Cross-link insights in research-insights.md." },
];

const PROCESS_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  { slug: "double-diamond", name: "Double Diamond", desc: "Discover, define, develop, deliver", when: "UK Design Council model.", steps: "Diverge/converge twice — problem then solution.", artifacts: "Diamond phase gate checklist.", sync: "Mark phase in discovery-log.md." },
  { slug: "lean-startup", name: "Lean Startup", desc: "Build–measure–learn", when: "High uncertainty startups.", steps: "MVP → measure → pivot or persevere.", artifacts: "Learning card; pivot log.", sync: "pivot-review event triggers." },
  { slug: "design-thinking", name: "Design Thinking", desc: "Empathise through test", when: "Workshop-heavy innovation.", steps: "Five phases with prototyping.", artifacts: "Empathy map, POV, HMW.", sync: "Workshop outputs to opportunity-tree.md." },
  { slug: "jtbd-framework", name: "JTBD Framework", desc: "Jobs customers hire products to do", when: "Market and switching analysis.", steps: "Forces of progress, job map, hiring criteria.", artifacts: "Job story, switch interview notes.", sync: "JTBD insights in research-insights.md." },
  { slug: "value-proposition-canvas", name: "Value Proposition Canvas", desc: "Customer profile vs value map", when: "Aligning product to customer jobs/pains/gains.", steps: "Fill customer profile then value map; fit check.", artifacts: "VPC canvas (markdown table).", sync: "Link VPC to opportunity-tree.md." },
  { slug: "lean-ux", name: "Lean UX", desc: "Hypothesis-driven design", when: "Cross-functional agile teams.", steps: "Hypothesis → MVP design → test → learn.", artifacts: "Hypothesis statement template.", sync: "Assumptions in assumptions-risks.md." },
  { slug: "outcome-driven-innovation", name: "Outcome-Driven Innovation", desc: "Desired outcomes and underserved jobs", when: "B2B innovation; ODI methodology.", steps: "Outcome statements, importance/satisfaction scores.", artifacts: "Outcome graph.", sync: "Opportunities ranked by underserved outcomes." },
];

const METHOD_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  { slug: "user-interviews", name: "User Interviews", desc: "1:1 qualitative interviews", when: "Generative or evaluative qual.", steps: "Recruit → script → 45–60min → synthesise within 48h.", artifacts: "Discussion guide; note template; consent.", sync: "discovery-log.md + research-insights.md." },
  { slug: "contextual-inquiry", name: "Contextual Inquiry", desc: "Observe users in context", when: "Workflow and environment matter.", steps: "Field visit; master-apprentice model.", artifacts: "Observation protocol.", sync: "Journey insights to research-insights.md." },
  { slug: "usability-testing", name: "Usability Testing", desc: "Task-based interface evaluation", when: "Solution validation.", steps: "Tasks → think-aloud → severity rating.", artifacts: "Test script; success criteria per task.", sync: "Task success rates in research-insights.md." },
  { slug: "surveys", name: "Surveys", desc: "Structured quant or qual-at-scale", when: "Attitudinal or PMF measurement.", steps: "Design → pilot → field → analyse.", artifacts: "Questionnaire; segment quotas.", sync: "pmf-signals.md for PMF surveys." },
  { slug: "card-sorting", name: "Card Sorting", desc: "IA validation", when: "Navigation and taxonomy.", steps: "Open or closed sort; analyse clusters.", artifacts: "Card list; dendrogram notes.", sync: "IA decisions in prefrontalCortex/decisions.md." },
  { slug: "tree-testing", name: "Tree Testing", desc: "Findability without visual design", when: "Validate IA before UI.", steps: "Tree JSON → tasks → success paths.", artifacts: "Tree definition; task list.", sync: "Link to architecture decisions if needed." },
  { slug: "diary-studies", name: "Diary Studies", desc: "Longitudinal self-reported behaviour", when: "Habits over days/weeks.", steps: "Onboard → daily prompts → exit interview.", artifacts: "Diary protocol; incentive plan.", sync: "Timeline themes in research-insights.md." },
  { slug: "prototype-testing", name: "Prototype Testing", desc: "Test fidelity prototypes", when: "Before engineering build.", steps: "Prototype → scenario tasks → iterate.", artifacts: "Prototype link; scenario script.", sync: "Validation status on opportunity-tree.md." },
  { slug: "concept-testing", name: "Concept Testing", desc: "Test value prop before build", when: "Early solution validation.", steps: "Concept board → reactions → preference.", artifacts: "Concept variants; scoring rubric.", sync: "Winning concept in opportunity-tree.md." },
  { slug: "jobs-to-be-done", name: "JTBD Interviews", desc: "Switch interviews and job mapping", when: "Understanding why customers switch.", steps: "Timeline interview; forces of progress.", artifacts: "Switch interview guide.", sync: "Job stories in research-insights.md." },
  { slug: "ethnography", name: "Ethnography", desc: "Deep field observation", when: "Complex social/contextual domains.", steps: "Immersion; field notes; thematic analysis.", artifacts: "Field note template.", sync: "Rich narratives in research-insights.md." },
  { slug: "analytics-review", name: "Analytics Review", desc: "Quantitative behaviour analysis", when: "Behavioral; existing product data.", steps: "Funnel → cohort → segment drill-down.", artifacts: "Metrics dashboard spec.", sync: "pmf-signals.md quantitative." },
  { slug: "competitive-analysis", name: "Competitive Analysis", desc: "Benchmark competitors", when: "Ideation and positioning.", steps: "Landscape → feature matrix → gaps.", artifacts: "Competitive matrix table.", sync: "Gaps as opportunities in opportunity-tree.md." },
  { slug: "pricing-research", name: "Pricing Research", desc: "Willingness to pay tests", when: "Monetisation decisions.", steps: "Van Westendorp or conjoint; segment tests.", artifacts: "Price sensitivity survey.", sync: "Pricing assumptions in assumptions-risks.md." },
  { slug: "a-b-testing", name: "A/B Testing", desc: "Controlled live experiments", when: "Growth stage; sufficient traffic.", steps: "Hypothesis → power analysis → ship → read.", artifacts: "Experiment doc; guardrails.", sync: "Results in pmf-signals.md or feature-map." },
  { slug: "heatmap-session-replay", name: "Heatmaps & Session Replay", desc: "Behavioural analytics on real usage", when: "Find friction in live UI.", steps: "Instrument → sample sessions → prioritise fixes.", artifacts: "Friction highlight reel notes.", sync: "UX issues → opportunity-tree or GitHub issues." },
];

const EVENT_DEFS: Array<Omit<DiscoveryPackDef, "id"> & { slug: string }> = [
  { slug: "design-sprint", name: "Design Sprint", desc: "5-day GV design sprint", when: "Validate solution in one week.", steps: "Mon map → sketch → decide → prototype → test.", artifacts: "Sprint brief; storyboard; test script.", events: "5 consecutive days; decider required each day.", sync: "Sprint outcome in opportunity-tree.md." },
  { slug: "discovery-sprint", name: "Discovery Sprint", desc: "Time-boxed research sprint", when: "Focused research push.", steps: "Plan Mon → field Tue–Thu → synthesise Fri.", artifacts: "Sprint backlog of questions.", sync: "Full readout to research-insights.md." },
  { slug: "kickoff-workshop", name: "Kickoff Workshop", desc: "Align stakeholders on problem", when: "New initiative or quarter.", steps: "Goals → constraints → risks → success metrics.", artifacts: "Workshop agenda; parking lot.", sync: "Goals in product-overview.md." },
  { slug: "story-mapping", name: "Story Mapping", desc: "User journey to release slices", when: "Release planning from journey.", steps: "Walk the map → slice MVP → order releases.", artifacts: "Story map (backbone + stories).", sync: "Slices link to feature-map.md." },
  { slug: "assumption-mapping", name: "Assumption Mapping", desc: "Prioritise riskiest assumptions", when: "Before building.", steps: "List assumptions → impact × uncertainty → test top.", artifacts: "Assumption map grid.", sync: "assumptions-risks.md populated." },
  { slug: "opportunity-mapping", name: "Opportunity Mapping", desc: "Map outcomes to opportunities", when: "OST kickoff.", steps: "Outcome → brainstorm opportunities → cluster.", artifacts: "Opportunity map wall.", sync: "opportunity-tree.md seeded." },
  { slug: "synthesis-session", name: "Synthesis Session", desc: "Cluster insights into opportunities", when: "After field research.", steps: "Affinity diagram → themes → opportunities.", artifacts: "Affinity clusters.", sync: "research-insights.md updated." },
  { slug: "prioritization-workshop", name: "Prioritization Workshop", desc: "Rank opportunities for next cycle", when: "Before delivery planning.", steps: "ICE/RICE/OST review → commit top items.", artifacts: "Scored backlog.", sync: "Top opportunities marked in opportunity-tree.md." },
  { slug: "pivot-review", name: "Pivot Review", desc: "Continue, pivot, or kill", when: "PMF signals weak or market shift.", steps: "Review evidence → decision → communicate.", artifacts: "Pivot decision record.", sync: "pmf-signals.md decision section." },
  { slug: "research-readout", name: "Research Readout", desc: "Share findings with stakeholders", when: "After any significant study.", steps: "30min presentation + Q&A + actions.", artifacts: "Readout deck outline (markdown).", sync: "Actions in hippocampus/research-backlog.md." },
];

export const DISCOVERY_PACKS: KnowledgePack[] = [
  ...FOUNDATION_PACKS,
  ...TEAM_DEFS.map((d) => subPack("discovery/teams", d)),
  ...LIFECYCLE_DEFS.map((d) => subPack("discovery/lifecycle", d)),
  ...RESEARCH_TYPE_DEFS.map((d) => subPack("discovery/research-types", d)),
  ...PROCESS_DEFS.map((d) => subPack("discovery/processes", d)),
  ...METHOD_DEFS.map((d) => subPack("discovery/methods", d)),
  ...EVENT_DEFS.map((d) => subPack("discovery/events", d)),
];

export const DISCOVERY_PACK_COUNT = DISCOVERY_PACKS.length;
