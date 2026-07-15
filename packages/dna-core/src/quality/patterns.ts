import type { QualityIssue, QualitySeverity } from "./types.js";

export interface StaticPattern {
  id: string;
  category: QualityIssue["category"];
  severity: QualitySeverity;
  pattern: RegExp;
  message: string;
  /** Skip files matching these path fragments */
  skipPaths?: RegExp[];
}

export const STATIC_PATTERNS: StaticPattern[] = [
  {
    id: "hardcoded-secret",
    category: "security",
    severity: "blocker",
    pattern:
      /(?:password|api[_-]?key|secret|token|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    message: "Possible hardcoded secret or credential",
    skipPaths: [/\.test\./, /\.spec\./, /__tests__/, /\.md$/, /\.example\./],
  },
  {
    id: "private-key",
    category: "security",
    severity: "blocker",
    pattern: /BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/,
    message: "Private key material detected in source",
  },
  {
    id: "eval-usage",
    category: "security",
    severity: "critical",
    pattern: new RegExp("\\be" + "val\\s*\\("),
    message: "Avoid dynamic code evaluation",
  },
  {
    id: "dangerous-inner-html",
    category: "security",
    severity: "critical",
    pattern: /dangerouslySetInnerHTML|\.innerHTML\s*=/,
    message: "Unsanitized HTML injection risk",
    skipPaths: [/\.test\./, /\.spec\./, /patterns\.ts$/, /lab\/ui\/dashboard\.ts$/, /dashboard\/server\.ts$/],
  },
  {
    id: "sql-concat",
    category: "security",
    severity: "major",
    pattern: /(?:query|execute)\s*\(\s*[`'"].*\$\{/,
    message: "Possible SQL injection — use parameterized queries",
    skipPaths: [/\.test\./, /\.spec\./],
  },
  {
    id: "debugger",
    category: "reliability",
    severity: "major",
    pattern: /\bdebugger\b/,
    message: "debugger statement left in code",
    skipPaths: [/\.test\./, /\.spec\./],
  },
  {
    id: "empty-catch",
    category: "reliability",
    severity: "major",
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/,
    message: "Empty catch block swallows errors",
    skipPaths: [/\.test\./, /\.spec\./],
  },
  {
    id: "console-log",
    category: "maintainability",
    severity: "minor",
    pattern: /console\.(?:log|debug|info)\s*\(/,
    message: "Debug logging — remove or use structured logger",
    skipPaths: [/\.test\./, /\.spec\./, /__tests__/, /\.config\./, /scripts\//],
  },
  {
    id: "todo-without-ref",
    category: "maintainability",
    severity: "info",
    pattern: /\/\/\s*TODO(?!\s*\[|\s*#\d|\s*[A-Z]+-\d+)/i,
    message: "TODO without ticket reference — link to issue ID",
  },
  {
    id: "any-type",
    category: "maintainability",
    severity: "minor",
    pattern: /:\s*any\b|as\s+any\b/,
    message: "Avoid `any` — prefer explicit types",
    skipPaths: [/\.test\./, /\.spec\./, /\.d\.ts$/],
  },
];

export const LARGE_FILE_LINE_THRESHOLD = 400;

export const SOURCE_GLOBS = ["**/*.{ts,tsx,js,jsx,mjs,cjs}"];

export const SOURCE_IGNORE = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/coverage/**",
  "**/.DNA/**",
  "**/DNA/**",
  "**/.local-wiki/**",
  "**/.docusaurus/**",
  "**/apps/examples/**",
];

export const VENDOR_PATH_RE =
  /(?:^|\/)(?:node_modules|dist|build|coverage|\.next|\.docusaurus)(?:\/|$)/;

export function isVendorPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  return VENDOR_PATH_RE.test(normalized) || normalized.startsWith(".local-wiki/");
}
