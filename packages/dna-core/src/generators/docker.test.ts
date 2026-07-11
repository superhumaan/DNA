import { describe, it, expect } from "vitest";
import {
  generateDockerfile,
  generateDockerignore,
} from "./docker.js";
import { mockScan } from "../test-helpers.js";

describe("docker generator", () => {
  it("generates multi-stage Dockerfile with non-root user", () => {
    const dockerfile = generateDockerfile(
      mockScan({
        packageManager: "pnpm",
        scripts: { build: "vite build", start: "node dist/index.js" },
        hasDna: true,
      }),
    );

    expect(dockerfile).toContain("FROM node:22-alpine");
    expect(dockerfile).toContain("USER nodejs");
    expect(dockerfile).toContain("pnpm install");
  });

  it("generates dockerignore excluding DNA local data", () => {
    const ignore = generateDockerignore();
    expect(ignore).toContain(".DNA/data");
    expect(ignore).toContain("node_modules");
  });
});
