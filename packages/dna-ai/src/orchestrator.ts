import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { git } from "@superhumaan/dna-github";
import type { AiRepairPlan, ClassifiedIssue, DnaConfig } from "@superhumaan/dna-config";
import { resolveRepairConfig } from "@superhumaan/dna-config";
import {
  createAiProvider,
  type RepairContext,
  type AiProviderConfig,
} from "./index.js";
import {
  createBranch,
  createPullRequest,
  resolveGitHubToken,
  linkIssueToPr,
} from "@superhumaan/dna-github";
import { applyPatches } from "./patch-parser.js";
import { gatewayRepairPlaybook } from "./gateway-playbook.js";

const execAsync = promisify(exec);

export interface ExecuteRepairOptions {
  projectRoot: string;
  dnaRoot: string;
  issue: ClassifiedIssue;
  config: DnaConfig;
  issueNumber?: number;
  dryRun?: boolean;
}

export interface ExecuteRepairResult {
  plan: AiRepairPlan;
  branchName: string;
  prUrl?: string;
  prNumber?: number;
  testsPassed: boolean;
  filesModified: string[];
}

async function loadRepairContext(
  dnaRoot: string,
  issue: ClassifiedIssue,
  projectRoot: string,
): Promise<RepairContext> {
  const behaviour: string[] = [];
  const memory: string[] = [];

  for (const file of issue.relevantBehaviour) {
    try {
      behaviour.push(await readFile(join(dnaRoot, "behaviour", file), "utf-8"));
    } catch {
      behaviour.push(`(missing: ${file})`);
    }
  }

  for (const mem of issue.relevantMemory) {
    try {
      memory.push(await readFile(join(dnaRoot, "CellularMemory", mem), "utf-8"));
    } catch {
      memory.push(`(missing: ${mem})`);
    }
  }

  const codeSnippets: RepairContext["codeSnippets"] = [];
  const stackFile = issue.stackTraceSummary?.match(/\((.+):\d+:\d+\)/)?.[1];
  if (stackFile) {
    try {
      const content = await readFile(join(projectRoot, stackFile), "utf-8");
      codeSnippets.push({
        file: stackFile,
        content: content.slice(0, 3000),
      });
    } catch {
      // file not found
    }
  }

  const probeFiles = ["src/index.ts", "src/server.ts", "src/app.ts", "Dockerfile", "vercel.json"];
  for (const file of probeFiles) {
    if (codeSnippets.some((s) => s.file === file)) continue;
    try {
      const content = await readFile(join(projectRoot, file), "utf-8");
      codeSnippets.push({ file, content: content.slice(0, 2000) });
    } catch {
      // optional
    }
  }

  return {
    behaviour,
    memory,
    codeSnippets,
    neuralNetworkIntent: issue.isBlocker ? "force_fix_blocker" : "fix_runtime_error",
  };
}

function getAiConfig(config: DnaConfig): AiProviderConfig {
  const provider = config.ai?.provider ?? "mock";
  return {
    provider,
    model: config.ai?.model,
    endpoint: config.ai?.endpoint,
    apiKey:
      provider === "openai"
        ? process.env.OPENAI_API_KEY
        : provider === "anthropic"
          ? process.env.ANTHROPIC_API_KEY
          : undefined,
  };
}

async function runTests(projectRoot: string): Promise<boolean> {
  try {
    const { stdout, stderr } = await execAsync("pnpm test 2>&1 || npm test 2>&1", {
      cwd: projectRoot,
      timeout: 120_000,
    });
    return !stderr.includes("FAIL") && !stdout.includes("FAIL");
  } catch {
    return false;
  }
}

function enrichPlanWithGatewayFixes(issue: ClassifiedIssue, plan: AiRepairPlan): AiRepairPlan {
  if (plan.proposedChanges.length > 0) return plan;
  const gatewayChanges = gatewayRepairPlaybook(issue);
  if (gatewayChanges.length === 0) return plan;
  return {
    ...plan,
    proposedChanges: gatewayChanges,
    diagnosis: `${plan.diagnosis}\n\nGateway playbook applied: origin health check and container probe.`,
  };
}

export async function executeRepairWorkflow(
  options: ExecuteRepairOptions,
): Promise<ExecuteRepairResult> {
  const { projectRoot, dnaRoot, issue, config, issueNumber, dryRun } = options;
  const repairConfig = resolveRepairConfig(config.ai);

  const context = await loadRepairContext(dnaRoot, issue, projectRoot);
  const provider = createAiProvider(getAiConfig(config));
  let plan = await provider.diagnose(issue, context);
  plan = enrichPlanWithGatewayFixes(issue, plan);

  if (dryRun || !config.github?.owner || !config.github?.repo) {
    return {
      plan,
      branchName: plan.branchName,
      testsPassed: false,
      filesModified: [],
    };
  }

  if (!repairConfig.autoPr) {
    return {
      plan,
      branchName: plan.branchName,
      testsPassed: false,
      filesModified: [],
    };
  }

  const creds = await resolveGitHubToken();
  const token = creds?.token;
  const g = git(projectRoot);

  if (token) {
    try {
      await g.checkoutLocalBranch(plan.branchName);
    } catch {
      await createBranch(
        { owner: config.github.owner, repo: config.github.repo, token },
        plan.branchName,
      );
      await g.fetch("origin", plan.branchName).catch(() => undefined);
      await g.checkout(plan.branchName).catch(async () => {
        await g.checkoutLocalBranch(plan.branchName);
      });
    }
  } else {
    await g.checkoutLocalBranch(plan.branchName).catch(async () => {
      await g.checkout(["-b", plan.branchName]);
    });
  }

  const modified = await applyPatches(projectRoot, plan.proposedChanges);

  if (modified.length > 0) {
    await g.add(modified);
    await g.commit(`fix(dna): ${issue.title}\n\nDNA aggressive repair — not auto-merged`);
  }

  const testsPassed = modified.length > 0 ? await runTests(projectRoot) : false;

  let prUrl: string | undefined;
  let prNumber: number | undefined;

  if (token && config.github.owner && config.github.repo && modified.length > 0) {
    await g.push("origin", plan.branchName).catch(() => undefined);

    const pr = await createPullRequest(
      { owner: config.github.owner, repo: config.github.repo, token },
      {
        title: plan.prTitle,
        body: [
          plan.prBody,
          "",
          "### Test Plan",
          plan.testPlan,
          "",
          `Tests: ${testsPassed ? "passed" : "not run or failed"}`,
          issue.isBlocker ? "\n⚠️ **BLOCKER** — repeat threshold exceeded." : "",
          "",
          "**DNA Safety:** This PR was created by DNA aggressive repair. Never auto-merged.",
        ]
          .filter(Boolean)
          .join("\n"),
        head: plan.branchName,
      },
    );

    prUrl = pr.url;
    prNumber = pr.number;

    if (issueNumber) {
      await linkIssueToPr(
        { owner: config.github.owner, repo: config.github.repo, token },
        issueNumber,
        prNumber,
      );
    }
  }

  await g.checkout("main").catch(() => g.checkout("master")).catch(() => undefined);

  return {
    plan,
    branchName: plan.branchName,
    prUrl,
    prNumber,
    testsPassed,
    filesModified: modified,
  };
}
