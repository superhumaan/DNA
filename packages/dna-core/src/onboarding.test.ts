import { describe, it, expect } from "vitest";
import type { ScanResult } from "@superhumaan/dna-config";
import {
  detectAiTools,
  inferCompliance,
  inferProjectStage,
  onboardingFeatureOptions,
} from "./onboarding.js";

const baseScan: ScanResult = {
  ciCd: [],
  docker: false,
  envFiles: [],
  docs: [],
  aiRules: [],
  securityRisks: [],
  missingDocs: [],
  missingTests: false,
  dependencies: [],
  scripts: {},
  hasDna: false,
};

describe("onboarding", () => {
  it("defaults to cursor and claude", () => {
    expect(detectAiTools(baseScan)).toContain("cursor");
    expect(detectAiTools(baseScan)).toContain("claude_code");
  });

  it("detects copilot from scan", () => {
    const scan = { ...baseScan, aiRules: [".github/copilot-instructions.md"] };
    expect(detectAiTools(scan)).toContain("github_copilot");
  });

  it("infers compliance from description", () => {
    expect(inferCompliance("HIPAA healthcare app")).toBe("hipaa");
    expect(inferCompliance("B2B SaaS")).toBe("none");
  });

  it("infers project stage", () => {
    expect(inferProjectStage({ ...baseScan, frontend: "react", backend: "express" })).toBe("mvp");
    expect(inferProjectStage(baseScan)).toBe("new");
  });

  it("lists onboarding features from catalog", () => {
    const options = onboardingFeatureOptions();
    expect(options.length).toBeGreaterThan(4);
    expect(options.some((o) => o.id === "admin-portal")).toBe(true);
  });
});
