import { Command } from "commander";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { PRODUCT_NAME } from "@humaan/dna-config";
import {
  scanProject,
  formatScanSummary,
  generateRecommendation,
  formatRecommendation,
  runWizard,
  validateProject,
  formatValidationResult,
  generateContext,
  runDoctor,
  formatDoctorReport,
  startWatch,
  loadDnaConfig,
  writeJsonFile,
  fetchMarketplaceCatalog,
  searchCatalog,
  installKnowledgePackById,
  checkMarketplaceUpdates,
  formatMarketplaceCatalog,
  formatUpdateResult,
} from "@humaan/dna-core";
import { RUNTIME_INSTALL_SNIPPET, ENV_EXAMPLE_SNIPPET } from "@humaan/dna-templates";
import { createIssue, getTokenFromEnv } from "@humaan/dna-github";
import { executeRepairWorkflow } from "@humaan/dna-ai";
import { runInitWizard } from "./prompts.js";

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
    const recommendation = generateRecommendation(scan, "project");

    if (!options.yes) {
      console.log(formatRecommendation(recommendation));
      console.log("");
    }

    const answers = await runInitWizard(!!options.yes);
    const result = await runWizard({ root, answers });

    console.log(`\n✓ DNA initialised for ${result.config.projectName}`);
    console.log(`  Created ${result.filesCreated.length} files`);
    console.log(`  Config: .DNA/config.dna.json`);
    console.log(`  Docs:   DNA/Impressions/`);
    console.log(`\nNext: dna validate && dna context cursor`);
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

program
  .command("context")
  .description("Generate AI-ready context")
  .argument("<target>", "cursor|claude|chatgpt|copilot|windsurf|gemini|backend|frontend|security|qa|devops|all")
  .option("--cwd <path>", "Project root directory")
  .action(async (target: string, options: { cwd?: string }) => {
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
      "all",
    ] as const;

    if (!validTargets.includes(target as (typeof validTargets)[number])) {
      console.error(`Unknown target: ${target}`);
      process.exit(1);
    }

    const context = await generateContext(
      root,
      target as (typeof validTargets)[number],
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

    const config = await loadDnaConfig(root);
    if (config) {
      config.runtime = { ...config.runtime, enabled: true };
      await writeJsonFile(join(root, ".DNA/config.dna.json"), config);
    }

    console.log("✓ Runtime install snippets created:");
    console.log(`  ${snippetPath}`);
    console.log(`  ${envPath}`);
    console.log("\nInstall: pnpm add @humaan/dna-runtime");
    console.log("Express:  app.use(dnaRuntime.express()); app.use(dnaRuntime.errorHandler());");
    console.log("Fastify:  dnaRuntime.attachFastify(fastify);");
    console.log("NestJS:   @UseInterceptors(dnaRuntime.nestInterceptor()) + @UseFilters(dnaRuntime.nestExceptionFilter())");
    console.log("Next.js:  export const middleware = dnaRuntime.nextMiddleware();");
  });

const github = program.command("github").description("GitHub integration");

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

    config.github = { enabled: true, owner: options.owner, repo: options.repo };
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, ".DNA/config.dna.json"), config);

    console.log(`✓ GitHub connected: ${options.owner}/${options.repo}`);
    console.log("  Set GITHUB_TOKEN environment variable for API access.");
    console.log("  Never store tokens in config.dna.json.");
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
    const result = await createIssue(
      {
        owner: config.github.owner,
        repo: config.github.repo,
        token: getTokenFromEnv(),
      },
      issue,
    );

    if ("dryRun" in result) {
      console.log("Dry run (no GITHUB_TOKEN):");
      console.log(JSON.stringify(result.payload, null, 2));
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
  .description("Run full DNA health check")
  .option("--cwd <path>", "Project root directory")
  .action(async (options: { cwd?: string }) => {
    const report = await runDoctor(getRoot(options));
    console.log(formatDoctorReport(report));
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

program.parse();
