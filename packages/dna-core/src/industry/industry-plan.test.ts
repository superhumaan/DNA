import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { writeJsonFile } from "../fs.js";
import { DNA_CONFIG_FILE } from "@superhumaan/dna-config";
import { generateIndustryPlan } from "./plan.js";
import { generateIndustryContext } from "./context.js";

describe("industry plan and context", () => {
  let root: string;

  beforeEach(async () => {
    root = join(tmpdir(), `dna-industry-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await mkdir(join(root, ".DNA"), { recursive: true });
    await mkdir(join(root, ".DNA", "marketplace"), { recursive: true });
    await writeJsonFile(join(root, DNA_CONFIG_FILE), {
      version: "0.1.0",
      projectId: "industry-test",
      projectName: "Industry Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stack: { frontend: "react", backend: "node", database: "postgres" },
      compliance: "gdpr",
      stage: "mvp",
      aiTools: ["cursor"],
      platformFeatures: [],
    });
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("generates industry plan and sets config", async () => {
    const result = await generateIndustryPlan({ root, sector: "healthcare", clientName: "Acme Health" });
    expect(result.sector).toBe("healthcare");
    expect(result.context).toContain("Healthcare");
    expect(result.context).toContain("Acme Health");

    const { loadDnaConfig } = await import("../validator.js");
    const config = await loadDnaConfig(root);
    expect(config?.industry?.active).toBe("healthcare");
    expect(config?.industry?.clientName).toBe("Acme Health");
  });

  it("generates industry context when active", async () => {
    await generateIndustryPlan({ root, sector: "fintech" });
    const context = await generateIndustryContext(root);
    expect(context).toContain("Fintech");
    expect(context).toContain("fintech");
  });

  it("context advises when no industry set", async () => {
    const context = await generateIndustryContext(root);
    expect(context).toContain("No active industry");
    expect(context).toContain("dna plan industry");
  });
});
