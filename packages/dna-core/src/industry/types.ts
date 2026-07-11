export interface IndustrySectorDef {
  id: string;
  name: string;
  description: string;
  landscape: string;
  influencers: string;
  techStack: string;
  latest: string;
  practices: string;
  regulation: string;
  agencyNotes: string;
  uiPatterns: string;
  linkedPacks: string[];
  tags?: string[];
}

export const INDUSTRY_KNOWLEDGE_FILES = [
  "overview.dna.md",
  "influencers.dna.md",
  "tech-stack.dna.md",
  "latest.dna.md",
  "practices.dna.md",
  "regulation.dna.md",
  "agency-notes.dna.md",
  "ui-patterns.dna.md",
] as const;

export type IndustryKnowledgeFile = (typeof INDUSTRY_KNOWLEDGE_FILES)[number];
