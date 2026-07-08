import { describe, it, expect } from "vitest";
import { generateNeuralNetwork } from "../src/generators/neural-network.js";

describe("neuralNetwork generator", () => {
  it("generates intents with required fields", () => {
    const network = generateNeuralNetwork({
      version: "0.1.0",
      projectId: "test",
      projectName: "test",
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
    });

    expect(network.version).toBe("0.1.0");
    expect(network.intents.build_frontend_component).toBeDefined();
    expect(network.intents.fix_runtime_error.requiredBehaviour).toContain(
      "runtime.behaviour.md",
    );
    expect(network.intents.create_pr.validationChecks).toContain("validate_behaviour");
    expect(Object.keys(network.intents).length).toBeGreaterThanOrEqual(10);
  });
});
