import { randomUUID } from "node:crypto";
import type { ClassifiedIssue, DnaConfig, FingerprintRecord } from "@superhumaan/dna-config";
import { resolveRepairConfig } from "@superhumaan/dna-config";
import { executeRepairWorkflow } from "@superhumaan/dna-ai";
import { readOpenBlockers } from "./memory-updates.js";
import { getBlockerFingerprints } from "./storage.js";

export interface ForceRepairResult {
  issue: ClassifiedIssue;
  repair: Awaited<ReturnType<typeof executeRepairWorkflow>>;
  blockersFound: number;
}

function recordToIssue(record: FingerprintRecord): ClassifiedIssue {
  return {
    id: randomUUID(),
    eventId: randomUUID(),
    severity: record.isBlocker ? "critical" : "high",
    category: (record.category as ClassifiedIssue["category"]) ?? "runtime_error",
    discipline: "backend",
    behaviourViolation: false,
    repeated: true,
    projectRisk: "elevated",
    confidence: 0.85,
    title: `BLOCKER: ${record.message.slice(0, 80)}`,
    summary: record.message,
    relevantBehaviour: ["runtime.behaviour.md", "reasoning.behaviour.md"],
    relevantMemory: [
      "amygdala/repeated-failures.md",
      "amygdala/blockers.md",
      "temporalLobe/previous-solutions.md",
    ],
    endpoint: record.endpoint,
    fingerprint: record.fingerprint,
    repeatCount: record.repeatCount,
    firstSeen: record.firstSeen,
    lastSeen: record.lastSeen,
    repairAttempts: record.repairAttempts,
    repairStatus: record.repairStatus,
    isBlocker: record.isBlocker,
    githubIssueNumber: record.githubIssueNumber,
    suggestedFix:
      record.statusCode && record.statusCode >= 502
        ? "Verify origin is running, add /health, check deploy and proxy config"
        : "Fix root cause and add regression test",
    testRecommendation: "Reproduce error, apply fix, confirm error stops in runtime.db",
  };
}

export async function runForceRepair(options: {
  projectRoot: string;
  dnaRoot: string;
  config: DnaConfig;
  fingerprint?: string;
  dryRun?: boolean;
}): Promise<ForceRepairResult | null> {
  const repairConfig = resolveRepairConfig(options.config.ai);
  if (!repairConfig.aggressive) {
    throw new Error("ai.repair.aggressive is disabled — enable in .DNA/config.dna.json");
  }

  const blockers = await getBlockerFingerprints(options.projectRoot);
  const memBlockers = await readOpenBlockers(options.dnaRoot);

  if (blockers.length === 0 && memBlockers.length === 0) {
    return null;
  }

  const target =
    (options.fingerprint
      ? blockers.find((b) => b.fingerprint === options.fingerprint)
      : undefined) ?? blockers.sort((a, b) => b.repeatCount - a.repeatCount)[0];

  if (!target) {
    return null;
  }

  const issue = recordToIssue(target);
  const repair = await executeRepairWorkflow({
    projectRoot: options.projectRoot,
    dnaRoot: options.dnaRoot,
    issue,
    config: options.config,
    issueNumber: target.githubIssueNumber,
    dryRun: options.dryRun,
  });

  return {
    issue,
    repair,
    blockersFound: Math.max(blockers.length, memBlockers.length),
  };
}
