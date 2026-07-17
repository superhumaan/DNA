import { describe, it, expect } from "vitest";
import type { DnaConfig } from "@superhumaan/dna-config";
import { generateAiToolFiles } from "./ai-tools.js";
import { mockWizardAnswers } from "../test-helpers.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "ai-tools-test",
    projectName: "AI Tools Test",
    description: "A test project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: [],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("generateAiToolFiles", () => {
  it("writes Cursor rules and delivery pipeline for cursor", () => {
    const files = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["cursor"] }));
    expect(files[".cursor/rules/dna.mdc"]).toContain("DNA by Humaan");
    expect(files[".cursor/rules/dna.mdc"]).toContain("alwaysApply: true");
    expect(files[".cursor/rules/delivery-pipeline.mdc"]).toBeTruthy();
    expect(files["AGENTS.md"]).toContain("AI Tools Test");
  });

  it("writes CLAUDE.md with workbench section for claude_code", () => {
    const files = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["claude_code"] }));
    expect(files["CLAUDE.md"]).toContain("DNA by Humaan");
    expect(files["CLAUDE.md"]).toContain("dna context");
  });

  it("supports chatgpt, copilot, windsurf, and gemini targets", () => {
    const chatgpt = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["chatgpt"] }));
    expect(chatgpt[".dna-chatgpt-context.md"]).toBeTruthy();

    const copilot = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["github_copilot"] }));
    expect(copilot[".github/copilot-instructions.md"]).toBeTruthy();

    const windsurf = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["windsurf"] }));
    expect(windsurf[".windsurfrules"]).toBeTruthy();

    const gemini = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["gemini"] }));
    expect(gemini["GEMINI.md"]).toBeTruthy();
  });

  it("writes cursor + claude + copilot for the multiple target", () => {
    const files = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: ["multiple"] }));
    expect(files[".cursor/rules/dna.mdc"]).toBeTruthy();
    expect(files["CLAUDE.md"]).toBeTruthy();
    expect(files[".github/copilot-instructions.md"]).toBeTruthy();
  });

  it("falls back to defaults when no AI tool is selected", () => {
    const files = generateAiToolFiles(testConfig(), mockWizardAnswers({ aiTools: [] }));
    expect(files[".cursor/rules/dna.mdc"]).toBeTruthy();
    expect(files["CLAUDE.md"]).toBeTruthy();
    expect(files["AGENTS.md"]).toBeTruthy();
  });

  it("injects the agent-flow section when featureFactory is enabled", () => {
    const withFactory = generateAiToolFiles(
      testConfig(),
      mockWizardAnswers({ aiTools: ["cursor"] }),
      true,
    );
    const withoutFactory = generateAiToolFiles(
      testConfig(),
      mockWizardAnswers({ aiTools: ["cursor"] }),
      false,
    );
    expect(withFactory[".cursor/rules/dna.mdc"].length).toBeGreaterThan(
      withoutFactory[".cursor/rules/dna.mdc"].length,
    );
  });
});
