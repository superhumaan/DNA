import { randomUUID } from "node:crypto";
import type {
  ClassifiedIssue,
  DnaConfig,
  FeedbackPayload,
  FeedbackSource,
} from "@superhumaan/dna-config";
import { hashFingerprint, getInstallId } from "./install-id.js";
import { sanitizeStack, sanitizeText } from "./sanitize.js";

export interface BuildFeedbackOptions {
  source: FeedbackSource;
  message: string;
  stack?: string;
  command?: string;
  dnaVersion: string;
  config: DnaConfig;
  issue?: ClassifiedIssue;
  severity?: FeedbackPayload["severity"];
  category?: string;
  suggestedFix?: string;
  reproductionNotes?: string;
}

export function fingerprintFeedback(input: {
  dnaVersion: string;
  command?: string;
  message: string;
  topFrame?: string;
}): string {
  const normalizedMessage = input.message.toLowerCase().replace(/\d+/g, "N").slice(0, 200);
  return hashFingerprint([
    input.dnaVersion,
    input.command ?? "",
    normalizedMessage,
    input.topFrame ?? "",
  ]);
}

export async function buildFeedbackPayload(
  options: BuildFeedbackOptions,
): Promise<FeedbackPayload> {
  const stack = sanitizeStack(options.stack ?? options.issue?.stackTraceSummary);
  const message = sanitizeText(options.message);
  const topFrame = stack?.split("\n").find((line) => line.startsWith("at "));

  const fingerprint = fingerprintFeedback({
    dnaVersion: options.dnaVersion,
    command: options.command,
    message,
    topFrame,
  });

  const installId = await getInstallId();

  return {
    id: randomUUID(),
    fingerprint,
    timestamp: new Date().toISOString(),
    source: options.source,
    dnaVersion: options.dnaVersion,
    nodeVersion: process.version,
    platform: process.platform,
    installId,
    projectId: options.config.projectId,
    command: options.command,
    message,
    stack,
    severity: options.severity ?? options.issue?.severity ?? "medium",
    category: options.category ?? options.issue?.category ?? "unknown",
    suggestedFix: options.config.feedback?.includeSuggestedFix
      ? options.suggestedFix ?? options.issue?.suggestedFix
      : undefined,
    reproductionNotes: options.reproductionNotes ?? options.issue?.reproductionNotes,
  };
}
