import { join } from "node:path";
import type { DnaConfig, NeuralNetwork } from "@superhumaan/dna-config";
import { readJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { installKnowledgePackById } from "./install.js";
import { normalizePackId } from "./aliases.js";
import { resolvePackIdsForIntents, resolvePackIdsForKnowledgePaths } from "./resolve.js";
import type { ContextTarget } from "../context-intents.js";
import { TARGET_INTENTS } from "../context-intents.js";
import { knowledgePackIdsForIndustry, resolveIndustryProfile } from "../industry/catalog.js";

export interface EnsureKnowledgeResult {
  installed: string[];
  refreshed: string[];
  failed: Array<{ packId: string; error: string }>;
}

export async function ensureKnowledgeInstalled(
  root: string,
  packIds: string[],
  channel: DnaConfig["channel"] = "stable",
): Promise<EnsureKnowledgeResult> {
  const unique = [...new Set(packIds.filter(Boolean))];
  const result: EnsureKnowledgeResult = { installed: [], refreshed: [], failed: [] };

  if (!unique.length) return result;

  const registryPath = join(root, ".DNA", "marketplace", "installed.json");
  const registry =
    (await readJsonFile<Record<string, { version: string }>>(registryPath)) ?? {};

  for (const packId of unique) {
    const resolvedId = normalizePackId(packId);
    const wasInstalled = Boolean(registry[packId] || registry[resolvedId]);
    try {
      await installKnowledgePackById(root, resolvedId, channel);
      if (wasInstalled) result.refreshed.push(packId);
      else result.installed.push(packId);
    } catch (error) {
      result.failed.push({
        packId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}

export async function ensureKnowledgeForPaths(
  root: string,
  knowledgePaths: string[],
  channel?: DnaConfig["channel"],
): Promise<EnsureKnowledgeResult> {
  const config = (await loadDnaConfig(root)) ?? null;
  const packIds = resolvePackIdsForKnowledgePaths(knowledgePaths);
  return ensureKnowledgeInstalled(root, packIds, channel ?? config?.channel ?? "stable");
}

export async function ensureKnowledgeForIntents(
  root: string,
  intentNames: string[],
  neuralNetwork: NeuralNetwork,
  channel?: DnaConfig["channel"],
): Promise<EnsureKnowledgeResult> {
  const config = (await loadDnaConfig(root)) ?? null;
  const packIds = resolvePackIdsForIntents(intentNames, neuralNetwork);
  return ensureKnowledgeInstalled(root, packIds, channel ?? config?.channel ?? "stable");
}

export async function ensureKnowledgeForContext(
  root: string,
  target: ContextTarget,
  neuralNetwork: NeuralNetwork | null,
): Promise<EnsureKnowledgeResult> {
  if (!neuralNetwork || target === "all") {
    return { installed: [], refreshed: [], failed: [] };
  }

  const intentNames = TARGET_INTENTS[target] ?? [];
  const config = (await loadDnaConfig(root)) ?? null;
  const packIdGroups: string[][] = [];

  if (intentNames.length) {
    packIdGroups.push(resolvePackIdsForIntents(intentNames, neuralNetwork));
  }

  if (target === "industry") {
    const profile = resolveIndustryProfile(config);
    if (profile.active) {
      packIdGroups.push(knowledgePackIdsForIndustry(profile.active));
    } else {
      packIdGroups.push(["industries/overview"]);
    }
  }

  if (!packIdGroups.length) {
    return { installed: [], refreshed: [], failed: [] };
  }

  return ensureKnowledgeInstalled(
    root,
    [...new Set(packIdGroups.flat())],
    config?.channel ?? "stable",
  );
}

export function formatEnsureResult(result: EnsureKnowledgeResult): string {
  const lines: string[] = [];
  if (result.installed.length) {
    lines.push(`Installed: ${result.installed.join(", ")}`);
  }
  if (result.refreshed.length) {
    lines.push(`Refreshed: ${result.refreshed.join(", ")}`);
  }
  if (result.failed.length) {
    lines.push("Failed:");
    for (const f of result.failed) {
      lines.push(`  • ${f.packId}: ${f.error}`);
    }
  }
  return lines.join("\n");
}
