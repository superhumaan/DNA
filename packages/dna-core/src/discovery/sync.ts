import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { IMPRESSIONS_DIR } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured } from "../fs.js";

const DISCOVERY_IMPRESSIONS: Array<{ rel: string; template: string }> = [
  {
    rel: "product/discovery-log.md",
    template: `# Discovery Log

_Running log of research activities. One row per study or event._

| Date | Method / event | Participants | Goal | Status | Link |
|------|----------------|--------------|------|--------|------|
| _TBD_ | | | | planned | |
`,
  },
  {
    rel: "product/opportunity-tree.md",
    template: `# Opportunity Solution Tree

_Outcome → opportunities → solutions → experiments. See \`discovery/opportunity-solution-tree\`._

## Desired outcome

_What business or customer outcome are we driving?_

## Opportunities

| Opportunity | Evidence | Priority | Status |
|-------------|----------|----------|--------|
| _TBD_ | | | exploring |

## Solutions (for top opportunity)

| Solution | Assumption tested | Result |
|----------|-------------------|--------|
| _TBD_ | | |
`,
  },
  {
    rel: "product/assumptions-risks.md",
    template: `# Assumptions & Risks

| Assumption | Risk if wrong | Test method | Status | Owner |
|------------|---------------|-------------|--------|-------|
| _TBD_ | | | untested | |
`,
  },
  {
    rel: "product/research-insights.md",
    template: `# Research Insights

_Synthesised findings — not raw notes. Cluster by theme or opportunity._

## Themes

### Theme 1

- Insight:
- Supporting evidence:
- Implication:

## Open questions

- 
`,
  },
  {
    rel: "product/pmf-signals.md",
    template: `# Product–Market Fit Signals

_See \`discovery/product-market-fit\` for benchmarks._

## Qualitative

- Sean Ellis score (target ≥ 40% "very disappointed"): _TBD_
- Customer quotes / case studies:

## Quantitative

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Retention (D7/D30) | | | |
| Activation rate | | | |
| NPS / CSAT | | | |

## Decision

- [ ] Continue current strategy
- [ ] Pivot (document in pivot-review)
- [ ] Kill / sunset
`,
  },
];

export async function scaffoldDiscoveryImpressions(root: string): Promise<string[]> {
  const created: string[] = [];
  for (const { rel, template } of DISCOVERY_IMPRESSIONS) {
    const path = join(root, IMPRESSIONS_DIR, rel);
    if (!(await fileExists(path))) {
      await writeFileEnsured(path, template);
      created.push(`${IMPRESSIONS_DIR}/${rel}`);
    }
  }
  return created;
}

export interface SyncDiscoveryOptions {
  root: string;
  quote?: string;
}

export interface SyncDiscoveryResult {
  updated: string[];
  message: string;
}

export async function syncDiscoveryFindings(options: SyncDiscoveryOptions): Promise<SyncDiscoveryResult> {
  const created = await scaffoldDiscoveryImpressions(options.root);
  const updated = [...created];

  if (options.quote?.trim()) {
    const logPath = join(options.root, IMPRESSIONS_DIR, "product/discovery-log.md");
    const insightsPath = join(options.root, IMPRESSIONS_DIR, "product/research-insights.md");
    const date = new Date().toISOString().slice(0, 10);

    const logEntry = `\n| ${date} | sync | — | ${options.quote.replace(/\|/g, "/").replace(/\n/g, " ").slice(0, 120)} | recorded | dna sync |`;
    let logContent = await readFile(logPath, "utf-8");
    if (!logContent.includes(logEntry.trim())) {
      logContent = logContent.trimEnd() + logEntry + "\n";
      await writeFileEnsured(logPath, logContent);
      if (!updated.includes(`${IMPRESSIONS_DIR}/product/discovery-log.md`)) {
        updated.push(`${IMPRESSIONS_DIR}/product/discovery-log.md`);
      }
    }

    const insightBlock = `\n## Sync ${date}\n\n${options.quote}\n`;
    let insightsContent = await readFile(insightsPath, "utf-8");
    if (!insightsContent.includes(insightBlock.trim())) {
      insightsContent = insightsContent.trimEnd() + insightBlock;
      await writeFileEnsured(insightsPath, insightsContent);
      if (!updated.includes(`${IMPRESSIONS_DIR}/product/research-insights.md`)) {
        updated.push(`${IMPRESSIONS_DIR}/product/research-insights.md`);
      }
    }
  }

  const hippocampusPath = join(
    options.root,
    ".DNA",
    "CellularMemory",
    "hippocampus",
    "research-backlog.md",
  );
  if (!(await fileExists(hippocampusPath))) {
    await writeFileEnsured(
      hippocampusPath,
      `# Research Backlog

_Upcoming discovery work. Managed by DNA discovery sync._

| Study | Method | Priority | Status |
|-------|--------|----------|--------|
| _TBD_ | | | backlog |
`,
    );
    updated.push(".DNA/CellularMemory/hippocampus/research-backlog.md");
  }

  const message =
    updated.length > 0
      ? `Updated ${updated.length} discovery artifact(s). Review Impressions and CellularMemory.`
      : "Discovery artifacts already present. Add --quote to append findings.";

  return { updated, message };
}
