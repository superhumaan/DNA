/** Pack lifecycle tag for marketplace filtering and greenfield guidance */
export type PackMaturity = "legacy" | "mainstream" | "emerging";

const LEGACY_IDS = new Set([
  "cms/wordpress",
  "frameworks/ember",
  "frameworks/apache-camel",
  "healthcare/hl7-v2",
  "healthcare/openemr",
  "cloud/heroku",
  "cloud/chef",
  "cloud/puppet",
  "databases/oracle",
  "databases/mysql",
  "databases/couchdb",
  "languages/perl",
  "languages/objective-c",
  "tools/webpack",
  "ecommerce/woocommerce",
  "integrations/mulesoft",
  "erp/sap",
  "erp/oracle-fusion",
]);

const EMERGING_IDS = new Set([
  "databases/convex",
  "databases/instantdb",
  "frameworks/electric-sql",
  "frameworks/powersync",
  "frameworks/trigger-dev",
  "frameworks/tamagui",
  "frameworks/uniwind",
  "frameworks/wasp",
  "realtime/partykit",
  "realtime/yjs",
  "cloud/wasm-edge",
  "cloud/fastly-compute",
  "cloud/coolify",
  "cloud/caprover",
  "xr/visionos",
  "xr/8th-wall",
  "ai/crewai",
  "ai/autogen",
  "ai/apple-intelligence",
  "ai/nvidia-nim",
  "web3/ethereum",
  "web3/solana",
  "iot/digital-twins",
  "healthcare/clinical-ai",
  "tools/biome",
  "data/data-mesh",
  "data/data-contracts",
]);

const LEGACY_PREFIXES = ["healthcare/hl7", "languages/perl"];

const EMERGING_PREFIXES = [
  "web3/",
  "xr/",
  "ai/crew",
  "ai/auto",
  "databases/surreal",
  "databases/fauna",
];

export function resolveMaturity(packId: string): PackMaturity {
  if (LEGACY_IDS.has(packId)) return "legacy";
  if (EMERGING_IDS.has(packId)) return "emerging";
  if (LEGACY_PREFIXES.some((p) => packId.startsWith(p))) return "legacy";
  if (EMERGING_PREFIXES.some((p) => packId.startsWith(p))) return "emerging";
  return "mainstream";
}

export function applyMaturityTag(tags: string[], packId: string): string[] {
  const maturity = resolveMaturity(packId);
  const without = tags.filter((t) => t !== "legacy" && t !== "mainstream" && t !== "emerging");
  return [...without, maturity];
}
