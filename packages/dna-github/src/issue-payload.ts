import type { ClassifiedIssue, GitHubIssuePayload } from "@superhumaan/dna-config";

export function buildIssuePayload(issue: ClassifiedIssue): GitHubIssuePayload {
  const labels = [
    "dna",
    `severity:${issue.severity}`,
    `category:${issue.category}`,
    `discipline:${issue.discipline}`,
  ];

  const body = [
    "## Summary",
    issue.summary,
    "",
    "## Classification",
    `- **Severity:** ${issue.severity}`,
    `- **Category:** ${issue.category}`,
    `- **Discipline:** ${issue.discipline}`,
    `- **Confidence:** ${(issue.confidence * 100).toFixed(0)}%`,
    `- **Repeated:** ${issue.repeated ? "yes" : "no"}`,
    issue.repeatCount != null ? `- **Repeat count:** ${issue.repeatCount}` : "",
    issue.fingerprint ? `- **Fingerprint:** \`${issue.fingerprint}\`` : "",
    issue.isBlocker ? `- **BLOCKER:** yes — aggressive repair required` : "",
    `- **Behaviour violation:** ${issue.behaviourViolation ? "yes" : "no"}`,
    "",
    issue.endpoint ? `## Impacted Endpoint\n\`${issue.endpoint}\`\n` : "",
    issue.stackTraceSummary
      ? `## Stack Trace Summary\n\`\`\`\n${issue.stackTraceSummary}\n\`\`\`\n`
      : "",
    issue.suspectedCause ? `## Suspected Cause\n${issue.suspectedCause}\n` : "",
    issue.relevantBehaviour.length
      ? `## Relevant Behaviour\n${issue.relevantBehaviour.map((b) => `- ${b}`).join("\n")}\n`
      : "",
    issue.relevantMemory.length
      ? `## Relevant CellularMemory\n${issue.relevantMemory.map((m) => `- ${m}`).join("\n")}\n`
      : "",
    issue.suggestedFix ? `## Suggested Fix\n${issue.suggestedFix}\n` : "",
    issue.testRecommendation ? `## Test Recommendation\n${issue.testRecommendation}\n` : "",
    issue.reproductionNotes ? `## Reproduction\n${issue.reproductionNotes}\n` : "",
    "",
    "---",
    "_Created by [DNA by Humaan](https://github.com/humaan/dna)_",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: issue.title,
    body,
    labels,
  };
}
