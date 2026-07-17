#!/usr/bin/env node
/**
 * DNA canonical health report composer.
 *
 * Reads machine-readable gate inputs and produces ONE canonical, sanitized,
 * public-safe health report in both JSON and Markdown. This is the single
 * source of truth for:
 *   - the GitHub Actions Step Summary + uploaded artifacts,
 *   - the npm README "Verified results" section,
 *   - any product surface that reports project health.
 *
 * Inputs (all optional — the report degrades gracefully and marks any missing
 * gate as `available: false` rather than fabricating results):
 *   coverage/coverage-summary.json      vitest v8 json-summary
 *   .dna-reports/test-results.json      vitest --reporter=json output
 *   .dna-reports/load-test.json         scripts/lab-load-test.mjs --json
 *   .dna-reports/audit.json             `pnpm audit --json` stdout
 *   .dna-reports/quality.json           `dna quality report --json` stdout
 *
 * Outputs:
 *   .dna-reports/health-report.json     canonical machine-readable document
 *   .dna-reports/health-report.md       Markdown (Step Summary + README source)
 *
 * Sanitization: absolute filesystem paths, the home directory, and the repo
 * root are stripped so the published report never leaks a contributor's local
 * environment. Only repo-relative file names and aggregate numbers are emitted.
 *
 * Usage:
 *   node scripts/health-report.mjs [--reports-dir .dna-reports]
 *     [--coverage coverage/coverage-summary.json] [--threshold 80]
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve, isAbsolute } from "node:path";
import { homedir } from "node:os";

const SCHEMA_VERSION = "1.0";
const CWD = process.cwd();
const HOME = homedir();

function strArg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? String(process.argv[i + 1]) : fallback;
}

const REPORTS_DIR = resolve(CWD, strArg("reports-dir", ".dna-reports"));
const COVERAGE_PATH = resolve(CWD, strArg("coverage", "coverage/coverage-summary.json"));
const THRESHOLD = Number(strArg("threshold", "80"));

/** Remove local environment leakage from a string value. */
function sanitizePath(value) {
  if (typeof value !== "string") return value;
  let out = value;
  if (isAbsolute(out) && out.startsWith(CWD)) out = relative(CWD, out) || ".";
  out = out.split(CWD + "/").join("");
  if (HOME) out = out.split(HOME).join("~");
  return out;
}

async function readJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(await readFile(path, "utf-8"));
  } catch {
    return null;
  }
}

function round(n, dp = 2) {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

function coverageGate(summary) {
  if (!summary || !summary.total) return { available: false, status: "unknown" };
  const total = summary.total;
  const below = [];
  for (const [file, m] of Object.entries(summary)) {
    if (file === "total") continue;
    const pct = m?.lines?.pct;
    if (typeof pct === "number" && pct < THRESHOLD) {
      below.push({ file: sanitizePath(file), linesPct: round(pct) });
    }
  }
  below.sort((a, b) => a.linesPct - b.linesPct);
  const linesPct = round(total.lines?.pct);
  const status =
    linesPct != null && linesPct >= THRESHOLD && below.length === 0 ? "pass" : "fail";
  return {
    available: true,
    threshold: THRESHOLD,
    linesPct,
    branchesPct: round(total.branches?.pct),
    functionsPct: round(total.functions?.pct),
    statementsPct: round(total.statements?.pct),
    coveredLines: total.lines?.covered ?? null,
    totalLines: total.lines?.total ?? null,
    filesBelowThreshold: below,
    status,
  };
}

function testsGate(results) {
  if (!results) return { available: false, status: "unknown" };
  // vitest --reporter=json shape
  const total = results.numTotalTests ?? null;
  const passed = results.numPassedTests ?? null;
  const failed = results.numFailedTests ?? null;
  const suites = results.numTotalTestSuites ?? null;
  const success = results.success === true || (failed === 0 && total != null);
  return {
    available: true,
    total,
    passed,
    failed,
    suites,
    status: success ? "pass" : "fail",
  };
}

function loadGate(load) {
  if (!load || !load.after) return { available: false, status: "unknown" };
  const a = load.after;
  return {
    available: true,
    users: load.scenario?.users ?? null,
    polls: load.scenario?.polls ?? null,
    requests: a.requests ?? null,
    p95Ms: a.p95Ms ?? null,
    p99Ms: a.p99Ms ?? null,
    throughputRps: a.throughputRps ?? null,
    errors: a.errors ?? null,
    status: load.gate?.passed ? "pass" : "fail",
    failures: load.gate?.failures ?? [],
  };
}

function auditGate(audit) {
  if (!audit) return { available: false, status: "unknown" };
  // pnpm audit --json: { metadata: { vulnerabilities: { info, low, moderate, high, critical } } }
  const v =
    audit.metadata?.vulnerabilities ??
    audit.vulnerabilities ??
    null;
  if (!v) return { available: false, status: "unknown" };
  const critical = v.critical ?? 0;
  const high = v.high ?? 0;
  const moderate = v.moderate ?? 0;
  const low = v.low ?? 0;
  const info = v.info ?? 0;
  return {
    available: true,
    vulnerabilities: { critical, high, moderate, low, info },
    // OWASP-aligned gate: block on high+.
    status: critical + high > 0 ? "fail" : "pass",
  };
}

function qualityGate(quality) {
  if (!quality) return { available: false, status: "unknown" };
  const gate = quality.gate ?? null;
  return {
    available: true,
    gate,
    filesScanned: quality.filesScanned ?? null,
    summary: quality.summary ?? null,
    status: gate === "pass" ? "pass" : gate === "fail" ? "fail" : "unknown",
  };
}

function overallStatus(gates) {
  const active = Object.values(gates).filter((g) => g.available);
  if (active.length === 0) return "unknown";
  if (active.some((g) => g.status === "fail")) return "fail";
  if (Object.values(gates).some((g) => !g.available)) return "partial";
  return "pass";
}

function badge(status) {
  switch (status) {
    case "pass":
      return "✅ pass";
    case "fail":
      return "❌ fail";
    case "partial":
      return "⚠️ partial";
    default:
      return "— n/a";
  }
}

function pct(n) {
  return n == null ? "—" : `${n}%`;
}

function buildMarkdown(doc) {
  const g = doc.gates;
  const lines = [
    `# DNA project health`,
    ``,
    `_Canonical report — generated by \`scripts/health-report.mjs\` on ${doc.generatedAt}._`,
    ``,
    `**Overall:** ${badge(doc.status)}`,
    doc.project?.name ? `**Project:** ${doc.project.name}${doc.project.version ? ` v${doc.project.version}` : ""}` : null,
    doc.commit?.sha ? `**Commit:** \`${doc.commit.sha.slice(0, 12)}\`${doc.commit.ref ? ` (${doc.commit.ref})` : ""}` : null,
    ``,
    `| Gate | Result | Detail |`,
    `|------|--------|--------|`,
    `| Unit tests | ${badge(g.tests.status)} | ${
      g.tests.available ? `${g.tests.passed}/${g.tests.total} passed` : "not run"
    } |`,
    `| Coverage (lines) | ${badge(g.coverage.status)} | ${
      g.coverage.available
        ? `${pct(g.coverage.linesPct)} (threshold ${g.coverage.threshold}%, ${g.coverage.filesBelowThreshold.length} file(s) below)`
        : "not run"
    } |`,
    `| Lab load | ${badge(g.load.status)} | ${
      g.load.available
        ? `${g.load.users} viewers · p95 ${g.load.p95Ms}ms · ${g.load.throughputRps} req/s · ${g.load.errors} errors`
        : "not run"
    } |`,
    `| Dependency audit | ${badge(g.audit.status)} | ${
      g.audit.available
        ? `crit ${g.audit.vulnerabilities.critical} · high ${g.audit.vulnerabilities.high} · mod ${g.audit.vulnerabilities.moderate}`
        : "not run"
    } |`,
    `| Code quality (SAST) | ${badge(g.quality.status)} | ${
      g.quality.available
        ? `gate ${g.quality.gate} · ${g.quality.filesScanned ?? "?"} files`
        : "not run"
    } |`,
    ``,
  ].filter((l) => l !== null);

  if (g.coverage.available) {
    lines.push(
      `## Coverage`,
      ``,
      `- Lines: ${pct(g.coverage.linesPct)}${g.coverage.coveredLines != null ? ` (${g.coverage.coveredLines}/${g.coverage.totalLines})` : ""}`,
      `- Branches: ${pct(g.coverage.branchesPct)} · Functions: ${pct(g.coverage.functionsPct)} · Statements: ${pct(g.coverage.statementsPct)}`,
      ``,
    );
    if (g.coverage.filesBelowThreshold.length > 0) {
      lines.push(`Files below ${g.coverage.threshold}%:`, ``);
      for (const f of g.coverage.filesBelowThreshold.slice(0, 25)) {
        lines.push(`- \`${f.file}\` — ${pct(f.linesPct)}`);
      }
      if (g.coverage.filesBelowThreshold.length > 25) {
        lines.push(`- … and ${g.coverage.filesBelowThreshold.length - 25} more`);
      }
      lines.push(``);
    }
  }

  if (g.load.available) {
    lines.push(
      `## Lab load`,
      ``,
      `${g.load.users} concurrent viewers × ${g.load.polls} polls (${g.load.requests} requests): ` +
        `p95 ${g.load.p95Ms}ms, p99 ${g.load.p99Ms}ms, ${g.load.throughputRps} req/s, ${g.load.errors} errors.`,
      ``,
    );
    if (g.load.failures?.length) {
      lines.push(`Gate failures: ${g.load.failures.join("; ")}`, ``);
    }
  }

  lines.push(
    `## Sources`,
    ``,
    ...doc.sources.map((s) => `- \`${s.path}\`${s.present ? "" : " (missing)"}`),
    ``,
    `---`,
    ``,
    `Regenerate: \`pnpm run health:report\` (after running tests, coverage, load, audit, and quality).`,
    ``,
  );

  return lines.join("\n");
}

async function main() {
  const coverage = await readJson(COVERAGE_PATH);
  const testResults = await readJson(join(REPORTS_DIR, "test-results.json"));
  const load = await readJson(join(REPORTS_DIR, "load-test.json"));
  const audit = await readJson(join(REPORTS_DIR, "audit.json"));
  const quality = await readJson(join(REPORTS_DIR, "quality.json"));

  const pkg =
    (await readJson(join(CWD, "packages", "dna-cli", "package.json"))) ??
    (await readJson(join(CWD, "package.json")));

  const gates = {
    tests: testsGate(testResults),
    coverage: coverageGate(coverage),
    load: loadGate(load),
    audit: auditGate(audit),
    quality: qualityGate(quality),
  };

  const sources = [
    { path: sanitizePath(COVERAGE_PATH), present: coverage != null },
    { path: sanitizePath(join(REPORTS_DIR, "test-results.json")), present: testResults != null },
    { path: sanitizePath(join(REPORTS_DIR, "load-test.json")), present: load != null },
    { path: sanitizePath(join(REPORTS_DIR, "audit.json")), present: audit != null },
    { path: sanitizePath(join(REPORTS_DIR, "quality.json")), present: quality != null },
  ];

  const doc = {
    schemaVersion: SCHEMA_VERSION,
    tool: "dna-health-report",
    generatedAt: new Date().toISOString(),
    project: pkg ? { name: pkg.name, version: pkg.version } : null,
    commit: process.env.GITHUB_SHA
      ? { sha: process.env.GITHUB_SHA, ref: process.env.GITHUB_REF_NAME || process.env.GITHUB_REF || null }
      : null,
    status: overallStatus(gates),
    gates,
    sources,
  };

  await mkdir(REPORTS_DIR, { recursive: true });
  const jsonPath = join(REPORTS_DIR, "health-report.json");
  const mdPath = join(REPORTS_DIR, "health-report.md");
  await writeFile(jsonPath, JSON.stringify(doc, null, 2) + "\n");
  await writeFile(mdPath, buildMarkdown(doc));

  console.log(`Canonical health report: ${sanitizePath(jsonPath)} + ${sanitizePath(mdPath)}`);
  console.log(`Overall status: ${doc.status}`);

  // Mirror to the GitHub Step Summary when running in Actions.
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    try {
      await writeFile(summaryFile, buildMarkdown(doc) + "\n", { flag: "a" });
    } catch (err) {
      console.error(`Could not append Step Summary: ${err.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
