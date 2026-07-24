import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findDnaByHumaanInstalls, summarizeDnaInstalls } from "./package-info.js";

describe("findDnaByHumaanInstalls", () => {
  it("detects root and nested backend installs with version drift", () => {
    const root = mkdtempSync(join(tmpdir(), "dna-installs-"));
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ name: "app", dependencies: { "@superhumaan/dna-by-humaan": "^0.6.14" } }),
    );
    mkdirSync(join(root, "node_modules", "@superhumaan", "dna-by-humaan", "dist"), { recursive: true });
    writeFileSync(
      join(root, "node_modules", "@superhumaan", "dna-by-humaan", "package.json"),
      JSON.stringify({ name: "@superhumaan/dna-by-humaan", version: "0.6.14" }),
    );
    writeFileSync(
      join(root, "node_modules", "@superhumaan", "dna-by-humaan", "dist", "lab.js"),
      "lab-batteries System performance",
    );

    mkdirSync(join(root, "backend"), { recursive: true });
    writeFileSync(
      join(root, "backend", "package.json"),
      JSON.stringify({ name: "backend", dependencies: { "@superhumaan/dna-by-humaan": "^0.6.11" } }),
    );
    mkdirSync(join(root, "backend", "node_modules", "@superhumaan", "dna-by-humaan", "dist"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "backend", "node_modules", "@superhumaan", "dna-by-humaan", "package.json"),
      JSON.stringify({ name: "@superhumaan/dna-by-humaan", version: "0.6.11" }),
    );
    writeFileSync(
      join(root, "backend", "node_modules", "@superhumaan", "dna-by-humaan", "dist", "lab.js"),
      "/* old */",
    );

    const installs = findDnaByHumaanInstalls(root);
    expect(installs).toHaveLength(2);
    expect(installs.map((i) => i.version).sort()).toEqual(["0.6.11", "0.6.14"]);

    const summary = summarizeDnaInstalls(root);
    expect(summary.multiVersion).toBe(true);
    expect(summary.staleCount).toBe(1);
    expect(summary.warnings.length).toBeGreaterThan(0);
  });
});
