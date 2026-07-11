import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { adviseLegal } from "./advisor.js";
import { generateLegalPlan, formatLegalCatalog, parseDomainsInput, parseJurisdictionsInput } from "./plan.js";
import { resolveLegalJurisdictionPackIds } from "./regions.js";

describe("legal advisor", () => {
  it("parses domain and jurisdiction lists", () => {
    expect(parseDomainsInput("privacy, banking, healthcare")).toEqual(["privacy", "banking", "healthcare"]);
    expect(parseJurisdictionsInput("sg, th, eu")).toEqual(["sg", "th", "eu"]);
  });

  it("lists domains and jurisdictions in catalog", () => {
    const catalog = formatLegalCatalog();
    expect(catalog).toContain("Privacy");
    expect(catalog).toContain("Singapore");
    expect(catalog).toContain("PDPA");
  });

  it("detects jurisdictions from description", () => {
    const packs = resolveLegalJurisdictionPackIds("Healthcare app for Singapore and Thailand markets");
    expect(packs).toContain("legal/regions/sg-pdpa");
    expect(packs).toContain("legal/regions/th-pdpa");
  });

  it("advises on banking and healthcare quote", () => {
    const result = adviseLegal({
      quote: "We want to launch a fintech app storing health records in Singapore",
      domains: ["banking", "healthcare", "privacy"],
      jurisdictions: ["sg"],
    });

    expect(result.domains).toContain("banking");
    expect(result.jurisdictions).toContain("sg");
    expect(result.brief).toContain("Singapore");
    expect(result.brief).toContain("Not legal advice");
    expect(result.engineeringRules.some((r) => r.includes("PCI"))).toBe(true);
  });

  it("generates legal plan and matrix", async () => {
    const root = join(tmpdir(), `dna-legal-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "legal-test" }));

    await runWizard({
      root,
      answers: {
        projectDescription: "Banking platform for Singapore with PDPA compliance",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "gdpr",
        stage: "scaling",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await generateLegalPlan({
      root,
      domains: ["banking", "privacy"],
      jurisdictions: ["sg"],
      quote: "Launch payment features in Singapore — what legal gates?",
    });

    expect(result.tier).toBe("sme");
    expect(result.context).toContain("Singapore");
    expect(result.context).toContain("banking");
    expect(result.planPath).toContain("legal-banking-privacy-sg-sme.md");
    expect(result.matrixPath).toContain("legal-considerations-matrix.md");

    await rm(root, { recursive: true, force: true });
  });
});
