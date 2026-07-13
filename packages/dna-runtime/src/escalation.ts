import type { ClassifiedIssue, FingerprintRecord, RuntimeEvent } from "@superhumaan/dna-config";
import { issueFingerprint } from "./fingerprint.js";
import { readFingerprintRecords, upsertFingerprintRecord } from "./storage.js";

export interface EscalationResult {
  record: FingerprintRecord;
  issue: ClassifiedIssue;
  event: RuntimeEvent;
}

export async function escalateFingerprint(
  projectRoot: string,
  event: RuntimeEvent,
  issue: ClassifiedIssue,
  options: { minRepeatForRepair: number; minRepeatForBlocker: number },
): Promise<EscalationResult> {
  const fingerprint = issueFingerprint(event, issue.category);
  const now = new Date().toISOString();
  const existing = (await readFingerprintRecords(projectRoot)).find(
    (r) => r.fingerprint === fingerprint,
  );

  const repeatCount = (existing?.repeatCount ?? 0) + 1;
  const record: FingerprintRecord = {
    fingerprint,
    repeatCount,
    firstSeen: existing?.firstSeen ?? now,
    lastSeen: now,
    repairAttempts: existing?.repairAttempts ?? 0,
    repairStatus: existing?.repairStatus ?? "pending",
    githubIssueNumber: existing?.githubIssueNumber,
    endpoint: event.endpoint,
    statusCode: event.statusCode,
    message: event.message,
    category: issue.category,
    isBlocker: repeatCount >= options.minRepeatForBlocker,
  };

  await upsertFingerprintRecord(projectRoot, record);

  const enrichedIssue: ClassifiedIssue = {
    ...issue,
    fingerprint,
    repeatCount,
    firstSeen: record.firstSeen,
    lastSeen: record.lastSeen,
    repairAttempts: record.repairAttempts,
    repairStatus: record.repairStatus,
    isBlocker: record.isBlocker,
    repeated: repeatCount >= options.minRepeatForRepair || issue.repeated,
    githubIssueNumber: record.githubIssueNumber,
    relevantMemory: [
      ...new Set([
        ...issue.relevantMemory,
        ...(repeatCount >= options.minRepeatForRepair ? ["amygdala/repeated-failures.md"] : []),
        ...(record.isBlocker ? ["amygdala/blockers.md"] : []),
        "temporalLobe/previous-solutions.md",
      ]),
    ],
  };

  const enrichedEvent: RuntimeEvent = { ...event, fingerprint };

  return { record, issue: enrichedIssue, event: enrichedEvent };
}

export async function markRepairAttempted(
  projectRoot: string,
  fingerprint: string,
  status: FingerprintRecord["repairStatus"],
  githubIssueNumber?: number,
): Promise<void> {
  const records = await readFingerprintRecords(projectRoot);
  const existing = records.find((r) => r.fingerprint === fingerprint);
  if (!existing) return;

  await upsertFingerprintRecord(projectRoot, {
    ...existing,
    repairAttempts: existing.repairAttempts + 1,
    repairStatus: status,
    githubIssueNumber: githubIssueNumber ?? existing.githubIssueNumber,
    lastSeen: new Date().toISOString(),
  });
}
