import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  runQualityAnalysis,
  writeQualityReport,
  slugifyFeature,
} from "./analyze.js";
import { formatQualityReportMarkdown } from "./report.js";

async function scaffoldProject(root: string, files: Record<string, string>) {
  await mkdir(root, { recursive: true });
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ name: "test", scripts: {} }),
  );
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel);
    await mkdir(join(full, ".."), { recursive: true });
    await writeFile(full, content);
  }
}

describe("quality analyzer", () => {
  it("slugifies feature names", () => {
    expect(slugifyFeature("Add Billing with Stripe!")).toBe("add-billing-with-stripe");
    expect(slugifyFeature("   ")).toBe("feature");
  });

  it("detects hardcoded secrets and eval", async () => {
    const root = join(tmpdir(), `dna-quality-${randomUUID()}`);
    await scaffoldProject(root, {
      "src/auth.ts": `const api_key = "sk_live_abcdefghijklmnop";\neval("bad");\n`,
    });

    const report = await runQualityAnalysis({
      root,
      projectName: "Test",
      runToolchain: false,
    });

    const rules = report.issues.map((i) => i.rule);
    expect(rules).toContain("hardcoded-secret");
    expect(rules).toContain("eval-usage");
    expect(report.gate).toBe("fail");
  });

  it("writes markdown report with gate status", async () => {
    const root = join(tmpdir(), `dna-quality-${randomUUID()}`);
    await scaffoldProject(root, {
      "src/clean.ts": "export const x = 1;\n",
    });

    const report = await runQualityAnalysis({
      root,
      projectName: "Clean Project",
      featureSlug: "clean-feature",
      runToolchain: false,
    });

    const md = formatQualityReportMarkdown(report);
    expect(md).toContain("Quality gate");
    expect(md).toContain("Clean Project");

    const { reportPath } = await writeQualityReport(root, report);
    expect(reportPath).toBe(".DNA/reports/quality/clean-feature.md");
  });

  it("flags missing test files in feature scope paths", async () => {
    const root = join(tmpdir(), `dna-quality-${randomUUID()}`);
    await scaffoldProject(root, {
      "src/widget.ts": "export function widget() { return 1; }\n",
    });

    const report = await runQualityAnalysis({
      root,
      projectName: "Test",
      paths: ["src/widget.ts"],
      runToolchain: false,
    });

    expect(report.issues.some((i) => i.rule === "missing-test-file")).toBe(true);
  });
});
