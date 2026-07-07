import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { ensureKnowledgeInstalled, type EnsureKnowledgeResult } from "./ensure.js";
import { getArchetype } from "../stack/catalog.js";

export type AppPlatform = "web" | "mobile" | "desktop" | "cms";

export function detectAppPlatform(config: DnaConfig, scan?: ScanResult): AppPlatform {
  const archetype = config.stack.archetype ? getArchetype(config.stack.archetype) : undefined;
  if (archetype?.platform === "cms") return "cms";
  if (archetype?.platform === "mobile") return "mobile";

  const deps = (scan?.dependencies ?? []).join(" ").toLowerCase();
  if (
    deps.includes("react-native") ||
    deps.includes("expo") ||
    deps.includes("flutter") ||
    scan?.frontend === "react-native"
  ) {
    return "mobile";
  }
  if (deps.includes("electron") || deps.includes("tauri") || deps.includes("@tauri-apps")) {
    return "desktop";
  }
  if (deps.includes("ghost") || scan?.frontend === "ghost") return "cms";
  return "web";
}

/** Foundation marketplace packs from stack archetype + compliance (Layer 1). */
export function resolveFoundationPackIds(config: DnaConfig, scan?: ScanResult): string[] {
  const packs = new Set<string>(["disciplines/security", "compliance/tiered-standards"]);

  const archetype = getArchetype(config.stack.archetype ?? "react-vite-api");
  if (archetype) {
    for (const packId of archetype.knowledgePacks) {
      packs.add(packId);
    }
  }

  const platform = (config.stack.platform ?? "").toLowerCase();
  const desc = (config.description ?? "").toLowerCase();
  const isSaas =
    platform.includes("saas") ||
    platform.includes("b2b") ||
    desc.includes("saas") ||
    desc.includes("b2b") ||
    desc.includes("platform");

  if (isSaas && archetype?.id !== "ghost-cms") {
    packs.add("platforms/b2b-saas");
    packs.add("security/rbac-zero-trust");
    packs.add("payments/overview");
    packs.add("data/data-hq");
  }

  const needsPayments =
    desc.includes("billing") ||
    desc.includes("subscription") ||
    desc.includes("stripe") ||
    desc.includes("checkout") ||
    desc.includes("payment");
  if (needsPayments) {
    packs.add("payments/overview");
    packs.add("payments/stripe");
  }

  const needsDr =
    desc.includes("disaster") ||
    desc.includes("failover") ||
    desc.includes("multi-region") ||
    desc.includes("geo-replic") ||
    desc.includes("active-active") ||
    desc.includes("high availability");
  if (needsDr) {
    packs.add("data/disaster-recovery");
    packs.add("data/geo-replication");
    packs.add("data/data-hq");
  }

  const isHealthcare =
    desc.includes("healthcare") ||
    desc.includes("hipaa") ||
    desc.includes("fhir") ||
    desc.includes("ehr") ||
    desc.includes("clinical") ||
    desc.includes("patient") ||
    desc.includes("telehealth") ||
    config.compliance === "hipaa";
  if (isHealthcare) {
    packs.add("healthcare/overview");
    packs.add("healthcare/fhir-r4");
    packs.add("healthcare/phi-engineering");
    packs.add("healthcare/redox");
  }

  const isFintech =
    desc.includes("fintech") ||
    desc.includes("plaid") ||
    desc.includes("bank linking") ||
    desc.includes("kyc") ||
    desc.includes("aml");
  if (isFintech) {
    packs.add("payments/plaid");
    packs.add("payments/overview");
    packs.add("payments/onfido");
  }

  const isEcommerce =
    desc.includes("ecommerce") ||
    desc.includes("e-commerce") ||
    desc.includes("shopify") ||
    desc.includes("marketplace seller") ||
    desc.includes("online store");
  if (isEcommerce) {
    packs.add("ecommerce/shopify");
    packs.add("payments/stripe");
  }

  const isAiProduct =
    desc.includes("llm") ||
    desc.includes("rag") ||
    desc.includes("chatbot") ||
    desc.includes("ai product") ||
    desc.includes("generative ai") ||
    desc.includes("copilot");
  if (isAiProduct) {
    packs.add("ai/vercel-ai-sdk");
    packs.add("ai/rag-patterns");
    packs.add("ai/prompt-injection-defense");
    packs.add("ai/ai-evals");
  }

  const isGaming =
    desc.includes("game") || desc.includes("unity") || desc.includes("multiplayer") || desc.includes("steam");
  if (isGaming) {
    packs.add("gaming/unity");
    packs.add("gaming/multiplayer-authoritative");
  }

  const isSap = desc.includes("sap") || desc.includes("s/4hana") || desc.includes("erp");
  if (isSap) {
    packs.add("erp/sap");
    packs.add("integrations/workato");
  }

  const isIot =
    desc.includes("iot") || desc.includes("mqtt") || desc.includes("telemetry") || desc.includes("device fleet");
  if (isIot) {
    packs.add("iot/mqtt");
    packs.add("iot/aws-iot-core");
  }

  const isInsurance = desc.includes("insurance") || desc.includes("claims") || desc.includes("policy admin");
  if (isInsurance) {
    packs.add("insurance/guidewire");
    packs.add("insurance/claims-automation");
  }

  const isAws = desc.includes("aws") || desc.includes("amazon web services");
  if (isAws && isSaas) {
    packs.add("cloud/aws-overview");
    packs.add("cloud/aws-dr-playbook");
  }

  if (config.compliance === "gdpr") packs.add("compliance/gdpr");
  if (config.compliance === "soc2") packs.add("compliance/soc2");

  // Stack-specific from config layers
  if (config.stack.frontend === "next" || config.stack.frontend === "nextjs") {
    packs.add("frameworks/nextjs");
  }
  if (config.stack.backend === "fastify") packs.add("frameworks/fastify");
  if (config.stack.backend === "nestjs") packs.add("frameworks/nestjs");
  if (config.stack.backend === "express") packs.add("frameworks/express");
  if (config.stack.frontend === "react") packs.add("frameworks/react");

  const appPlatform = detectAppPlatform(config, scan);
  if (appPlatform === "desktop") packs.add("platforms/desktop-cross-platform");
  if (appPlatform === "mobile" && !packs.has("frameworks/react-native")) {
    packs.add("disciplines/mobile-development");
  }
  if (platform.includes("pwa") || desc.includes("pwa") || desc.includes("progressive web")) {
    packs.add("platforms/pwa");
  }

  if (appPlatform === "web" || archetype?.platform === "web") {
    packs.add("browsers/cross-browser");
    packs.add("disciplines/coding-trends-2025");
  }

  const isMultilingual =
    desc.includes("multilingual") ||
    desc.includes("i18n") ||
    desc.includes("l10n") ||
    desc.includes("locali") ||
    desc.includes("translation") ||
    desc.includes("tiếng việt") ||
    desc.includes("español") ||
    desc.includes("français") ||
    desc.includes("日本語") ||
    desc.includes("简体中文") ||
    desc.includes("العربية");

  if (isMultilingual) {
    packs.add("languages/stem-bridge");
  }

  return [...packs];
}

export async function installFoundationKnowledge(
  root: string,
  config: DnaConfig,
  scan?: ScanResult,
): Promise<EnsureKnowledgeResult> {
  if (!config.autoUpdate) {
    return { installed: [], refreshed: [], failed: [] };
  }
  const packIds = resolveFoundationPackIds(config, scan);
  return ensureKnowledgeInstalled(root, packIds, config.channel);
}
