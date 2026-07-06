import { describe, it, expect } from "vitest";
import { generateBehaviourFiles } from "../src/generators/behaviour.js";

const baseConfig = {
  version: "0.1.0",
  projectId: "test",
  projectName: "Test App",
  description: "A test application",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  stack: { frontend: "react", backend: "express", testing: "vitest" },
  compliance: "gdpr" as const,
  stage: "mvp" as const,
  aiTools: ["cursor" as const],
  autoUpdate: true,
  channel: "stable" as const,
  knowledgePacks: [],
};

describe("behaviour generator", () => {
  it("generates all behaviour files with DNA rules", () => {
    const files = generateBehaviourFiles(baseConfig);

    expect(files["ai.behaviour.md"]).toContain("neuralNetwork");
    expect(files["ai.behaviour.md"]).toContain("CellularMemory");
    expect(files["coding.behaviour.md"]).toContain("react");
    expect(files["security.behaviour.md"]).toContain("gdpr");
    expect(files["testing.behaviour.md"]).toContain("vitest");
    expect(Object.keys(files)).toHaveLength(6);
  });
});
