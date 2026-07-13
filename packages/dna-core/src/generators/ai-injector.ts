import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { detectAiTools } from "../onboarding.js";
import { scanProject } from "../scanner.js";
import { fileExists, writeFileEnsured } from "../fs.js";
import { generateAiToolFiles } from "./ai-tools.js";
import { installFeatureFactory } from "./feature-factory.js";
import { installAiWorkbench, isAiWorkbenchEnabled } from "./ai-workbench.js";

const ALWAYS_ON_MARKER = "DNA is always on";
const NEVER_WAIT_MARKER = 'wait for the user to say "use DNA"';

export interface AiInjectionCheck {
  path: string;
  ok: boolean;
  issue?: string;
}

export interface AiInjectionReport {
  /** Workbench or feature factory injection is expected */
  expected: boolean;
  complete: boolean;
  checks: AiInjectionCheck[];
  missing: string[];
  stale: string[];
}

export interface SyncAiInjectionOptions {
  preferRemoteStems?: boolean;
  featureFactory?: boolean;
  workbench?: boolean;
  /** Run verification after sync (default: true) */
  verify?: boolean;
  /** Pre-scanned project (avoids duplicate scan) */
  scan?: Awaited<ReturnType<typeof scanProject>>;
}

export interface AiInjectionSyncResult {
  written: string[];
  report: AiInjectionReport;
}

function resolvedAiTools(config: DnaConfig): string[] {
  return config.aiTools.length > 0 ? config.aiTools : ["cursor", "claude_code"];
}

function usesCursor(config: DnaConfig): boolean {
  const tools = resolvedAiTools(config);
  return tools.includes("cursor") || tools.includes("multiple");
}

function usesClaude(config: DnaConfig): boolean {
  const tools = resolvedAiTools(config);
  return tools.includes("claude_code") || tools.includes("multiple");
}

export function injectionExpected(config: DnaConfig): boolean {
  return isAiWorkbenchEnabled(config) || config.featureFactory?.enabled !== false;
}

/** Paths that must exist for DNA to be fully injected into Cursor / Claude. */
export function getRequiredInjectionPaths(config: DnaConfig): string[] {
  if (!injectionExpected(config)) return [];

  const paths = new Set<string>(["AGENTS.md"]);

  if (usesCursor(config)) {
    paths.add(".cursor/rules/dna.mdc");
    paths.add(".cursor/rules/dna-workbench.mdc");
    paths.add(".cursor/rules/dna-cli-commands.mdc");
    paths.add(".cursor/rules/delivery-pipeline.mdc");
    paths.add(".cursor/skills/dna-workbench/SKILL.md");
    paths.add(".cursor/skills/dna-cli/SKILL.md");
  }

  if (config.featureFactory?.enabled !== false) {
    paths.add(".cursor/rules/product-process.mdc");
    paths.add("ai/agent-loop.md");
  }

  if (usesClaude(config)) {
    paths.add("CLAUDE.md");
    paths.add(".claude/skills/dna-workbench/SKILL.md");
    paths.add(".claude/skills/dna-cli/SKILL.md");
  }

  return [...paths];
}

function requiresAlwaysOnContent(relPath: string): boolean {
  return (
    relPath === "AGENTS.md" ||
    relPath === "CLAUDE.md" ||
    relPath.endsWith("SKILL.md") ||
    relPath === ".cursor/rules/dna.mdc" ||
    relPath === ".cursor/rules/dna-workbench.mdc"
  );
}

function requiresAlwaysApply(relPath: string): boolean {
  return relPath.endsWith(".mdc");
}

async function checkInjectionFile(root: string, relPath: string): Promise<AiInjectionCheck> {
  const abs = join(root, relPath);
  if (!(await fileExists(abs))) {
    return { path: relPath, ok: false, issue: "missing" };
  }

  const content = await readFile(abs, "utf-8");

  if (requiresAlwaysApply(relPath) && !content.includes("alwaysApply: true")) {
    return { path: relPath, ok: false, issue: "stale (missing alwaysApply: true)" };
  }

  if (
    requiresAlwaysOnContent(relPath) &&
    !content.includes(ALWAYS_ON_MARKER) &&
    !content.includes(NEVER_WAIT_MARKER) &&
    !content.toLowerCase().includes("always on")
  ) {
    return { path: relPath, ok: false, issue: "stale (missing always-on instructions)" };
  }

  return { path: relPath, ok: true };
}

export async function verifyAiInjection(root: string, config: DnaConfig): Promise<AiInjectionReport> {
  const expected = injectionExpected(config);
  if (!expected) {
    return { expected: false, complete: true, checks: [], missing: [], stale: [] };
  }

  const checks: AiInjectionCheck[] = [];
  for (const relPath of getRequiredInjectionPaths(config)) {
    checks.push(await checkInjectionFile(root, relPath));
  }

  const missing = checks.filter((c) => !c.ok && c.issue === "missing").map((c) => c.path);
  const stale = checks.filter((c) => !c.ok && c.issue !== "missing").map((c) => c.path);

  return {
    expected: true,
    complete: missing.length === 0 && stale.length === 0,
    checks,
    missing,
    stale,
  };
}

function buildWizardAnswers(
  config: DnaConfig,
  scan: Awaited<ReturnType<typeof scanProject>>,
  featureFactory: boolean,
): WizardAnswers {
  return {
    projectDescription: config.description ?? config.projectName,
    acceptRecommendation: true,
    platformFeatures: config.platformFeatures ?? [],
    aiTools: config.aiTools.length ? config.aiTools : detectAiTools(scan),
    compliance: config.compliance,
    stage: config.stage,
    installRuntime: false,
    installFeatureFactory: featureFactory,
    installCi: false,
    configureGithub: false,
    configureAi: false,
  };
}

/**
 * Refresh all AI injection layers (rules, AGENTS.md, skills, stems, commands)
 * and verify the project is fully injected for Cursor / Claude.
 */
export async function syncAiInjection(
  root: string,
  config: DnaConfig,
  options: SyncAiInjectionOptions = {},
): Promise<AiInjectionSyncResult> {
  const written: string[] = [];
  const scan = options.scan ?? (await scanProject(root));
  const featureFactory = options.featureFactory ?? config.featureFactory?.enabled !== false;
  const workbench = options.workbench ?? isAiWorkbenchEnabled(config);

  if (!featureFactory && !workbench) {
    const report = await verifyAiInjection(root, config);
    return { written, report };
  }

  const answers = buildWizardAnswers(config, scan, featureFactory);

  for (const [relPath, content] of Object.entries(
    generateAiToolFiles(config, answers, featureFactory),
  )) {
    await writeFileEnsured(join(root, relPath), content);
    written.push(relPath);
  }

  if (featureFactory) {
    written.push(...(await installFeatureFactory(root, config)));
  }

  if (workbench) {
    config.aiWorkbench = { enabled: true, ...config.aiWorkbench };
    written.push(
      ...(await installAiWorkbench(root, config, {
        preferRemoteStems: options.preferRemoteStems,
      })),
    );
  }

  const report = options.verify !== false ? await verifyAiInjection(root, config) : {
    expected: injectionExpected(config),
    complete: true,
    checks: [],
    missing: [],
    stale: [],
  };

  return { written: [...new Set(written)], report };
}

export function formatAiInjectionReport(report: AiInjectionReport): string {
  if (!report.expected) {
    return "AI injection: disabled (workbench + feature factory off)";
  }

  const status = report.complete ? "✓" : "✗";
  const lines = [
    `${status} AI injection (Cursor + Claude always-on)`,
    `  ${report.checks.filter((c) => c.ok).length}/${report.checks.length} required files OK`,
  ];

  if (report.missing.length) {
    lines.push(`  Missing: ${report.missing.join(", ")}`);
  }
  if (report.stale.length) {
    lines.push(`  Stale: ${report.stale.join(", ")}`);
  }
  if (report.complete) {
    lines.push("  AGENTS.md, alwaysApply rules, and skills are current");
  } else {
    lines.push("  Run `npx dna doctor` to repair injection");
  }

  return lines.join("\n");
}
