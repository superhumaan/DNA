import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ISSUE_CATEGORIES, SEVERITY_LEVELS } from "@superhumaan/dna-config";

export interface ImmuneRule {
  id: string;
  condition: string;
  category: (typeof ISSUE_CATEGORIES)[number];
  severity: (typeof SEVERITY_LEVELS)[number];
}

export interface ImmuneClassifier {
  pattern: string;
  category: (typeof ISSUE_CATEGORIES)[number];
  discipline: string;
}

export interface ImmuneConfig {
  rules: ImmuneRule[];
  classifiers: ImmuneClassifier[];
  autoIssueSeverities: Set<string>;
}

export const DEFAULT_CLASSIFIERS: ImmuneClassifier[] = [
  { pattern: "ECONNREFUSED|ETIMEDOUT|connection", category: "database", discipline: "backend" },
  { pattern: "JWT|token|unauthorized|forbidden", category: "auth", discipline: "security" },
  { pattern: "timeout|slow|duration", category: "performance", discipline: "backend" },
  { pattern: "Cannot find module|MODULE_NOT_FOUND", category: "dependency", discipline: "devops" },
  { pattern: "validation|ZodError|invalid", category: "runtime_error", discipline: "backend" },
  { pattern: "tenant|multi-tenant", category: "multi_tenancy", discipline: "backend" },
  { pattern: "HTTP 502|HTTP 503|HTTP 504|Bad gateway|bad gateway|502|503|504", category: "deployment", discipline: "devops" },
  { pattern: "ECONNRESET|upstream|gateway", category: "deployment", discipline: "devops" },
];

export async function loadImmuneConfig(dnaRoot: string): Promise<ImmuneConfig> {
  const rulesPath = join(dnaRoot, "immuneSystem", "rules.json");
  const classifierPath = join(dnaRoot, "immuneSystem", "issue-classifier.json");
  const severityPath = join(dnaRoot, "immuneSystem", "severity-model.json");

  let rules: ImmuneRule[] = [];
  let classifiers = DEFAULT_CLASSIFIERS;
  const autoIssueSeverities = new Set<string>(["high", "critical"]);

  try {
    const rulesRaw = JSON.parse(await readFile(rulesPath, "utf-8")) as {
      rules?: ImmuneRule[];
    };
    rules = rulesRaw.rules ?? [];
  } catch {
    // use defaults
  }

  try {
    const classifierRaw = JSON.parse(await readFile(classifierPath, "utf-8")) as {
      classifiers?: ImmuneClassifier[];
    };
    if (classifierRaw.classifiers?.length) {
      classifiers = classifierRaw.classifiers;
    }
  } catch {
    // use defaults
  }

  try {
    const severityRaw = JSON.parse(await readFile(severityPath, "utf-8")) as {
      levels?: Record<string, { autoIssue?: boolean }>;
    };
    for (const [level, meta] of Object.entries(severityRaw.levels ?? {})) {
      if (meta.autoIssue) autoIssueSeverities.add(level);
    }
  } catch {
    // use defaults
  }

  return { rules, classifiers, autoIssueSeverities };
}
