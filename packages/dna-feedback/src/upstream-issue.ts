import type { FeedbackPayload, GitHubIssuePayload } from "@superhumaan/dna-config";
import { DNA_UPSTREAM_REPO } from "@superhumaan/dna-config";

export function fingerprintLabel(fingerprint: string): string {
  return `fp:${fingerprint.slice(0, 12)}`;
}

export function buildUpstreamIssuePayload(payload: FeedbackPayload): GitHubIssuePayload {
  const labels = [
    "dna-feedback",
    "upstream",
    `severity:${payload.severity}`,
    `source:${payload.source}`,
    fingerprintLabel(payload.fingerprint),
  ];

  const body = [
    "## Summary",
    payload.message,
    "",
    "## Context",
    `- **DNA version:** ${payload.dnaVersion}`,
    `- **Node:** ${payload.nodeVersion}`,
    `- **Platform:** ${payload.platform}`,
    `- **Source:** ${payload.source}`,
    `- **Project ID:** \`${payload.projectId}\` (anonymous install fingerprint — not PII)`,
    `- **Fingerprint:** \`${payload.fingerprint}\``,
    payload.command ? `- **Command:** \`${payload.command}\`` : "",
    `- **Category:** ${payload.category}`,
  ]
    .filter(Boolean)
    .join("\n");

  const sections = [
    body,
    payload.stack
      ? `\n## Stack Trace (redacted)\n\`\`\`\n${payload.stack}\n\`\`\``
      : "",
    payload.suggestedFix ? `\n## Suggested Fix\n${payload.suggestedFix}` : "",
    payload.reproductionNotes ? `\n## Reproduction\n${payload.reproductionNotes}` : "",
    "",
    "---",
    `_Upstream feedback from [DNA by Humaan](https://github.com/${DNA_UPSTREAM_REPO.owner}/${DNA_UPSTREAM_REPO.repo}) — install \`${payload.installId.slice(0, 8)}…\`_`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: `[feedback] ${payload.message.slice(0, 72)}`,
    body: sections,
    labels,
  };
}
