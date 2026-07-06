import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { WizardAnswers } from "@humaan/dna-config";
import {
  AI_TOOLS,
  COMPLIANCE_OPTIONS,
  PROJECT_STAGES,
} from "@humaan/dna-config";

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

export async function promptYesNo(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  const answer = await prompt(`${question} ${hint}: `);
  if (!answer) return defaultYes;
  return answer.toLowerCase().startsWith("y");
}

export async function runInitWizard(nonInteractive = false): Promise<WizardAnswers> {
  if (nonInteractive) {
    return {
      projectDescription: "Demo project",
      acceptRecommendation: true,
      aiTools: ["cursor"],
      compliance: "none",
      stage: "new",
      installRuntime: false,
      configureGithub: false,
      configureAi: false,
    };
  }

  console.log("\n🧬 DNA by Humaan — Project Initialisation\n");

  const projectDescription = await prompt("What are you building?\n> ");
  const acceptRecommendation = await promptYesNo("\nAccept DNA recommendation?", true);

  let customStack: WizardAnswers["customStack"];
  if (!acceptRecommendation) {
    console.log("\nEnter custom stack (press Enter to skip):");
    customStack = {
      frontend: await prompt("Frontend: ") || undefined,
      backend: await prompt("Backend: ") || undefined,
      database: await prompt("Database: ") || undefined,
      platform: await prompt("Platform: ") || undefined,
      hosting: await prompt("Hosting: ") || undefined,
      testing: await prompt("Testing: ") || undefined,
    };
  }

  console.log("\nAI development environment? (comma-separated numbers, or 8 for None)");
  AI_TOOLS.forEach((tool, i) => console.log(`  ${i + 1}. ${tool}`));
  const aiAnswer = await prompt("Selection: ");
  const aiTools: WizardAnswers["aiTools"] = [];
  if (aiAnswer && !aiAnswer.includes("8")) {
    const indices = aiAnswer.split(",").map((s) => parseInt(s.trim(), 10) - 1);
    for (const idx of indices) {
      if (idx >= 0 && idx < AI_TOOLS.length) {
        aiTools.push(AI_TOOLS[idx]);
      }
    }
  }

  const compliance = await promptChoice("\nCompliance?", COMPLIANCE_OPTIONS);
  const stage = await promptChoice("\nProject stage?", PROJECT_STAGES);

  const installRuntime = await promptYesNo("\nInstall runtime observer?", false);
  const configureGithub = await promptYesNo("Configure GitHub integration?", false);
  const configureAi = await promptYesNo("Configure AI provider?", false);

  return {
    projectDescription: projectDescription || "Software project",
    acceptRecommendation,
    customStack,
    aiTools,
    compliance,
    stage,
    installRuntime,
    configureGithub,
    configureAi,
  };
}
