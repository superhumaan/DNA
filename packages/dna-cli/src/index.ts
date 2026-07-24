import { Command } from "./cli.js";
import { join, dirname } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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
  applyMarketplaceUpdates,
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
  generateMethodologyPlan,
  showDeliveryProfile,
  setDeliveryProfile,
  formatDeliveryProfileSummary,
  generateDiscoveryPlan,
  generateResearchPlan,
  showDiscoveryProfile,
  setDiscoveryProfile,
  formatDiscoveryProfileSummary,
  syncDiscoveryFindings,
  LIFECYCLE_CATALOG,
  TEAM_CATALOG,
  PROCESS_CATALOG,
  METHOD_CATALOG,
  EVENT_CATALOG,
  generateIndustryPlan,
  generateIndustryContext,
  formatIndustryCatalog,
  METHODOLOGY_CATALOG,
  ARCHETYPE_CATALOG,
  generateLegalPlan,
  formatLegalCatalog,
  generateLegalContext,
  parseDomainsInput,
  parseJurisdictionsInput,
  adviseLegal,
  formatGdprDocumentCatalog,
  installGdprExamples,
  installFeatureFactory,
  uninstallFeatureFactory,
  refreshAiToolsForFeatureFactory,
  installAiCommands,
  uninstallAiCommands,
  formatAiCommandsCatalog,
  uninstallAiWorkbench,
  persistAiWorkbenchEnabled,
  syncAiInjection,
  verifyAiInjection,
  formatAiInjectionReport,
  getPromptStemPacks,
  getPromptStemPack,
  installPromptStemPacks,
  STEM_CATEGORY_LABELS,
  formatAiConnectGuide,
  intelligenceCatalogJson,
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
  formatImpressionsDriftReport,
  generateImpressionsSyncPlan,
  openImpressionsSyncDraftPr,
  exportCellularMemory,
  importCellularMemory,
  syncFromTeamRegistry,
  formatMemoryExportSummary,
  formatMemoryImportSummary,
  analyzeSharedLibrary,
  planSharedLibraryExecution,
  formatSharedLibraryDryRun,
  scaffoldSharedLibraryPackage,
  executeSharedLibraryExtraction,
  generateAuditLoggingScaffold,
  generateSsoScaffold,
  generateMultiTenantScaffold,
  generateFeatureFlagsScaffold,
  generateGradualRolloutScaffold,
  isPlatformCodegenFeature,
  PLATFORM_CODEGEN_FEATURES,
  startLabServer,
  formatLabStart,
  ensureLabAssets,
  runRegisterLab,
  runRegisterLabWithCallback,
  wireLabStack,
  formatInitCompleteMessage,
  formatInitContextBanner,
  detectProjectContext,
  checkAndUpgradeCli,
  formatCliUpgradeResult,
  maybeAutoUpgradeCli,
  syncAutoUpdateForCliVersion,
} from "@superhumaan/dna-core";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET } from "@superhumaan/dna-templates";
import { createIssue, loginWithWebFlow, pushFeatureToGitHub, resolveGitHubToken } from "@superhumaan/dna-github";
import { executeRepairWorkflow } from "@superhumaan/dna-ai";
import {
  buildUpstreamIssuePayload,
  ingestFeedback,
  readFeedbackQueue,
  reportUpstream,
  syncFeedbackQueue,
} from "@superhumaan/dna-feedback";
import { runInitWizard } from "./prompts.js";
import { connectGitHubDuringOnboarding } from "./github-onboarding.js";
import { resolveProjectRoot, resolveTargetDirectory } from "./project-root.js";

const CLI_ENTRY_PATH = fileURLToPath(import.meta.url);
const CLI_PACKAGE_JSON = JSON.parse(
  readFileSync(join(dirname(CLI_ENTRY_PATH), "../package.json"), "utf-8"),
) as { version: string };
const CLI_VERSION = CLI_PACKAGE_JSON.version;

const program = new Command();

program
  .name("dna")
  .description(`${PRODUCT_NAME} — project intelligence and runtime observer`)
  .version(CLI_VERSION);

function getRoot(options: { cwd?: string }): string {
  return resolveProjectRoot(options.cwd);
}

program
  .command("init")
  .description("Initialise DNA in the current project")
  .option("-y, --yes", "Non-interactive mode with defaults")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { yes?: boolean; cwd?: string }) => {
    const root = resolveTargetDirectory(options.cwd);
    const scan = await scanProject(root);
    const projectContext = detectProjectContext(scan);

    let defaultProjectName: string | undefined;
    let defaultDescription: string | undefined;
    const existing = await loadDnaConfig(root);
    if (existing?.projectName) {
      defaultProjectName = existing.projectName;
      defaultDescription = existing.description;
    } else {
      try {
        const raw = await readFile(join(root, "package.json"), "utf-8");
        const pkg = JSON.parse(raw) as { name?: string; description?: string };
        defaultProjectName = pkg.name;
        defaultDescription = pkg.description;
      } catch {
        defaultProjectName = root.split(/[/\\]/).pop() || undefined;
      }
    }

    console.log(formatInitContextBanner(projectContext, defaultProjectName ?? "project"));

    const answers = await runInitWizard(!!options.yes, scan, defaultProjectName, defaultDescription);
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

    if (result.initAnalysis) {
      console.log("\n" + result.initAnalysis.summary);
    }

    const topGaps =
      result.initAnalysis?.analysis.verticalGaps
        .filter((g) => g.priority === "P0" || g.priority === "P1")
        .slice(0, 5)
        .map((g) => `[${g.priority}] ${g.name}: ${g.currentState}`) ?? [];

    console.log(
      formatInitCompleteMessage({
        projectName: result.config.projectName,
        context: result.projectContext,
        archetype: result.config.stack.archetype,
        aiTools: result.config.aiTools,
        topGaps,
        detectedFeatures: result.initAnalysis?.detectedFeatures,
        planPath: result.initAnalysis?.planPath,
      }),
    );
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
  .option("--open-pr", "Open a GitHub PR with Impressions sync plan when drift is critical")
  .action(async (options: { cwd?: string; openPr?: boolean }) => {
    const root = getRoot(options);
    const scan = await scanProject(root);
    console.log(formatScanSummary(scan));

    if (options.openPr && scan.impressionsDrift && scan.impressionsDrift.level === "critical") {
      const result = await openImpressionsSyncDraftPr({ root, draft: true });
      console.log("\n" + formatImpressionsDriftReport(scan.impressionsDrift));
      console.log(`\nSync plan written: ${result.planPath}`);
      if (result.prUrl) {
        console.log(`Draft PR: ${result.prUrl}`);
      } else {
        console.log("Configure GitHub (`dna github login`) to open draft PRs automatically.");
      }
    }
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
  .argument("<target>", "cursor|claude|chatgpt|copilot|windsurf|gemini|backend|frontend|security|qa|devops|rbac|platform|compliance|legal|multilingual|methodology|discovery|industry|ivf|all")
  .option("--cwd <path>", "Project root directory")
  .option("--feature <id>", "Focus platform context on a feature id (with platform target)")
  .option("--tier <tier>", "Org tier for compliance context: startup|sme|corporate|enterprise")
  .option("--frameworks <list>", "Frameworks for compliance context: gdpr,hipaa,iso27001")
  .option("--domains <list>", "Legal domains for legal context: privacy,banking,healthcare")
  .option("--jurisdictions <list>", "Legal jurisdictions: sg,th,eu,us,uk")
  .option("--quote <text>", "Plain-language question for legal context or advisor")
  .action(async (target: string, options: { cwd?: string; feature?: string; tier?: string; frameworks?: string; domains?: string; jurisdictions?: string; quote?: string }) => {
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
      "legal",
      "multilingual",
      "methodology",
      "discovery",
      "industry",
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

    if (target === "legal") {
      const domains = options.domains ? parseDomainsInput(options.domains) : undefined;
      const jurisdictions = options.jurisdictions ? parseJurisdictionsInput(options.jurisdictions) : undefined;
      const context = await generateLegalContext(root, { domains, jurisdictions, quote: options.quote });
      console.log(context);
      return;
    }

    if (target === "ivf") {
      const context = await generateIvfContext(root);
      console.log(context);
      return;
    }

    if (target === "methodology") {
      const context = await generateContext(root, "methodology");
      console.log(context);
      return;
    }

    if (target === "discovery") {
      const context = await generateContext(root, "discovery");
      console.log(context);
      return;
    }

    if (target === "industry") {
      const context = await generateIndustryContext(root);
      console.log(context);
      return;
    }

    const context = await generateContext(
      root,
      target as Exclude<(typeof validTargets)[number], "platform" | "compliance" | "legal" | "ivf" | "methodology" | "discovery" | "industry">,
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
        storage: "json",
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

const featureFactory = program
  .command("feature-factory")
  .description("Cursor feature factory rules and /ai agent templates");

featureFactory
  .command("install")
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

featureFactory
  .command("uninstall")
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

const commandsCmd = program
  .command("commands")
  .description("Cursor and Claude slash commands for DNA CLI");

commandsCmd
  .command("install")
  .description("Install /dna-* slash commands for Cursor and Claude Code")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const created = await installAiCommands(root, config);
    console.log(`✓ DNA slash commands installed (${created.length} files)`);
    console.log("\nCursor: type `/` and search for `dna-` (e.g. `/dna-doctor`, `/dna-analyze`)");
    console.log("Claude: type `/` and search for `dna-` in Claude Code");
    console.log("\nCatalog: https://dna.humaan.app/intelligence");
  });

commandsCmd
  .command("list")
  .description("List available DNA slash commands")
  .action(() => {
    console.log(formatAiCommandsCatalog());
  });

commandsCmd
  .command("export-catalog")
  .description("Write intelligence catalog JSON (for DNA-Web sync)")
  .option("--out <path>", "Output file path", ".DNA/intelligence-catalog.json")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { out?: string; cwd?: string }) => {
    const root = getRoot(options);
    const outPath = join(root, options.out ?? ".DNA/intelligence-catalog.json");
    await writeFile(outPath, intelligenceCatalogJson(), "utf-8");
    console.log(`✓ Intelligence catalog written to ${outPath}`);
  });

commandsCmd
  .command("uninstall")
  .description("Remove DNA slash commands from Cursor and Claude")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const removed = await uninstallAiCommands(root);
    if (removed.length === 0) {
      console.log("No DNA slash commands found.");
      return;
    }
    console.log(`✓ Removed ${removed.length} command files`);
  });

const workbenchCmd = program
  .command("workbench")
  .description("DNA Workbench — prompt-first Cursor and Claude packages (default on init/update)");

workbenchCmd
  .command("install")
  .description("Install or refresh DNA Workbench prompts and skills")
  .option("--bundled", "Use bundled stem catalog (skip remote fetch)")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { bundled?: boolean; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    await persistAiWorkbenchEnabled(root, config, true);
    const injection = await syncAiInjection(root, config, {
      preferRemoteStems: options.bundled ? false : undefined,
    });
    console.log(`✓ DNA Workbench installed (${injection.written.length} files, ${getPromptStemPacks().length} stem packs)`);
    console.log(formatAiInjectionReport(injection.report));
    console.log("\nIn Cursor, type `/` → analyze-project, what-next, ship-feature, …");
    console.log("Copy-paste library: https://dna.humaan.app/intelligence#stem-library");
  });

workbenchCmd
  .command("uninstall")
  .description("Remove DNA Workbench (opt out of default prompts)")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed.");
      process.exit(1);
    }
    const removed = await uninstallAiWorkbench(root);
    await persistAiWorkbenchEnabled(root, config, false);
    console.log(`✓ DNA Workbench removed (${removed.length} files)`);
    console.log("Re-enable: dna workbench install");
  });

const stemsCmd = program
  .command("stems")
  .description("DNA prompt stem packs — copy-paste prompts with guidelines and expectations");

stemsCmd
  .command("list")
  .description("List installed prompt stem packs")
  .option("--cwd <path>", "Project root directory")
  .action(async (_options: { cwd?: string }) => {
    const packs = getPromptStemPacks();
    console.log(`DNA Prompt Stem Packs (${packs.length})\n`);
    for (const [cat, meta] of Object.entries(STEM_CATEGORY_LABELS)) {
      const inCat = packs.filter((p) => p.category === cat);
      if (!inCat.length) continue;
      console.log(`${meta.label}`);
      for (const p of inCat) {
        const slash = p.slash ? ` /${p.slash}` : "";
        console.log(`  ${p.id}${slash} — ${p.summary}`);
      }
      console.log("");
    }
    console.log("Catalog: https://dna.humaan.app/intelligence#stem-library");
  });

stemsCmd
  .command("show <id>")
  .description("Show a stem pack — copy variants and file paths")
  .option("--cwd <path>", "Project root directory")
  .action(async (id: string) => {
    const pack = getPromptStemPack(id);
    if (!pack) {
      console.error(`Unknown stem: ${id}`);
      process.exit(1);
    }
    console.log(`${pack.name} (${pack.id})`);
    console.log(pack.summary);
    if (pack.slash) console.log(`Slash: /${pack.slash}`);
    console.log(`\nCopy-paste:\n`);
    for (const v of pack.copyVariants) {
      console.log(`  "${v}"`);
    }
    console.log(`\nFiles: .DNA/stems/${pack.id}/`);
    for (const f of pack.files) {
      console.log(`  ${f.path}`);
    }
  });

stemsCmd
  .command("install")
  .description("Install or refresh all prompt stem packs")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const created = await installPromptStemPacks(root, config);
    console.log(`✓ Prompt stem packs installed (${created.length} files, ${getPromptStemPacks().length} stems)`);
    console.log("https://dna.humaan.app/intelligence#stem-library");
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

const feedback = program.command("feedback").description("Upstream DNA platform feedback");

feedback
  .command("report")
  .description("Report a DNA platform issue to the upstream feedback API")
  .option("--message <text>", "Error message to report")
  .option("--file <path>", "JSON file with error details")
  .option("--command <cmd>", "Command that failed (e.g. dna doctor)")
  .option("--dry-run", "Print payload without sending")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      message?: string;
      file?: string;
      command?: string;
      dryRun?: boolean;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      let message = options.message;
      let stack: string | undefined;
      let command = options.command;

      if (options.file) {
        const raw = JSON.parse(await readFile(options.file, "utf-8")) as {
          message?: string;
          stack?: string;
          command?: string;
        };
        message = message ?? raw.message;
        stack = raw.stack;
        command = command ?? raw.command;
      }

      if (!message) {
        console.error("Provide --message or --file with a message field.");
        process.exit(1);
      }

      const result = await reportUpstream({
        projectRoot: root,
        config,
        source: "manual",
        message,
        stack,
        command,
        dnaVersion: CLI_VERSION,
        dryRun: options.dryRun,
      });

      if (result.status === "skipped") {
        console.log("Skipped — not a DNA platform issue or feedback disabled.");
        return;
      }

      if (result.status === "dry-run") {
        console.log(JSON.stringify(result.payload, null, 2));
        console.log("\nUpstream issue preview:");
        console.log(JSON.stringify(buildUpstreamIssuePayload(result.payload), null, 2));
        return;
      }

      if (result.status === "sent") {
        console.log(`✓ Feedback sent to ${result.endpoint}`);
      } else if (result.status === "queued") {
        console.log(`✓ Feedback queued (offline): ${result.queuePath}`);
        console.log("  Run `dna feedback sync` when online.");
      }
    },
  );

feedback
  .command("sync")
  .description("Flush queued feedback to the upstream API")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const { sent, remaining } = await syncFeedbackQueue(root, config);
    console.log(`✓ Sent ${sent} report(s); ${remaining} remaining in queue`);
  });

feedback
  .command("status")
  .description("Show feedback config and queue status")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const queue = await readFeedbackQueue(root);
    const fb = config.feedback ?? {
      enabled: true,
      upstream: true,
      autoReport: "dna-only" as const,
      includeSuggestedFix: true,
    };

    console.log("Feedback configuration:");
    console.log(`  enabled: ${fb.enabled}`);
    console.log(`  upstream: ${fb.upstream}`);
    console.log(`  autoReport: ${fb.autoReport}`);
    console.log(`  queued: ${queue.length}`);
  });

feedback
  .command("ingest")
  .description("Maintainer: ingest feedback JSON into superhumaan/DNA issues (requires DNA_FEEDBACK_TOKEN)")
  .requiredOption("--file <path>", "Feedback payload JSON file")
  .option("--dry-run", "Preview without creating GitHub issue")
  .action(async (options: { file: string; dryRun?: boolean }) => {
    const payload = JSON.parse(await readFile(options.file, "utf-8"));
    const result = await ingestFeedback(payload, { dryRun: options.dryRun });

    if (result.action === "dry-run") {
      console.log("Dry run — issue payload:");
      console.log(JSON.stringify(buildUpstreamIssuePayload(payload), null, 2));
      return;
    }

    if (result.action === "deduped") {
      console.log(`✓ Deduped — commented on existing issue #${result.issueNumber}: ${result.issueUrl}`);
    } else {
      console.log(`✓ Created issue #${result.issueNumber}: ${result.issueUrl}`);
    }
  });

const ai = program.command("ai").description("AI provider configuration");

ai
  .command("connect")
  .description("Configure AI provider — run without flags to see supported services")
  .option("--provider <name>", "openai|anthropic|mock")
  .option("--model <model>", "Model name")
  .option("--endpoint <url>", "API endpoint URL")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      provider?: string;
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

      if (!options.provider) {
        console.log(
          formatAiConnectGuide({
            enabled: config.ai?.enabled,
            provider: config.ai?.provider,
            model: config.ai?.model,
          }),
        );
        return;
      }

      const provider = options.provider as "mock" | "openai" | "anthropic";
      if (!["mock", "openai", "anthropic"].includes(provider)) {
        console.error(`Unknown provider "${options.provider}". Run \`dna ai connect\` for supported services.`);
        process.exit(1);
      }

      config.ai = {
        ...config.ai,
        enabled: true,
        provider,
        model: options.model ?? config.ai?.model,
        endpoint: options.endpoint ?? config.ai?.endpoint,
      };
      config.updatedAt = new Date().toISOString();
      await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

      if (provider === "mock") {
        console.log("✓ AI provider configured: mock (local testing only)");
        console.log("  Run `dna ai connect` to connect OpenAI or Anthropic for real repairs.");
        return;
      }

      const envVar = provider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY";
      console.log(`✓ AI provider configured: ${provider}`);
      console.log(`  Set ${envVar} in your environment.`);
      console.log("  Test: dna ai repair --file issue.json --dry-run");
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
    console.log(`Files modified: ${result.filesModified.join(", ") || "none"}`);
    console.log(`Tests: ${result.testsPassed ? "passed" : "failed/skipped"}`);
    if (result.prUrl) console.log(`PR: ${result.prUrl}`);
    console.log("\n**Never auto-merged** — requires human review.");
  });

ai
  .command("force-repair")
  .description("Force aggressive repair for open runtime blockers")
  .option("--fingerprint <id>", "Specific fingerprint to repair")
  .option("--dry-run", "Plan only, do not create branch or PR")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { fingerprint?: string; dryRun?: boolean; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    const { runForceRepair } = await import("@superhumaan/dna-runtime");
    const result = await runForceRepair({
      projectRoot: root,
      dnaRoot: join(root, ".DNA"),
      config,
      fingerprint: options.fingerprint,
      dryRun: options.dryRun,
    });

    if (!result) {
      console.log("No open blockers in runtime.db or amygdala/blockers.md.");
      console.log("Blockers appear after repeatCount >= ai.repair.minRepeatForBlocker (default 5).");
      return;
    }

    console.log("DNA Force Repair — aggressive loop");
    console.log("==================================");
    console.log(`Blockers found: ${result.blockersFound}`);
    console.log(`Target: ${result.issue.title}`);
    console.log(`Fingerprint: ${result.issue.fingerprint}`);
    console.log(`Repeat count: ${result.issue.repeatCount}`);
    console.log(`Branch: ${result.repair.branchName}`);
    console.log(`Files modified: ${result.repair.filesModified.join(", ") || "none"}`);
    if (result.repair.prUrl) console.log(`PR: ${result.repair.prUrl}`);
    console.log("");
    console.log("MANDATORY: Run full 9-role agent loop until error stops recurring.");
    console.log("Load amygdala/blockers.md + temporalLobe/previous-solutions.md before coding.");
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
      root: resolveTargetDirectory(options.cwd),
      checkOnly: options.checkOnly,
      runIvf: options.ivf,
      quote: options.quote,
      currentCliVersion: CLI_VERSION,
      cliEntryPath: CLI_ENTRY_PATH,
      onStatus: (msg) => console.log(msg),
    });
    console.log(formatDoctorOrchestratorResult(result));
    if (!result.report.validation.valid && !options.checkOnly) {
      process.exit(1);
    }
  });

const ivfCmd = program
  .command("ivf")
  .description("Brownfield IVF — integrate DNA into existing projects");

ivfCmd
  .command("run", { isDefault: true })
  .description("Analyze, document, plan, and wire DNA into existing projects")
  .option("--quote <text>", "Plain-language integration requirement")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { quote?: string; cwd?: string }) => {
    const result = await runDoctorOrchestrator({
      root: resolveTargetDirectory(options.cwd),
      runIvf: true,
      quote: options.quote ?? "Integrate DNA without a rewrite",
      onStatus: (msg) => console.log(msg),
    });
    console.log(formatDoctorOrchestratorResult(result));
  });

ivfCmd
  .command("shared-library")
  .description("Shared library extraction — analyze, dry-run, scaffold")
  .option("--dry-run", "List files that would be moved")
  .option("--scaffold", "Create shared package skeleton")
  .option("--execute", "Execute extraction (copy components + rewire imports)")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { dryRun?: boolean; scaffold?: boolean; execute?: boolean; cwd?: string }) => {
    const root = getRoot(options);

    if (options.execute) {
      const result = await executeSharedLibraryExtraction({ root, runTests: true });
      console.log("✓ Shared library extraction complete\n");
      console.log(`  Package: ${result.packagePath}`);
      console.log(`  Copied:  ${result.copied.length} file(s)`);
      console.log(`  Rewired: ${result.rewired.length} import(s)`);
      if (result.rewired.length) {
        result.rewired.forEach((f) => console.log(`    ${f}`));
      }
      return;
    }

    if (options.scaffold) {
      const result = await scaffoldSharedLibraryPackage(root);
      console.log("✓ Shared library package scaffolded\n");
      console.log(`  Path: ${result.packagePath}`);
      result.created.forEach((f) => console.log(`    ${f}`));
      return;
    }

    const analysis = await analyzeSharedLibrary(root);
    const plan = planSharedLibraryExecution(analysis);
    console.log(formatSharedLibraryDryRun(plan));
  });

program
  .command("update")
  .description(
    "Upgrade DNA CLI, re-apply all installed knowledge packs, and force re-inject Cursor/Claude rules",
  )
  .option("--cwd <path>", "Project root directory")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .option("--skip-workbench", "Do not refresh Cursor/Claude workbench prompts / rules")
  .option("--skip-cli", "Do not check or install a newer DNA CLI package")
  .option("--skip-packs", "Do not re-apply installed marketplace knowledge packs")
  .option("--check-only", "Report available updates without installing or rewriting files")
  .action(async (options: {
    cwd?: string;
    channel?: "stable" | "beta" | "nightly";
    skipWorkbench?: boolean;
    skipCli?: boolean;
    skipPacks?: boolean;
    checkOnly?: boolean;
  }) => {
    const root = getRoot(options);
    let config = await loadDnaConfig(root);
    const channel = options.channel ?? config?.channel ?? "stable";
    let injectionComplete = true;

    if (!options.skipCli) {
      const cliResult = await checkAndUpgradeCli({
        root,
        currentVersion: CLI_VERSION,
        cliEntryPath: CLI_ENTRY_PATH,
        channel,
        force: true,
        install: !options.checkOnly,
        checkOnly: options.checkOnly,
      });
      console.log(formatCliUpgradeResult(cliResult));
      console.log("");

      // After a real CLI install, finish packs + injection with the NEW package so
      // generators match the published version (running process still has old code).
      if (cliResult.installed && !options.checkOnly) {
        const { spawnSync } = await import("node:child_process");
        const args = [
          "--yes",
          `@superhumaan/dna-by-humaan@${cliResult.latestVersion ?? "latest"}`,
          "update",
          "--skip-cli",
          "--cwd",
          root,
          "--channel",
          channel,
        ];
        if (options.skipWorkbench) args.push("--skip-workbench");
        if (options.skipPacks) args.push("--skip-packs");
        console.log(`\n↻ Re-running update with newly installed CLI (${cliResult.latestVersion})…\n`);
        const child = spawnSync("npx", args, { cwd: root, stdio: "inherit", env: process.env });
        process.exit(child.status ?? 1);
      }
    }

    if (!options.skipPacks) {
      const result = await applyMarketplaceUpdates(root, {
        channel,
        checkOnly: options.checkOnly,
        foundation: true,
      });
      console.log(formatUpdateResult(result));
      // Individual pack failures are reported but do not fail the whole update —
      // injection + CLI refresh must still complete. Exit non-zero only if every
      // refresh attempt failed while packs were installed.
      if (
        !options.checkOnly &&
        (result.failed?.length ?? 0) > 0 &&
        (result.refreshed?.length ?? 0) === 0 &&
        result.installed.length > 0
      ) {
        process.exitCode = 1;
      }
    } else {
      console.log("DNA Marketplace Update");
      console.log("============================");
      console.log("");
      console.log("Skipped pack refresh (--skip-packs).");
    }

    if (config && !options.checkOnly) {
      config = (await loadDnaConfig(root)) ?? config;
      const injection = await syncAiInjection(root, config, {
        force: !options.skipWorkbench,
        workbench: !options.skipWorkbench,
        preferRemoteStems: true,
      });
      injectionComplete = injection.report.complete;
      const stems = injection.written.filter((p: string) => p.startsWith(".DNA/stems/"));
      const rules = injection.written.filter(
        (p: string) => p.includes(".cursor/rules/") || p.includes(".claude/") || p === "AGENTS.md" || p === "CLAUDE.md",
      );
      console.log(
        `\n✓ AI rules re-injected (${injection.written.length} files` +
          `${rules.length ? `, ${rules.length} rules/skills` : ""}` +
          `${stems.length ? `, stems synced` : ""})`,
      );
      console.log(formatAiInjectionReport(injection.report));

      if (!injection.report.complete) {
        console.error("\n✗ DNA co-pilot injection incomplete — AI will not reliably consult DNA.");
        console.error("  Fix missing/stale paths above, then re-run `dna update`.");
        process.exitCode = 1;
      }

      if (config.lab?.enabled !== false) {
        await ensureLabAssets(root);
        const labWire = await wireLabStack({ root, config });
        if (labWire.wired.length > 0) {
          console.log("\n✓ DNA Lab wiring refreshed");
          for (const item of labWire.wired) console.log(`  · ${item}`);
        }
      }
      const indexPath = join(root, ".DNA", "stems", "index.json");
      try {
        const raw = await readFile(indexPath, "utf-8");
        const idx = JSON.parse(raw) as { source?: string; count?: number; catalogVersion?: number };
        if (idx.source && idx.count) {
          console.log(`  Prompt stems: ${idx.count} from ${idx.source} (catalog v${idx.catalogVersion ?? "?"})`);
        }
      } catch {
        // no index yet
      }
    } else if (config && options.checkOnly) {
      const report = await verifyAiInjection(root, config);
      injectionComplete = report.complete;
      console.log(`\n${formatAiInjectionReport(report)}`);
      if (!report.complete) process.exitCode = 1;
    } else if (!config) {
      console.log("\nDNA not installed in this project. Run `dna init` or `dna doctor` first.");
      process.exitCode = 1;
    }

    if (injectionComplete && !options.checkOnly && config) {
      console.log("\n✓ DNA update complete — CLI, knowledge packs, and always-on AI rules are current.");
    }
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
  .option("--category <category>", "languages|frameworks|platforms|disciplines|compliance|legal")
  .option("--channel <channel>", "stable|beta|nightly", "stable")
  .action(
    async (options: {
      query?: string;
      category?: "languages" | "frameworks" | "platforms" | "disciplines" | "compliance" | "legal";
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

    const { pack, files, bundleInstalled } = await installKnowledgePackById(root, packId, options.channel ?? "stable");
    console.log(`✓ Installed ${pack.name} (${pack.id}@${pack.version})`);
    console.log(`  Files: ${files.length}`);
    files.forEach((f) => console.log(`    ${f}`));
    if (bundleInstalled?.length) {
      console.log(`\n  Country bundle (+${bundleInstalled.length} supporting packs):`);
      for (const entry of bundleInstalled) {
        console.log(`    • ${entry.pack.id} — ${entry.pack.name} (${entry.files.length} files)`);
      }
    }
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
  .command("legal")
  .description("Plan legal considerations — privacy, banking, healthcare, IP, regional law")
  .option("--domains <list>", "Comma-separated: privacy,banking,healthcare,ip,consumer,employment,ai_governance")
  .option("--jurisdictions <list>", "Comma-separated: eu,uk,us,sg,th,my,au,ca,in,br,jp,kr,id,ph,vn,hk,tw,cn")
  .option("--tier <tier>", "Org tier: startup|sme|corporate|enterprise")
  .option("--quote <text>", "Plain-language requirement or question")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      domains?: string;
      jurisdictions?: string;
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

      const domains = options.domains ? parseDomainsInput(options.domains) : undefined;
      const jurisdictions = options.jurisdictions ? parseJurisdictionsInput(options.jurisdictions) : undefined;
      const tier = options.tier ? parseOrgTier(options.tier) : undefined;
      if (options.tier && !tier) {
        console.error("Unknown tier. Use: startup, sme, corporate, enterprise");
        process.exit(1);
      }

      const result = await generateLegalPlan({
        root,
        domains,
        jurisdictions,
        tier,
        quote: options.quote,
      });

      console.log(`✓ Legal plan generated (${result.tier} tier)\n`);
      console.log(`  Plan:   ${result.planPath}`);
      console.log(`  Matrix: ${result.matrixPath}`);
      console.log(`  Domains: ${result.domains.join(", ")}`);
      console.log(`  Jurisdictions: ${result.jurisdictions.join(", ") || "none detected"}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context legal");
      console.log("  dna legal advise --quote \"...\"");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

plan
  .command("industry")
  .description("Plan industry context — domain knowledge for agencies and vertical teams")
  .argument("[sector]", "healthcare|fintech|ecommerce-retail|edtech|gov-public-sector|travel-hospitality|saas-b2b|logistics-supply-chain|media-entertainment|real-estate-proptech|energy-utilities|legal-tech")
  .option("--client <name>", "Client or engagement name")
  .option("--secondary <list>", "Comma-separated secondary sectors")
  .option("--quote <text>", "Plain-language requirement")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (
      sector: string | undefined,
      options: { client?: string; secondary?: string; quote?: string; cwd?: string },
    ) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      try {
        const result = await generateIndustryPlan({
          root,
          sector,
          clientName: options.client,
          secondary: options.secondary,
          quote: options.quote,
        });

        console.log(`✓ Industry plan generated (${result.sector})\n`);
        console.log(`  Plan:    ${result.planPath}`);
        console.log(`  Summary: ${result.summaryPath}`);
        console.log(`  Linked:  ${result.linkedPacks.join(", ")}`);
        console.log("");
        console.log("Paste the plan into your AI tool, or run:");
        console.log("  dna context industry");
        console.log("");
        console.log("─".repeat(60));
        console.log(result.context);
      } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        console.error("");
        console.error("Run `dna industry list` to see available sectors.");
        process.exit(1);
      }
    },
  );

plan
  .command("discovery")
  .description("Plan product discovery — lifecycle, research, and Impressions scaffold")
  .option("--lifecycle <stage>", "ideation|problem-validation|solution-validation|pmf|growth|scale")
  .option("--team <model>", "innovation-lab|discovery-squad|embedded-triad|dual-track|design-ops|none")
  .option("--quote <text>", "Plain-language requirement")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: { lifecycle?: string; team?: string; quote?: string; cwd?: string }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const result = await generateDiscoveryPlan({
        root,
        lifecycleStage: options.lifecycle,
        teamModel: options.team,
        quote: options.quote,
      });

      console.log("✓ Discovery plan generated\n");
      console.log(`  Plan: ${result.planPath}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context discovery");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    },
  );

plan
  .command("research")
  .description("Plan a user research study for a specific method")
  .argument("<method>", "user-interviews|usability-testing|surveys|...")
  .option("--quote <text>", "Research question")
  .option("--cwd <path>", "Project root directory")
  .action(async (method: string, options: { quote?: string; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }

    try {
      const result = await generateResearchPlan({
        root,
        method,
        quote: options.quote,
      });

      console.log("✓ Research plan generated\n");
      console.log(`  Plan: ${result.planPath}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context discovery");
      console.log("");
      console.log("─".repeat(60));
      console.log(result.context);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      console.error("");
      console.error("Run `dna discovery list` to see methods and events.");
      process.exit(1);
    }
  });

plan
  .command("methodology")
  .description("Plan delivery methodology — how the team tickets, documents, and plans work")
  .option("--methodology <id>", "scrum|kanban|less|safe|spotify-model|shape-up|dna-default")
  .option("--archetype <id>", "travel-scale-up|big-tech|research-lab|agency|startup|none")
  .option("--quote <text>", "Plain-language requirement")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: { methodology?: string; archetype?: string; quote?: string; cwd?: string }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }

      const result = await generateMethodologyPlan({
        root,
        methodology: options.methodology,
        companyArchetype: options.archetype,
        quote: options.quote,
      });

      console.log("✓ Methodology plan generated\n");
      console.log(`  Plan: ${result.planPath}`);
      console.log("");
      console.log("Paste the plan into your AI tool, or run:");
      console.log("  dna context methodology");
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

plan
  .command("impressions-sync")
  .description("Generate a plan to reconcile Impressions drift with the codebase")
  .option("--cwd <path>", "Project root directory")
  .option("--open-pr", "Include PR automation guidance")
  .action(async (options: { cwd?: string; openPr?: boolean }) => {
    const root = getRoot(options);
    const result = await generateImpressionsSyncPlan({ root, openPr: options.openPr });
    console.log("✓ Impressions sync plan generated\n");
    console.log(`  Plan: ${result.planPath}`);
    console.log(`  Drift: ${result.driftReport.score}/100 (${result.driftReport.level})`);
    console.log("");
    console.log("─".repeat(60));
    console.log(result.context);
  });

const methodology = program
  .command("methodology")
  .description("Configure how your team plans, documents, and tickets work");

methodology
  .command("show")
  .description("Show current delivery profile")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const result = await showDeliveryProfile(root);
    console.log(formatDeliveryProfileSummary(result));
  });

methodology
  .command("list")
  .description("List available methodologies and company archetypes")
  .action(() => {
    console.log("Methodologies:\n");
    for (const m of METHODOLOGY_CATALOG) {
      console.log(`  ${m.id.padEnd(16)} ${m.name}`);
      console.log(`  ${"".padEnd(16)} ${m.description}`);
      console.log(`  ${"".padEnd(16)} Hierarchy: ${m.defaultHierarchy.join(" → ")}\n`);
    }
    console.log("Company archetypes:\n");
    for (const a of ARCHETYPE_CATALOG) {
      console.log(`  ${a.id.padEnd(16)} ${a.name} — ${a.description}`);
    }
    console.log("\nConfigure: dna methodology set --methodology <id> --archetype <id>");
    console.log("Context:   dna context methodology");
  });

methodology
  .command("set")
  .description("Set delivery profile (methodology, archetype, ticket/doc systems)")
  .option("--methodology <id>", "Delivery methodology")
  .option("--archetype <id>", "Company archetype")
  .option("--ticket-system <system>", "jira|linear|github|azure-devops|none")
  .option("--doc-system <system>", "confluence|notion|impressions|google-docs|github-wiki")
  .option("--hierarchy <list>", "Comma-separated hierarchy levels")
  .option("--ceremonies <list>", "Comma-separated ceremonies")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      methodology?: string;
      archetype?: string;
      ticketSystem?: string;
      docSystem?: string;
      hierarchy?: string;
      ceremonies?: string;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }
      if (!options.methodology && !options.archetype && !options.ticketSystem && !options.docSystem) {
        console.error("Provide at least one of: --methodology, --archetype, --ticket-system, --doc-system");
        process.exit(1);
      }
      const result = await setDeliveryProfile({
        root,
        methodology: options.methodology,
        companyArchetype: options.archetype,
        ticketSystem: options.ticketSystem,
        docSystem: options.docSystem,
        hierarchy: options.hierarchy,
        ceremonies: options.ceremonies,
      });
      console.log("✓ Delivery profile updated\n");
      console.log(formatDeliveryProfileSummary(result));
    },
  );

const discovery = program
  .command("discovery")
  .description("Configure product discovery — research, UX, PMF, and lifecycle");

discovery
  .command("show")
  .description("Show current discovery profile")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const result = await showDiscoveryProfile(root);
    console.log(formatDiscoveryProfileSummary(result));
  });

discovery
  .command("list")
  .description("List lifecycle stages, team models, processes, methods, and events")
  .action(() => {
    console.log("Lifecycle stages:\n");
    for (const l of LIFECYCLE_CATALOG) {
      console.log(`  ${l.id.padEnd(22)} ${l.name}`);
      console.log(`  ${"".padEnd(22)} ${l.description}\n`);
    }
    console.log("Team models:\n");
    for (const t of TEAM_CATALOG) {
      console.log(`  ${t.id.padEnd(22)} ${t.name} — ${t.description}`);
    }
    console.log("\nProcesses:\n");
    for (const p of PROCESS_CATALOG) {
      console.log(`  ${p.id.padEnd(22)} ${p.name}`);
    }
    console.log("\nMethods:\n");
    for (const m of METHOD_CATALOG) {
      console.log(`  ${m.id.padEnd(22)} ${m.name} (${m.researchType})`);
    }
    console.log("\nEvents:\n");
    for (const e of EVENT_CATALOG) {
      console.log(`  ${e.id.padEnd(22)} ${e.name}`);
    }
    console.log("\nConfigure: dna discovery set --lifecycle <id> --team <id>");
    console.log("Context:   dna context discovery");
  });

discovery
  .command("set")
  .description("Set discovery profile (lifecycle, team, processes, methods, events)")
  .option("--lifecycle <stage>", "Product lifecycle stage")
  .option("--team <model>", "Discovery team model")
  .option("--processes <list>", "Comma-separated processes")
  .option("--methods <list>", "Comma-separated research methods")
  .option("--events <list>", "Comma-separated discovery events")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: {
      lifecycle?: string;
      team?: string;
      processes?: string;
      methods?: string;
      events?: string;
      cwd?: string;
    }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      if (!config) {
        console.error("DNA not installed. Run `dna init` first.");
        process.exit(1);
      }
      if (
        !options.lifecycle &&
        !options.team &&
        !options.processes &&
        !options.methods &&
        !options.events
      ) {
        console.error(
          "Provide at least one of: --lifecycle, --team, --processes, --methods, --events",
        );
        process.exit(1);
      }
      const result = await setDiscoveryProfile({
        root,
        lifecycleStage: options.lifecycle,
        teamModel: options.team,
        processes: options.processes,
        methods: options.methods,
        events: options.events,
      });
      console.log("✓ Discovery profile updated\n");
      console.log(formatDiscoveryProfileSummary(result));
    },
  );

discovery
  .command("sync")
  .description("Sync research findings into Impressions and CellularMemory")
  .option("--quote <text>", "Summary of findings to append")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { quote?: string; cwd?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    if (!config) {
      console.error("DNA not installed. Run `dna init` first.");
      process.exit(1);
    }
    const result = await syncDiscoveryFindings({ root, quote: options.quote });
    console.log(`✓ ${result.message}\n`);
    for (const path of result.updated) {
      console.log(`  ${path}`);
    }
  });

const memory = program.command("memory").description("CellularMemory export and import across projects");

memory
  .command("export")
  .description("Export CellularMemory segments to a JSON file")
  .option("--cwd <path>", "Project root directory")
  .option("--segments <list>", "Comma-separated segments (default: all)")
  .option("--out <path>", "Output file", ".DNA/exports/cellular-memory.json")
  .action(async (options: { cwd?: string; segments?: string; out?: string }) => {
    const root = getRoot(options);
    const outPath = join(root, options.out ?? ".DNA/exports/cellular-memory.json");
    const result = await exportCellularMemory({
      root,
      segments: options.segments?.split(",").map((s) => s.trim()).filter(Boolean),
      outPath,
    });
    console.log(formatMemoryExportSummary(result));
  });

memory
  .command("import")
  .description("Import CellularMemory from an export file")
  .argument("<file>", "Export JSON file")
  .option("--cwd <path>", "Project root directory")
  .option("--merge", "Merge with existing files (skip conflicts)")
  .option("--on-conflict <strategy>", "Conflict strategy: newest|keep-local|keep-remote", "newest")
  .option("--segments <list>", "Only import listed segments")
  .action(async (file: string, options: { cwd?: string; merge?: boolean; segments?: string; onConflict?: string }) => {
    const root = getRoot(options);
    const inPath = file.startsWith("/") ? file : join(root, file);
    const strategy = options.onConflict as "newest" | "keep-local" | "keep-remote";
    const result = await importCellularMemory({
      root,
      inPath,
      merge: options.merge,
      segments: options.segments?.split(",").map((s) => s.trim()).filter(Boolean),
      onConflict: strategy,
    });
    console.log(formatMemoryImportSummary(result));
  });

memory
  .command("sync")
  .description("Import from team registry path configured in config.dna.json")
  .option("--cwd <path>", "Project root directory")
  .option("--registry <path>", "Override team registry JSON path")
  .action(async (options: { cwd?: string; registry?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const registry = options.registry ?? config?.memory?.teamRegistry;
    if (!registry) {
      console.error("No team registry configured. Set memory.teamRegistry in .DNA/config.dna.json");
      process.exit(1);
    }
    const result = await syncFromTeamRegistry(root, registry);
    console.log(formatMemoryImportSummary(result));
  });

program
  .command("dashboard")
  .description("Start local DNA dashboard (legacy — prefer dna lab serve for /labs)")
  .option("--cwd <path>", "Project root directory")
  .option("--port <number>", "Port", "3200")
  .action(async (options: { cwd?: string; port?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const { url } = await startLabServer({
      root,
      port: Number(options.port ?? 3200),
      config,
    });
    console.log(formatLabStart(url));
    await new Promise(() => {});
  });

const lab = program.command("lab").description("DNA Lab — production observability at /labs");

lab
  .command("install")
  .description("Scaffold Lab assets and auto-wire /labs into your server")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const root = getRoot(options);
    const config = (await loadDnaConfig(root)) ?? {
      projectId: "app",
      projectName: "app",
      lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true },
    };
    const created = await ensureLabAssets(root);
    const wire = await wireLabStack({ root, config: config as Awaited<ReturnType<typeof loadDnaConfig>> & object });
    console.log("DNA Lab install");
    console.log("================");
    for (const item of created) console.log(`  ✓ ${item}`);
    for (const item of wire.wired) console.log(`  ✓ lab auto-wired: ${item}`);
    for (const item of wire.skipped) console.log(`  · ${item}`);
    console.log("");
    console.log("Local:    http://localhost:<port>/labs (no login)");
    console.log("Production: https://<your-domain>/labs");
    console.log("Pair:     npx dna register lab --url https://<your-domain>");
  });

lab
  .command("serve")
  .description("Start local Lab server at /labs (no auth on localhost)")
  .option("--cwd <path>", "Project root directory")
  .option("--port <number>", "Port", "3200")
  .action(async (options: { cwd?: string; port?: string }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const { url } = await startLabServer({
      root,
      port: Number(options.port ?? 3200),
      config,
    });
    console.log(formatLabStart(url));
    await new Promise(() => {});
  });

lab
  .command("installs")
  .description("List every @superhumaan/dna-by-humaan install (detect nested/stale Lab UI)")
  .option("--cwd <path>", "Project root directory")
  .option("--fix", "Upgrade every owner package to @latest")
  .action(async (options: { cwd?: string; fix?: boolean }) => {
    const root = getRoot(options);
    const {
      reportLabInstalls,
      formatLabInstallsReport,
      fixLabInstalls,
    } = await import("@superhumaan/dna-core");
    if (options.fix) {
      console.log("Upgrading DNA in every package that owns an install…\n");
      const result = await fixLabInstalls(root);
      console.log("");
      console.log(formatLabInstallsReport(root, result.report));
      console.log("");
      console.log("Restart the API process that mounts Lab, then hard-refresh /labs.");
      if (!result.report.ok) process.exitCode = 1;
      return;
    }
    const report = reportLabInstalls(root);
    console.log(formatLabInstallsReport(root, report));
    if (!report.ok) process.exitCode = 1;
  });

const registerCmd = program.command("register").description("Register local project with DNA services");

registerCmd
  .command("lab")
  .description("Generate 148-digit pairing code for production /labs (paste to verify)")
  .requiredOption("--url <productionUrl>", "Production URL, e.g. https://app.example.com")
  .option("--cwd <path>", "Project root directory")
  .option("--callback-port <number>", "Local callback port", "9473")
  .option("--wait", "Wait for production callback after posting pairing")
  .action(async (options: { url: string; cwd?: string; callbackPort?: string; wait?: boolean }) => {
    const root = getRoot(options);
    const config = await loadDnaConfig(root);
    const result = options.wait
      ? await runRegisterLabWithCallback({
          root,
          productionUrl: options.url,
          callbackPort: Number(options.callbackPort ?? 9473),
          projectId: config?.projectId,
        })
      : await runRegisterLab({
          root,
          productionUrl: options.url,
          callbackPort: Number(options.callbackPort ?? 9473),
          projectId: config?.projectId,
        });
    console.log(result.message);
    if (result.verified) {
      console.log("\n✓ Verified via production callback. Finish account setup in your browser.");
    }
  });

const generate = program.command("generate").description("Generate platform feature scaffolds");

generate
  .command("feature")
  .description("Generate code scaffold for a platform feature")
  .argument("<featureId>", "Platform feature id, e.g. audit-logging")
  .option("--cwd <path>", "Project root directory")
  .action(async (featureId: string, options: { cwd?: string }) => {
    const root = getRoot(options);
    if (!isPlatformCodegenFeature(featureId)) {
      console.error(`Codegen not available for: ${featureId}`);
      console.error(`Available: ${PLATFORM_CODEGEN_FEATURES.join(", ")}`);
      process.exit(1);
    }

    const result =
      featureId === "audit-logging"
        ? await generateAuditLoggingScaffold({ root, feature: featureId })
        : featureId === "sso"
          ? await generateSsoScaffold({ root, feature: featureId })
          : featureId === "multi-tenant"
            ? await generateMultiTenantScaffold({ root, feature: featureId })
            : featureId === "feature-flags"
              ? await generateFeatureFlagsScaffold({ root, feature: featureId })
              : await generateGradualRolloutScaffold({ root, feature: featureId });

    console.log(`✓ ${featureId} scaffold generated\n`);
    console.log(`  Plan: ${result.planPath}`);
    if (result.created.length) {
      console.log("  Created:");
      result.created.forEach((f) => console.log(`    ${f}`));
    }
    if (result.skipped.length) {
      console.log("  Skipped (already exist):");
      result.skipped.forEach((f) => console.log(`    ${f}`));
    }
  });

const industry = program.command("industry").description("Industry packs for agencies and vertical product teams");

industry
  .command("list")
  .description("List available industry sectors")
  .action(() => {
    console.log(formatIndustryCatalog());
  });

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

const legal = program.command("legal").description("Legal advisor — jurisdictions, sectors, and engineering legal gates");

legal
  .command("list")
  .description("List legal domains and supported jurisdictions")
  .action(() => {
    console.log(formatLegalCatalog());
  });

legal
  .command("advise")
  .description("Get legal considerations for a product question (not legal advice)")
  .requiredOption("--quote <text>", "Plain-language question, e.g. \"Store patient data in Thailand\"")
  .option("--domains <list>", "Override detected domains: privacy,banking,healthcare")
  .option("--jurisdictions <list>", "Override detected jurisdictions: sg,th,eu")
  .option("--cwd <path>", "Project root directory")
  .action(
    async (options: { quote: string; domains?: string; jurisdictions?: string; cwd?: string }) => {
      const root = getRoot(options);
      const config = await loadDnaConfig(root);
      const domains = options.domains ? parseDomainsInput(options.domains) : undefined;
      const jurisdictions = options.jurisdictions ? parseJurisdictionsInput(options.jurisdictions) : undefined;

      if (config) {
        await generateLegalContext(root, { domains, jurisdictions, quote: options.quote });
      }

      const result = adviseLegal({
        quote: options.quote,
        projectDescription: config?.description,
        domains,
        jurisdictions,
      });

      console.log(result.brief);
    },
  );

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

async function runStartupCliUpgrade(): Promise<void> {
  if (process.argv.includes("--version") || process.argv.includes("-V")) return;
  if (process.argv.includes("update")) return;

  try {
    const root = resolveProjectRoot(process.cwd());
    await syncAutoUpdateForCliVersion(root, CLI_VERSION);
    const result = await maybeAutoUpgradeCli({
      root,
      currentVersion: CLI_VERSION,
      cliEntryPath: CLI_ENTRY_PATH,
      install: true,
    });
    if (result?.installed && result.latestVersion) {
      console.log(
        `✓ DNA CLI upgraded to ${result.latestVersion}. Re-run your command to use the new version.\n`,
      );
      process.exit(0);
    }
  } catch {
    // Non-fatal — offline or no .DNA yet
  }
}

await runStartupCliUpgrade();
program.parse();
