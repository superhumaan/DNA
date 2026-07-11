import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { detectImpressionsDrift } from "./drift.js";
import type { ScanResult } from "@superhumaan/dna-config";
import { runWizard } from "../wizard.js";
import { mockScan, mockWizardAnswers } from "../test-helpers.js";

const WIZARD_ANSWERS = mockWizardAnswers({
  projectDescription: "Drift test project",
});

describe("impressions drift", () => {
  it("detects missing docs and stack mismatch", async () => {
    const root = join(tmpdir(), `dna-drift-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(
      join(root, "package.json"),
      JSON.stringify({ name: "drift-test", version: "1.0.0", dependencies: { next: "^15.0.0" } }),
    );

    await runWizard({ root, answers: WIZARD_ANSWERS, nonInteractive: true });

    const scan: ScanResult = mockScan({
      frontend: "next",
      backend: "express",
      missingDocs: ["architecture/overview.md"],
      dependencies: ["next"],
      scripts: {},
      hasDna: true,
      hasSourceCode: true,
      fileCount: 1,
    });

    const report = await detectImpressionsDrift(root, scan);
    expect(report.score).toBeGreaterThan(0);
    expect(report.findings.some((f) => f.category === "docs")).toBe(true);

    await rm(root, { recursive: true, force: true });
  });
});
