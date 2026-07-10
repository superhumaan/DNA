import type { DeepAnalysis } from "../ivf/analyze.js";
import { PLATFORM_FEATURES } from "./catalog.js";

const INVENTORY_HINTS: Record<string, RegExp> = {
  "admin-portal": /\/admin|AdminPortal|admin-portal/i,
  "rbac-permissions": /requireAdmin|requireRole|capability|permission|rbac/i,
  "sso-bridge": /sso|SsoBridge|silent.?sso/i,
  "google-oauth-directory": /google.*oauth|GoogleOAuth|directory.*sync/i,
  "azure-ad-b2c": /azure.*b2c|msal|entra/i,
  "mfa-2fa": /mfa|two.?factor|2fa|totp/i,
  "ai-governance": /openai|anthropic|llm|ai.?governance|content.?policy/i,
  "feature-flags": /featureFlag|launchdarkly|unleash|flagsmith/i,
  "feature-management": /feature.?management|release.?toggle/i,
  "multi-tenant": /tenant|multi.?tenant|orgId|workspaceId/i,
  "audit-logging": /audit.?log|auditLog|activity.?log/i,
  "vercel-supabase": /supabase|@supabase/i,
  "reporting-analytics": /analytics|dashboard|reporting|metrics/i,
  "cms-content": /cms|contentful|sanity|strapi|payload/i,
  "crm-pipeline": /crm|pipeline|deal.?stage|salesforce/i,
  "harvest-jira-integrations": /jira|harvest|linear\.app/i,
  "nginx-reverse-proxy": /nginx|reverse.?proxy/i,
  "azure-deploy": /azure.*container|azurerm|bicep/i,
  "aws-deploy": /@aws-sdk|cloudformation|ecs|lambda/i,
};

function inventoryText(analysis: DeepAnalysis): string {
  const { inventory } = analysis;
  return [
    ...inventory.routes.map((r) => r.path),
    ...inventory.apis.map((a) => a.path),
    ...inventory.pages.map((p) => p.path),
  ].join(" ");
}

function depsText(scan: DeepAnalysis["scan"]): string {
  return scan.dependencies.join(" ").toLowerCase();
}

/**
 * Detect platform features present in the codebase from deep analysis signals.
 */
export function detectPlatformFeaturesFromAnalysis(analysis: DeepAnalysis): string[] {
  const detected = new Set<string>();
  const paths = inventoryText(analysis);
  const deps = depsText(analysis.scan);
  const integrationNames = analysis.integrations.map((i) => i.name.toLowerCase()).join(" ");

  if (analysis.structure.hasAdminRoute || INVENTORY_HINTS["admin-portal"]!.test(paths)) {
    detected.add("admin-portal");
  }
  if (analysis.authPatterns.length > 0 || INVENTORY_HINTS["rbac-permissions"]!.test(paths)) {
    detected.add("rbac-permissions");
  }

  for (const feature of PLATFORM_FEATURES) {
    const hint = INVENTORY_HINTS[feature.id];
    if (hint && (hint.test(paths) || hint.test(deps) || hint.test(integrationNames))) {
      detected.add(feature.id);
    }
  }

  if (analysis.scan.database === "postgresql" && deps.includes("supabase")) {
    detected.add("vercel-supabase");
  }
  if (analysis.integrations.some((i) => i.name === "Supabase")) {
    detected.add("vercel-supabase");
  }
  if (analysis.integrations.some((i) => /openai|anthropic/i.test(i.name))) {
    detected.add("ai-governance");
  }
  if (analysis.structure.hasFeaturesFolder) {
    detected.add("feature-management");
  }

  return [...detected];
}

export function formatDetectedFeatures(features: string[]): string {
  if (!features.length) return "  (none detected — describe features in Cursor to plan them)";
  return features.map((id) => {
    const meta = PLATFORM_FEATURES.find((f) => f.id === id);
    return `  • ${meta?.name ?? id}`;
  }).join("\n");
}
