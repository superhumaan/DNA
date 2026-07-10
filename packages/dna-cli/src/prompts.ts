import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { WizardAnswers } from "@superhumaan/dna-config";
import {
  detectAiTools,
  inferCompliance,
  inferProjectStage,
  detectProjectContext,
  ONBOARDING_PLATFORMS,
  onboardingFeatureOptions,
} from "@superhumaan/dna-core";
import type { ScanResult } from "@superhumaan/dna-config";

export async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

export async function promptChoice<T extends string>(
  question: string,
  options: readonly T[],
): Promise<T> {
  console.log(question);
  options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));
  const answer = await prompt("Enter number: ");
  const index = parseInt(answer, 10) - 1;
  if (index >= 0 && index < options.length) {
    return options[index];
  }
  return options[0];
}

function defaultAnswers(scan: ScanResult, overrides: Partial<WizardAnswers> = {}): WizardAnswers {
  const context = detectProjectContext(scan);
  return {
    projectDescription: "Software project",
    acceptRecommendation: true,
    platformFeatures: [],
    aiTools: detectAiTools(scan),
    compliance: "none",
    stage: inferProjectStage(scan, context.context),
    installRuntime: true,
    installFeatureFactory: true,
    installCi: true,
    configureGithub: true,
    configureAi: true,
    ...overrides,
  };
}

export async function runInitWizard(
  nonInteractive = false,
  scan?: ScanResult,
  defaultProjectName?: string,
  defaultDescription?: string,
): Promise<WizardAnswers> {
  const emptyScan: ScanResult = {
    ciCd: [],
    docker: false,
    envFiles: [],
    docs: [],
    aiRules: [],
    securityRisks: [],
    missingDocs: [],
    missingTests: false,
    dependencies: [],
    scripts: {},
    hasDna: false,
    fileCount: 0,
    hasPackageJson: false,
    hasSourceCode: false,
  };
  const projectScan = scan ?? emptyScan;

  if (nonInteractive) {
    const name = defaultProjectName ?? "my-project";
    const description = defaultDescription ?? name;
    return defaultAnswers(projectScan, {
      projectName: name,
      projectDescription: description,
      aiTools: ["cursor", "claude_code"],
      stage: inferProjectStage(projectScan, detectProjectContext(projectScan).context),
    });
  }

  console.log("\n🧬 DNA by Humaan\n");
  console.log("Quick setup — then just describe what you want to build in Cursor or Claude.\n");

  const nameAnswer = await prompt(
    `Project name${defaultProjectName ? ` [${defaultProjectName}]` : ""}:\n> `,
  );
  const projectName = nameAnswer || defaultProjectName;

  const projectDescription = await prompt("\nWhat are you building?\n> ");

  console.log("\nPlatform:");
  ONBOARDING_PLATFORMS.forEach((p, i) => console.log(`  ${i + 1}. ${p.label}`));
  const platformAnswer = await prompt("Enter number [1]: ");
  const platformIndex = platformAnswer ? parseInt(platformAnswer, 10) - 1 : 0;
  const appPlatform =
    ONBOARDING_PLATFORMS[platformIndex >= 0 && platformIndex < ONBOARDING_PLATFORMS.length
      ? platformIndex
      : 0].id;

  const features = onboardingFeatureOptions();
  console.log("\nAny specific features? (comma-separated numbers, or Enter to skip)");
  features.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}`));
  const featureAnswer = await prompt("Selection: ");
  const platformFeatures: string[] = [];
  if (featureAnswer) {
    for (const part of featureAnswer.split(",")) {
      const idx = parseInt(part.trim(), 10) - 1;
      if (idx >= 0 && idx < features.length) {
        platformFeatures.push(features[idx].id);
      }
    }
  }

  const description = projectDescription || "Software project";

  console.log("\n✓ Setting up DNA, Cursor rules, Claude context, and knowledge packs...");
  console.log("  Next: GitHub browser login (one time — no tokens to copy)\n");

  return {
    projectName,
    projectDescription: description,
    appPlatform,
    platformFeatures,
    acceptRecommendation: true,
    aiTools: detectAiTools(projectScan),
    compliance: inferCompliance(description),
    stage: inferProjectStage(projectScan, detectProjectContext(projectScan).context),
    installRuntime: true,
    installFeatureFactory: true,
    installCi: true,
    configureGithub: true,
    configureAi: true,
  };
}
