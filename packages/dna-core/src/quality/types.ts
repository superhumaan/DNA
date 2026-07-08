export type QualitySeverity = "blocker" | "critical" | "major" | "minor" | "info";

export type QualityCategory =
  | "security"
  | "reliability"
  | "maintainability"
  | "coverage"
  | "toolchain";

export interface QualityIssue {
  rule: string;
  category: QualityCategory;
  severity: QualitySeverity;
  message: string;
  file?: string;
  line?: number;
}

export interface ToolchainResult {
  command: string;
  script: string;
  success: boolean;
  output: string;
}

export interface QualityReport {
  generatedAt: string;
  projectName: string;
  featureSlug?: string;
  scope: "full" | "feature" | "paths";
  filesScanned: number;
  issues: QualityIssue[];
  toolchain: ToolchainResult[];
  gate: "pass" | "fail";
  summary: Record<QualitySeverity, number>;
}

export interface RunQualityAnalysisOptions {
  root: string;
  projectName: string;
  featureSlug?: string;
  /** Limit scan to these relative paths */
  paths?: string[];
  /** Use git diff vs default branch for feature scope */
  featureScope?: boolean;
  /** Run project lint/typecheck scripts when available */
  runToolchain?: boolean;
}

export interface WriteQualityReportResult {
  reportPath: string;
  report: QualityReport;
}
