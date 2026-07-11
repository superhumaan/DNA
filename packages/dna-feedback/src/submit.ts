import type { DnaConfig, FeedbackPayload } from "@superhumaan/dna-config";
import { FEEDBACK_BASE_URL } from "@superhumaan/dna-config";
import { shouldReportUpstream } from "@superhumaan/dna-immune";
import { buildFeedbackPayload, type BuildFeedbackOptions } from "./payload.js";
import { enqueueFeedback, readFeedbackQueue, writeFeedbackQueue } from "./queue.js";

export interface SubmitFeedbackOptions {
  projectRoot: string;
  config: DnaConfig;
  payload: FeedbackPayload;
  dryRun?: boolean;
}

export interface SubmitFeedbackResult {
  status: "sent" | "queued" | "dry-run" | "skipped";
  endpoint?: string;
  queuePath?: string;
  payload: FeedbackPayload;
}

async function postFeedback(
  endpoint: string,
  payload: FeedbackPayload,
): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "dna-by-humaan-feedback",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function submitFeedback(
  options: SubmitFeedbackOptions,
): Promise<SubmitFeedbackResult> {
  const { payload, projectRoot, config, dryRun } = options;

  const feedback = config.feedback ?? {
    enabled: true,
    upstream: true,
    autoReport: "dna-only" as const,
    includeSuggestedFix: true,
  };

  if (!feedback.enabled || !feedback.upstream) {
    return { status: "skipped", payload };
  }

  if (dryRun) {
    return { status: "dry-run", payload };
  }

  const endpoint = feedback.endpoint ?? FEEDBACK_BASE_URL;
  const sent = await postFeedback(endpoint, payload);

  if (sent) {
    return { status: "sent", endpoint, payload };
  }

  const queuePath = await enqueueFeedback(projectRoot, payload);
  return { status: "queued", queuePath, payload };
}

export interface ReportUpstreamOptions extends BuildFeedbackOptions {
  projectRoot: string;
  config: DnaConfig;
  dryRun?: boolean;
}

export async function reportUpstream(
  options: ReportUpstreamOptions,
): Promise<SubmitFeedbackResult | { status: "skipped" }> {
  const { config, projectRoot, dryRun, ...buildOpts } = options;
  const feedback = config.feedback ?? {
    enabled: true,
    upstream: true,
    autoReport: "dna-only" as const,
    includeSuggestedFix: true,
  };

  if (!feedback.enabled || !feedback.upstream) {
    return { status: "skipped" };
  }

  const autoReport = feedback.autoReport ?? "dna-only";
  const shouldReport = shouldReportUpstream(
    {
      message: buildOpts.message,
      stack: buildOpts.stack,
      command: buildOpts.command,
      source: buildOpts.source,
      issue: buildOpts.issue,
    },
    autoReport,
  );

  if (!shouldReport) {
    return { status: "skipped" };
  }

  const payload = await buildFeedbackPayload({ ...buildOpts, config });
  return submitFeedback({ projectRoot, config, payload, dryRun });
}

export async function syncFeedbackQueue(
  projectRoot: string,
  config: DnaConfig,
): Promise<{ sent: number; remaining: number }> {
  const items = await readFeedbackQueue(projectRoot);
  if (items.length === 0) return { sent: 0, remaining: 0 };

  const endpoint = config.feedback?.endpoint ?? FEEDBACK_BASE_URL;
  const remaining: FeedbackPayload[] = [];
  let sent = 0;

  for (const payload of items) {
    const ok = await postFeedback(endpoint, payload);
    if (ok) sent += 1;
    else remaining.push(payload);
  }

  await writeFeedbackQueue(projectRoot, remaining);
  return { sent, remaining: remaining.length };
}
