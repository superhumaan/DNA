import { describe, it, expect } from "vitest";
import { generateImpressions } from "../src/generators/impressions.js";
import { generateRecommendation } from "../src/recommend.js";

describe("impressions generator", () => {
  it("generates product and architecture docs", () => {
    const config = {
      version: "0.1.0",
      projectId: "saas-app",
      projectName: "SaaS App",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stack: { frontend: "react", backend: "express", database: "postgresql" },
      compliance: "soc2" as const,
      stage: "scaling" as const,
      aiTools: [],
      autoUpdate: true,
      channel: "stable" as const,
      knowledgePacks: [],
    };

    const rec = generateRecommendation(
      { ciCd: [], docker: false, envFiles: [], docs: [], aiRules: [], securityRisks: [], missingDocs: [], missingTests: false, dependencies: [], scripts: {}, hasDna: false },
      "B2B SaaS productivity platform",
    );

    const impressions = generateImpressions(
      config,
      {
        projectDescription: "B2B SaaS productivity platform",
        acceptRecommendation: true,
        aiTools: [],
        compliance: "soc2",
        stage: "scaling",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
      rec,
    );

    expect(impressions["product/product-overview.md"]).toContain("B2B SaaS");
    expect(impressions["architecture/solution-architecture.md"]).toContain("react");
    expect(impressions["security/security-baseline.md"]).toContain("soc2");
    expect(Object.keys(impressions).length).toBeGreaterThanOrEqual(15);
  });
});
