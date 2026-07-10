import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";

export type ImpressionsDriftLevel = "ok" | "warning" | "critical";

export interface ImpressionsDriftFinding {
  category: "stack" | "docs" | "architecture" | "staleness";
  message: string;
  weight: number;
}

export interface ImpressionsDriftReport {
  score: number;
  level: ImpressionsDriftLevel;
  findings: ImpressionsDriftFinding[];
  missingDocs: number;
  stackMismatches: string[];
}

function levelFromScore(score: number): ImpressionsDriftLevel {
  if (score >= 50) return "critical";
  if (score >= 25) return "warning";
  return "ok";
}

async function readArchitectureImpression(root: string): Promise<string> {
  const path = join(root, "DNA", "Impressions", "architecture", "overview.md");
  if (!(await fileExists(path))) return "";
  try {
    return await readFile(path, "utf-8");
  } catch {
    return "";
  }
}

function stackMismatch(config: DnaConfig | null, scan: ScanResult): string[] {
  if (!config) return [];
  const mismatches: string[] = [];
  const { stack } = config;

  if (stack.frontend && scan.frontend && stack.frontend !== scan.frontend) {
    mismatches.push(`config frontend (${stack.frontend}) ≠ detected (${scan.frontend})`);
  }
  if (stack.backend && scan.backend && stack.backend !== scan.backend) {
    mismatches.push(`config backend (${stack.backend}) ≠ detected (${scan.backend})`);
  }
  if (stack.database && scan.database && stack.database !== scan.database) {
    mismatches.push(`config database (${stack.database}) ≠ detected (${scan.database})`);
  }
  return mismatches;
}

export async function detectImpressionsDrift(
  root: string,
  scan: ScanResult,
): Promise<ImpressionsDriftReport> {
  const config = await loadDnaConfig(root);
  const findings: ImpressionsDriftFinding[] = [];
  let score = 0;

  const missingDocs = scan.missingDocs.length;
  if (missingDocs > 0) {
    const weight = Math.min(missingDocs * 5, 30);
    score += weight;
    findings.push({
      category: "docs",
      message: `${missingDocs} required Impressions file(s) missing`,
      weight,
    });
  }

  const mismatches = stackMismatch(config, scan);
  if (mismatches.length) {
    const weight = mismatches.length * 15;
    score += weight;
    for (const m of mismatches) {
      findings.push({ category: "stack", message: m, weight: 15 });
    }
  }

  const archDoc = await readArchitectureImpression(root);
  if (config && archDoc) {
    const stackTerms = [
      config.stack.frontend,
      config.stack.backend,
      config.stack.database,
      scan.frontend,
      scan.backend,
    ].filter(Boolean) as string[];

    const mentioned = stackTerms.filter((term) =>
      archDoc.toLowerCase().includes(term.toLowerCase()),
    );
    if (stackTerms.length >= 2 && mentioned.length === 0) {
      score += 20;
      findings.push({
        category: "architecture",
        message: "architecture/overview.md does not mention detected stack",
        weight: 20,
      });
    }
  } else if (config && !archDoc) {
    score += 15;
    findings.push({
      category: "architecture",
      message: "architecture/overview.md missing",
      weight: 15,
    });
  }

  const decisionsPath = join(root, ".DNA", "CellularMemory", "prefrontalCortex", "decisions.md");
  if (await fileExists(decisionsPath)) {
    try {
      const raw = await readFile(decisionsPath, "utf-8");
      const dateMatch = raw.match(/(\d{4}-\d{2}-\d{2})/g);
      if (dateMatch?.length) {
        const latest = dateMatch.sort().at(-1)!;
        const ageDays = (Date.now() - new Date(latest).getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > 90 && (scan.frontend || scan.backend)) {
          score += 10;
          findings.push({
            category: "staleness",
            message: `CellularMemory decisions last updated ${latest} — may be stale vs current code`,
            weight: 10,
          });
        }
      }
    } catch {
      /* ignore */
    }
  }

  score = Math.min(score, 100);
  return {
    score,
    level: levelFromScore(score),
    findings,
    missingDocs,
    stackMismatches: mismatches,
  };
}

export function formatImpressionsDriftReport(report: ImpressionsDriftReport): string {
  const lines = [
    "Impressions Drift",
    "=================",
    "",
    `Score:  ${report.score}/100 (${report.level})`,
    "",
  ];

  if (!report.findings.length) {
    lines.push("No drift detected — Impressions align with codebase.");
    return lines.join("\n");
  }

  lines.push("Findings:");
  for (const f of report.findings) {
    lines.push(`  • [${f.category}] ${f.message}`);
  }

  if (report.level !== "ok") {
    lines.push("", "Suggested actions:");
    lines.push("  dna document --from-code");
    lines.push("  dna plan impressions-sync   # generate sync plan");
    if (report.level === "critical") {
      lines.push("  dna scan --open-pr            # open doc-sync PR (when configured)");
    }
  }

  return lines.join("\n");
}
