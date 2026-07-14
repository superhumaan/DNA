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
import { writeRuntimeOccurrence } from "./storage.js";
import { readFile } from "node:fs/promises";
import { escalateFingerprint, markRepairAttempted } from "./escalation.js";
import {
  updateRepeatedFailuresMemory,
  updateBlockersMemory,
  updatePreviousSolutionsMemory,
} from "./memory-updates.js";
import { enrichRuntimeEvent } from "./enrich.js";
import { decideEventSample, markEventSampled } from "./sample.js";
import { isBenignRuntimeMessage } from "./core/noise.js";

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
  if (isBenignRuntimeMessage(event.message)) {
    return {
      event,
      issue: {
        id: event.id,
        eventId: event.id,
        severity: "low",
        category: "unknown",
        discipline: "backend",
        behaviourViolation: false,
        repeated: false,
        projectRisk: "none",
        confidence: 1,
        title: "Benign disconnect (ignored)",
        summary: event.message,
        relevantBehaviour: [],
        relevantMemory: [],
      },
      fingerprint: undefined,
      isBlocker: false,
    };
  }

  const projectRoot = options.projectRoot;
  const dnaRoot = options.dnaRoot ?? join(projectRoot, ".DNA");
  const config = options.config ?? (await loadConfig(projectRoot));
  const tracker = options.tracker ?? new EventTracker();
  const repairConfig = resolveRepairConfig(config?.ai);

  event = enrichRuntimeEvent(event);

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
  issue = {
    ...escalation.issue,
    latestEvent: escalation.event,
    stackTraceSummary:
      escalation.issue.stackTraceSummary ??
      escalation.event.frames?.[0]?.filename ??
      escalation.event.stack?.split("\n")[0],
  };
  const fingerprintRecord = escalation.record;

  const sample = decideEventSample(fingerprintRecord.fingerprint, {
    force: fingerprintRecord.repeatCount === 1,
  });
  event = markEventSampled(event, sample.sampled);
  issue = { ...issue, latestEvent: event };

  const storage = config?.runtime?.storage ?? "sqlite";

  if (storage === "sqlite") {
    await writeRuntimeOccurrence(projectRoot, {
      event: sample.persistEvent ? event : undefined,
      issue,
    });
  } else {
    if (sample.persistEvent) {
      await appendJsonl(join(dnaRoot, "runtime", "events.jsonl"), event);
    }
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

  // GitHub issue create + AI repair must never block the hot path (HTTP/error ingest).
  void runGitHubAndRepair({
    projectRoot,
    dnaRoot,
    config,
    issue,
    event,
    fingerprintRecord,
    repairConfig,
    autoIssue,
    dnaVersion: options.dnaVersion,
  }).catch((err) => {
    console.error("dna_pipeline_async_failed", {
      message: err instanceof Error ? err.message : String(err),
      fingerprint: issue.fingerprint,
    });
  });

  return result;
}

async function runGitHubAndRepair(args: {
  projectRoot: string;
  dnaRoot: string;
  config: DnaConfig | null;
  issue: ClassifiedIssue;
  event: RuntimeEvent;
  fingerprintRecord: Awaited<ReturnType<typeof escalateFingerprint>>["record"];
  repairConfig: ReturnType<typeof resolveRepairConfig>;
  autoIssue: boolean;
  dnaVersion?: string;
}): Promise<void> {
  const {
    projectRoot,
    dnaRoot,
    config,
    issue,
    event,
    fingerprintRecord,
    repairConfig,
    autoIssue,
    dnaVersion,
  } = args;

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
        } catch {
          await markRepairAttempted(
            projectRoot,
            fingerprintRecord.fingerprint,
            "failed",
            ghResult.number,
          );
        }
      }
    }
  }

  if (config != null && config.feedback?.enabled !== false && config.feedback?.upstream !== false) {
    await reportUpstream({
      projectRoot,
      config,
      source: "runtime",
      message: issue.summary || event.message,
      stack: event.stack ?? issue.stackTraceSummary,
      dnaVersion: dnaVersion ?? "unknown",
      issue,
    }).catch(() => undefined);
  }
}
