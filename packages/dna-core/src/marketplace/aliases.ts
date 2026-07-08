/** Retired marketplace pack IDs → current IDs. */
export const PACK_ID_ALIASES: Record<string, string> = {
  "platforms/humaan-stack": "platforms/dna-stack",
};

const LEGACY_KNOWLEDGE_PREFIX = "platforms/humaan/";
const CURRENT_KNOWLEDGE_PREFIX = "platforms/dna/";

export function normalizePackId(packId: string): string {
  return PACK_ID_ALIASES[packId] ?? packId;
}

/** Map retired knowledge paths to current paths before pack resolution. */
export function normalizeKnowledgePath(path: string): string {
  const normalized = path.replace(/^\//, "");
  if (normalized.startsWith(LEGACY_KNOWLEDGE_PREFIX)) {
    return normalized.replace(LEGACY_KNOWLEDGE_PREFIX, CURRENT_KNOWLEDGE_PREFIX);
  }
  return normalized;
}

export function isRetiredPackId(packId: string): boolean {
  return packId in PACK_ID_ALIASES;
}
