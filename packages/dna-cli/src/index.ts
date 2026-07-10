import { Command } from "commander";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { PRODUCT_NAME } from "@superhumaan/dna-config";
import {
  scanProject,
  formatScanSummary,
  generateRecommendation,
  formatRecommendation,
  runWizard,
  validateProject,
  formatValidationResult,
  generateContext,
  runDoctorOrchestrator,
  formatDoctorOrchestratorResult,
  startWatch,
  loadDnaConfig,
  writeJsonFile,
  fetchMarketplaceCatalog,
  searchCatalog,
  installKnowledgePackById,
  checkMarketplaceUpdates,
  formatMarketplaceCatalog,
  formatUpdateResult,
  generateRbacPlan,
  parseRolesInput,
  generateFeaturePlan,
  formatPlatformCatalog,
  formatProjectFeatures,
  generatePlatformContext,
  resolveReferenceProjects,
  formatReferencePath,
  generateCompliancePlan,
  formatComplianceCatalog,
  generateComplianceContext,
  parseFrameworksInput,
  parseOrgTier,
  formatGdprDocumentCatalog,
  installGdprExamples,
  installFeatureFactory,
  uninstallFeatureFactory,
  refreshAiToolsForFeatureFactory,
  beginFeatureFromQuote,
  runAndWriteQualityReport,
  runQualityAnalysis,
  formatQualityReportSummary,
  slugifyFeature,
  formatStackCatalog,
  resolveArchetype,
  stackFromArchetype,
  formatStackValidationSummary,
  validateStackCompatibility,
  getArchetype,
  analyzeProject,
  formatAnalysisSummary,
  documentFromCode,
  formatDocumentResult,
  generateIvfPlan,
  parseVerticalsInput,
  generateIvfContext,
  installCiPipeline,
  installGitHooks,
  installDockerScaffold,
  runDockerBuild,
  ensureRuntimeDatabase,
  wireRuntimeMiddleware,
} from "@superhumaan/dna-core";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET } from "@superhumaan/dna-templates";
import { createIssue, loginWithWebFlow, pushFeatureToGitHub, resolveGitHubToken } from "@superhumaan/dna-github";
import { executeRepairWorkflow } from "@superhumaan/dna-ai";
import { runInitWizard } from "./prompts.js";
import { connectGitHubDuringOnboarding } from "./github-onboarding.js";

const program = new Command();

program
  .name("dna")
  .description(`${PRODUCT_NAME} — project intelligence and runtime observer`)
  .version("0.1.0");

function getRoot(options: { cwd?: string }): string {
  return options.cwd ?? process.cwd();
}

program
  .command("init")
  .description("Initialise DNA in the current project")
  .option("-y, --yes", "Non-interactive mode with defaults")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { yes?: boolean; cwd?: string }) => {
    const root = getRoot(options);
    const scan = await scanProject(root);

    let defaultProjectName: string | undefined;
    const existing = await loadDnaConfig(root);
    if (existing?.projectName) {
      defaultProjectName = existing.projectName;
    } else {
      try {
        const raw = await readFile(join(root, "package.json"), "utf-8");
        defaultProjectName = (JSON.parse(raw) as { name?: string }).name;
      } catch {
        // no package.json
      }
    }

    const answers = await runInitWizard(!!options.yes, scan, defaultProjectName);
    const result = await runWizard({ root, answers });

    if (answers.configureGithub) {
      const gh = await connectGitHubDuringOnboarding(root, result.config, {
        onStatus: (msg) => {
          if (!options.yes) console.log(msg);
        },
        skipLogin: !!options.yes,
      });
      if (gh.connected && gh.owner && gh.repo) {
        console.log(`✓ GitHub: ${gh.owner}/${gh.repo}${gh.username ? ` (@${gh.username})` : ""}`);
      } else if (gh.username) {
        console.log(`✓ GitHub: signed in as @${gh.username}`);
      } else if (!options.yes || gh.message !== "GitHub integration disabled") {
        console.log(`⚠ GitHub: ${gh.message}`);
      }
    }

    console.log(`\n✓ ${result.config.projectName} is ready.\n`);
    console.log("Describe what you want to build in Cursor or Claude — DNA runs the feature factory automatically.");
    console.log('  Example: "I want providers to record phone calls and transcribe the notes"\n');
    console.log(`  Archetype: ${result.config.stack.archetype ?? "—"}`);
    if (result.config.platformFeatures?.length) {
      console.log(`  Features:  ${result.config.platformFeatures.join(", ")}`);
    }
    console.log(`  AI tools:  ${result.config.aiTools.join(", ")}`);
  });

program
  .command("analyze")
  .description("Deep analysis of an existing project (structure, auth, integrations, IVF gaps)")
  .option("--deep", "Full analysis including vertical gap matrix (default)")
  .option("--verticals <list>", "Comma-separated verticals for gap assessment")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { deep?: boolean; verticals?: string; cwd?: string }) => {
    const root = getRoot(options);
    const verticals = options.verticals ? parseVerticalsInput(options.verticals) : undefined;
    const analysis = await analyzeProject(root, { verticals });
    console.log(formatAnalysisSummary(analysis));
  });

program
  .command("document")
  .description("Generate or update documentation from codebase analysis")
  .option("--from-code", "Reverse-engineer Impressions and system map from code")
  .option("--merge", "Skip files with existing real content (default)")
  .option("--no-merge", "Write all architecture docs even if content exists")
  .option("--force", "Overwrite all target files")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { fromCode?: boolean; merge?: boolean; force?: boolean; cwd?: string }) => {
    const root = getRoot(options);
    if (!options.fromCode) {
      console.error("Use --from-code to document from codebase analysis.");
      console.error("Example: dna document --from-code");
      process.exit(1);
    }

    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const result = await documentFromCode({
      root,
      merge: options.merge !== false,
      force: options.force,
    });
    console.log(formatDocumentResult(result));
    console.log("\nNext: dna plan ivf --quote \"...\"");
  });

program
  .command("scan")
  .description("Scan the current project")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const scan = await scanProject(getRoot(options));
    console.log(formatScanSummary(scan));
  });

program
  .command("recommend")
  .description("Recommend solution architecture and stack")
  .option("--cwd <path>", "Project root directory")
  .option("-d, --description <text>", "Project description")
  .action(async (options: { cwd?: string; description?: string }) => {
    const root = getRoot(options);
    const scan = await scanProject(root);
    const rec = generateRecommendation(scan, options.description ?? "software project");
    console.log(formatRecommendation(rec));
  });

const stack = program.command("stack").description("Stack archetypes and compatibility");

stack
  .command("list")
  .description("List approved stack archetypes")
  .action(() => {
    console.log(formatStackCatalog());
  });

stack
  .command("recommend")
  .description("Recommend a stack archetype for this project")
  .option("--cwd <path>", "Project root directory")
  .option("-d, --description <text>", "Project description")
  .action(async (options: { cwd?: string; description?: string }) => {
    const root = getRoot(options);
    const scan = await scanProject(root);
    const description = options.description ?? "software project";
    const resolution = resolveArchetype(scan, description);
    const stackConfig = stackFromArchetype(resolution, scan, description);
    const arch = getArchetype(resolution.archetype.id);

    console.log(formatStackValidationSummary(
      { stack: stackConfig } as Awaited<ReturnType<typeof loadDnaConfig>>,
      scan,
    ));
    console.log(`Confidence: ${resolution.confidence}`);
    console.log(`Reason: ${resolution.reason}`);
    if (arch) {
      console.log("\nExcluded technologies (do not add):");
      console.log(`  ${arch.excludes.join(", ")}`);
    }
  });

stack
  .command("show")
  .description("Show current project stack archetype and detected technologies")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const scan = await scanProject(root);
    console.log(formatStackValidationSummary(config, scan));
    const issues = validateStackCompatibility(config, scan);
    if (issues.length) {
      console.log("\nStack issues:");
      for (const issue of issues) {
        const icon = issue.severity === "error" ? "✗" : "⚠";
        console.log(`  ${icon} ${issue.message}`);
      }
    } else {
      console.log("\n✓ No stack conflicts detected");
    }
  });

program
  .command("context")
  .description("Generate AI-ready context")
  .argument("<target>", "cursor|claude|chatgpt|copilot|windsurf|gemini|backend|frontend|security|qa|devops|rbac|platform|compliance|multilingual|ivf|all")
  .option("--cwd <path>", "Project root directory")
  .option("--feature <id>", "Focus platform context on a feature id (with platform target)")
  .option("--tier <tier>", "Org tier for compliance context: startup|sme|corporate|enterprise")
  .option("--frameworks <list>", "Frameworks for compliance context: gdpr,hipaa,iso27001")
  .action(async (target: string, options: { cwd?: string; feature?: string; tier?: string; frameworks?: string }) => {
    const root = getRoot(options);
    const validTargets = [
      "cursor",
      "claude",
      "chatgpt",
      "copilot",
      "windsurf",
      "gemini",
      "backend",
      "frontend",
      "security",
      "qa",
      "devops",
      "rbac",
      "platform",
      "compliance",
      "multilingual",
      "ivf",
      "all",
    ] as const;

    if (!validTargets.includes(target as (typeof validTargets)[number])) {
      console.error(`Unknown target: ${target}`);
      process.exit(1);
    }

    if (target === "platform") {
      const context = await generatePlatformContext(root, options.feature);
      console.log(context);
      return;
    }

    if (target === "compliance") {
      const tier = options.tier ? parseOrgTier(options.tier) : undefined;
      const frameworks = options.frameworks ? parseFrameworksInput(options.frameworks) : undefined;
      const context = await generateComplianceContext(root, { tier, frameworks });
      console.log(context);
      return;
    }

    if (target === "ivf") {
      const context = await generateIvfContext(root);
      console.log(context);
      return;
    }

    const context = await generateContext(
      root,
      target as Exclude<(typeof validTargets)[number], "platform" | "compliance" | "ivf">,
    );
    console.log(context);
  });

program
  .command("validate")
  .description("Validate project against Behaviour")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const result = await validateProject(getRoot(options));
    console.log(formatValidationResult(result));
    if (!result.valid) process.exit(1);
  });

program
  .command("watch")
  .description("Watch for file changes and update CellularMemory")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    await startWatch({
      root,
      onDrift: (msg) => console.log(msg),
    });

    await new Promise(() => {});
  });

program
  .command("runtime install")
  .description("Add runtime observer setup instructions")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const snippetPath = join(root, ".DNA", "runtime", "install-snippet.ts");
    const envPath = join(root, ".DNA", "runtime", "env.example.snippet");

    await writeFile(snippetPath, RUNTIME_INSTALL_SNIPPET, "utf-8");
    await writeFile(envPath, ENV_EXAMPLE_SNIPPET, "utf-8");

    const db = await ensureRuntimeDatabase(root);
    if (db.created) {
      console.log(`  ${db.path}`);
    }
    if (db.migrated > 0) {
      console.log(`  Migrated ${db.migrated} legacy jsonl record(s) to runtime.db`);
    }

    const config = await loadDnaConfig(root);
    if (config) {
      config.runtime = {
        storage: "sqlite",
        watchBackend: true,
        watchFrontend: true,
        ...config.runtime,
        enabled: true,
      };
      await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

      const wire = await wireRuntimeMiddleware({ root, config });
      if (wire.wired.length > 0) {
        console.log("\n✓ Runtime auto-wired:");
        wire.wired.forEach((f) => console.log(`  ${f}`));
      }
      for (const s of wire.skipped) console.log(`  (skipped: ${s})`);
    }

    console.log("\n✓ Runtime install complete");
    console.log(`  ${snippetPath}`);
    console.log(`  ${envPath}`);
    if (!config) {
      console.log("\nRun `dna doctor` to auto-wire middleware for your stack.");
    }
  });

program
  .command("feature-factory install")
  .description("Install or re-enable Cursor feature factory rules and /ai agent templates")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const installed = await installFeatureFactory(root, config);
    installed.push(...(await refreshAiToolsForFeatureFactory(root, config, true)));

    config.featureFactory = { enabled: true };
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

    console.log(`✓ Feature factory installed (${installed.length} files):`);
    installed.forEach((f) => console.log(`  ${f}`));
  });

program
  .command("feature")
  .description("Start the feature factory from a plain-language request")
  .argument("<quote>", "What you want to build, in plain language")
  .option("--cwd <path>", "Project root directory")
  .action(async (quote: string, options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const written = await beginFeatureFromQuote(root, config, quote);
    console.log("✓ Feature factory started:");
    written.forEach((f) => console.log(`  ${f}`));
    console.log("\nContinue in Cursor or Claude — the agent loop runs automatically from your message.");
  });

const quality = program.command("quality").description("Local code quality analysis (SonarQube-style, no server)");

quality
  .command("report")
  .description("Run local SAST + toolchain checks and write a quality report")
  .option("--cwd <path>", "Project root directory")
  .option("--feature", "Scope to git-changed files for the current feature")
  .option("--slug <name>", "Report filename slug (default: derived from feature request or 'latest')")
  .option("--paths <paths...>", "Limit scan to specific paths")
  .option("--no-toolchain", "Skip running lint/typecheck scripts")
  .option("--fail", "Exit non-zero when quality gate fails (strict CI only)")
  .option("--json", "Print report summary as JSON to stdout")
  .action(
    async (options: {
      cwd?: string;
      feature?: boolean;
      slug?: string;
      paths?: string[];
      toolchain?: boolean;
      fail?: boolean;
      json?: boolean;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      let featureSlug = options.slug;
      if (!featureSlug && options.feature) {
        try {
          const req = await readFile(join(root, "ai/feature-request.md"), "utf-8");
          const match = req.match(/^>\s*(.+)$/m);
          featureSlug = slugifyFeature(match?.[1] ?? "feature");
        } catch {
          featureSlug = "feature";
        }
      }

      const result = await runAndWriteQualityReport(root, {
        projectName: config.projectName,
        featureSlug: featureSlug ?? (options.feature ? "feature" : undefined),
        featureScope: options.feature ?? false,
        paths: options.paths,
        runToolchain: options.toolchain !== false,
      });

      if (options.json) {
        console.log(JSON.stringify(result.report, null, 2));
      } else {
        console.log(`✓ Quality report written: ${result.reportPath}`);
        console.log(formatQualityReportSummary(result.report));
        const shouldFail = options.fail === true || (config.ci?.strict ?? false);
        if (shouldFail && result.report.gate === "fail") {
          process.exit(1);
        }
      }
    },
  );

quality
  .command("scan")
  .description("Run analysis without writing a report file")
  .option("--cwd <path>", "Project root directory")
  .option("--feature", "Scope to git-changed files")
  .option("--paths <paths...>", "Limit scan to specific paths")
  .action(async (options: { cwd?: string; feature?: boolean; paths?: string[] }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const projectName = config?.projectName ?? "project";

    const report = await runQualityAnalysis({
      root,
      projectName,
      featureScope: options.feature ?? false,
      paths: options.paths,
      runToolchain: false,
    });

    console.log(formatQualityReportSummary(report));
    for (const issue of report.issues.slice(0, 30)) {
      const loc = issue.file ? `${issue.file}${issue.line ? `:${issue.line}` : ""}` : "project";
      console.log(`  [${issue.severity}] ${issue.rule}: ${issue.message} (${loc})`);
    }
    if (report.issues.length > 30) {
      console.log(`  ... and ${report.issues.length - 30} more`);
    }
    if (report.gate === "fail") process.exit(1);
  });

const ci = program.command("ci").description("CI/CD pipeline scaffolding");

ci.command("install")
  .description("Scaffold GitHub Actions workflows (lint, test, coverage, security)")
  .option("--cwd <path>", "Project root directory")
  .option("--force", "Install even when existing CI is detected")
  .action(async (options: { cwd?: string; force?: boolean }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const scan = await scanProject(root);
    const result = await installCiPipeline({
      root,
      config,
      scan,
      skipIfExists: !options.force,
    });

    const hooks = await installGitHooks(root, config);
    const docker = await installDockerScaffold({ root, config, scan });

    console.log("✓ CI pipeline install complete\n");
    for (const f of result.created) console.log(`  + ${f}`);
    for (const f of hooks) console.log(`  + ${f}`);
    for (const f of docker.created) console.log(`  + ${f}`);
    for (const s of result.skipped) console.log(`  (skipped: ${s})`);
    for (const s of docker.skipped) console.log(`  (docker skipped: ${s})`);
    if (result.created.length === 0 && result.skipped.length > 0) {
      console.log("\nUse --force to add DNA workflows alongside existing CI.");
    }
  });

program
  .command("feature-factory uninstall")
  .description("Remove feature factory rules and /ai templates from the project")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const removed = await uninstallFeatureFactory(root, config);

    config.featureFactory = { enabled: false };
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

    if (removed.length === 0) {
      console.log("Feature factory was not installed (no files removed).");
      return;
    }

    console.log(`✓ Feature factory removed (${removed.length} files):`);
    removed.forEach((f) => console.log(`  ${f}`));
    console.log("\nRe-enable anytime with: dna feature-factory install");
  });

const github = program.command("github").description("GitHub integration");

github
  .command("login")
  .description("Sign in to GitHub via browser (web flow — no manual tokens)")
  .action(async () => {
    try {
      const result = await loginWithWebFlow({
        onStatus: (msg) => console.log(msg),
        force: true,
      });
      console.log(`\n✓ Signed in as @${result.username}`);
      console.log("  Token stored in ~/.config/dna/github-credentials.json");
      console.log("  Never committed to your repo.");
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

github
  .command("push")
  .description("Commit and push current feature branch to GitHub")
  .option("--cwd <path>", "Project root directory")
  .option("-m, --message <text>", "Commit message")
  .option("--branch <name>", "Branch name (default: current or auto feature/*)")
  .option("--create-branch", "Create feature/* branch from main if on main")
  .action(
    async (options: {
      cwd?: string;
      message?: string;
      branch?: string;
      createBranch?: boolean;
    }) => {
      const root = getRoot(options);
      try {
        const result = await pushFeatureToGitHub({
          root,
          message: options.message ?? "feat: DNA feature factory delivery",
          branch: options.branch,
          createBranch: options.createBranch ?? true,
        });
        console.log(`✓ Pushed to ${result.owner}/${result.repo}`);
        console.log(`  Branch: ${result.branch}`);
        if (result.committed) console.log("  (committed local changes)");
      } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        console.error("\nRun `dna github login` if you have not signed in yet.");
        process.exit(1);
      }
    },
  );

github
  .command("connect")
  .description("Store GitHub repo settings")
  .requiredOption("--owner <owner>", "GitHub repository owner")
  .requiredOption("--repo <repo>", "GitHub repository name")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { owner: string; repo: string; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    config.github = {
      enabled: true,
      owner: options.owner,
      repo: options.repo,
      authenticated: false,
    };
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

    const creds = await resolveGitHubToken();
    console.log(`✓ GitHub connected: ${options.owner}/${options.repo}`);
    if (creds?.token) {
      config.github.authenticated = true;
      await writeJsonFile(join(root, ".DNA/config.dna.json"), config);
      console.log(`  Signed in${creds.username ? ` as @${creds.username}` : ""}`);
    } else {
      console.log("  Run `dna github login` — browser login, no manual tokens.");
    }
  });

const docker = program.command("docker").description("Docker build verification");

docker
  .command("install")
  .description("Scaffold Dockerfile, docker-compose, and npm scripts")
  .option("--cwd <path>", "Project root directory")
  .option("--force", "Overwrite existing Dockerfile")
  .action(async (options: { cwd?: string; force?: boolean }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const result = await installDockerScaffold({
      root,
      config,
      skipIfExists: !options.force,
    });
    console.log("✓ Docker scaffold installed\n");
    for (const f of result.created) console.log(`  + ${f}`);
    for (const s of result.skipped) console.log(`  (skipped: ${s})`);
  });

docker
  .command("build")
  .description("Build Docker image — mandatory feature factory close-out gate")
  .option("--cwd <path>", "Project root directory")
  .option("--tag <tag>", "Image tag", "dna-app:local")
  .action(async (options: { cwd?: string; tag?: string }) => {
    const root = getRoot(options);
    const result = await runDockerBuild(root, options.tag ?? "dna-app:local");
    if (result.skipped) {
      console.error(`⚠ Docker build skipped: ${result.reason}`);
      process.exit(1);
    }
    if (result.success) {
      console.log(`✓ Docker build succeeded: ${result.imageTag}`);
    } else {
      console.error(`✗ Docker build failed`);
      if (result.output) console.error(result.output);
      process.exit(1);
    }
  });

github
  .command("issue")
  .description("Create a GitHub issue from a classified runtime issue JSON file")
  .requiredOption("--file <path>", "Path to issue JSON file")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { file: string; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config?.github?.owner || !config?.github?.repo) {
      console.error("GitHub not configured. Run `dna github connect` first.");
      process.exit(1);
    }

    const { readFile } = await import("node:fs/promises");
    const issue = JSON.parse(await readFile(options.file, "utf-8"));
    const creds = await resolveGitHubToken();
    const result = await createIssue(
      {
        owner: config.github.owner,
        repo: config.github.repo,
        token: creds?.token,
      },
      issue,
    );

    if ("dryRun" in result) {
      console.log("Dry run (not signed in to GitHub):");
      console.log(JSON.stringify(result.payload, null, 2));
      console.log("\nRun `dna github login` to create issues for real.");
    } else {
      console.log(`✓ Issue created: ${result.url}`);
    }
  });

const ai = program.command("ai").description("AI provider configuration");

ai
  .command("connect")
  .description("Configure AI provider")
  .option("--provider <name>", "mock|openai|anthropic", "mock")
  .option("--model <model>", "Model name")
  .option("--endpoint <url>", "API endpoint URL")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      provider: string;
      model?: string;
      endpoint?: string;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const provider = options.provider as "mock" | "openai" | "anthropic";
      config.ai = {
        enabled: true,
        provider,
        model: options.model,
        endpoint: options.endpoint,
      };
      config.updatedAt = new Date().toISOString();
      await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

      console.log(`✓ AI provider configured: ${provider}`);
      if (provider !== "mock") {
        console.log(`  Set ${provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY"} env var.`);
      }
    },
  );

ai
  .command("repair")
  .description("Run AI repair workflow for a classified issue")
  .requiredOption("--file <path>", "Path to issue JSON file")
  .option("--dry-run", "Plan only, do not create branch or PR")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { file: string; dryRun?: boolean; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const { readFile } = await import("node:fs/promises");
    const issue = JSON.parse(await readFile(options.file, "utf-8"));

    const result = await executeRepairWorkflow({
      projectRoot: root,
      dnaRoot: join(root, ".DNA"),
      issue,
      config,
      dryRun: options.dryRun,
    });

    console.log("DNA AI Repair");
    console.log("=============");
    console.log(`Branch: ${result.branchName}`);
    console.log(`Confidence: ${(result.plan.confidence * 100).toFixed(0)}%`);
    console.log(`Tests: ${result.testsPassed ? "passed" : "failed/skipped"}`);
    if (result.prUrl) console.log(`PR: ${result.prUrl}`);
    console.log("\n**Never auto-merged** — requires human review.");
  });

program
  .command("doctor")
  .description("Scaffold, repair, and health-check DNA (orchestrator — runs by default)")
  .option("--cwd <path>", "Project root directory")
  .option("--check-only", "Report only — do not scaffold or fix")
  .option("--ivf", "Run brownfield IVF pipeline (analyze → document → plan)")
  .option("--quote <text>", "IVF integration quote")
  .action(async (options: { cwd?: string; checkOnly?: boolean; ivf?: boolean; quote?: string }) => {
    const result = await runDoctorOrchestrator({
      root: getRoot(options),
      checkOnly: options.checkOnly,
      runIvf: options.ivf,
      quote: options.quote,
      onStatus: (msg) => console.log(msg),
    });
    console.log(formatDoctorOrchestratorResult(result));
    if (!result.report.validation.valid && !options.checkOnly) {
      process.exit(1);
    }
  });

program
  .command("ivf")
  .description("Brownfield orchestrator — analyze, document, plan, and wire DNA into existing projects")
  .option("--quote <text>", "Plain-language integration requirement")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { quote?: string; cwd?: string }) => {
    const result = await runDoctorOrchestrator({
      root: getRoot(options),
      runIvf: true,
      quote: options.quote ?? "Integrate DNA without a rewrite",
      onStatus: (msg) => console.log(msg),
    });
    console.log(formatDoctorOrchestratorResult(result));
  });

program
  .command("update")
  .description("Check for DNA knowledge pack updates")
  .option("--cwd <path>", "Project root directory")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .action(async (options: { cwd?: string; channel?: "stable" | "beta" | "nightly" }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const channel = options.channel ?? config?.channel ?? "stable";
    const result = await checkMarketplaceUpdates(root, channel);
    console.log(formatUpdateResult(result));
  });

const marketplace = program.command("marketplace").description("Remote knowledge pack marketplace");

marketplace
  .command("list")
  .description("List available knowledge packs")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .action(async (options: { channel?: "stable" | "beta" | "nightly" }) => {
    const catalog = await fetchMarketplaceCatalog({ channel: options.channel ?? "stable" });
    console.log(formatMarketplaceCatalog(catalog));
  });

marketplace
  .command("search")
  .description("Search knowledge packs")
  .option("--query <text>", "Search query")
  .option("--category <category>", "languages|frameworks|platforms|disciplines|compliance")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .action(
    async (options: {
      query?: string;
      category?: "languages" | "frameworks" | "platforms" | "disciplines" | "compliance";
      channel?: "stable" | "beta" | "nightly";
    }) => {
      const catalog = await fetchMarketplaceCatalog({ channel: options.channel ?? "stable" });
      const results = searchCatalog(catalog, options.query, options.category);
      if (!results.length) {
        console.log("No packs matched your search.");
        return;
      }
      console.log(`Found ${results.length} pack(s):\n`);
      for (const pack of results) {
        console.log(`• ${pack.id}@${pack.version} — ${pack.name}`);
        console.log(`  ${pack.description}\n`);
      }
    },
  );

marketplace
  .command("install")
  .description("Install a knowledge pack into .DNA/knowledge/")
  .argument("<packId>", "Pack id, e.g. frameworks/vite")
  .option("--cwd <path>", "Project root directory")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .action(async (packId: string, options: { cwd?: string; channel?: "stable" | "beta" | "nightly" }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const { pack, files } = await installKnowledgePackById(root, packId, options.channel ?? "stable");
    console.log(`✓ Installed ${pack.name} (${pack.id}@${pack.version})`);
    console.log(`  Files: ${files.length}`);
    files.forEach((f) => console.log(`    ${f}`));
    console.log("\nBrowse: https://dna.humaan.app/marketplace");
  });

const plan = program.command("plan").description("Generate AI implementation plans from plain-language requirements");

plan
  .command("rbac")
  .description("Plan RBAC + zero trust from a plain-language requirement")
  .option("--quote <text>", "Plain-language requirement from the user")
  .option("--roles <list>", "Comma-separated roles, e.g. manager,hr,operations,admin")
  .option("--feature <name>", "Feature or area to secure, e.g. dashboard", "dashboard")
  .option("--no-deny-by-default", "Allow access by default (not recommended)")
  .option("--no-zero-trust", "Skip zero-trust server enforcement guidance")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      quote?: string;
      roles?: string;
      feature?: string;
      denyByDefault?: boolean;
      zeroTrust?: boolean;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const roles = options.roles
        ? parseRolesInput(options.roles)
        : ["manager", "hr", "operations", "admin"];

      const result = await generateRbacPlan({
        root,
        quote: options.quote,
        roles,
        feature: options.feature ?? "dashboard",
        denyByDefault: options.denyByDefault !== false,
        zeroTrust: options.zeroTrust !== false,
      });

      console.log("✓ RBAC plan generated\n");
      console.log(`  Plan:   ${result.planPath}`);
      console.log(`  Matrix: ${result.matrixPath}`);
      console.log(`  JSON:   ${result.matrixJsonPath}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context rbac");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

plan
  .command("feature")
  .description("Plan a Humaan platform feature from plain-language requirements")
  .argument("<featureId>", "Feature id, e.g. admin-portal, sso-bridge, azure-deploy")
  .option("--quote <text>", "Plain-language requirement from the user")
  .option(
    "--reference-project <id>",
    "Reference project: aistudio|colorparty|humaan|soli",
  )
  .option("--cwd <path>", "Project root directory")
  .action(
    async (
      featureId: string,
      options: {
        quote?: string;
        referenceProject?: "aistudio" | "colorparty" | "humaan" | "soli";
        cwd?: string;
      },
    ) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const result = await generateFeaturePlan({
        root,
        featureId,
        quote: options.quote,
        referenceProject: options.referenceProject,
      });

      console.log(`✓ Feature plan generated: ${result.feature.name}\n`);
      console.log(`  Plan: ${result.planPath}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context platform");
      if (result.feature.category === "auth" || result.feature.id.includes("rbac")) {
        console.log("  dna plan rbac --quote \"...\"  (if roles involved)");
      }
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

plan
  .command("compliance")
  .description("Plan tiered GDPR, HIPAA, ISO 27001, SOC 2, or PCI controls")
  .option("--frameworks <list>", "Comma-separated: gdpr,hipaa,iso27001,soc2,pci_dss,uk_gdpr")
  .option("--framework <id>", "Single framework (alias for --frameworks)")
  .option("--tier <tier>", "Org tier: startup|sme|corporate|enterprise (inferred from stage if omitted)")
  .option("--quote <text>", "Plain-language requirement")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      frameworks?: string;
      framework?: string;
      tier?: string;
      quote?: string;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const frameworkInput = options.frameworks ?? options.framework;
      let frameworks = frameworkInput ? parseFrameworksInput(frameworkInput) : [];

      if (!frameworks.length && config.compliance !== "none" && config.compliance !== "custom" && config.compliance !== "pdpa_thailand") {
        frameworks = parseFrameworksInput(config.compliance);
      }
      if (!frameworks.length) {
        frameworks = parseFrameworksInput("gdpr,iso27001");
      }

      const tier = options.tier ? parseOrgTier(options.tier) : undefined;
      if (options.tier && !tier) {
        console.error("Unknown tier. Use: startup, sme, corporate, enterprise");
        process.exit(1);
      }

      const result = await generateCompliancePlan({
        root,
        frameworks,
        tier,
        quote: options.quote,
      });

      console.log(`✓ Compliance plan generated (${result.tier} tier)\n`);
      console.log(`  Plan:   ${result.planPath}`);
      console.log(`  Matrix: ${result.matrixPath}`);
      console.log(`  Frameworks: ${result.frameworks.join(", ")}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context compliance");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

plan
  .command("ivf")
  .description("Generate an Integrating Vertical Functions plan for brownfield projects")
  .option("--quote <text>", "Plain-language integration requirement")
  .option(
    "--verticals <list>",
    "Comma-separated: behaviour,cellularMemory,runtime,rbac,compliance,platform,knowledge,neuralNetwork,mui,buildRules,sharedLibrary,mobileTheming,mobileBuildRules,impressions",
  )
  .option("--gaps-only", "Only write gap matrix, skip full plan document")
  .option("--no-document", "Skip automatic dna document --from-code")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      quote?: string;
      verticals?: string;
      gapsOnly?: boolean;
      document?: boolean;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const verticals = options.verticals ? parseVerticalsInput(options.verticals) : undefined;
      if (options.verticals && verticals && !verticals.length) {
        console.error("Unknown verticals. Use: behaviour,cellularMemory,runtime,rbac,compliance,platform,knowledge,neuralNetwork,mui,buildRules,sharedLibrary,mobileTheming,mobileBuildRules,impressions");
        process.exit(1);
      }

      const result = await generateIvfPlan({
        root,
        quote: options.quote,
        verticals,
        gapsOnly: options.gapsOnly,
        documentFromCode: options.document !== false,
      });

      console.log("✓ IVF plan generated\n");
      if (!options.gapsOnly) {
        console.log(`  Plan:  ${result.planPath}`);
      }
      console.log(`  Gaps:  ${result.gapsPath}`);
      if (result.documentFiles?.length) {
        console.log(`  Docs:  ${result.documentFiles.length} file(s) from codebase analysis`);
      }
      if (result.sharedLibraryPlanPath) {
        console.log(`  Shared library: ${result.sharedLibraryPlanPath}`);
      }
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context ivf");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

const compliance = program.command("compliance").description("Tiered compliance standards catalog");

compliance
  .command("list")
  .description("List org tiers and compliance frameworks")
  .action(() => {
    console.log(formatComplianceCatalog());
  });

compliance
  .command("tiers")
  .description("Show organisation tier definitions")
  .action(() => {
    console.log(formatComplianceCatalog().split("Frameworks")[0]);
  });

compliance
  .command("documents")
  .description("UK GDPR required document catalog (scrubbed templates)")
  .option("--tier <tier>", "Filter by org tier: startup|sme|corporate|enterprise")
  .option("--no-ai", "Exclude AI-specific documents")
  .action((options: { tier?: string; ai?: boolean }) => {
    const tier = options.tier ? parseOrgTier(options.tier) : undefined;
    if (options.tier && !tier) {
      console.error("Unknown tier. Use: startup, sme, corporate, enterprise");
      process.exit(1);
    }
    console.log(formatGdprDocumentCatalog(tier));
  });

compliance
  .command("install-examples")
  .description("Install GDPR reference examples into .DNA/knowledge/compliance/gdpr/examples/")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const installed = await installGdprExamples(root);
    console.log(`✓ Installed ${installed.length} GDPR reference files`);
    installed.slice(0, 5).forEach((f) => console.log(`  ${f}`));
    if (installed.length > 5) console.log(`  ... and ${installed.length - 5} more`);
    console.log("\nBrowse: .DNA/knowledge/compliance/gdpr/examples/INDEX.md");
  });

const platform = program.command("platform").description("DNA production platform catalog");

platform
  .command("list")
  .description("List platform features DNA learned from production projects")
  .action(() => {
    console.log(formatPlatformCatalog());
  });

platform
  .command("projects")
  .description("List reference production projects")
  .action(async () => {
    const projects = await resolveReferenceProjects();
    console.log("DNA production reference projects:\n");
    for (const p of projects) {
      console.log(`• ${p.id} — ${p.name}`);
      console.log(`  ${formatReferencePath(p)}`);
      console.log(`  ${p.stack}`);
      for (const h of p.highlights) {
        console.log(`  - ${h}`);
      }
      console.log("");
    }
  });

platform
  .command("project")
  .description("Show features mapped to a reference project")
  .argument("<projectId>", "aistudio|colorparty|humaan|soli")
  .action((projectId: string) => {
    const valid = ["aistudio", "colorparty", "humaan", "soli"] as const;
    if (!valid.includes(projectId as (typeof valid)[number])) {
      console.error(`Unknown project: ${projectId}`);
      process.exit(1);
    }
    console.log(formatProjectFeatures(projectId as (typeof valid)[number]));
  });

program
  .command("credits")
  .description("Show sponsors, funding links, and package credits")
  .action(async () => {
    const { loadSponsorLedger, formatCredits } = await import("./credits.js");
    try {
      console.log(formatCredits(await loadSponsorLedger()));
    } catch {
      console.log("DNA by Humaan — credits");
      console.log("");
      console.log("Maintained by Humaan by Superlite (https://dna.humaan.app)");
      console.log("Sponsor: https://github.com/sponsors/superhumaan");
      console.log("Services: https://dna.humaan.app/services");
      console.log("");
      console.log("Also try: npm fund @superhumaan/dna-by-humaan");
    }
  });

program.parse();
