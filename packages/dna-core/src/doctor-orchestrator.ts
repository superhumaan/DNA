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
import { maybeAutoUpgradeCli } from "./cli-upgrade.js";
import { installCiPipeline } from "./generators/ci.js";
import { installGitHooks } from "./generators/git-hooks.js";
import { installDockerScaffold } from "./generators/docker.js";
import { wireRuntimeMiddleware } from "./generators/wire-runtime.js";
import { syncAiInjection } from "./generators/ai-injector.js";
import { generateBehaviourFiles } from "./generators/behaviour.js";
import { ensureRuntimeDatabase } from "./storage/runtime-db.js";
import { writeFileEnsured, writeJsonFile, fileExists, ensureDir } from "./fs.js";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET, BROWSER_RUNTIME_SNIPPET } from "@superhumaan/dna-templates";
import { ensureLabAssets as ensureLabStore } from "./lab/server.js";
import { wireLabMiddleware } from "./generators/wire-lab.js";
import { detectGitHubRemote, resolveGitHubToken, loginWithWebFlow } from "@superhumaan/dna-github";
import { analyzeProject } from "./ivf/analyze.js";
import { documentFromCode } from "./ivf/document.js";
import { generateIvfPlan } from "./ivf/plan.js";
import { ALL_IVF_VERTICALS } from "./ivf/verticals.js";

export interface DoctorOrchestratorOptions {
  root: string;
  /** When true, only report — do not scaffold or fix */
  checkOnly?: boolean;
  /** Run brownfield IVF pipeline when legacy project detected */
  runIvf?: boolean;
  quote?: string;
  /** Installed DNA CLI version (for auto-upgrade checks). */
  currentCliVersion?: string;
  /** Resolved CLI entry path (import.meta.url). */
  cliEntryPath?: string;
  /** Status lines during interactive steps (e.g. GitHub browser login) */
  onStatus?: (message: string) => void;
}

function shouldAttemptGitHubLogin(): boolean {
  if (process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true") return false;
  if (process.env.DNA_SKIP_GITHUB_LOGIN === "1") return false;
  return Boolean(process.stdin.isTTY);
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
    actions.push("AI repair armed (run `dna ai connect` to pick a provider)");
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
    actions.push("GitHub integration enabled");
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

  if (!config.feedback?.enabled) {
    config.feedback = {
      enabled: true,
      upstream: true,
      autoReport: "dna-only",
      includeSuggestedFix: true,
    };
    changed = true;
    actions.push("upstream feedback enabled (DNA-only auto-report)");
  }

  if (changed) {
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
  }

  return actions;
}

async function ensureGitHubConnection(
  root: string,
  config: DnaConfig,
  options?: { interactive?: boolean; onStatus?: (message: string) => void },
): Promise<string[]> {
  const actions: string[] = [];
  if (!config.github?.enabled) return actions;

  const log = options?.onStatus ?? (() => {});
  let changed = false;
  let creds = await resolveGitHubToken();

  if (
    !creds?.token &&
    options?.interactive !== false &&
    shouldAttemptGitHubLogin()
  ) {
    log("\n🔗 GitHub — sign in with your browser (one time)\n");
    log("DNA needs repo access to push features and open issues. No tokens to copy.\n");
    try {
      const login = await loginWithWebFlow({ onStatus: log });
      creds = login.credentials;
      actions.push(`GitHub signed in as @${login.username}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      actions.push(`GitHub login skipped: ${msg}`);
    }
  }

  const remote = await detectGitHubRemote(root);

  if (remote) {
    const needsRepo =
      config.github.owner !== remote.owner ||
      config.github.repo !== remote.repo ||
      !config.github.owner ||
      !config.github.repo;
    if (needsRepo) {
      config.github = {
        ...config.github,
        enabled: true,
        owner: remote.owner,
        repo: remote.repo,
        authenticated: !!creds?.token,
      };
      changed = true;
      actions.push(`GitHub repo: ${remote.owner}/${remote.repo}`);
    }
  }

  if (creds?.token && !config.github.authenticated) {
    config.github = { ...config.github, authenticated: true };
    changed = true;
    if (!actions.some((a) => a.startsWith("GitHub signed in"))) {
      actions.push(`GitHub signed in${creds.username ? ` as @${creds.username}` : ""}`);
    }
  } else if (!creds?.token && options?.interactive === false) {
    actions.push("GitHub: not signed in (run `dna doctor` in a terminal to use browser login)");
  } else if (!creds?.token && !shouldAttemptGitHubLogin()) {
    actions.push("GitHub: not signed in (non-interactive — run `dna github login` locally)");
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

async function ensureRuntimeAssets(root: string, config: DnaConfig): Promise<string[]> {
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

  const pkgPath = join(root, "package.json");
  try {
    const raw = await readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as { dependencies?: Record<string, string> };
    const deps = pkg.dependencies ?? {};
    if (!deps["@superhumaan/dna-by-humaan"]) {
      deps["@superhumaan/dna-by-humaan"] = "^0.3.3";
      pkg.dependencies = deps;
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
      actions.push("package.json (added @superhumaan/dna-by-humaan — run npm install)");
    }
  } catch {
    // no package.json
  }

  const wire = await wireRuntimeMiddleware({ root, config });
  for (const file of wire.wired) {
    actions.push(`runtime auto-wired: ${file}`);
  }
  for (const skip of wire.skipped) {
    actions.push(`(runtime wire: ${skip})`);
  }

  return actions;
}

async function ensureLabScaffold(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];
  if (config.lab?.enabled === false) return actions;

  actions.push(...(await ensureLabStore(root)));

  if (!config.lab) {
    config.lab = {
      enabled: true,
      path: "/labs",
      requireAuthInProduction: true,
      openLocalWithoutAuth: true,
    };
    await writeJsonFile(join(root, DNA_CONFIG_FILE), {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    actions.push(".DNA/config.dna.json (lab enabled)");
  }

  const wire = await wireLabMiddleware({ root, config });
  for (const file of wire.wired) {
    actions.push(`lab auto-wired: ${file}`);
  }
  for (const skip of wire.skipped) {
    actions.push(`(lab wire: ${skip})`);
  }

  return actions;
}

async function ensureAiAndCi(root: string, config: DnaConfig): Promise<string[]> {
  const actions: string[] = [];
  const scan = await scanProject(root);

  const injection = await syncAiInjection(root, config, { scan });
  actions.push(`AI injection synced (${injection.written.length} files)`);
  if (injection.report.complete) {
    actions.push("AI injection verified — Cursor + Claude always-on rules current");
  } else {
    const gaps = [...injection.report.missing, ...injection.report.stale];
    actions.push(`AI injection gaps remain: ${gaps.join(", ")}`);
  }

  const ci = await installCiPipeline({ root, config, scan, skipIfExists: false });
  actions.push(...ci.created);
  for (const skip of ci.skipped) {
    actions.push(`(ci skipped: ${skip})`);
  }

  const hooks = await installGitHooks(root, config);
  actions.push(...hooks);

  const docker = await installDockerScaffold({ root, config, scan });
  actions.push(...docker.created);
  for (const skip of docker.skipped) {
    actions.push(`(docker skipped: ${skip})`);
  }

  return actions;
}

async function pullEssentials(
  root: string,
  config: DnaConfig,
  currentCliVersion?: string,
  cliEntryPath?: string,
): Promise<string[]> {
  const actions: string[] = [];
  const scan = await scanProject(root);

  const foundation = await installFoundationKnowledge(root, config, scan);
  for (const packId of foundation.installed) {
    actions.push(`knowledge pack: ${packId}`);
  }

  if (currentCliVersion) {
    try {
      const cliUpgrade = await maybeAutoUpgradeCli({
        root,
        currentVersion: currentCliVersion,
        cliEntryPath,
        channel: config.channel,
      });
      if (cliUpgrade?.installed && cliUpgrade.latestVersion) {
        actions.push(`CLI upgraded: ${cliUpgrade.currentVersion} → ${cliUpgrade.latestVersion}`);
      } else if (cliUpgrade?.updateAvailable && cliUpgrade.latestVersion) {
        actions.push(
          `CLI update available: ${cliUpgrade.currentVersion} → ${cliUpgrade.latestVersion} — run dna update`,
        );
      }
    } catch {
      // npm registry offline — skip
    }
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
    verticals: ALL_IVF_VERTICALS,
  });
  actions.push("IVF plan + gap matrix");

  return actions;
}

export async function runDoctorOrchestrator(
  options: DoctorOrchestratorOptions,
): Promise<DoctorOrchestratorResult> {
  const { root, checkOnly = false, runIvf = false, quote, onStatus, currentCliVersion, cliEntryPath } =
    options;
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
    actions.push(...(await ensureGitHubConnection(root, config, {
      interactive: !checkOnly,
      onStatus,
    })));
    config = (await loadDnaConfig(root)) ?? config;

    actions.push(...(await repairMissingStructure(root, config)));
    actions.push(...(await ensureRuntimeAssets(root, config)));
    actions.push(...(await ensureLabScaffold(root, config)));
    actions.push(...(await ensureAiAndCi(root, config)));
    actions.push(...(await pullEssentials(root, config, currentCliVersion, cliEntryPath)));

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
    lines.push("DNA is ready. Run `npm install` if package.json was updated, then start your app.");
  } else if (!result.report.dna.installed) {
    lines.push("DNA not installed. Run `dna doctor` (without --check-only) to scaffold.");
  } else {
    const needsNpmInstall = result.actions.some((a) => a.includes("package.json (added"));
    if (needsNpmInstall) {
      lines.push("Run `npm install` to install @superhumaan/dna-by-humaan for the runtime observer.");
    }
    lines.push("DNA is up to date.");
    if (result.report.github.enabled && !result.report.github.signedIn) {
      lines.push("GitHub: sign in failed or was skipped — run `dna github login` in a terminal.");
    }
    if (result.report.github.enabled && !result.report.github.configured) {
      lines.push("GitHub: add a GitHub `origin` remote and re-run `dna doctor`.");
    }
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
