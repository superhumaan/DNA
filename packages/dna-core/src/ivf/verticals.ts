export const IVF_VERTICALS = [
  {
    id: "behaviour",
    name: "Behaviour Layer",
    description: "Six AI behaviour files governing how tools work on this project",
  },
  {
    id: "cellularMemory",
    name: "CellularMemory",
    description: "Project-specific learning regions for AI and runtime",
  },
  {
    id: "runtime",
    name: "Runtime Observer",
    description: "Production error classification with project context",
  },
  {
    id: "rbac",
    name: "RBAC & Zero Trust",
    description: "Permission matrix, server enforcement, surface hiding",
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Tiered controls for GDPR, HIPAA, ISO 27001, SOC 2, PCI",
  },
  {
    id: "platform",
    name: "Platform Features",
    description: "Admin portal, SSO, feature flags, cloud deploy patterns",
  },
  {
    id: "knowledge",
    name: "Knowledge Packs",
    description: "Stack and compliance guidance in .DNA/knowledge/",
  },
  {
    id: "neuralNetwork",
    name: "neuralNetwork",
    description: "Intent → resource routing for AI context",
  },
  {
    id: "impressions",
    name: "Impressions",
    description: "Human-facing documentation in DNA/Impressions/",
  },
] as const;

export type IvfVerticalId = (typeof IVF_VERTICALS)[number]["id"];

export const DEFAULT_IVF_VERTICALS: IvfVerticalId[] = [
  "behaviour",
  "cellularMemory",
  "runtime",
  "knowledge",
  "neuralNetwork",
  "impressions",
];

export type VerticalGapPriority = "P0" | "P1" | "P2" | "P3";

export interface VerticalGap {
  vertical: IvfVerticalId;
  name: string;
  currentState: string;
  targetState: string;
  restructureNeeded: boolean;
  priority: VerticalGapPriority;
  why: string;
  actions: string[];
}

export function parseVerticalsInput(input: string): IvfVerticalId[] {
  const ids = new Set<IvfVerticalId>();
  const valid = new Set(IVF_VERTICALS.map((v) => v.id));

  for (const part of input.split(",")) {
    const id = part.trim() as IvfVerticalId;
    if (valid.has(id)) ids.add(id);
  }

  return [...ids];
}

export function getVerticalName(id: IvfVerticalId): string {
  return IVF_VERTICALS.find((v) => v.id === id)?.name ?? id;
}
