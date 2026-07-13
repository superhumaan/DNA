import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ClassifiedIssue, FingerprintRecord } from "@superhumaan/dna-config";

async function appendSection(path: string, entry: string): Promise<void> {
  try {
    await appendFile(path, entry, "utf-8");
  } catch {
    // memory file may not exist yet
  }
}

export async function updateRepeatedFailuresMemory(
  dnaRoot: string,
  issue: ClassifiedIssue,
  record: FingerprintRecord,
): Promise<void> {
  if (!issue.repeated && record.repeatCount < 3) return;

  const memPath = join(dnaRoot, "CellularMemory", "amygdala", "repeated-failures.md");
  const entry = [
    "",
    `## ${issue.title}`,
    `- **Fingerprint:** \`${record.fingerprint}\``,
    `- **Repeat count:** ${record.repeatCount}`,
    `- **First seen:** ${record.firstSeen}`,
    `- **Last seen:** ${record.lastSeen}`,
    `- **Category:** ${issue.category} | **Severity:** ${issue.severity}`,
    issue.endpoint ? `- **Endpoint:** \`${issue.endpoint}\`` : "",
    issue.reproductionNotes ? `- **Context:** ${issue.reproductionNotes}` : "",
    `- **Repair attempts:** ${record.repairAttempts} (${record.repairStatus})`,
    issue.suspectedCause ? `- **Suspected cause:** ${issue.suspectedCause}` : "",
    issue.suggestedFix ? `- **Suggested fix:** ${issue.suggestedFix}` : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  await appendSection(memPath, entry);
}

export async function updateBlockersMemory(
  dnaRoot: string,
  issue: ClassifiedIssue,
  record: FingerprintRecord,
): Promise<void> {
  if (!record.isBlocker) return;

  const memPath = join(dnaRoot, "CellularMemory", "amygdala", "blockers.md");
  const entry = [
    "",
    `## BLOCKER: ${issue.title}`,
    `- **Fingerprint:** \`${record.fingerprint}\``,
    `- **Repeat count:** ${record.repeatCount} (threshold exceeded)`,
    `- **Last seen:** ${record.lastSeen}`,
    issue.endpoint ? `- **Endpoint:** \`${issue.endpoint}\`` : "",
    `- **Status:** ${record.repairStatus} | **Repair attempts:** ${record.repairAttempts}`,
  ].join("\n");

  await appendSection(memPath, entry);
}

export async function updatePreviousSolutionsMemory(
  dnaRoot: string,
  issue: ClassifiedIssue,
  outcome: {
    branchName: string;
    filesModified: string[];
    testsPassed: boolean;
    prUrl?: string;
    diagnosis: string;
  },
): Promise<void> {
  const memPath = join(dnaRoot, "CellularMemory", "temporalLobe", "previous-solutions.md");
  const entry = [
    "",
    `## ${new Date().toISOString()}: ${issue.title}`,
    `- **Fingerprint:** \`${issue.fingerprint ?? "unknown"}\``,
    `- **Branch:** \`${outcome.branchName}\``,
    outcome.prUrl ? `- **PR:** ${outcome.prUrl}` : "",
    `- **Files modified:** ${outcome.filesModified.length > 0 ? outcome.filesModified.join(", ") : "none"}`,
    `- **Tests:** ${outcome.testsPassed ? "passed" : "failed/skipped"}`,
    `- **Diagnosis:** ${outcome.diagnosis.slice(0, 500)}`,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  await appendSection(memPath, entry);
}

export async function readOpenBlockers(dnaRoot: string): Promise<string[]> {
  const memPath = join(dnaRoot, "CellularMemory", "amygdala", "blockers.md");
  try {
    const content = await readFile(memPath, "utf-8");
    const matches = content.match(/^## BLOCKER: .+$/gm);
    return matches ?? [];
  } catch {
    return [];
  }
}
