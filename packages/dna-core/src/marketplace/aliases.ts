/** Retired marketplace pack IDs → current IDs. */
export const PACK_ID_ALIASES: Record<string, string> = {
  "platforms/humaan-stack": "platforms/dna-stack",
  // Healthcare country shortcuts — install full country bundle via overview pack
  france: "healthcare/overview-fr",
  french: "healthcare/overview-fr",
  "healthcare/france": "healthcare/overview-fr",
  "healthcare/french": "healthcare/overview-fr",
  usa: "healthcare/overview-us",
  "united-states": "healthcare/overview-us",
  "healthcare/usa": "healthcare/overview-us",
  "healthcare/united-states": "healthcare/overview-us",
  uk: "healthcare/overview-uk",
  britain: "healthcare/overview-uk",
  "united-kingdom": "healthcare/overview-uk",
  "healthcare/uk": "healthcare/overview-uk",
  "healthcare/britain": "healthcare/overview-uk",
  germany: "healthcare/overview-de",
  "healthcare/germany": "healthcare/overview-de",
  canada: "healthcare/overview-ca",
  "healthcare/canada": "healthcare/overview-ca",
  australia: "healthcare/overview-au",
  "healthcare/australia": "healthcare/overview-au",
  japan: "healthcare/overview-jp",
  "healthcare/japan": "healthcare/overview-jp",
  india: "healthcare/overview-in",
  "healthcare/india": "healthcare/overview-in",
  brazil: "healthcare/overview-br",
  "healthcare/brazil": "healthcare/overview-br",
  singapore: "healthcare/overview-sg",
  "healthcare/singapore": "healthcare/overview-sg",
  "new-zealand": "healthcare/overview-nz",
  aotearoa: "healthcare/overview-nz",
  "healthcare/new-zealand": "healthcare/overview-nz",
  apac: "healthcare/overview-apac",
  "asia-pacific": "healthcare/overview-apac",
  "healthcare/apac": "healthcare/overview-apac",
  bangladesh: "healthcare/overview-bd",
  pakistan: "healthcare/overview-pk",
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
