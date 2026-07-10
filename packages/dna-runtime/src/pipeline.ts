import { join } from "node:path";
import type { ClassifiedIssue, DnaConfig, RuntimeEvent } from "@superhumaan/dna-config";
import { DnaConfigSchema, DNA_CONFIG_FILE } from "@superhumaan/dna-config";
import {
  classifyIssue,
  getImmuneConfig,
  shouldAutoCreateIssue,
  eventKey,
  EventTracker,
} from "@superhumaan/dna-immune";
import { createIssue, resolveGitHubToken, commentOnIssue } from "@superhumaan/dna-github";
import { executeRepairWorkflow } from "@superhumaan/dna-ai";
import { appendJsonl } from "./persistence.js";
import { appendRuntimeRecord } from "./storage.js";
import { readFile } from "node:fs/promises";

export interface PipelineResult {
  event: RuntimeEvent;
  issue: ClassifiedIssue;
  githubIssue?: { number: number; url: string } | { dryRun: true };
  repair?: { branchName: string; prUrl?: string };
}

export interface PipelineOptions {
  projectRoot: string;
  dnaRoot?: string;
  config?: DnaConfig;
  tracker?: EventTracker;
}

async function loadConfig(projectRoot: string): Promise<DnaConfig | null> {
  try {
    const raw = await readFile(join(projectRoot, DNA_CONFIG_FILE), "utf-8");
    const parsed = DnaConfigSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function updateRepeatedFailuresMemory(
  dnaRoot: string,
  issue: ClassifiedIssue,
): Promise<void> {
  if (!issue.repeated) return;
  const memPath = join(dnaRoot, "CellularMemory", "amygdala", "repeated-failures.md");
  try {
    const { appendFile } = await import("node:fs/promises");
    const entry = `- ${new Date().toISOString()}: ${issue.title} (${issue.category})\n`;
    await appendFile(memPath, entry, "utf-8");
  } catch {
    // memory file may not exist
  }
}

export async function processRuntimeEvent(
  event: RuntimeEvent,
  options: PipelineOptions,
): Promise<PipelineResult> {
  const projectRoot = options.projectRoot;
  const dnaRoot = options.dnaRoot ?? join(projectRoot, ".DNA");
  const config = options.config ?? (await loadConfig(projectRoot));
  const tracker = options.tracker ?? new EventTracker();

  const key = eventKey(event);
  const repeatCount = tracker.record(key, event);

  const issue = await classifyIssue(event, {
    dnaRoot,
    repeatCount,
    repeated: repeatCount >= 3 || event.type === "repeated_error",
  });

  const storage = config?.runtime?.storage ?? "sqlite";

  if (storage === "sqlite") {
    await appendRuntimeRecord(projectRoot, "events", event);
    await appendRuntimeRecord(projectRoot, "issues", issue);
  } else {
    await appendJsonl(join(dnaRoot, "runtime", "events.jsonl"), event);
    await appendJsonl(join(dnaRoot, "runtime", "issues.jsonl"), issue);
  }
  await updateRepeatedFailuresMemory(dnaRoot, issue);

  const result: PipelineResult = { event, issue };

  const immuneConfig = await getImmuneConfig(dnaRoot);
  const autoIssue = shouldAutoCreateIssue(issue, immuneConfig);

  if (config?.github?.enabled && config.github.owner && config.github.repo && autoIssue) {
    const creds = await resolveGitHubToken();
    const ghResult = await createIssue(
      {
        owner: config.github.owner,
        repo: config.github.repo,
        token: creds?.token,
      },
      issue,
    );

    if ("number" in ghResult) {
      result.githubIssue = { number: ghResult.number, url: ghResult.url };

      if (config.ai?.enabled) {
        const repair = await executeRepairWorkflow({
          projectRoot,
          dnaRoot,
          issue,
          config,
          issueNumber: ghResult.number,
        });
        result.repair = {
          branchName: repair.branchName,
          prUrl: repair.prUrl,
        };

        if (repair.prUrl && creds?.token) {
          await commentOnIssue(
            {
              owner: config.github.owner,
              repo: config.github.repo,
              token: creds.token,
            },
            ghResult.number,
            `DNA AI repair opened PR: ${repair.prUrl}\n\n**Never auto-merged** — requires human review.`,
          );
        }
      }
    } else {
      result.githubIssue = { dryRun: true };
    }
  }

  return result;
}
