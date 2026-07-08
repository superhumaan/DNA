import type { DnaConfig, WizardAnswersInput } from "@superhumaan/dna-config";
import { WizardAnswersSchema } from "@superhumaan/dna-config";
import { readJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { generateRecommendation, resolveStackFromWizard } from "./recommend.js";
import { generateDnaStructure } from "./generators/init.js";
import { runPostInit } from "./post-init.js";
import { installFoundationKnowledge } from "./marketplace/foundation.js";
import { ensureKnowledgeInstalled } from "./marketplace/ensure.js";
import { getFeature } from "./platform/catalog.js";
import { resolveFeaturePlanPackIds } from "./platform/knowledge.js";
import { loadDnaConfig } from "./validator.js";
import { createLogger } from "./logger.js";

const log = createLogger("wizard");

export interface WizardOptions {
  root: string;
  answers: WizardAnswersInput;
  nonInteractive?: boolean;
}

export interface WizardResult {
  config: DnaConfig;
  filesCreated: string[];
}

async function installOnboardingFeaturePacks(
  root: string,
  config: DnaConfig,
  featureIds: string[],
): Promise<string[]> {
  const installed: string[] = [];
  const packIds = new Set<string>();

  for (const featureId of featureIds) {
    const feature = getFeature(featureId);
    if (!feature) continue;
    for (const packId of resolveFeaturePlanPackIds(feature)) {
      packIds.add(packId);
    }
  }

  if (packIds.size === 0) return installed;

  const result = await ensureKnowledgeInstalled(root, [...packIds], config.channel);
  for (const packId of result.installed) {
    installed.push(`.DNA/knowledge/ (feature pack: ${packId})`);
  }
  return installed;
}

export async function runWizard(options: WizardOptions): Promise<WizardResult> {
  const { root } = options;
  const answers = WizardAnswersSchema.parse(options.answers);
  const scan = await scanProject(root);
  const platformHint = answers.appPlatform ? ` ${answers.appPlatform} application` : "";
  const recommendation = generateRecommendation(
    scan,
    `${answers.projectDescription}${platformHint}`,
  );
  const stack = resolveStackFromWizard(scan, answers, recommendation);

  const pkgName =
    answers.projectName ??
    (await readJsonFile<{ name?: string }>(`${root}/package.json`))?.name ??
    "my-project";

  const now = new Date().toISOString();
  const config: DnaConfig = {
    version: "0.1.0",
    projectId: pkgName.replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
    projectName: pkgName,
    description: answers.projectDescription,
    createdAt: now,
    updatedAt: now,
    stack: {
      ...stack,
      platform: answers.appPlatform ?? stack.platform,
      packageManager: scan.packageManager,
    },
    compliance: answers.compliance,
    stage: answers.stage,
    aiTools: answers.aiTools,
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: answers.platformFeatures,
    featureFactory: { enabled: answers.installFeatureFactory },
    github: { enabled: answers.configureGithub },
    ai: {
      enabled: answers.configureAi,
      provider: "mock",
      repair: { enabled: true, autoPr: true, requireReview: true },
    },
    runtime: {
      enabled: answers.installRuntime,
      environment: "development",
      storage: "sqlite",
      watchBackend: true,
      watchFrontend: true,
    },
    ci: {
      enabled: answers.installCi,
      strict: false,
      coverageThreshold: 80,
      perFileCoverage: true,
      owasp: true,
      pushToPreview: true,
    },
  };

  log.info({ projectId: config.projectId }, "Generating DNA structure");
  const filesCreated = await generateDnaStructure(root, config, answers, recommendation);
  const postFiles = await runPostInit(root, config, answers);
  filesCreated.push(...postFiles);

  const foundation = await installFoundationKnowledge(root, config, scan);
  for (const packId of foundation.installed) {
    filesCreated.push(`.DNA/knowledge/ (marketplace: ${packId})`);
  }

  const featurePacks = await installOnboardingFeaturePacks(
    root,
    config,
    answers.platformFeatures ?? [],
  );
  filesCreated.push(...featurePacks);

  const finalConfig = (await loadDnaConfig(root)) ?? config;
  return { config: finalConfig, filesCreated };
}
