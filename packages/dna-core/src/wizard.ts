import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";
import { readJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { generateRecommendation, resolveStackFromWizard } from "./recommend.js";
import { generateDnaStructure } from "./generators/init.js";
import { runPostInit } from "./post-init.js";
import { installFoundationKnowledge } from "./marketplace/foundation.js";
import { loadDnaConfig } from "./validator.js";
import { createLogger } from "./logger.js";

const log = createLogger("wizard");

export interface WizardOptions {
  root: string;
  answers: WizardAnswers;
  nonInteractive?: boolean;
}

export interface WizardResult {
  config: DnaConfig;
  filesCreated: string[];
}

export async function runWizard(options: WizardOptions): Promise<WizardResult> {
  const { root, answers } = options;
  const scan = await scanProject(root);
  const recommendation = generateRecommendation(scan, answers.projectDescription);
  const stack = resolveStackFromWizard(scan, answers, recommendation);

  const projectName =
    (await readJsonFile<{ name?: string }>(`${root}/package.json`))?.name ?? "my-project";

  const now = new Date().toISOString();
  const config: DnaConfig = {
    version: "0.1.0",
    projectId: projectName.replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
    projectName,
    description: answers.projectDescription,
    createdAt: now,
    updatedAt: now,
    stack: {
      ...stack,
      packageManager: scan.packageManager,
    },
    compliance: answers.compliance,
    stage: answers.stage,
    aiTools: answers.aiTools,
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    github: answers.configureGithub ? { enabled: true } : { enabled: false },
    ai: answers.configureAi
      ? { enabled: true, provider: "mock" }
      : { enabled: false, provider: "mock" },
    runtime: answers.installRuntime
      ? { enabled: true, environment: "development" }
      : { enabled: false },
  };

  log.info({ projectId: config.projectId }, "Generating DNA structure");
  const filesCreated = await generateDnaStructure(root, config, answers, recommendation);
  const postFiles = await runPostInit(root, config, answers);
  filesCreated.push(...postFiles);

  const foundation = await installFoundationKnowledge(root, config, scan);
  for (const packId of foundation.installed) {
    filesCreated.push(`.DNA/knowledge/ (marketplace: ${packId})`);
  }

  const finalConfig = (await loadDnaConfig(root)) ?? config;
  return { config: finalConfig, filesCreated };
}
