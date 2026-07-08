import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { BEHAVIOUR_FILES, DNA_CONFIG_FILE, DNA_GITIGNORE_ENTRIES } from "@superhumaan/dna-config";
import { detectAiTools, inferCompliance, inferProjectStage } from "./onboarding.js";
import { scanProject } from "./scanner.js";
import { runWizard } from "./wizard.js";
import { loadDnaConfig, validateProject } from "./validator.js";
import { runDoctor, formatDoctorReport, type DoctorReport } from "./doctor.js";
import { installFoundationKnowledge } from "./marketplace/foundation.js";
import { checkMarketplaceUpdates } from "./marketplace/install.js";
import { installCiPipeline } from "./generators/ci.js";
import { installGitHooks } from "./generators/git-hooks.js";
import { installFeatureFactory } from "./generators/feature-factory.js";
import { generateAiToolFiles } from "./generators/ai-tools.js";
import { generateBehaviourFiles } from "./generators/behaviour.js";
import { ensureRuntimeDatabase } from "./storage/runtime-db.js";
import { writeFileEnsured, writeJsonFile, fileExists, ensureDir } from "./fs.js";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET, BROWSER_RUNTIME_SNIPPET } from "@superhumaan/dna-templates";
import { analyzeProject } from "./ivf/analyze.js";
import { documentFromCode } from "./ivf/document.js";
import { generateIvfPlan } from "./ivf/plan.js";

export interface DoctorOrchestratorOptions {
  root: string;
  /** When true, only report — do not scaffold or fix */
  checkOnly?: boolean;
  /** Run brownfield IVF pipeline when legacy project detected */
  runIvf?: boolean;
  quote?: string;
}

export interface DoctorOrchestratorResult {
  report: DoctorReport;
  actions: string[];
  initialized: boolean;
  ivfRun: boolean;
}

function defaultWizardAnswers(scan: Awaited<ReturnType<typeof scanProject>>): WizardAnswers {
  return {
    projectDescription: "Software project",
    acceptRecommendation: true,
    platformFeatures: [],
    aiTools: detectAiTools(scan),
    compliance: inferCompliance(""),
    stage: inferProjectStage(scan),
    installRuntime: true,
    installFeatureFactory: true,
    installCi: true,
    configureGithub: true,
    configureAi: true,
  };
}

async function ensureGitignore(root: string): Promise<string[]> {
  const actions: string[] = [];
  const gitignorePath = join(root, ".gitignore");
  let content = "";
  try {
    content = await readFile(gitignorePath, "utf-8");
  } catch {
    content = "";
  }

  const missing = DNA_GITIGNORE_ENTRIES.filter((entry) => !content.includes(entry));
  if (missing.length === 0) return actions;

  const block = ["", "# DNA local data (not committed)", ...missing].join("\n");
  await writeFile(gitignorePath, content.trimEnd() + block + "\n", "utf-8");
  actions.push(`.gitignore (+${missing.length} DNA entries)`);
  return actions;
}

async function ensureEnabledDefaults(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];
  let changed = false;

  if (!config.runtime?.enabled) {
    config.runtime = {
      ...config.runtime,
      enabled: true,
      storage: "sqlite",
      watchBackend: true,
      watchFrontend: true,
      environment: config.runtime?.environment ?? "development",
    };
    changed = true;
    actions.push("runtime enabled (backend + frontend watching)");
  }

  if (!config.ai?.enabled) {
    config.ai = { ...config.ai, enabled: true, provider: config.ai?.provider ?? "mock" };
    changed = true;
    actions.push("AI repair armed (provider: mock until API key set)");
  }

  if (!config.ai?.repair?.enabled) {
    config.ai = {
      ...config.ai,
      enabled: config.ai?.enabled ?? true,
      provider: config.ai?.provider ?? "mock",
      repair: { enabled: true, autoPr: true, requireReview: true },
    };
    changed = true;
    actions.push("AI repair workflow enabled");
  }

  if (!config.github?.enabled) {
    config.github = { ...config.github, enabled: true };
    changed = true;
    actions.push("GitHub integration enabled — run `dna github login` then `dna github connect`");
  }

  if (!config.ci?.enabled) {
    config.ci = {
      enabled: true,
      strict: false,
      coverageThreshold: 80,
      perFileCoverage: true,
      owasp: true,
      pushToPreview: true,
      previewProvider: "vercel",
    };
    changed = true;
    actions.push("CI quality gates enabled (80% coverage, OWASP)");
  }

  if (!config.featureFactory?.enabled) {
    config.featureFactory = { enabled: true };
    changed = true;
    actions.push("feature factory enabled");
  }

  if (changed) {
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
  }

  return actions;
}

async function repairMissingStructure(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];

  for (const [file, content] of Object.entries(generateBehaviourFiles(config))) {
    const path = join(root, ".DNA", "behaviour", file);
    if (!(await fileExists(path))) {
      await writeFileEnsured(path, content);
      actions.push(`.DNA/behaviour/${file}`);
    }
  }

  for (const file of BEHAVIOUR_FILES) {
    const path = join(root, ".DNA", "behaviour", file);
    if (!(await fileExists(path))) {
      await writeFileEnsured(path, `# ${file}\n\n_Generated by DNA doctor._\n`);
      actions.push(`.DNA/behaviour/${file}`);
    }
  }

  return actions;
}

async function ensureRuntimeAssets(root: string): Promise<string[]> {
  const actions: string[] = [];
  const runtimeDir = join(root, ".DNA", "runtime");

  await ensureDir(join(root, ".DNA", "data"));

  const db = await ensureRuntimeDatabase(root);
  if (db.created) actions.push(db.path);

  const snippetPath = join(runtimeDir, "install-snippet.ts");
  if (!(await fileExists(snippetPath))) {
    await writeFileEnsured(snippetPath, RUNTIME_INSTALL_SNIPPET);
    actions.push(".DNA/runtime/install-snippet.ts");
  }

  const browserPath = join(runtimeDir, "browser-client.ts");
  if (!(await fileExists(browserPath))) {
    await writeFileEnsured(browserPath, BROWSER_RUNTIME_SNIPPET);
    actions.push(".DNA/runtime/browser-client.ts");
  }

  const envPath = join(runtimeDir, "env.example.snippet");
  if (!(await fileExists(envPath))) {
    await writeFileEnsured(envPath, ENV_EXAMPLE_SNIPPET);
    actions.push(".DNA/runtime/env.example.snippet");
  }

  return actions;
}

async function ensureAiAndCi(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];
  const scan = await scanProject(root);
  const answers: WizardAnswers = {
    projectDescription: config.description ?? config.projectName,
    acceptRecommendation: true,
    platformFeatures: config.platformFeatures ?? [],
    aiTools: config.aiTools.length ? config.aiTools : detectAiTools(scan),
    compliance: config.compliance,
    stage: config.stage,
    installRuntime: true,
    installFeatureFactory: true,
    installCi: true,
    configureGithub: true,
    configureAi: true,
  };

  for (const [relPath, content] of Object.entries(
    generateAiToolFiles(config, answers, true),
  )) {
    await writeFileEnsured(join(root, relPath), content);
  }
  actions.push("AI tool rules refreshed (Cursor + delivery pipeline)");

  if (config.featureFactory?.enabled !== false) {
    const factoryFiles = await installFeatureFactory(root, config);
    actions.push(`feature factory refreshed (${factoryFiles.length} files)`);
  }

  const ci = await installCiPipeline({ root, config, scan, skipIfExists: false });
  actions.push(...ci.created);
  for (const skip of ci.skipped) {
    actions.push(`(ci skipped: ${skip})`);
  }

  const hooks = await installGitHooks(root, config);
  actions.push(...hooks);

  return actions;
}

async function pullEssentials(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];
  const scan = await scanProject(root);

  const foundation = await installFoundationKnowledge(root, config, scan);
  for (const packId of foundation.installed) {
    actions.push(`knowledge pack: ${packId}`);
  }

  try {
    const updates = await checkMarketplaceUpdates(root, config.channel);
    if (updates.updatesAvailable.length > 0) {
      actions.push(`${updates.updatesAvailable.length} pack update(s) available — run dna update`);
    }
  } catch {
    // marketplace offline — bundled fallback still works
  }

  return actions;
}

async function runBrownfieldPipeline(
  root: string,
  quote?: string,
): Promise<string[]> {
  const actions: string[] = [];

  await analyzeProject(root, {});
  actions.push("deep analysis complete");

  await documentFromCode({ root, merge: true });
  actions.push("documentation from code");

  await generateIvfPlan({
    root,
    quote: quote ?? "Integrate DNA without a rewrite",
    documentFromCode: false,
  });
  actions.push("IVF plan + gap matrix");

  return actions;
}

export async function runDoctorOrchestrator(
  options: DoctorOrchestratorOptions,
): Promise<DoctorOrchestratorResult> {
  const { root, checkOnly = false, runIvf = false, quote } = options;
  const actions: string[] = [];
  let initialized = false;
  let ivfRun = false;

  const scan = await scanProject(root);
  let config = await loadDnaConfig(root);

  if (!checkOnly && !config) {
    const answers = defaultWizardAnswers(scan);
    const result = await runWizard({ root, answers });
    config = result.config;
    actions.push(`initialized DNA (${result.filesCreated.length} files)`);
    initialized = true;
  }

  if (!checkOnly && config) {
    actions.push(...(await ensureGitignore(root)));
    actions.push(...(await ensureEnabledDefaults(root, config)));
    config = (await loadDnaConfig(root)) ?? config;

    actions.push(...(await repairMissingStructure(root, config)));
    actions.push(...(await ensureRuntimeAssets(root)));
    actions.push(...(await ensureAiAndCi(root, config)));
    actions.push(...(await pullEssentials(root, config)));

    const isBrownfield = runIvf;

    if (isBrownfield) {
      const ivfActions = await runBrownfieldPipeline(root, quote);
      actions.push(...ivfActions.map((a) => `ivf: ${a}`));
      ivfRun = true;
    }

    const validation = await validateProject(root);
    if (!validation.valid) {
      actions.push(`validation: ${validation.errors.length} issue(s) — run dna validate`);
    }
  }

  const report = await runDoctor(root);

  return {
    report,
    actions,
    initialized,
    ivfRun,
  };
}

export function formatDoctorOrchestratorResult(result: DoctorOrchestratorResult): string {
  const lines = [formatDoctorReport(result.report), ""];

  if (result.actions.length > 0) {
    lines.push("Doctor actions", "==============", "");
    for (const action of result.actions) {
      lines.push(`  ✓ ${action}`);
    }
    lines.push("");
  }

  if (result.initialized) {
    lines.push("DNA is ready. Describe what you want to build in Cursor or Claude.");
  } else if (!result.report.dna.installed) {
    lines.push("DNA not installed. Run `dna doctor` (without --check-only) to scaffold.");
  } else {
    lines.push("DNA is up to date. Push to preview — CI quality gates run on every push.");
    if (result.report.preview.enabled && !result.report.preview.workflowInstalled) {
      lines.push(
        "Preview deploy: run `dna ci install` and set GitHub secrets for your provider (Vercel: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID; Netlify: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID).",
      );
    }
  }

  if (result.ivfRun) {
    lines.push("", "Brownfield IVF complete. Run `dna context ivf` for AI context.");
  }

  return lines.join("\n");
}
