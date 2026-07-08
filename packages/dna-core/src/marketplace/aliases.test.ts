import { describe, it, expect } from "vitest";
import {
  normalizePackId,
  normalizeKnowledgePath,
  PACK_ID_ALIASES,
} from "./aliases.js";
import {
  resolvePackIdsForKnowledgePaths,
  resetKnowledgePathIndex,
} from "./resolve.js";
import { getBundledPack } from "./bundled-catalog.js";

describe("marketplace aliases", () => {
  it("maps retired pack IDs to current IDs", () => {
    expect(normalizePackId("platforms/humaan-stack")).toBe("platforms/dna-stack");
    expect(normalizePackId("platforms/dna-stack")).toBe("platforms/dna-stack");
  });

  it("maps retired knowledge paths to current paths", () => {
    expect(normalizeKnowledgePath("platforms/humaan/admin-portal.dna.md")).toBe(
      "platforms/dna/admin-portal.dna.md",
    );
    expect(normalizeKnowledgePath("/platforms/dna/audit.dna.md")).toBe(
      "platforms/dna/audit.dna.md",
    );
  });

  it("resolves legacy knowledge paths to dna-stack pack", () => {
    resetKnowledgePathIndex();
    const packs = resolvePackIdsForKnowledgePaths([
      "platforms/humaan/rbac-patterns.dna.md",
    ]);
    expect(packs).toContain("platforms/dna-stack");
  });

  it("finds bundled pack by retired ID", () => {
    const pack = getBundledPack("platforms/humaan-stack");
    expect(pack?.id).toBe("platforms/dna-stack");
  });

  it("documents all aliases", () => {
    expect(Object.keys(PACK_ID_ALIASES).length).toBeGreaterThan(0);
  });
});
