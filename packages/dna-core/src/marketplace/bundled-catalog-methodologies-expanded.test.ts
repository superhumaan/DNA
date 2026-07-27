import { describe, expect, it } from "vitest";
import {
  COMPANY_SIZE_PACKS,
  INDUSTRY_METHODOLOGY_PACKS,
  METHODOLOGY_EXPANDED_PACKS,
  PROCESS_METHODOLOGY_PACKS,
} from "./bundled-catalog-methodologies-expanded.js";
import { METHODOLOGY_PACKS } from "./bundled-catalog-methodologies.js";

describe("methodology expansion", () => {
  it("ships company sizes across solo → enterprise spectrum", () => {
    const ids = COMPANY_SIZE_PACKS.map((p) => p.id);
    for (const id of [
      "companies/solo",
      "companies/startup",
      "companies/scale-up",
      "companies/sme",
      "companies/mid-market",
      "companies/enterprise",
      "companies/big-tech",
      "companies/agency",
      "companies/nonprofit",
      "companies/platform-marketplace",
    ]) {
      expect(ids).toContain(id);
    }
  });

  it("ships industry delivery overlays", () => {
    expect(INDUSTRY_METHODOLOGY_PACKS.length).toBeGreaterThanOrEqual(12);
    expect(
      INDUSTRY_METHODOLOGY_PACKS.some((p) => p.id === "methodologies/industry-healthcare"),
    ).toBe(true);
    expect(
      INDUSTRY_METHODOLOGY_PACKS.some((p) => p.id === "methodologies/industry-fintech"),
    ).toBe(true);
  });

  it("ships additional process methodologies", () => {
    const ids = PROCESS_METHODOLOGY_PACKS.map((p) => p.id);
    expect(ids).toContain("methodologies/lean-startup");
    expect(ids).toContain("methodologies/xp");
    expect(ids).toContain("methodologies/devops");
    expect(ids).toContain("methodologies/dual-track-agile");
  });

  it("jams expanded packs above stub depth (≥8 files, not stub-sized)", () => {
    for (const p of METHODOLOGY_EXPANDED_PACKS) {
      expect(p.files.length, p.id).toBeGreaterThanOrEqual(8);
      const chars = p.files.reduce((s, f) => s + (f.content?.length ?? 0), 0);
      expect(chars, p.id).toBeGreaterThan(700);
    }
  });

  it("includes expanded packs in METHODOLOGY_PACKS export", () => {
    expect(METHODOLOGY_PACKS.length).toBeGreaterThan(40);
    expect(METHODOLOGY_PACKS.some((p) => p.id === "companies/startup")).toBe(true);
    expect(METHODOLOGY_PACKS.filter((p) => p.id === "companies/startup")).toHaveLength(1);
  });
});
