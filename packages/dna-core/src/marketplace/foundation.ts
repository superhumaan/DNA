import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { ensureKnowledgeInstalled, type EnsureKnowledgeResult } from "./ensure.js";
import { getArchetype } from "../stack/catalog.js";
import { HEALTHCARE_ALL_OVERVIEW_PACK_IDS } from "./healthcare-country-bundles.js";
import { resolveLegalJurisdictionPackIds } from "../legal/regions.js";
import { resolveHealthcareCountryBundlePackIds } from "./healthcare-country-bundles.js";
import { DISCOVERY_FOUNDATION_PACK_IDS } from "@superhumaan/dna-config";

export type AppPlatform = "web" | "mobile" | "desktop" | "cms";

/** Map project description keywords to country-specific healthcare overview stem packs. */
export function resolveHealthcareCountryOverviewPackIds(description: string): string[] {
  const d = description.toLowerCase();
  const matches = new Set<string>();

  const rules: Array<{ pack: string; patterns: RegExp[] }> = [
    { pack: "healthcare/overview-us", patterns: [/\b(us|usa|united states|american)\b/, /\bhipaa\b/, /\b(epic|cerner|cms|medicare|medicaid)\b/, /\btefca\b/] },
    { pack: "healthcare/overview-uk", patterns: [/\b(uk|united kingdom|britain|british|england|scotland|wales)\b/, /\bnhs\b/, /\buk gdpr\b/, /\bdspt\b/] },
    { pack: "healthcare/overview-ca", patterns: [/\b(canada|canadian)\b/, /\bpipeda\b/, /\b(ontario|quebec|alberta|bc)\b.*\bhealth\b/] },
    { pack: "healthcare/overview-au", patterns: [/\b(australia|australian)\b/, /\bmy health record\b/, /\bmhr\b/] },
    { pack: "healthcare/overview-nz", patterns: [/\b(new zealand|aotearoa)\b/, /\bhipc\b/] },
    { pack: "healthcare/overview-eu", patterns: [/\b(european union|eu)\b.*\bhealth\b/, /\behds\b/] },
    { pack: "healthcare/overview-de", patterns: [/\b(germany|german)\b/, /\bgematik\b/, /\bdiga\b/, /\bepa\b.*\bgerman\b/] },
    { pack: "healthcare/overview-fr", patterns: [/\b(france|french)\b/, /\bhds\b/, /\bdmp\b/, /\bmon espace santé\b/] },
    { pack: "healthcare/overview-ie", patterns: [/\b(ireland|irish)\b/, /\bhse\b.*\bhealth\b/] },
    { pack: "healthcare/overview-nl", patterns: [/\b(netherlands|dutch)\b/, /\bnictiz\b/, /\bmedmij\b/] },
    { pack: "healthcare/overview-ch", patterns: [/\b(switzerland|swiss)\b/, /\behealth suisse\b/] },
    { pack: "healthcare/overview-jp", patterns: [/\b(japan|japanese)\b/, /\bappi\b/] },
    { pack: "healthcare/overview-kr", patterns: [/\b(south korea|korean)\b/, /\b(nhis|pipa)\b.*\bkorea\b/] },
    { pack: "healthcare/overview-sg", patterns: [/\b(singapore)\b/, /\bnehr\b/] },
    { pack: "healthcare/overview-in", patterns: [/\b(india|indian)\b/, /\babdm\b/, /\babha\b/] },
    { pack: "healthcare/overview-br", patterns: [/\b(brazil|brazilian)\b/, /\brnds\b/, /\blgpd\b.*\bhealth\b/] },
    { pack: "healthcare/overview-mx", patterns: [/\b(mexico|mexican)\b/, /\bnom-024\b/] },
    { pack: "healthcare/overview-za", patterns: [/\b(south africa)\b/, /\bpopia\b/] },
    { pack: "healthcare/overview-sa", patterns: [/\b(saudi arabia|saudi)\b/, /\bnphies\b/] },
    { pack: "healthcare/overview-ae", patterns: [/\b(uae|dubai|abu dhabi|emirates)\b/, /\b(malaffi|nabidh)\b/] },
    { pack: "healthcare/overview-il", patterns: [/\b(israel|israeli)\b/] },
    { pack: "healthcare/overview-it", patterns: [/\b(italy|italian)\b/, /\bfse\b/] },
    { pack: "healthcare/overview-es", patterns: [/\b(spain|spanish)\b/] },
    { pack: "healthcare/overview-se", patterns: [/\b(sweden|swedish)\b/] },
    { pack: "healthcare/overview-no", patterns: [/\b(norway|norwegian)\b/] },
    { pack: "healthcare/overview-dk", patterns: [/\b(denmark|danish)\b/] },
    { pack: "healthcare/overview-fi", patterns: [/\b(finland|finnish)\b/, /\bkanta\b/] },
    { pack: "healthcare/overview-at", patterns: [/\b(austria|austrian)\b/, /\belga\b/] },
    { pack: "healthcare/overview-be", patterns: [/\b(belgium|belgian)\b/, /\behealth platform\b/] },
    { pack: "healthcare/overview-pl", patterns: [/\b(poland|polish)\b/] },
    { pack: "healthcare/overview-pt", patterns: [/\b(portugal|portuguese)\b/] },
    { pack: "healthcare/overview-tw", patterns: [/\b(taiwan|taiwanese)\b/] },
    { pack: "healthcare/overview-hk", patterns: [/\b(hong kong)\b/, /\behrss\b/] },
    { pack: "healthcare/overview-my", patterns: [/\b(malaysia|malaysian)\b/] },
    { pack: "healthcare/overview-th", patterns: [/\b(thailand|thai)\b/] },
    { pack: "healthcare/overview-ph", patterns: [/\b(philippines|filipino)\b/, /\bphilhealth\b/] },
    { pack: "healthcare/overview-id", patterns: [/\b(indonesia|indonesian)\b/, /\bsatusehat\b/] },
    { pack: "healthcare/overview-vn", patterns: [/\b(vietnam|vietnamese)\b/] },
    { pack: "healthcare/overview-cn", patterns: [/\b(china|chinese)\b/, /\bpipl\b/] },
    { pack: "healthcare/overview-apac", patterns: [/\b(asia.?pacific|apac|asean)\b.*\bhealth\b/, /\bapac\b.*\b(fhir|clinical|healthcare)\b/] },
    { pack: "healthcare/overview-bd", patterns: [/\b(bangladesh|bangladeshi)\b/] },
    { pack: "healthcare/overview-pk", patterns: [/\b(pakistan|pakistani)\b/] },
    { pack: "healthcare/overview-lk", patterns: [/\b(sri lanka|srilanka)\b/] },
    { pack: "healthcare/overview-np", patterns: [/\b(nepal|nepalese)\b/] },
    { pack: "healthcare/overview-kh", patterns: [/\b(cambodia|cambodian)\b/] },
    { pack: "healthcare/overview-mm", patterns: [/\b(myanmar|burma)\b/] },
  ];

  for (const { pack, patterns } of rules) {
    if (patterns.some((p) => p.test(d)) && HEALTHCARE_ALL_OVERVIEW_PACK_IDS.includes(pack)) {
      matches.add(pack);
    }
  }

  const bundleIds = new Set<string>();
  for (const overviewPack of matches) {
    const bundle = resolveHealthcareCountryBundlePackIds(overviewPack);
    if (bundle) {
      for (const id of bundle) bundleIds.add(id);
    } else {
      bundleIds.add(overviewPack);
    }
  }

  return [...bundleIds];
}

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
  const packs = new Set<string>([
    "disciplines/security",
    "compliance/tiered-standards",
    "legal/tiered-standards",
    "disciplines/qa",
    "testing/code-coverage",
    "cloud/github-actions",
    "tools/eslint-prettier",
    "testing/owasp-zap",
    ...DISCOVERY_FOUNDATION_PACK_IDS,
  ]);

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
    packs.add("healthcare/fhir-r4");
    packs.add("healthcare/phi-engineering");
    packs.add("healthcare/redox");
    for (const countryPack of resolveHealthcareCountryOverviewPackIds(desc)) {
      packs.add(countryPack);
    }
    if (!resolveHealthcareCountryOverviewPackIds(desc).length) {
      packs.add("healthcare/overview");
    }
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

  for (const legalPack of resolveLegalJurisdictionPackIds(desc)) {
    packs.add(legalPack);
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
