import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NEURAL_NETWORK_ALT, NEURAL_NETWORK_FILE } from "@superhumaan/dna-config";
import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { detectAiTools } from "../onboarding.js";
import { scanProject } from "../scanner.js";
import { fileExists, writeFileEnsured, writeJsonFile } from "../fs.js";
import { generateAiToolFiles } from "./ai-tools.js";
import { generateBehaviourFiles } from "./behaviour.js";
import { installFeatureFactory } from "./feature-factory.js";
import { installAiWorkbench, isAiWorkbenchEnabled } from "./ai-workbench.js";
import { generateNeuralNetwork } from "./neural-network.js";
import { REASONING_BEHAVIOUR_FILE, REASONING_MARKER } from "./dna-reasoning.js";

const ALWAYS_ON_MARKER = "DNA is always on";
const NEVER_WAIT_MARKER = 'wait for the user to say "use DNA"';
const CRITICAL_THINKING_MARKER = "Critical thinking";

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

export function injectionExpected(_config: DnaConfig): boolean {
  /** DNA projects always get reasoning + injection — no opt-in. */
  return true;
}

/** Paths that must exist for DNA to be fully injected into Cursor / Claude. */
export function getRequiredInjectionPaths(config: DnaConfig): string[] {
  const paths = new Set<string>([
    "AGENTS.md",
    `.DNA/behaviour/${REASONING_BEHAVIOUR_FILE}`,
    ".DNA/neuralNetwork.json",
  ]);

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

function requiresCriticalThinking(relPath: string): boolean {
  return (
    relPath === "AGENTS.md" ||
    relPath === "CLAUDE.md" ||
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

  if (relPath === `.DNA/behaviour/${REASONING_BEHAVIOUR_FILE}` && !content.includes(REASONING_MARKER)) {
    return { path: relPath, ok: false, issue: "stale (missing reasoning engine)" };
  }

  if (requiresCriticalThinking(relPath) && !content.includes(CRITICAL_THINKING_MARKER)) {
    return { path: relPath, ok: false, issue: "stale (missing critical thinking)" };
  }

  return { path: relPath, ok: true };
}

export async function verifyAiInjection(root: string, config: DnaConfig): Promise<AiInjectionReport> {
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
 * Refresh all DNA co-pilot layers: behaviour (reasoning), neural network, rules,
 * AGENTS.md, skills, stems, commands — then verify injection.
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

  // Reasoning + behaviour — always on by default (no opt-in)
  for (const [file, content] of Object.entries(generateBehaviourFiles(config))) {
    const relPath = `.DNA/behaviour/${file}`;
    await writeFileEnsured(join(root, relPath), content);
    written.push(relPath);
  }

  const neuralNetwork = generateNeuralNetwork(config);
  await writeJsonFile(join(root, NEURAL_NETWORK_FILE), neuralNetwork);
  await writeJsonFile(join(root, NEURAL_NETWORK_ALT), neuralNetwork);
  written.push(NEURAL_NETWORK_FILE);

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

  const report =
    options.verify !== false
      ? await verifyAiInjection(root, config)
      : {
          expected: true,
          complete: true,
          checks: [],
          missing: [],
          stale: [],
        };

  return { written: [...new Set(written)], report };
}

export function formatAiInjectionReport(report: AiInjectionReport): string {
  const status = report.complete ? "✓" : "✗";
  const lines = [
    `${status} DNA co-pilot injection (always-on — reasoning + Cursor + Claude)`,
    `  ${report.checks.filter((c) => c.ok).length}/${report.checks.length} required files OK`,
  ];

  if (report.missing.length) {
    lines.push(`  Missing: ${report.missing.join(", ")}`);
  }
  if (report.stale.length) {
    lines.push(`  Stale: ${report.stale.join(", ")}`);
  }
  if (report.complete) {
    lines.push("  reasoning.behaviour.md, AGENTS.md, alwaysApply rules, and skills are current");
  } else {
    lines.push("  Run `npx dna doctor` to repair injection");
  }

  return lines.join("\n");
}
