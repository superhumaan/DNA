import type { ScanResult, WizardAnswers } from "@superhumaan/dna-config";
import { AI_TOOLS } from "@superhumaan/dna-config";
import { getFeature, PLATFORM_FEATURES } from "./platform/catalog.js";

export const ONBOARDING_PLATFORMS = [
  { id: "web", label: "Web application" },
  { id: "mobile", label: "Mobile app" },
  { id: "desktop", label: "Desktop app" },
  { id: "cms", label: "CMS / content site" },
] as const;

export type OnboardingPlatformId = (typeof ONBOARDING_PLATFORMS)[number]["id"];

/** Curated features shown during onboarding (ids from platform catalog). */
export const ONBOARDING_FEATURE_IDS = [
  "admin-portal",
  "rbac-permissions",
  "sso-bridge",
  "multi-tenant",
  "feature-flags",
  "audit-logging",
  "vercel-supabase",
  "ai-governance",
] as const;

export function onboardingFeatureOptions(): Array<{ id: string; name: string }> {
  return ONBOARDING_FEATURE_IDS.map((id) => {
    const feature = getFeature(id) ?? PLATFORM_FEATURES.find((f) => f.id === id);
    return { id, name: feature?.name ?? id };
  });
}

type AiTool = WizardAnswers["aiTools"][number];

/** DNA always configures Cursor + Claude; adds others when detected in the repo. */
export function detectAiTools(scan: ScanResult): AiTool[] {
  const detected = new Set<AiTool>(["cursor", "claude_code"]);
  const rules = scan.aiRules.join(" ").toLowerCase();

  if (rules.includes("copilot")) detected.add("github_copilot");
  if (rules.includes("windsurf")) detected.add("windsurf");
  if (rules.includes("gemini")) detected.add("gemini");

  return [...detected].filter((t) => t !== "none" && AI_TOOLS.includes(t));
}

export function inferProjectStage(scan: ScanResult): WizardAnswers["stage"] {
  if (scan.hasDna) return "legacy_modernisation";
  if (scan.frontend && scan.backend) return "mvp";
  return "new";
}

export function inferCompliance(description: string): WizardAnswers["compliance"] {
  const d = description.toLowerCase();
  if (d.includes("hipaa") || d.includes("healthcare") || d.includes("phi")) return "hipaa";
  if (d.includes("soc2") || d.includes("soc 2")) return "soc2";
  if (d.includes("gdpr") || d.includes("privacy") || d.includes("uk data")) return "gdpr";
  return "none";
}
