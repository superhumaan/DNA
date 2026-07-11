import { describe, it, expect } from "vitest";
import { detectHosting, supportsPreviewDeploy } from "./hosting.js";
import type { ScanResult } from "@superhumaan/dna-config";

function scan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
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
    fileCount: 0,
    hasPackageJson: true,
    hasSourceCode: true,
    ...overrides,
  };
}

describe("detectHosting", () => {
  it("detects docker/ecr without guessing vercel", () => {
    expect(
      detectHosting(scan({ docker: true }), [
        "Dockerfile",
        ".github/workflows/deploy-ecr.yml",
      ]),
    ).toBe("aws-ecr");
  });

  it("detects vercel from vercel.json", () => {
    expect(detectHosting(scan(), ["vercel.json", "package.json"])).toBe("vercel");
  });

  it("returns undefined when no hosting signals", () => {
    expect(detectHosting(scan({ dependencies: ["react", "vite", "express"] }), ["package.json"])).toBeUndefined();
  });

  it("only enables preview for vercel/netlify", () => {
    expect(supportsPreviewDeploy("vercel")).toBe(true);
    expect(supportsPreviewDeploy("docker")).toBe(false);
    expect(supportsPreviewDeploy(undefined)).toBe(false);
  });
});
