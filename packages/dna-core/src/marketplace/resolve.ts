import type { NeuralNetwork } from "@superhumaan/dna-config";
import { getBundledCatalog } from "./bundled-catalog.js";
import { normalizeKnowledgePath } from "./aliases.js";

let knowledgePathToPackId: Map<string, string> | null = null;

function getKnowledgePathIndex(): Map<string, string> {
  if (!knowledgePathToPackId) {
    knowledgePathToPackId = new Map();
    for (const pack of getBundledCatalog().packs) {
      for (const file of pack.files) {
        knowledgePathToPackId.set(file.path, pack.id);
      }
    }
  }
  return knowledgePathToPackId;
}

/** Map knowledge file paths (under `.DNA/knowledge/`) to marketplace pack IDs. */
export function resolvePackIdsForKnowledgePaths(paths: string[]): string[] {
  const index = getKnowledgePathIndex();
  const packIds = new Set<string>();
  for (const path of paths) {
    const normalized = normalizeKnowledgePath(path);
    const packId = index.get(normalized);
    if (packId) packIds.add(packId);
  }
  return [...packIds];
}

export function resolvePackIdsForIntents(
  intentNames: string[],
  neuralNetwork: NeuralNetwork,
): string[] {
  const paths: string[] = [];
  for (const name of intentNames) {
    const intent = neuralNetwork.intents[name];
    if (intent) paths.push(...intent.requiredKnowledge);
  }
  return resolvePackIdsForKnowledgePaths(paths);
}

export function mergePackIds(...groups: string[][]): string[] {
  return [...new Set(groups.flat())];
}

/** Reset cached index (for tests). */
export function resetKnowledgePathIndex(): void {
  knowledgePathToPackId = null;
}
