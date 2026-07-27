import { describe, expect, it } from "vitest";
import { AGILE_FAMILY_PACKS } from "./bundled-catalog-agile-family.js";
import { METHODOLOGY_PACKS } from "./bundled-catalog-methodologies.js";
import { meetsRichnessBar, RICHNESS_MIN_FILES } from "./pack-richness.js";

describe("agile family", () => {
  it("includes Scrum, LeSS, and companions", () => {
    const ids = new Set(AGILE_FAMILY_PACKS.map((p) => p.id));
    for (const id of [
      "methodologies/scrum",
      "methodologies/less",
      "methodologies/less-huge",
      "methodologies/kanban",
      "methodologies/safe",
      "methodologies/nexus",
      "methodologies/scrum-at-scale",
      "methodologies/scrum-of-scrums",
      "methodologies/definition-of-done",
      "methodologies/user-stories",
      "methodologies/estimation-planning-poker",
      "methodologies/wsjf",
      "methodologies/tdd",
      "methodologies/bdd",
      "methodologies/pair-mob-programming",
      "methodologies/okr-delivery",
      "methodologies/shape-up",
      "methodologies/spotify-model",
    ]) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it("jams each agile pack to richness bar (≥16 files + assets)", () => {
    for (const p of AGILE_FAMILY_PACKS) {
      expect(p.files.length, p.id).toBeGreaterThanOrEqual(RICHNESS_MIN_FILES);
      expect(meetsRichnessBar(p, 2500), p.id).toBe(true);
      expect(
        p.files.some((f) => f.path.includes("/assets/diagrams/")),
        p.id,
      ).toBe(true);
      expect(
        p.files.some((f) => f.path.includes("/assets/fixtures/")),
        p.id,
      ).toBe(true);
    }
  });

  it("exports unique methodology ids (no thin duplicates)", () => {
    const meth = METHODOLOGY_PACKS.filter((p) => p.id.startsWith("methodologies/"));
    const seen = new Set<string>();
    for (const p of meth) {
      expect(seen.has(p.id), `duplicate ${p.id}`).toBe(false);
      seen.add(p.id);
    }
    const scrum = METHODOLOGY_PACKS.find((p) => p.id === "methodologies/scrum");
    expect(scrum?.files.length ?? 0).toBeGreaterThanOrEqual(RICHNESS_MIN_FILES);
  });
});
