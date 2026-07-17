import { describe, expect, it } from "vitest";
import { DnaConfigSchema } from "./schemas.js";

function config(runtime?: Record<string, unknown>) {
  return {
    version: "0.1.0",
    projectId: "config-test",
    projectName: "Config Test",
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
    runtime,
  };
}

describe("DnaConfig runtime storage", () => {
  it("defaults to the truthful atomic JSON storage name", () => {
    expect(DnaConfigSchema.parse(config({ enabled: true })).runtime?.storage).toBe("json");
  });

  it("normalizes the historical sqlite label without breaking old configs", () => {
    expect(
      DnaConfigSchema.parse(config({ enabled: true, storage: "sqlite" })).runtime?.storage,
    ).toBe("json");
  });
});
