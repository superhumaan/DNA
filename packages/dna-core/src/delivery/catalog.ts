import type { DnaConfig } from "@superhumaan/dna-config";
import {
  COMPANY_ARCHETYPES,
  DELIVERY_METHODOLOGIES,
  DOC_SYSTEMS,
  TICKET_SYSTEMS,
  WORK_HIERARCHY_LEVELS,
} from "@superhumaan/dna-config";

export type DeliveryMethodology = (typeof DELIVERY_METHODOLOGIES)[number];
export type CompanyArchetype = (typeof COMPANY_ARCHETYPES)[number];
export type TicketSystem = (typeof TICKET_SYSTEMS)[number];
export type DocSystem = (typeof DOC_SYSTEMS)[number];
export type WorkHierarchyLevel = (typeof WORK_HIERARCHY_LEVELS)[number];

export interface DeliveryProfile {
  methodology: DeliveryMethodology;
  companyArchetype: CompanyArchetype;
  ticketSystem: TicketSystem;
  docSystem: DocSystem;
  hierarchy: WorkHierarchyLevel[];
  ceremonies: string[];
  customProfile: string;
}

export interface MethodologyMeta {
  id: DeliveryMethodology;
  name: string;
  description: string;
  defaultHierarchy: WorkHierarchyLevel[];
  defaultCeremonies: string[];
  packId: string;
}

export interface ArchetypeMeta {
  id: CompanyArchetype;
  name: string;
  description: string;
  packId?: string;
}

export const METHODOLOGY_CATALOG: MethodologyMeta[] = [
  {
    id: "dna-default",
    name: "DNA Feature Factory",
    description: "DNA default — feature request, agent loop, GitHub issues, Impressions docs",
    defaultHierarchy: ["feature", "story", "task"],
    defaultCeremonies: ["plan", "implement", "quality-gate", "ship"],
    packId: "methodologies/dna-default",
  },
  {
    id: "scrum",
    name: "Scrum",
    description: "Time-boxed sprints, product backlog, story points, Definition of Done",
    defaultHierarchy: ["epic", "story", "subtask"],
    defaultCeremonies: ["sprint-planning", "daily-standup", "refinement", "sprint-review", "retro"],
    packId: "methodologies/scrum",
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Flow-based delivery, WIP limits, cycle time — no fixed sprints",
    defaultHierarchy: ["epic", "story", "task"],
    defaultCeremonies: ["replenishment", "delivery-review", "risk-review"],
    packId: "methodologies/kanban",
  },
  {
    id: "less",
    name: "LeSS (Large-Scale Scrum)",
    description: "Feature teams, system thinking, integration across multiple Scrum teams",
    defaultHierarchy: ["initiative", "epic", "story"],
    defaultCeremonies: ["overall-retro", "multi-team-pbr", "system-demo"],
    packId: "methodologies/less",
  },
  {
    id: "safe",
    name: "SAFe",
    description: "Scaled Agile — PI planning, ARTs, enablers, program increments",
    defaultHierarchy: ["theme", "epic", "feature", "story"],
    defaultCeremonies: ["pi-planning", "scrum-of-scrums", "inspect-adapt", "system-demo"],
    packId: "methodologies/safe",
  },
  {
    id: "spotify-model",
    name: "Spotify Model",
    description: "Squads, tribes, chapters, guilds — autonomous teams with alignment",
    defaultHierarchy: ["initiative", "epic", "story"],
    defaultCeremonies: ["tribe-sync", "squad-demo", "chapter-sync"],
    packId: "methodologies/spotify-model",
  },
  {
    id: "shape-up",
    name: "Shape Up",
    description: "Appetite-driven bets, pitches, no backlog grooming — Basecamp pattern",
    defaultHierarchy: ["bet", "scope", "task"],
    defaultCeremonies: ["shaping", "betting-table", "cool-down"],
    packId: "methodologies/shape-up",
  },
];

export const ARCHETYPE_CATALOG: ArchetypeMeta[] = [
  { id: "none", name: "None", description: "No company archetype overlay" },
  {
    id: "travel-scale-up",
    name: "Travel scale-up",
    description: "Tribe/squad orgs, quarterly initiatives, Jira-heavy (Agoda-like)",
    packId: "companies/travel-scale-up",
  },
  {
    id: "big-tech",
    name: "Big tech",
    description: "OKR-driven, design docs, launch reviews (Google-like)",
    packId: "companies/big-tech",
  },
  {
    id: "research-lab",
    name: "Research lab",
    description: "Fast iteration, eval-driven, lightweight specs (OpenAI-like)",
    packId: "companies/research-lab",
  },
  {
    id: "agency",
    name: "Agency",
    description: "Client SOW → deliverables, time tracking, client-facing specs",
    packId: "companies/agency",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Small team, minimal ceremony, ship fast",
    packId: "companies/startup",
  },
];

export function getMethodologyMeta(id: DeliveryMethodology): MethodologyMeta {
  return METHODOLOGY_CATALOG.find((m) => m.id === id) ?? METHODOLOGY_CATALOG[0]!;
}

export function getArchetypeMeta(id: CompanyArchetype): ArchetypeMeta {
  return ARCHETYPE_CATALOG.find((a) => a.id === id) ?? ARCHETYPE_CATALOG[0]!;
}

export function parseMethodologyInput(input: string): DeliveryMethodology {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, DeliveryMethodology> = {
    scrum: "scrum",
    kanban: "kanban",
    less: "less",
    "large-scale-scrum": "less",
    safe: "safe",
    spotify: "spotify-model",
    tribes: "spotify-model",
    "spotify-model": "spotify-model",
    "shape-up": "shape-up",
    shapeup: "shape-up",
    dna: "dna-default",
    "dna-default": "dna-default",
    default: "dna-default",
  };
  const resolved = aliases[normalized] ?? (normalized as DeliveryMethodology);
  if (!DELIVERY_METHODOLOGIES.includes(resolved)) {
    throw new Error(
      `Unknown methodology: ${input}. Valid: ${DELIVERY_METHODOLOGIES.join(", ")}`,
    );
  }
  return resolved;
}

export function parseArchetypeInput(input: string): CompanyArchetype {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, "-");
  const aliases: Record<string, CompanyArchetype> = {
    agoda: "travel-scale-up",
    "travel-scale-up": "travel-scale-up",
    travel: "travel-scale-up",
    google: "big-tech",
    "big-tech": "big-tech",
    openai: "research-lab",
    "research-lab": "research-lab",
    agency: "agency",
    startup: "startup",
    none: "none",
  };
  const resolved = aliases[normalized] ?? (normalized as CompanyArchetype);
  if (!COMPANY_ARCHETYPES.includes(resolved)) {
    throw new Error(
      `Unknown archetype: ${input}. Valid: ${COMPANY_ARCHETYPES.join(", ")}`,
    );
  }
  return resolved;
}

export function resolveDeliveryProfile(config: DnaConfig | null): DeliveryProfile {
  const d = config?.delivery;
  const methodology = d?.methodology ?? "dna-default";
  const meta = getMethodologyMeta(methodology);
  return {
    methodology,
    companyArchetype: d?.companyArchetype ?? "none",
    ticketSystem: d?.ticketSystem ?? "github",
    docSystem: d?.docSystem ?? "impressions",
    hierarchy: d?.hierarchy?.length ? d.hierarchy : meta.defaultHierarchy,
    ceremonies: d?.ceremonies?.length ? d.ceremonies : meta.defaultCeremonies,
    customProfile: d?.customProfile ?? ".DNA/delivery/profile.md",
  };
}

export function knowledgePackIdsForProfile(profile: DeliveryProfile): string[] {
  const ids = new Set<string>([
    getMethodologyMeta(profile.methodology).packId,
    "methodologies/ticket-writing",
    "methodologies/document-writing",
  ]);
  const archetype = getArchetypeMeta(profile.companyArchetype);
  if (archetype.packId) ids.add(archetype.packId);
  if (profile.ticketSystem === "jira") ids.add("integrations/jira");
  if (profile.ticketSystem === "linear") ids.add("integrations/linear");
  return [...ids];
}

export function knowledgePathsForProfile(profile: DeliveryProfile): string[] {
  const paths: string[] = [];
  for (const packId of knowledgePackIdsForProfile(profile)) {
    paths.push(`${packId}/positioning.dna.md`);
    paths.push(`${packId}/artifacts.dna.md`);
  }
  return paths;
}
