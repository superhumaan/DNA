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

/** How init should treat the target folder. */
export type ProjectContext = "empty" | "greenfield" | "existing" | "dna_refresh";

export interface ProjectContextResult {
  context: ProjectContext;
  label: string;
  reason: string;
}

export function detectProjectContext(scan: ScanResult): ProjectContextResult {
  if (scan.hasDna) {
    return {
      context: "dna_refresh",
      label: "DNA refresh",
      reason: "DNA is already installed — refreshing rules, stems, and analysis",
    };
  }

  const depCount = scan.dependencies.length;
  const hasStack = Boolean(scan.frontend || scan.backend || scan.database || scan.testFramework);
  const substantial =
    scan.hasSourceCode ||
    depCount >= 3 ||
    hasStack ||
    (scan.hasPackageJson && scan.fileCount >= 40) ||
    (scan.hasPackageJson && scan.ciCd.length > 0) ||
    (scan.hasPackageJson && scan.docker);

  if (substantial) {
    const stackBits =
      [scan.frontend, scan.backend, scan.database].filter(Boolean).join(" + ") ||
      (scan.hasSourceCode ? "application codebase" : "project files");
    return {
      context: "existing",
      label: "Existing project",
      reason: `Detected ${stackBits} (${scan.fileCount.toLocaleString()} files) — running full analysis`,
    };
  }

  if (scan.hasPackageJson) {
    return {
      context: "greenfield",
      label: "New project scaffold",
      reason: "package.json present but little or no application code yet",
    };
  }

  if (scan.fileCount <= 5 && !scan.hasSourceCode) {
    return {
      context: "empty",
      label: "Empty folder",
      reason: "No package.json or source code — DNA will install without inferring a stack",
    };
  }

  return {
    context: "empty",
    label: "Non-code folder",
    reason: "This folder does not look like a software project — DNA will install without inferring a stack",
  };
}

export function inferProjectStage(scan: ScanResult, context?: ProjectContext): WizardAnswers["stage"] {
  const ctx = context ?? detectProjectContext(scan).context;
  if (ctx === "dna_refresh") return "legacy_modernisation";
  if (ctx === "empty" || ctx === "greenfield") return "new";
  if (scan.frontend && scan.backend) return "mvp";
  if (scan.ciCd.length > 0 || scan.docker || scan.dependencies.length > 15) return "scaling";
  return "mvp";
}

export function formatInitContextBanner(context: ProjectContextResult, projectName: string): string {
  const lines = [
    "",
    `🧬 DNA init — ${projectName}`,
    "",
    `Context: ${context.label}`,
    `  ${context.reason}`,
    "",
  ];
  return lines.join("\n");
}

export function formatInitCompleteMessage(options: {
  projectName: string;
  context: ProjectContextResult;
  archetype?: string;
  aiTools: string[];
  topGaps?: string[];
  detectedFeatures?: string[];
  planPath?: string;
}): string {
  const { projectName, context, archetype, aiTools, topGaps, detectedFeatures, planPath } = options;
  const lines: string[] = [
    `\n✓ ${projectName} is ready.`,
    "",
    "DNA is active in Cursor and Claude Code — just describe what you want. No need to say \"use DNA\".",
    "",
  ];

  switch (context.context) {
    case "empty":
      lines.push(
        "This folder is not a detected codebase. Cursor rules and prompt stems are installed.",
        "Run `npx dna init` from your app repository for stack detection and deep analysis.",
        "",
      );
      break;
    case "greenfield":
      if (planPath) {
        lines.push(
          "Project scaffold analysed — all IVF verticals and platform features scanned.",
          planPath ? `Plan: ${planPath.replace(/^.*\.DNA\//, ".DNA/")}` : "",
          "",
        );
      } else {
        lines.push(
          "New project scaffold detected. Describe what you want to build in Cursor — DNA runs the feature factory.",
          archetype ? `Suggested stack when you scaffold: ${archetype}` : "",
          "",
        );
      }
      break;
    case "existing":
    case "dna_refresh":
      lines.push(
        "Full analysis complete — all IVF verticals and platform features scanned.",
        "Cursor rules, prompt stems, gap matrix, and IVF plan are in place.",
        planPath ? `Plan: ${planPath.replace(/^.*\.DNA\//, ".DNA/")}` : "",
        "Next: describe features in plain language in Cursor.",
        "",
      );
      if (detectedFeatures?.length) {
        lines.push("Features detected in codebase:");
        detectedFeatures.slice(0, 8).forEach((f) => lines.push(`  • ${f}`));
        if (detectedFeatures.length > 8) lines.push(`  • …and ${detectedFeatures.length - 8} more`);
        lines.push("");
      }
      if (topGaps?.length) {
        lines.push("Top gaps:");
        topGaps.forEach((g) => lines.push(`  • ${g}`));
        lines.push("");
      }
      break;
  }

  if (archetype && context.context !== "empty") {
    lines.push(`Stack:     ${archetype}`);
  } else if (context.context === "empty") {
    lines.push("Stack:     not detected (empty / non-code folder)");
  }

  lines.push(`AI tools:  ${aiTools.join(", ")}`);
  return lines.filter(Boolean).join("\n");
}

export function inferCompliance(description: string): WizardAnswers["compliance"] {
  const d = description.toLowerCase();
  if (d.includes("hipaa") || d.includes("healthcare") || d.includes("phi")) return "hipaa";
  if (d.includes("soc2") || d.includes("soc 2")) return "soc2";
  if (d.includes("gdpr") || d.includes("privacy") || d.includes("uk data")) return "gdpr";
  return "none";
}
