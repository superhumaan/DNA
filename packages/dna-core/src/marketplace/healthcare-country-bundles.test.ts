import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { runWizard } from "../wizard.js";
import { installKnowledgePackById } from "./install.js";
import {
  resolveHealthcareCountryBundlePackIds,
  HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS,
} from "./healthcare-country-bundles.js";
import { ALL_HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS } from "./catalog-wave-healthcare-country-support.js";
import { HEALTHCARE_APAC_DEEP_SUPPORT_PACKS } from "./catalog-wave-healthcare-apac.js";
import { resolveFoundationPackIds } from "./foundation.js";
import type { DnaConfig } from "@superhumaan/dna-config";

describe("healthcare country bundles", () => {
  it("resolves France bundle with support, EU, and compliance packs", () => {
    const bundle = resolveHealthcareCountryBundlePackIds("healthcare/overview-fr");
    expect(bundle).toContain("healthcare/overview-fr");
    expect(bundle).toContain("healthcare/fr-support");
    expect(bundle).toContain("healthcare/overview-eu");
    expect(bundle).toContain("healthcare/fhir-r4");
    expect(bundle).toContain("healthcare/mdr-eu");
    expect(bundle).toContain("compliance/gdpr");
    expect(bundle!.length).toBeGreaterThan(10);
  });

  it("returns null for non-country overview packs", () => {
    expect(resolveHealthcareCountryBundlePackIds("healthcare/fhir-r4")).toBeNull();
    expect(resolveHealthcareCountryBundlePackIds("healthcare/overview")).toBeNull();
  });

  it("has a support pack for every bundled country", () => {
    const allSupportIds = [
      ...ALL_HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS,
      ...HEALTHCARE_APAC_DEEP_SUPPORT_PACKS.map((p) => p.id),
    ];
    expect(allSupportIds.length).toBeGreaterThanOrEqual(45);
    for (const id of HEALTHCARE_COUNTRY_SUPPORT_PACK_IDS) {
      expect(allSupportIds).toContain(id);
    }
  });

  it("resolves Australia bundle with APAC regional packs and MHR support", () => {
    const bundle = resolveHealthcareCountryBundlePackIds("healthcare/overview-au");
    expect(bundle).toContain("healthcare/overview-apac");
    expect(bundle).toContain("healthcare/apac-support");
    expect(bundle).toContain("healthcare/au-support");
  });

  it("resolves Canada bundle with deep ca-support (not APAC regional)", () => {
    const bundle = resolveHealthcareCountryBundlePackIds("healthcare/overview-ca");
    expect(bundle).toContain("healthcare/ca-support");
    expect(bundle).not.toContain("healthcare/overview-apac");
  });

  it("installs France healthcare bundle including fr-support HDS topic", async () => {
    const root = join(tmpdir(), `dna-hc-fr-${randomUUID()}`);
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "hc-fr-test" }));

    await runWizard({
      root,
      answers: {
        projectDescription: "test",
        acceptRecommendation: true,
        aiTools: [],
        compliance: "none",
        stage: "new",
        installRuntime: false,
        configureGithub: false,
        configureAi: false,
      },
    });

    const { pack, bundleInstalled } = await installKnowledgePackById(root, "healthcare/overview-fr");
    expect(pack.id).toBe("healthcare/overview-fr");
    expect(bundleInstalled?.some((b) => b.pack.id === "healthcare/fr-support")).toBe(true);
    expect(bundleInstalled?.some((b) => b.pack.id === "compliance/gdpr")).toBe(true);

    const hds = await readFile(
      join(root, ".DNA", "knowledge", "healthcare/fr-support/hds.dna.md"),
      "utf-8",
    );
    expect(hds).toContain("HDS");

    const systems = await readFile(
      join(root, ".DNA", "knowledge", "healthcare/fr-support/systems-integrations.dna.md"),
      "utf-8",
    );
    expect(systems).toContain("Mon Espace Santé");
    expect(systems).toContain("Integration playbook");

    await rm(root, { recursive: true, force: true });
  });

  it("Australia bundle includes systems catalog and Epic/Cerner DNA packs", () => {
    const bundle = resolveHealthcareCountryBundlePackIds("healthcare/overview-au");
    expect(bundle).toContain("healthcare/cerner-oracle-health");
    expect(bundle).toContain("healthcare/redox");
  });

  it("resolves france alias to overview-fr bundle via foundation", () => {
    const config = {
      description: "French healthcare portal with DMP integration",
      stack: { frontend: "next", backend: "fastify" },
      autoUpdate: true,
      channel: "stable",
    } as DnaConfig;

    const packs = resolveFoundationPackIds(config);
    expect(packs).toContain("healthcare/fr-support");
    expect(packs).toContain("healthcare/overview-fr");
    expect(packs).toContain("compliance/gdpr");
  });
});
