import { join } from "node:path";
import type { ClassifiedIssue, DnaConfig, RuntimeEvent } from "@superhumaan/dna-config";
import { DnaConfigSchema, DNA_CONFIG_FILE, resolveRepairConfig } from "@superhumaan/dna-config";
import {
  classifyIssue,
  getImmuneConfig,
  shouldAutoCreateIssue,
  eventKey,
  EventTracker,
} from "@superhumaan/dna-immune";
import {
  createOrUpdateRuntimeIssue,
  resolveGitHubToken,
  commentOnIssue,
} from "@superhumaan/dna-github";
import { executeRepairWorkflow } from "@superhumaan/dna-ai";
import { reportUpstream } from "@superhumaan/dna-feedback";
import { appendJsonl } from "./persistence.js";
import { appendRuntimeRecord } from "./storage.js";
import { readFile } from "node:fs/promises";
import { escalateFingerprint, markRepairAttempted } from "./escalation.js";
import {
  updateRepeatedFailuresMemory,
  updateBlockersMemory,
  updatePreviousSolutionsMemory,
} from "./memory-updates.js";

export interface PipelineResult {
  event: RuntimeEvent;
  issue: ClassifiedIssue;
  githubIssue?: { number: number; url: string; action: "created" | "deduped" | "dry-run" };
  repair?: { branchName: string; prUrl?: string; skipped?: string };
  fingerprint?: string;
  isBlocker?: boolean;
}

export interface PipelineOptions {
  projectRoot: string;
  dnaRoot?: string;
  config?: DnaConfig;
  tracker?: EventTracker;
  dnaVersion?: string;
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

function shouldTriggerRepair(
  issue: ClassifiedIssue,
  repairConfig: ReturnType<typeof resolveRepairConfig>,
): boolean {
  if (!repairConfig.enabled) return false;

  if (repairConfig.aggressive) {
    if (issue.isBlocker) return true;
    if ((issue.repeatCount ?? 0) >= repairConfig.minRepeatForRepair) return true;
    if (issue.repeated && (issue.repeatCount ?? 0) >= 1) return true;
  }

  return issue.severity === "high" || issue.severity === "critical";
}

function shouldRetryRepair(
  issue: ClassifiedIssue,
  repairConfig: ReturnType<typeof resolveRepairConfig>,
): boolean {
  if (!repairConfig.retryOpenRepairs) return false;
  return (
    issue.repairStatus === "attempted" ||
    issue.repairStatus === "failed" ||
    (issue.repairAttempts ?? 0) > 0
  );
}

export async function processRuntimeEvent(
  event: RuntimeEvent,
  options: PipelineOptions,
): Promise<PipelineResult> {
  const projectRoot = options.projectRoot;
  const dnaRoot = options.dnaRoot ?? join(projectRoot, ".DNA");
  const config = options.config ?? (await loadConfig(projectRoot));
  const tracker = options.tracker ?? new EventTracker();
  const repairConfig = resolveRepairConfig(config?.ai);

  const key = eventKey(event);
  const windowRepeatCount = tracker.record(key, event);

  let issue = await classifyIssue(event, {
    dnaRoot,
    repeatCount: windowRepeatCount,
    repeated: windowRepeatCount >= repairConfig.minRepeatForRepair || event.type === "repeated_error",
  });

  const escalation = await escalateFingerprint(projectRoot, event, issue, {
    minRepeatForRepair: repairConfig.minRepeatForRepair,
    minRepeatForBlocker: repairConfig.minRepeatForBlocker,
  });

  event = escalation.event;
  issue = escalation.issue;
  const fingerprintRecord = escalation.record;

  const storage = config?.runtime?.storage ?? "sqlite";

  if (storage === "sqlite") {
    await appendRuntimeRecord(projectRoot, "events", event);
    await appendRuntimeRecord(projectRoot, "issues", issue);
  } else {
    await appendJsonl(join(dnaRoot, "runtime", "events.jsonl"), event);
    await appendJsonl(join(dnaRoot, "runtime", "issues.jsonl"), issue);
  }

  await updateRepeatedFailuresMemory(dnaRoot, issue, fingerprintRecord);
  await updateBlockersMemory(dnaRoot, issue, fingerprintRecord);

  const result: PipelineResult = {
    event,
    issue,
    fingerprint: issue.fingerprint,
    isBlocker: issue.isBlocker,
  };

  const immuneConfig = await getImmuneConfig(dnaRoot);
  const autoIssue = shouldAutoCreateIssue(issue, immuneConfig);

  if (config?.github?.enabled && config.github.owner && config.github.repo && autoIssue) {
    const creds = await resolveGitHubToken();
    const ghResult = await createOrUpdateRuntimeIssue(
      {
        owner: config.github.owner,
        repo: config.github.repo,
        token: creds?.token,
      },
      issue,
      {
        fingerprint: fingerprintRecord.fingerprint,
        repeatCount: fingerprintRecord.repeatCount,
        dedupe: repairConfig.dedupeIssues,
      },
    );

    if (ghResult.number != null && ghResult.url != null) {
      result.githubIssue = {
        number: ghResult.number,
        url: ghResult.url,
        action: ghResult.action,
      };

      await markRepairAttempted(
        projectRoot,
        fingerprintRecord.fingerprint,
        fingerprintRecord.repairStatus,
        ghResult.number,
      );

      const triggerRepair =
        repairConfig.autoPr &&
        shouldTriggerRepair(issue, repairConfig) &&
        (!shouldRetryRepair(issue, repairConfig) ||
          fingerprintRecord.repeatCount % repairConfig.minRepeatForRepair === 0);

      if (triggerRepair && config.ai?.enabled !== false) {
        try {
          const repair = await executeRepairWorkflow({
            projectRoot,
            dnaRoot,
            issue,
            config,
            issueNumber: ghResult.number,
          });

          const hasChanges =
            repair.filesModified.length > 0 ||
            repair.plan.proposedChanges.some((c) => c.patch || c.search);
          await markRepairAttempted(
            projectRoot,
            fingerprintRecord.fingerprint,
            hasChanges ? "attempted" : "failed",
            ghResult.number,
          );

          result.repair = {
            branchName: repair.branchName,
            prUrl: repair.prUrl,
            skipped: hasChanges ? undefined : "AI produced no applicable patches",
          };

          await updatePreviousSolutionsMemory(dnaRoot, issue, {
            branchName: repair.branchName,
            filesModified: repair.filesModified,
            testsPassed: repair.testsPassed,
            prUrl: repair.prUrl,
            diagnosis: repair.plan.diagnosis,
          }).catch(() => undefined);

          if (repair.prUrl && creds?.token) {
            await commentOnIssue(
              {
                owner: config.github.owner,
                repo: config.github.repo,
                token: creds.token,
              },
              ghResult.number,
              [
                `DNA aggressive repair opened PR: ${repair.prUrl}`,
                "",
                issue.isBlocker
                  ? "⚠️ **BLOCKER** — this error exceeded the repeat threshold. Review and merge urgently."
                  : "",
                repairConfig.requireReview
                  ? "**Never auto-merged** — requires human review."
                  : "",
              ]
                .filter(Boolean)
                .join("\n"),
            );
          }
        } catch (err) {
          await markRepairAttempted(
            projectRoot,
            fingerprintRecord.fingerprint,
            "failed",
            ghResult.number,
          );
          result.repair = {
            branchName: `dna/fix/${issue.fingerprint ?? issue.id.slice(0, 8)}`,
            skipped: err instanceof Error ? err.message : "Repair workflow failed",
          };
        }
      } else if (!triggerRepair) {
        result.repair = {
          branchName: "",
          skipped: repairConfig.autoPr
            ? "Repair threshold not met"
            : "ai.repair.autoPr disabled",
        };
      }
    } else {
      result.githubIssue = { number: 0, url: "", action: "dry-run" };
    }
  }

  if (config != null && config.feedback?.enabled !== false && config.feedback?.upstream !== false) {
    const feedbackConfig = config;
    await reportUpstream({
      projectRoot,
      config: feedbackConfig,
      source: "runtime",
      message: issue.summary || event.message,
      stack: event.stack ?? issue.stackTraceSummary,
      dnaVersion: options.dnaVersion ?? "unknown",
      issue,
    }).catch(() => undefined);
  }

  return result;
}
