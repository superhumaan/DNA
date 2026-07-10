export const STEM_CATEGORIES = [
  "session",
  "analysis",
  "features",
  "quality",
  "compliance",
  "debug",
  "docs",
  "ivf",
  "delivery",
  "marketplace",
  "memory",
] as const;

export type StemCategory = (typeof STEM_CATEGORIES)[number];

export interface StemGuidelines {
  must: string[];
  never: string[];
  should?: string[];
}

export interface StemExample {
  userSays: string;
  goodResponse: string;
}

/** Authoring definition for one prompt stem pack */
export interface PromptStemPackDef {
  id: string;
  name: string;
  category: StemCategory;
  /** Slash command name without leading slash (e.g. analyze-project) */
  slash?: string;
  summary: string;
  tags: string[];
  /** Short lines users copy-paste into Cursor chat */
  copyVariants: string[];
  /** Full agent prompt body (markdown) */
  prompt: string;
  guidelines: StemGuidelines;
  expectations: string[];
  contextLoads: string[];
  cliCommands: string[];
  examples: StemExample[];
  workflow?: string[];
}

export interface PromptStemPackFile {
  path: string;
  content: string;
}

export interface PromptStemPack extends PromptStemPackDef {
  files: PromptStemPackFile[];
}

/** Catalog entry for dna.humaan.app/intelligence */
export interface IntelligenceStemPackEntry {
  id: string;
  name: string;
  category: StemCategory;
  slash?: string;
  summary: string;
  tags: string[];
  copyVariants: string[];
  copyPrompt: string;
  guidelines: StemGuidelines;
  expectations: string[];
  contextLoads: string[];
  cliCommands: string[];
  files: string[];
  workflow?: string[];
}
