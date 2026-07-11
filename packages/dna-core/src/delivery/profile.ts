import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { DEFAULT_DELIVERY_PROFILE, DNA_CONFIG_FILE } from "@superhumaan/dna-config";
import { readFile } from "node:fs/promises";
import { fileExists, writeFileEnsured, writeJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import {
  getArchetypeMeta,
  getMethodologyMeta,
  knowledgePackIdsForProfile,
  parseArchetypeInput,
  parseMethodologyInput,
  resolveDeliveryProfile,
  type DeliveryProfile,
} from "./catalog.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import { deliveryBehaviourMarkdown } from "./behaviour.js";

export interface SetDeliveryOptions {
  root: string;
  methodology?: string;
  companyArchetype?: string;
  ticketSystem?: string;
  docSystem?: string;
  hierarchy?: string;
  ceremonies?: string;
}

export interface DeliveryShowResult {
  profile: DeliveryProfile;
  methodologyName: string;
  archetypeName: string;
  knowledgePacks: string[];
  customProfileExists: boolean;
}

export function formatDeliveryProfileSummary(result: DeliveryShowResult): string {
  const { profile } = result;
  const lines = [
    "# Delivery Profile",
    "",
    `**Methodology:** ${result.methodologyName} (\`${profile.methodology}\`)`,
    `**Company archetype:** ${result.archetypeName} (\`${profile.companyArchetype}\`)`,
    `**Ticket system:** ${profile.ticketSystem}`,
    `**Doc system:** ${profile.docSystem}`,
    `**Hierarchy:** ${profile.hierarchy.join(" → ")}`,
    `**Ceremonies:** ${profile.ceremonies.length ? profile.ceremonies.join(", ") : "(none)"}`,
    `**Custom profile:** ${profile.customProfile}${result.customProfileExists ? "" : " (not created yet)"}`,
    "",
    "**Knowledge packs:**",
    ...result.knowledgePacks.map((p) => `- ${p}`),
    "",
    "Run `dna context methodology` before creating tickets or specs.",
  ];
  return lines.join("\n");
}

export async function showDeliveryProfile(root: string): Promise<DeliveryShowResult> {
  const config = await loadDnaConfig(root);
  const profile = resolveDeliveryProfile(config);
  const customPath = join(root, profile.customProfile);
  return {
    profile,
    methodologyName: getMethodologyMeta(profile.methodology).name,
    archetypeName: getArchetypeMeta(profile.companyArchetype).name,
    knowledgePacks: knowledgePackIdsForProfile(profile),
    customProfileExists: await fileExists(customPath),
  };
}

export async function setDeliveryProfile(options: SetDeliveryOptions): Promise<DeliveryShowResult> {
  const config = (await loadDnaConfig(options.root))!;
  const existing = resolveDeliveryProfile(config);
  const methodology = options.methodology
    ? parseMethodologyInput(options.methodology)
    : existing.methodology;
  const companyArchetype = options.companyArchetype
    ? parseArchetypeInput(options.companyArchetype)
    : existing.companyArchetype;
  const meta = getMethodologyMeta(methodology);

  const delivery: NonNullable<DnaConfig["delivery"]> = {
    methodology,
    companyArchetype,
    ticketSystem: (options.ticketSystem as DeliveryProfile["ticketSystem"]) ?? existing.ticketSystem,
    docSystem: (options.docSystem as DeliveryProfile["docSystem"]) ?? existing.docSystem,
    hierarchy: options.hierarchy
      ? (options.hierarchy.split(",").map((s) => s.trim()) as DeliveryProfile["hierarchy"])
      : meta.defaultHierarchy,
    ceremonies: options.ceremonies
      ? options.ceremonies.split(",").map((s) => s.trim())
      : meta.defaultCeremonies,
    customProfile: existing.customProfile,
  };

  const updated: DnaConfig = {
    ...config,
    delivery,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(join(options.root, DNA_CONFIG_FILE), updated);

  const profile = resolveDeliveryProfile(updated);
  await ensureKnowledgeInstalled(options.root, knowledgePackIdsForProfile(profile));

  const behaviourPath = join(options.root, ".DNA", "behaviour", "delivery.behaviour.md");
  await writeFileEnsured(behaviourPath, deliveryBehaviourMarkdown(updated));

  const customPath = join(options.root, profile.customProfile);
  if (!(await fileExists(customPath))) {
    await writeFileEnsured(customPath, buildCustomProfileTemplate(profile, updated));
  }

  return showDeliveryProfile(options.root);
}

function buildCustomProfileTemplate(profile: DeliveryProfile, config: DnaConfig): string {
  const meta = getMethodologyMeta(profile.methodology);
  const archetype = getArchetypeMeta(profile.companyArchetype);
  return `# Delivery Profile — ${config.projectName}

_Organisation-specific overrides. DNA loads this after methodology packs._

## Methodology

- **Framework:** ${meta.name}
- **Archetype:** ${archetype.name}
- **Ticket system:** ${profile.ticketSystem}
- **Doc system:** ${profile.docSystem}

## Work hierarchy

${profile.hierarchy.map((level, i) => `${i + 1}. **${level}**`).join("\n")}

## Ceremonies

${profile.ceremonies.map((c) => `- ${c}`).join("\n")}

## Ticket conventions (override defaults)

- Issue key prefix: _(e.g. PROJ, BOOK, PAY)_
- Required labels: _(e.g. tribe-checkout, squad-payments)_
- Story point scale: _(e.g. Fibonacci 1–13)_
- Definition of Done checklist:
  - [ ] Code reviewed
  - [ ] Tests pass
  - [ ] Deployed to staging

## Document conventions (override defaults)

- Spec template location: _(Confluence space / Notion DB / DNA/Impressions/)_
- Required sections for design docs: _(e.g. Problem, Goals, Non-goals, Risks)_
- Approval workflow: _(e.g. tech lead + PM sign-off)_

## Team-specific notes

_Add tribe/squad/client-specific rules here._
`;
}

export async function readCustomProfileContent(root: string, profile: DeliveryProfile): Promise<string | null> {
  const path = join(root, profile.customProfile);
  if (!(await fileExists(path))) return null;
  return readFile(path, "utf-8");
}

export function defaultDeliveryBlock(): DnaConfig["delivery"] {
  return {
    methodology: DEFAULT_DELIVERY_PROFILE.methodology,
    companyArchetype: DEFAULT_DELIVERY_PROFILE.companyArchetype,
    ticketSystem: DEFAULT_DELIVERY_PROFILE.ticketSystem,
    docSystem: DEFAULT_DELIVERY_PROFILE.docSystem,
    hierarchy: [...DEFAULT_DELIVERY_PROFILE.hierarchy],
    ceremonies: [...DEFAULT_DELIVERY_PROFILE.ceremonies],
    customProfile: DEFAULT_DELIVERY_PROFILE.customProfile,
  };
}
