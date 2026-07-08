import { describe, it, expect } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  resolveReferenceProjects,
  formatReferencePath,
  formatCodeReference,
  DNA_REFERENCE_PROJECT_DEFS,
} from "./reference-projects.js";

describe("reference projects", () => {
  it("lists project defs without a reference root", async () => {
    const prev = process.env.DNA_REFERENCE_ROOT;
    delete process.env.DNA_REFERENCE_ROOT;

    const projects = await resolveReferenceProjects();
    expect(projects).toHaveLength(DNA_REFERENCE_PROJECT_DEFS.length);
    expect(projects[0]?.path).toBe(projects[0]?.repoDir);
    expect(projects[0]?.pathAvailable).toBe(false);
    expect(formatReferencePath(projects[0]!)).toContain("DNA_REFERENCE_ROOT");

    process.env.DNA_REFERENCE_ROOT = prev;
  });

  it("resolves paths under DNA_REFERENCE_ROOT when repos exist", async () => {
    const root = await mkdtemp(join(tmpdir(), "dna-ref-root-"));
    const aistudio = join(root, "AIStudio");
    await mkdir(aistudio, { recursive: true });
    await writeFile(join(aistudio, "package.json"), "{}");

    const projects = await resolveReferenceProjects(root);
    const aistudioProject = projects.find((p) => p.id === "aistudio");
    expect(aistudioProject?.path).toBe(aistudio);
    expect(aistudioProject?.pathAvailable).toBe(true);
    expect(formatReferencePath(aistudioProject!)).toBe(aistudio);
    expect(formatCodeReference(aistudioProject, "src/admin/AdminPortal.jsx")).toContain(aistudio);

    await rm(root, { recursive: true, force: true });
  });

  it("marks missing repos as unavailable", async () => {
    const root = await mkdtemp(join(tmpdir(), `dna-ref-missing-${randomUUID()}`));
    const projects = await resolveReferenceProjects(root);
    expect(projects.every((p) => !p.pathAvailable)).toBe(true);
    expect(formatReferencePath(projects[0]!)).toContain("not found");
    await rm(root, { recursive: true, force: true });
  });
});
