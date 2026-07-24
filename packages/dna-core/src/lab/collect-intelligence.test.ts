import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectLabIntelligence, LAB_INTELLIGENCE_FILE_CAP } from "./collect-intelligence.js";

describe("collectLabIntelligence", () => {
  let root = "";

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
    root = "";
  });

  it("lists impressions and cellular memory markdown paths", () => {
    root = mkdtempSync(join(tmpdir(), "dna-lab-intel-"));
    mkdirSync(join(root, "DNA", "Impressions", "architecture"), { recursive: true });
    mkdirSync(join(root, ".DNA", "CellularMemory", "hippocampus"), { recursive: true });
    writeFileSync(join(root, "DNA", "Impressions", "architecture", "solution.md"), "# a\n");
    writeFileSync(join(root, ".DNA", "CellularMemory", "hippocampus", "recent-changes.md"), "# m\n");
    writeFileSync(join(root, "DNA", "Impressions", "skip.txt"), "nope");

    const data = collectLabIntelligence(root);
    expect(data.impressions.map((f) => f.path)).toEqual(["DNA/Impressions/architecture/solution.md"]);
    expect(data.cellularMemory.map((f) => f.path)).toEqual([
      ".DNA/CellularMemory/hippocampus/recent-changes.md",
    ]);
    expect(data.impressions[0]?.kind).toBe("impression");
    expect(data.cellularMemory[0]?.kind).toBe("memory");
  });

  it("caps file walks", () => {
    root = mkdtempSync(join(tmpdir(), "dna-lab-intel-cap-"));
    const dir = join(root, "DNA", "Impressions");
    mkdirSync(dir, { recursive: true });
    for (let i = 0; i < LAB_INTELLIGENCE_FILE_CAP + 25; i += 1) {
      writeFileSync(join(dir, `doc-${String(i).padStart(3, "0")}.md`), "#\n");
    }
    const data = collectLabIntelligence(root);
    expect(data.impressions).toHaveLength(LAB_INTELLIGENCE_FILE_CAP);
  });
});
