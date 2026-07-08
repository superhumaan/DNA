import type { QualityReport, QualitySeverity } from "./types.js";

const SEVERITY_LABEL: Record<QualitySeverity, string> = {
  blocker: "Blocker",
  critical: "Critical",
  major: "Major",
  minor: "Minor",
  info: "Info",
};

function gateEmoji(gate: QualityReport["gate"]): string {
  return gate === "pass" ? "PASS" : "FAIL";
}

export function formatQualityReportMarkdown(report: QualityReport): string {
  const lines: string[] = [
    `# Code Quality Report`,
    ``,
    `_Local DNA quality analysis — SonarQube-style gate without a SonarQube server._`,
    ``,
    `| Field | Value |`,
    `|-------|-------|`,
    `| Project | ${report.projectName} |`,
    `| Generated | ${report.generatedAt} |`,
    `| Scope | ${report.scope}${report.featureSlug ? ` (${report.featureSlug})` : ""} |`,
    `| Files scanned | ${report.filesScanned} |`,
    `| **Quality gate** | **${gateEmoji(report.gate)}** |`,
    ``,
    `## Summary`,
    ``,
    `| Severity | Count |`,
    `|----------|-------|`,
  ];

  for (const sev of ["blocker", "critical", "major", "minor", "info"] as QualitySeverity[]) {
    lines.push(`| ${SEVERITY_LABEL[sev]} | ${report.summary[sev]} |`);
  }

  if (report.toolchain.length > 0) {
    lines.push(``, `## Toolchain`, ``);
    for (const t of report.toolchain) {
      const status = t.success ? "pass" : "FAIL";
      lines.push(`- **${t.script}** (\`${t.command}\`): ${status}`);
      if (!t.success && t.output) {
        lines.push(``, "```", t.output.slice(0, 2000), "```", ``);
      }
    }
  }

  lines.push(``, `## Issues`, ``);

  if (report.issues.length === 0) {
    lines.push(`No issues found.`);
  } else {
    const byCategory = new Map<string, typeof report.issues>();
    for (const issue of report.issues) {
      const list = byCategory.get(issue.category) ?? [];
      list.push(issue);
      byCategory.set(issue.category, list);
    }

    for (const [category, issues] of [...byCategory.entries()].sort()) {
      lines.push(`### ${category}`, ``);
      for (const issue of issues) {
        const loc = issue.file
          ? issue.line
            ? `\`${issue.file}:${issue.line}\``
            : `\`${issue.file}\``
          : "_project_";
        lines.push(
          `- **[${SEVERITY_LABEL[issue.severity]}]** \`${issue.rule}\` — ${issue.message} (${loc})`,
        );
      }
      lines.push(``);
    }
  }

  lines.push(
    `---`,
    ``,
    `## Quality gate rules`,
    ``,
    `- **FAIL** when any **Blocker** or **Critical** issue remains`,
    `- Feature factory agents must fix blockers/criticals before marking a feature complete`,
    `- Re-run: \`dna quality report --feature\``,
    ``,
  );

  return lines.join("\n");
}

export function formatQualityReportSummary(report: QualityReport): string {
  const parts = [
    `Quality gate: ${gateEmoji(report.gate)}`,
    `Files: ${report.filesScanned}`,
    `Issues: blocker=${report.summary.blocker} critical=${report.summary.critical} major=${report.summary.major}`,
  ];
  return parts.join(" · ");
}
