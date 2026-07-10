import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import {
  DNA_AI_COMMAND_CATALOG,
  DNA_COMMAND_PACKAGE_PATHS,
  formatAiCommandsCatalog,
  generateAiCommandFiles,
  installAiCommands,
  uninstallAiCommands,
  intelligenceCatalogJson,
} from "./ai-commands.js";
import { enrichCommandSpec } from "./ai-command-specs.js";

function testConfig(): DnaConfig {
  return {
    version: "0.1.0",
    projectId: "test-project",
    projectName: "Test Project",
    description: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stack: {},
    compliance: "none",
    stage: "new",
    aiTools: ["cursor", "claude_code"],
    autoUpdate: true,
    channel: "stable",
    knowledgePacks: [],
    platformFeatures: [],
  };
}

describe("ai commands", () => {
  it("generates detailed cursor and claude command files", () => {
    const files = generateAiCommandFiles(testConfig());
    const commandFiles = DNA_AI_COMMAND_CATALOG.length * 2;
    const packageFiles = DNA_COMMAND_PACKAGE_PATHS.length;
    expect(Object.keys(files).length).toBe(commandFiles + packageFiles);

    const doctorCursor = files[".cursor/commands/dna-doctor.md"];
    expect(doctorCursor).toContain("Mandatory behaviour — OBEY");
    expect(doctorCursor).toContain("Forbidden — NEVER");
    expect(doctorCursor).toContain("npx dna doctor");
    expect(doctorCursor.length).toBeGreaterThan(800);

    const doctorClaude = files[".claude/commands/dna-doctor.md"];
    expect(doctorClaude).toContain("disable-model-invocation: true");
    expect(doctorClaude).toContain("allowed-tools:");

    expect(files[".cursor/skills/dna-cli/SKILL.md"]).toContain("Absolute rules");
    expect(files[".cursor/rules/dna-cli-commands.mdc"]).toContain("alwaysApply: true");
    expect(files[".claude/skills/dna-cli/workflows.md"]).toContain("Hard gates");
  });

  it("enriches specs with category defaults and overrides", () => {
    const spec = enrichCommandSpec(DNA_AI_COMMAND_CATALOG[0]);
    expect(spec.mustDo.some((m) => m.includes("real CLI"))).toBe(true);
    expect(spec.relatedCommands).toContain("dna-init");
  });

  it("formats catalog for CLI list output", () => {
    const text = formatAiCommandsCatalog();
    expect(text).toContain("command packages");
    expect(text).toContain("/dna-doctor");
    expect(text).toContain(`Total: ${DNA_AI_COMMAND_CATALOG.length}`);
  });

  it("exports JSON catalog v2 for DNA-Web", () => {
    const json = JSON.parse(intelligenceCatalogJson());
    expect(json.version).toBe(2);
    expect(json.packages.cursor.skill).toContain("skills/dna-cli");
    expect(json.commands[0].mustDo.length).toBeGreaterThan(0);
  });

  it("installs and uninstalls command packages", async () => {
    const root = join(tmpdir(), `dna-cmd-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "test" }));

    const installed = await installAiCommands(root, testConfig());
    expect(installed.length).toBeGreaterThan(DNA_AI_COMMAND_CATALOG.length * 2);
    expect(await fileExists(join(root, ".cursor/skills/dna-cli/SKILL.md"))).toBe(true);
    expect(await fileExists(join(root, ".cursor/rules/dna-cli-commands.mdc"))).toBe(true);
    expect(await fileExists(join(root, ".claude/skills/dna-cli/SKILL.md"))).toBe(true);

    const removed = await uninstallAiCommands(root);
    expect(removed.length).toBeGreaterThan(0);
    expect(await fileExists(join(root, ".cursor/commands/dna-analyze.md"))).toBe(false);
    expect(await fileExists(join(root, ".cursor/skills/dna-cli/SKILL.md"))).toBe(false);
  });
});
