import type { PlatformFeature } from "./catalog.js";
import { mergePackIds, resolvePackIdsForKnowledgePaths } from "../marketplace/resolve.js";

/** Extra packs pulled when planning a feature (transitive dependencies). */
const CATEGORY_EXTRA_PACKS: Partial<Record<PlatformFeature["category"], string[]>> = {
  auth: ["security/rbac-zero-trust"],
  admin: ["security/rbac-zero-trust", "platforms/humaan-stack"],
  integration: ["platforms/humaan-stack"],
  cloud: ["platforms/humaan-stack"],
  product: ["platforms/humaan-stack"],
  ai: ["platforms/humaan-stack", "security/rbac-zero-trust"],
  ops: ["platforms/humaan-stack"],
};

const FEATURE_EXTRA_PACKS: Record<string, string[]> = {
  "rbac-permissions": ["security/rbac-zero-trust"],
  "multi-tenant": ["platforms/b2b-saas"],
  "vercel-supabase": ["frameworks/vite"],
};

export function resolveFeaturePlanPackIds(feature: PlatformFeature): string[] {
  const fromPaths = resolvePackIdsForKnowledgePaths(feature.knowledgeFiles);
  const fromCategory = CATEGORY_EXTRA_PACKS[feature.category] ?? [];
  const fromFeature = FEATURE_EXTRA_PACKS[feature.id] ?? [];
  return mergePackIds(fromPaths, fromCategory, fromFeature);
}
