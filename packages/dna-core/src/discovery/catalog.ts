import type { DnaConfig } from "@superhumaan/dna-config";
import {
  DEFAULT_DISCOVERY_PROFILE,
  DISCOVERY_EVENTS,
  DISCOVERY_FOUNDATION_PACK_IDS,
  DISCOVERY_LIFECYCLE_STAGES,
  DISCOVERY_METHODS,
  DISCOVERY_PROCESSES,
  DISCOVERY_TEAM_MODELS,
} from "@superhumaan/dna-config";

export type DiscoveryLifecycleStage = (typeof DISCOVERY_LIFECYCLE_STAGES)[number];
export type DiscoveryTeamModel = (typeof DISCOVERY_TEAM_MODELS)[number];
export type DiscoveryProcess = (typeof DISCOVERY_PROCESSES)[number];
export type DiscoveryMethod = (typeof DISCOVERY_METHODS)[number];
export type DiscoveryEvent = (typeof DISCOVERY_EVENTS)[number];

export interface DiscoveryProfile {
  lifecycleStage: DiscoveryLifecycleStage;
  teamModel: DiscoveryTeamModel;
  activeProcesses: DiscoveryProcess[];
  activeMethods: DiscoveryMethod[];
  activeEvents: DiscoveryEvent[];
  customProfile: string;
}

export interface LifecycleMeta {
  id: DiscoveryLifecycleStage;
  name: string;
  description: string;
  packId: string;
  recommendedMethods: DiscoveryMethod[];
}

export interface TeamMeta {
  id: DiscoveryTeamModel;
  name: string;
  description: string;
  packId?: string;
}

export interface ProcessMeta {
  id: DiscoveryProcess;
  name: string;
  description: string;
  packId: string;
}

export interface MethodMeta {
  id: DiscoveryMethod;
  name: string;
  description: string;
  researchType: string;
  packId: string;
}

export interface EventMeta {
  id: DiscoveryEvent;
  name: string;
  description: string;
  packId: string;
}

export const LIFECYCLE_CATALOG: LifecycleMeta[] = [
  {
    id: "ideation",
    name: "Ideation",
    description: "Explore problems, opportunities, and strategic bets before validation",
    packId: "discovery/lifecycle/ideation",
    recommendedMethods: ["jobs-to-be-done", "competitive-analysis", "user-interviews"],
  },
  {
    id: "problem-validation",
    name: "Problem validation",
    description: "Confirm the problem is real, frequent, and painful for target users",
    packId: "discovery/lifecycle/problem-validation",
    recommendedMethods: ["user-interviews", "surveys", "analytics-review"],
  },
  {
    id: "solution-validation",
    name: "Solution validation",
    description: "Test whether proposed solutions solve the validated problem",
    packId: "discovery/lifecycle/solution-validation",
    recommendedMethods: ["prototype-testing", "usability-testing", "concept-testing"],
  },
  {
    id: "pmf",
    name: "Product–market fit",
    description: "Measure retention, satisfaction, and willingness to pay",
    packId: "discovery/lifecycle/pmf",
    recommendedMethods: ["surveys", "analytics-review", "a-b-testing"],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Optimise acquisition, activation, and expansion loops",
    packId: "discovery/lifecycle/growth",
    recommendedMethods: ["a-b-testing", "analytics-review", "heatmap-session-replay"],
  },
  {
    id: "scale",
    name: "Scale",
    description: "Discovery at scale — portfolio bets, platform opportunities, new segments",
    packId: "discovery/lifecycle/scale",
    recommendedMethods: ["surveys", "ethnography", "competitive-analysis"],
  },
];

export const TEAM_CATALOG: TeamMeta[] = [
  { id: "none", name: "None", description: "No dedicated discovery team overlay" },
  {
    id: "innovation-lab",
    name: "Innovation lab",
    description: "Central lab exploring bets, prototypes, and new markets",
    packId: "discovery/teams/innovation-lab",
  },
  {
    id: "discovery-squad",
    name: "Discovery squad",
    description: "Cross-functional squad owning continuous discovery for a product area",
    packId: "discovery/teams/discovery-squad",
  },
  {
    id: "embedded-triad",
    name: "Embedded triad",
    description: "PM + design + engineering triad embedded in delivery teams",
    packId: "discovery/teams/embedded-triad",
  },
  {
    id: "dual-track",
    name: "Dual-track",
    description: "Parallel discovery and delivery tracks with regular handoffs",
    packId: "discovery/teams/dual-track-squad",
  },
  {
    id: "design-ops",
    name: "Design ops",
    description: "Design operations enabling research, systems, and quality at scale",
    packId: "discovery/teams/design-ops",
  },
];

export const PROCESS_CATALOG: ProcessMeta[] = [
  {
    id: "continuous-discovery",
    name: "Continuous discovery",
    description: "Weekly customer touchpoints, opportunity solution trees, assumption tests",
    packId: "discovery/continuous-discovery",
  },
  {
    id: "double-diamond",
    name: "Double diamond",
    description: "Diverge/converge discover and define phases",
    packId: "discovery/processes/double-diamond",
  },
  {
    id: "lean-startup",
    name: "Lean startup",
    description: "Build–measure–learn loops and validated learning",
    packId: "discovery/processes/lean-startup",
  },
  {
    id: "design-thinking",
    name: "Design thinking",
    description: "Empathise, define, ideate, prototype, test",
    packId: "discovery/processes/design-thinking",
  },
  {
    id: "jtbd-framework",
    name: "Jobs to be done",
    description: "Frame opportunities around jobs customers hire products to do",
    packId: "discovery/processes/jtbd-framework",
  },
  {
    id: "value-proposition-canvas",
    name: "Value proposition canvas",
    description: "Map customer jobs, pains, gains to product value",
    packId: "discovery/processes/value-proposition-canvas",
  },
  {
    id: "lean-ux",
    name: "Lean UX",
    description: "Hypothesis-driven design with fast feedback loops",
    packId: "discovery/processes/lean-ux",
  },
  {
    id: "outcome-driven-innovation",
    name: "Outcome-driven innovation",
    description: "Desired outcomes and underserved jobs in a market",
    packId: "discovery/processes/outcome-driven-innovation",
  },
];

export const METHOD_CATALOG: MethodMeta[] = [
  { id: "user-interviews", name: "User interviews", description: "1:1 qualitative interviews", researchType: "generative", packId: "discovery/methods/user-interviews" },
  { id: "contextual-inquiry", name: "Contextual inquiry", description: "Observe users in their environment", researchType: "generative", packId: "discovery/methods/contextual-inquiry" },
  { id: "usability-testing", name: "Usability testing", description: "Task-based evaluation of interfaces", researchType: "evaluative", packId: "discovery/methods/usability-testing" },
  { id: "surveys", name: "Surveys", description: "Structured quantitative or qual-at-scale input", researchType: "attitudinal", packId: "discovery/methods/surveys" },
  { id: "card-sorting", name: "Card sorting", description: "Information architecture validation", researchType: "evaluative", packId: "discovery/methods/card-sorting" },
  { id: "tree-testing", name: "Tree testing", description: "Validate navigation findability", researchType: "evaluative", packId: "discovery/methods/tree-testing" },
  { id: "diary-studies", name: "Diary studies", description: "Longitudinal self-reported behaviour", researchType: "behavioral", packId: "discovery/methods/diary-studies" },
  { id: "prototype-testing", name: "Prototype testing", description: "Test fidelity prototypes with users", researchType: "evaluative", packId: "discovery/methods/prototype-testing" },
  { id: "concept-testing", name: "Concept testing", description: "Test value prop before build", researchType: "evaluative", packId: "discovery/methods/concept-testing" },
  { id: "jobs-to-be-done", name: "JTBD interviews", description: "Switch interviews and job mapping", researchType: "generative", packId: "discovery/methods/jobs-to-be-done" },
  { id: "ethnography", name: "Ethnography", description: "Deep field observation and cultural context", researchType: "generative", packId: "discovery/methods/ethnography" },
  { id: "analytics-review", name: "Analytics review", description: "Quantitative behaviour analysis", researchType: "behavioral", packId: "discovery/methods/analytics-review" },
  { id: "competitive-analysis", name: "Competitive analysis", description: "Benchmark competitors and alternatives", researchType: "generative", packId: "discovery/methods/competitive-analysis" },
  { id: "pricing-research", name: "Pricing research", description: "Willingness to pay and packaging tests", researchType: "evaluative", packId: "discovery/methods/pricing-research" },
  { id: "a-b-testing", name: "A/B testing", description: "Controlled experiments on live product", researchType: "behavioral", packId: "discovery/methods/a-b-testing" },
  { id: "heatmap-session-replay", name: "Heatmaps & session replay", description: "Behavioural analytics on real usage", researchType: "behavioral", packId: "discovery/methods/heatmap-session-replay" },
];

export const EVENT_CATALOG: EventMeta[] = [
  { id: "design-sprint", name: "Design sprint", description: "5-day Google Ventures-style sprint", packId: "discovery/events/design-sprint" },
  { id: "discovery-sprint", name: "Discovery sprint", description: "Time-boxed research and synthesis sprint", packId: "discovery/events/discovery-sprint" },
  { id: "kickoff-workshop", name: "Kickoff workshop", description: "Align stakeholders on problem and scope", packId: "discovery/events/kickoff-workshop" },
  { id: "story-mapping", name: "Story mapping", description: "Map user journey to release slices", packId: "discovery/events/story-mapping" },
  { id: "assumption-mapping", name: "Assumption mapping", description: "Prioritise riskiest assumptions to test", packId: "discovery/events/assumption-mapping" },
  { id: "opportunity-mapping", name: "Opportunity mapping", description: "Map outcomes to opportunity areas", packId: "discovery/events/opportunity-mapping" },
  { id: "synthesis-session", name: "Synthesis session", description: "Cluster insights into opportunities", packId: "discovery/events/synthesis-session" },
  { id: "prioritization-workshop", name: "Prioritization workshop", description: "Rank opportunities for next cycle", packId: "discovery/events/prioritization-workshop" },
  { id: "pivot-review", name: "Pivot review", description: "Decide continue, pivot, or kill", packId: "discovery/events/pivot-review" },
  { id: "research-readout", name: "Research readout", description: "Share findings with stakeholders", packId: "discovery/events/research-readout" },
];

function findMeta<T extends { id: string }>(catalog: T[], id: string): T | undefined {
  return catalog.find((entry) => entry.id === id);
}

export function getLifecycleMeta(id: DiscoveryLifecycleStage): LifecycleMeta {
  return findMeta(LIFECYCLE_CATALOG, id) ?? LIFECYCLE_CATALOG[0]!;
}

export function getTeamMeta(id: DiscoveryTeamModel): TeamMeta {
  return findMeta(TEAM_CATALOG, id) ?? TEAM_CATALOG[0]!;
}

export function getProcessMeta(id: DiscoveryProcess): ProcessMeta {
  return findMeta(PROCESS_CATALOG, id) ?? PROCESS_CATALOG[0]!;
}

export function getMethodMeta(id: DiscoveryMethod): MethodMeta {
  return findMeta(METHOD_CATALOG, id) ?? METHOD_CATALOG[0]!;
}

export function getEventMeta(id: DiscoveryEvent): EventMeta {
  return findMeta(EVENT_CATALOG, id) ?? EVENT_CATALOG[0]!;
}

export function parseLifecycleInput(input: string): DiscoveryLifecycleStage {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, DiscoveryLifecycleStage> = {
    ideation: "ideation",
    idea: "ideation",
    "problem-validation": "problem-validation",
    problem: "problem-validation",
    "solution-validation": "solution-validation",
    solution: "solution-validation",
    pmf: "pmf",
    "product-market-fit": "pmf",
    growth: "growth",
    scale: "scale",
  };
  const resolved = aliases[normalized] ?? (normalized as DiscoveryLifecycleStage);
  if (!DISCOVERY_LIFECYCLE_STAGES.includes(resolved)) {
    throw new Error(`Unknown lifecycle stage: ${input}. Valid: ${DISCOVERY_LIFECYCLE_STAGES.join(", ")}`);
  }
  return resolved;
}

export function parseTeamInput(input: string): DiscoveryTeamModel {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, DiscoveryTeamModel> = {
    none: "none",
    "innovation-lab": "innovation-lab",
    lab: "innovation-lab",
    "discovery-squad": "discovery-squad",
    squad: "discovery-squad",
    "embedded-triad": "embedded-triad",
    triad: "embedded-triad",
    "dual-track": "dual-track",
    dual: "dual-track",
    "design-ops": "design-ops",
  };
  const resolved = aliases[normalized] ?? (normalized as DiscoveryTeamModel);
  if (!DISCOVERY_TEAM_MODELS.includes(resolved)) {
    throw new Error(`Unknown team model: ${input}. Valid: ${DISCOVERY_TEAM_MODELS.join(", ")}`);
  }
  return resolved;
}

export function parseProcessInput(input: string): DiscoveryProcess {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  if (!DISCOVERY_PROCESSES.includes(normalized as DiscoveryProcess)) {
    throw new Error(`Unknown process: ${input}. Valid: ${DISCOVERY_PROCESSES.join(", ")}`);
  }
  return normalized as DiscoveryProcess;
}

export function parseMethodInput(input: string): DiscoveryMethod {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, DiscoveryMethod> = {
    interviews: "user-interviews",
    "user-interviews": "user-interviews",
    usability: "usability-testing",
    "usability-testing": "usability-testing",
    ab: "a-b-testing",
    "a-b-testing": "a-b-testing",
    jtbd: "jobs-to-be-done",
    "jobs-to-be-done": "jobs-to-be-done",
  };
  const resolved = aliases[normalized] ?? (normalized as DiscoveryMethod);
  if (!DISCOVERY_METHODS.includes(resolved)) {
    throw new Error(`Unknown method: ${input}. Valid: ${DISCOVERY_METHODS.join(", ")}`);
  }
  return resolved;
}

export function parseEventInput(input: string): DiscoveryEvent {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  if (!DISCOVERY_EVENTS.includes(normalized as DiscoveryEvent)) {
    throw new Error(`Unknown event: ${input}. Valid: ${DISCOVERY_EVENTS.join(", ")}`);
  }
  return normalized as DiscoveryEvent;
}

export function parseCsvDiscoveryIds<T extends string>(
  input: string | undefined,
  parser: (value: string) => T,
): T[] {
  if (!input?.trim()) return [];
  return input.split(",").map((part) => parser(part.trim()));
}

export function resolveDiscoveryProfile(config: DnaConfig | null): DiscoveryProfile {
  const d = config?.discovery;
  return {
    lifecycleStage: d?.lifecycleStage ?? DEFAULT_DISCOVERY_PROFILE.lifecycleStage,
    teamModel: d?.teamModel ?? DEFAULT_DISCOVERY_PROFILE.teamModel,
    activeProcesses: d?.activeProcesses?.length
      ? d.activeProcesses
      : [...DEFAULT_DISCOVERY_PROFILE.activeProcesses],
    activeMethods: d?.activeMethods ?? [],
    activeEvents: d?.activeEvents ?? [],
    customProfile: d?.customProfile ?? DEFAULT_DISCOVERY_PROFILE.customProfile,
  };
}

export function knowledgePackIdsForDiscoveryProfile(profile: DiscoveryProfile): string[] {
  const ids = new Set<string>(DISCOVERY_FOUNDATION_PACK_IDS);

  const team = getTeamMeta(profile.teamModel);
  if (team.packId) ids.add(team.packId);

  ids.add(getLifecycleMeta(profile.lifecycleStage).packId);

  for (const processId of profile.activeProcesses) {
    ids.add(getProcessMeta(processId).packId);
  }
  for (const methodId of profile.activeMethods) {
    ids.add(getMethodMeta(methodId).packId);
  }
  for (const eventId of profile.activeEvents) {
    ids.add(getEventMeta(eventId).packId);
  }

  return [...ids];
}

export function knowledgePathsForDiscoveryProfile(profile: DiscoveryProfile): string[] {
  const paths: string[] = [];
  for (const packId of knowledgePackIdsForDiscoveryProfile(profile)) {
    paths.push(`${packId}/positioning.dna.md`);
    paths.push(`${packId}/process.dna.md`);
    paths.push(`${packId}/artifacts.dna.md`);
  }
  return paths;
}
