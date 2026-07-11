import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { exportCellularMemory, importCellularMemory } from "./sync.js";

const WIZARD_ANSWERS = {
  projectDescription: "Memory sync test",
  acceptRecommendation: true,
  aiTools: ["cursor"] as const,
  compliance: "none" as const,
  stage: "mvp" as const,
  installRuntime: false,
  installFeatureFactory: false,
  installCi: false,
  configureGithub: false,
  configureAi: false,
};

describe("CellularMemory sync", () => {
  it("exports and imports memory segments", async () => {
    const rootA = join(tmpdir(), `dna-mem-a-${randomUUID()}`);
    const rootB = join(tmpdir(), `dna-mem-b-${randomUUID()}`);

    await mkdir(rootA, { recursive: true });
    await mkdir(rootB, { recursive: true });
    await writeFile(join(rootA, "package.json"), JSON.stringify({ name: "mem-a", version: "1.0.0" }));
    await writeFile(join(rootB, "package.json"), JSON.stringify({ name: "mem-b", version: "1.0.0" }));

    await runWizard({ root: rootA, answers: WIZARD_ANSWERS, nonInteractive: true });
    await runWizard({ root: rootB, answers: WIZARD_ANSWERS, nonInteractive: true });

    const exportPath = join(rootA, "memory-export.json");
    const exported = await exportCellularMemory({ root: rootA, outPath: exportPath, segments: ["hippocampus"] });
    expect(exported.fileCount).toBeGreaterThan(0);

    const imported = await importCellularMemory({ root: rootB, inPath: exportPath, merge: true });
    expect(imported.imported + imported.merged).toBeGreaterThan(0);

    const summary = await readFile(join(rootB, ".DNA", "CellularMemory", "hippocampus", "project-summary.md"), "utf-8");
    expect(summary).toContain("Project Summary");

    await rm(rootA, { recursive: true, force: true });
    await rm(rootB, { recursive: true, force: true });
  });
});
