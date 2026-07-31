import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  detectSkeletor,
  pullSkeletorData,
  formatSkeletorContextSection,
  formatSkeletorStatus,
  feedSkeletorToAi,
  isSkeletorPullEnabled,
} from "./index.js";

async function fakeSkeletorHome(): Promise<string> {
  const home = join(tmpdir(), `dna-sk-${randomUUID()}`);
  const prefs = join(home, "Library", "Application Support", "app.humaan.skeletor");
  await mkdir(join(prefs, "kit"), { recursive: true });
  await mkdir(join(prefs, "bridge"), { recursive: true });
  await writeFile(
    join(prefs, "settings.json"),
    JSON.stringify({
      projectsContainer: "/Users/me/Projects",
      dnaSetupComplete: true,
      onboardingComplete: true,
    }),
  );
  await writeFile(
    join(prefs, "kit", "manifest.json"),
    JSON.stringify({
      channel: "stable",
      dnaVersion: "0.6.22",
      stemsVersion: "8",
      stemCount: 103,
    }),
  );
  await writeFile(
    join(prefs, "bridge", "fleet.json"),
    JSON.stringify({
      version: 1,
      scannedAt: Date.now() - 60_000,
      containerPath: "/Users/me/Projects",
      phase: "full",
      analytics: {
        total: 2,
        withDna: 2,
        doctorFailing: 1,
        labIssues: 3,
        dirtyRepos: 1,
      },
      projects: [
        {
          name: "LabA",
          path: "/Users/me/Projects/LabA",
          hasDna: true,
          dnaVersion: "0.6.20",
          gitDirty: true,
          labIssueCount: 2,
          labDoctorOk: 4,
          labDoctorTotal: 5,
        },
        {
          name: "DNA",
          path: "/Users/me/Projects/DNA",
          hasDna: true,
          dnaVersion: "0.6.22",
          gitDirty: false,
          labIssueCount: 1,
          labDoctorOk: 5,
          labDoctorTotal: 5,
        },
      ],
      hotIssues: [{ title: "GET /error", severity: "high", projectName: "DNA", count: 12 }],
    }),
  );
  return home;
}

describe("skeletor bridge", () => {
  it("detects absence", async () => {
    const home = join(tmpdir(), `dna-sk-none-${randomUUID()}`);
    await mkdir(home, { recursive: true });
    const d = await detectSkeletor(home);
    expect(d.installed).toBe(false);
    await rm(home, { recursive: true, force: true });
  });

  it("pulls fleet when Skeletor is installed", async () => {
    const home = await fakeSkeletorHome();
    const pull = await pullSkeletorData({ home });
    expect(pull.detection.installed).toBe(true);
    expect(pull.settings?.projectsContainer).toBe("/Users/me/Projects");
    expect(pull.kit?.dnaVersion).toBe("0.6.22");
    expect(pull.fleet?.projects).toHaveLength(2);

    const section = formatSkeletorContextSection(pull);
    expect(section).toContain("Skeletor fleet");
    expect(section).toContain("LabA");
    expect(section).toContain("GET /error");

    expect(formatSkeletorStatus(pull)).toMatch(/installed/);
    await rm(home, { recursive: true, force: true });
  });

  it("respects opt-out", async () => {
    expect(isSkeletorPullEnabled({ skeletor: { enabled: false } })).toBe(false);
    const home = await fakeSkeletorHome();
    const pull = await pullSkeletorData({
      home,
      config: { skeletor: { enabled: false } },
    });
    expect(pull.enabled).toBe(false);
    expect(pull.fleet).toBeNull();
    expect(formatSkeletorContextSection(pull)).toBeNull();
    await rm(home, { recursive: true, force: true });
  });

  it("feeds CellularMemory for AI", async () => {
    const home = await fakeSkeletorHome();
    const root = join(tmpdir(), `dna-sk-feed-${randomUUID()}`);
    await mkdir(join(root, ".DNA"), { recursive: true });

    // Monkey-patch via HOME env is fragile — call feed with pull using home by
    // temporarily writing into the real detect path is not needed: feed uses pullSkeletorData
    // which reads HOMEDIR. Instead unit-test format+write path via feed after setting HOME.
    const prev = process.env.HOME;
    process.env.HOME = home;
    try {
      const written = await feedSkeletorToAi(root);
      expect(written).toBe(".DNA/CellularMemory/parietalLobe/skeletor-fleet.md");
      const { readFile } = await import("node:fs/promises");
      const body = await readFile(join(root, written!), "utf-8");
      expect(body).toContain("LabA");
    } finally {
      if (prev === undefined) delete process.env.HOME;
      else process.env.HOME = prev;
      await rm(root, { recursive: true, force: true });
      await rm(home, { recursive: true, force: true });
    }
  });
});
