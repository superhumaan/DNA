import { describe, it, expect } from "vitest";
import { PROMPT_STEM_DEFS, getPromptStemPacks, intelligenceStemPackEntries, generatePromptStemPackFiles } from "./index.js";
import { finalizeStemPack } from "./builder.js";
import { checkStemQualityBaseline } from "./stem-quality.js";
import { EXPO_STEM_DEFS, EXPO_STEM_IDS } from "./catalog-expo.js";
import { SURFACE_STEM_DEFS, SURFACE_STEM_IDS } from "./catalog-surfaces.js";

describe("prompt stem packs", () => {
  it("defines a large stem library", () => {
    expect(PROMPT_STEM_DEFS.length).toBeGreaterThanOrEqual(126);
  });

  it("has unique stem ids", () => {
    const ids = PROMPT_STEM_DEFS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("day-to-day stems meet baseline stem quality", () => {
    const dayToDayIds = [
      "plan-admin-portal",
      "ship-tauri-release",
      "build-analytics-dashboard",
      "plan-fleet-scan",
      "create-pr",
      "ship-preview",
      "trunk-based-delivery",
      "a11y-audit",
      "perf-audit",
      "incident-postmortem",
      "design-onboarding",
      "plan-mcp-server",
      "implement-i18n",
      "write-release-notes",
      "security-patch-deps",
      "visual-qa-pass",
    ];
    for (const id of dayToDayIds) {
      const def = PROMPT_STEM_DEFS.find((d) => d.id === id);
      expect(def, id).toBeDefined();
      expect(def?.slash).toBe(id);
      const quality = checkStemQualityBaseline(def!);
      expect(quality.ok, `${id}: ${quality.failures.join("; ")}`).toBe(true);
    }
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "plan-admin-portal")?.category).toBe("features");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "create-pr")?.category).toBe("delivery");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "a11y-audit")?.category).toBe("quality");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "incident-postmortem")?.category).toBe("debug");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "write-release-notes")?.category).toBe("docs");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "plan-fleet-scan")?.category).toBe("analysis");
  });

  it("includes strategy ladder stems", () => {
    for (const id of [
      "strategy-ladder",
      "golden-circle",
      "business-strategy-canvas",
      "product-canvas",
      "north-star-metric",
      "define-okrs",
      "define-kpis",
      "goal-cascade",
      "define-initiative",
      "define-product",
      "shape-feature",
      "roadmap-now-next-later",
    ]) {
      expect(PROMPT_STEM_DEFS.find((d) => d.id === id)?.category).toBe("strategy");
    }
  });

  it("includes product-intel stems with evidence grounding", () => {
    const intelIds = [
      "product-diagnose",
      "product-purpose-audit",
      "product-swot",
      "product-value-proposition",
      "product-kano-scan",
      "competitor-landscape",
      "competitor-feature-matrix",
      "competitor-positioning",
      "upgrade-leverage-map",
      "upgrade-modernization",
      "upgrade-recommend",
    ];
    for (const id of intelIds) {
      const def = PROMPT_STEM_DEFS.find((d) => d.id === id);
      expect(def?.category).toBe("strategy");
      expect(def?.tags).toContain("product-intel");
      expect(def?.guidelines.never.some((n) => /stub/i.test(n))).toBe(true);
      expect(def?.cliCommands.some((c) => c.includes("dna analyze"))).toBe(true);
    }
  });

  it("each stem has required files", () => {
    for (const def of PROMPT_STEM_DEFS) {
      const pack = finalizeStemPack(def);
      const paths = pack.files.map((f) => f.path);
      expect(paths).toContain("prompt.md");
      expect(paths).toContain("guidelines.md");
      expect(paths).toContain("expectations.md");
      expect(paths).toContain("context.md");
      expect(paths).toContain("examples.md");
      expect(pack.copyVariants.length).toBeGreaterThan(0);
    }
  });

  it("exports intelligence catalog entries", () => {
    const entries = intelligenceStemPackEntries();
    expect(entries.length).toBe(getPromptStemPacks().length);
    expect(entries.find((e) => e.id === "what-next-after-analyze")).toBeDefined();
    expect(entries.find((e) => e.id === "analyze-project")?.copyVariants.length).toBeGreaterThan(0);
    expect(entries.find((e) => e.id === "golden-circle")).toBeDefined();
    expect(entries.find((e) => e.id === "roadmap-now-next-later")?.slash).toBe("roadmap-now-next-later");
    expect(entries.find((e) => e.id === "define-okrs")?.slash).toBe("define-okrs");
    expect(entries.find((e) => e.id === "define-kpis")?.slash).toBe("define-kpis");
    expect(entries.find((e) => e.id === "product-diagnose")?.slash).toBe("product-diagnose");
    expect(entries.find((e) => e.id === "upgrade-recommend")?.slash).toBe("upgrade-recommend");
    expect(entries.find((e) => e.id === "expo-architect")?.slash).toBe("expo-architect");
    expect(entries.find((e) => e.id === "expo-dynamic-builds")?.slash).toBe("expo-dynamic-builds");
    expect(entries.find((e) => e.id === "expo-bff")?.slash).toBe("expo-bff");
  });

  it("expo / react-native stems meet baseline stem quality", () => {
    expect(EXPO_STEM_DEFS.map((d) => d.id)).toEqual([...EXPO_STEM_IDS]);
    expect(EXPO_STEM_DEFS.length).toBe(23);
    for (const id of EXPO_STEM_IDS) {
      const def = PROMPT_STEM_DEFS.find((d) => d.id === id);
      expect(def, id).toBeDefined();
      expect(def?.slash).toBe(id);
      expect(def?.tags).toContain("expo");
      expect(def?.tags).toContain("react-native");
      const quality = checkStemQualityBaseline(def!);
      expect(quality.ok, `${id}: ${quality.failures.join("; ")}`).toBe(true);
    }
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-architect")?.category).toBe("analysis");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-bff")?.category).toBe("features");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-dynamic-builds")?.category).toBe("delivery");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-ios-ship")?.category).toBe("delivery");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-android-ship")?.category).toBe("delivery");
    expect(PROMPT_STEM_DEFS.find((d) => d.id === "expo-perf-mobile")?.category).toBe("quality");
  });

  it("surface stems are generic workflows with no borrowed product identity", () => {
    const banned =
      /\b(invitrace|fourty|skeletor|colorparty|atlantis|humaan|grab-merch|aistudio|ai-studio|ai-commander|ai-controller|bleep|joli)\b/i;
    expect(SURFACE_STEM_DEFS.map((d) => d.id)).toEqual([...SURFACE_STEM_IDS]);
    for (const id of SURFACE_STEM_IDS) {
      const def = PROMPT_STEM_DEFS.find((d) => d.id === id);
      expect(def, id).toBeDefined();
      expect(def?.slash).toBe(id);
      const quality = checkStemQualityBaseline(def!);
      expect(quality.ok, `${id}: ${quality.failures.join("; ")}`).toBe(true);
      const blob = JSON.stringify(def);
      expect(blob, id).not.toMatch(banned);
    }
  });

  it("writes Claude slash commands with YAML frontmatter then a heading", () => {
    const files = generatePromptStemPackFiles({
      version: "0.1.0",
      projectId: "test",
      projectName: "Test",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      stack: {},
      compliance: "none",
      stage: "new",
      aiTools: ["cursor"],
      autoUpdate: true,
      channel: "stable",
      knowledgePacks: [],
      platformFeatures: [],
    });
    const claude = files[".claude/commands/expo-bff.md"];
    expect(claude).toMatch(/^---\n/);
    expect(claude).toContain("\n---\n# Expo backend for frontend");
    expect(JSON.parse(files[".DNA/stems/index.json"]).catalogVersion).toBe(10);
    expect(JSON.parse(files[".DNA/stems/index.json"]).count).toBe(PROMPT_STEM_DEFS.length);
  });
});
