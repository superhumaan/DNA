import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { generateCompliancePlan, formatComplianceCatalog, parseFrameworksInput } from "./plan.js";

describe("compliance plan", () => {
  it("parses framework lists", () => {
    expect(parseFrameworksInput("gdpr, hipaa, iso27001")).toEqual(["gdpr", "hipaa", "iso27001"]);
  });

  it("lists tiers and frameworks in catalog", () => {
    const catalog = formatComplianceCatalog();
    expect(catalog).toContain("startup");
    expect(catalog).toContain("enterprise");
    expect(catalog).toContain("HIPAA");
    expect(catalog).toContain("ISO");
  });

  it("generates compliance plan and control matrix", async () => {
    const root = join(tmpdir(), `dna-compliance-${randomUUID()}`);
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "compliance-test" }));

    await runWizard({
      root,
      answers: {
        projectDescription: "Healthcare B2B SaaS",
        acceptRecommendation: true,
        aiTools: ["cursor"],
        compliance: "hipaa",
        stage: "scaling",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const result = await generateCompliancePlan({
      root,
      frameworks: ["gdpr", "hipaa"],
      quote: "EU customers plus US health data — what controls at SME tier?",
    });

    expect(result.tier).toBe("sme");
    expect(result.context).toContain("GDPR");
    expect(result.context).toContain("HIPAA");
    expect(result.context).toContain("Engineering rules");
    expect(result.planPath).toContain("compliance-gdpr-hipaa-sme.md");
    expect(result.matrixPath).toContain("compliance-control-matrix.md");

    const checklistPath = join(
      root,
      ".DNA",
      "CellularMemory",
      "prefrontalCortex",
      "gdpr-document-checklist.md",
    );
    const { readFile: readFileFs } = await import("node:fs/promises");
    const checklist = await readFileFs(checklistPath, "utf-8");
    expect(checklist).toContain("privacy-policy");
    expect(checklist).toContain("ROPA");

    const indexPath = join(root, ".DNA", "knowledge", "compliance/gdpr/examples/INDEX.md");
    const index = await readFile(indexPath, "utf-8");
    expect(index).toContain("UK GDPR required documents");

    await rm(root, { recursive: true, force: true });
  });
});
