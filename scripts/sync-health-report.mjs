#!/usr/bin/env node
/**
 * Map DNA's canonical engineering health report into the sanitized public
 * DNA-Web `/health` schema and write it into the active DNA-Web checkout.
 *
 * Usage:
 *   node scripts/sync-health-report.mjs
 *   DNA_WEB_ROOT="../DNA-Web" node scripts/sync-health-report.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DNA_WEB_ROOT = process.env.DNA_WEB_ROOT ?? join(ROOT, "..", "DNA-Web");
const SOURCE =
  process.env.DNA_HEALTH_REPORT ?? join(ROOT, ".dna-reports", "health-report.json");
const OUT = join(DNA_WEB_ROOT, "apps", "web", "public", "health", "v1", "report.json");
const MARKDOWN_OUT = join(ROOT, "docs", "quality-assurance", "test-results", "latest.md");

function mapStatus(status) {
  if (status === "pass") return "pass";
  if (status === "fail") return "fail";
  return "risk";
}

function check(id, label, gate, detail) {
  return {
    id,
    label,
    status: gate?.available ? mapStatus(gate.status) : "risk",
    detail,
  };
}

function detailFor(gate, availableText, missingText) {
  return gate?.available ? availableText : missingText;
}

async function main() {
  if (!existsSync(SOURCE)) {
    throw new Error(`Canonical health report missing: ${SOURCE}. Run pnpm run health:report first.`);
  }

  const raw = JSON.parse(await readFile(SOURCE, "utf-8"));
  const cliPkg = JSON.parse(
    await readFile(join(ROOT, "packages", "dna-cli", "package.json"), "utf-8"),
  );
  const g = raw.gates ?? {};
  const version = cliPkg.version;
  const overall = mapStatus(raw.status);

  const checks = [
    check(
      "tests",
      "Unit tests",
      g.tests,
      detailFor(
        g.tests,
        `${g.tests?.passed ?? 0}/${g.tests?.total ?? 0} tests passed`,
        "Unit test evidence was not available for this snapshot.",
      ),
    ),
    check(
      "coverage",
      "Product-critical coverage",
      g.coverage,
      detailFor(
        g.coverage,
        `${g.coverage?.linesPct ?? "—"}% lines (threshold ${g.coverage?.threshold ?? 80}%, per-file gate)`,
        "Coverage evidence was not available for this snapshot.",
      ),
    ),
    check(
      "load",
      "Lab capacity",
      g.load,
      detailFor(
        g.load,
        `${g.load?.users ?? "—"} concurrent viewers · p95 ${g.load?.p95Ms ?? "—"}ms · ${g.load?.throughputRps ?? "—"} req/s · ${g.load?.errors ?? "—"} errors`,
        "Load-test evidence was not available for this snapshot.",
      ),
    ),
    check(
      "security",
      "Dependency audit",
      g.audit,
      detailFor(
        g.audit,
        `critical ${g.audit?.vulnerabilities?.critical ?? 0} · high ${g.audit?.vulnerabilities?.high ?? 0} · moderate ${g.audit?.vulnerabilities?.moderate ?? 0}`,
        "Dependency audit evidence was not available for this snapshot.",
      ),
    ),
    check(
      "quality",
      "Code quality (SAST)",
      g.quality,
      detailFor(
        g.quality,
        `gate ${g.quality?.gate ?? "unknown"} · ${g.quality?.filesScanned ?? "?"} files scanned`,
        "Quality/SAST evidence was not available for this snapshot.",
      ),
    ),
  ];

  const publicReport = {
    schemaVersion: "1.0.0",
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    project: {
      name: "DNA by Humaan",
      version,
      repository: "https://github.com/superhumaan/DNA",
    },
    summary: {
      status: overall,
      headline:
        overall === "pass"
          ? "Published release checks are healthy"
          : overall === "fail"
            ? "One or more release checks failed"
            : "Release checks are available with residual risk",
      description:
        "This sanitized snapshot contains only public release signals from DNA's canonical health report. It does not expose private CI logs, runtime events, source paths, or DNA Lab session data.",
    },
    checks,
    links: {
      repository: "https://github.com/superhumaan/DNA",
      releases: "https://github.com/superhumaan/DNA/releases",
      issues: "https://github.com/superhumaan/DNA/issues",
    },
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(publicReport, null, 2) + "\n", "utf-8");
  console.log(`✓ Public health report → ${OUT}`);

  if (existsSync(join(ROOT, ".dna-reports", "health-report.md"))) {
    const md = await readFile(join(ROOT, ".dna-reports", "health-report.md"), "utf-8");
    await mkdir(dirname(MARKDOWN_OUT), { recursive: true });
    await writeFile(
      MARKDOWN_OUT,
      [
        "# Latest test results",
        "",
        "Canonical machine-readable source: `.dna-reports/health-report.json`.",
        "Public site snapshot: https://dna.humaan.app/health",
        "",
        md.trim(),
        "",
      ].join("\n"),
      "utf-8",
    );
    console.log(`✓ Docs latest results → ${MARKDOWN_OUT}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
