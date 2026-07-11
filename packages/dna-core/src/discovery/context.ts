import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { IMPRESSIONS_DIR } from "@superhumaan/dna-config";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import {
  getLifecycleMeta,
  getTeamMeta,
  knowledgePackIdsForDiscoveryProfile,
  resolveDiscoveryProfile,
} from "./catalog.js";
import { readCustomDiscoveryContent } from "./profile.js";

export { discoveryBehaviourMarkdown } from "./behaviour.js";

export async function generateDiscoveryContext(root: string): Promise<string> {
  const config = await loadDnaConfig(root);
  const profile = resolveDiscoveryProfile(config);
  const packIds = knowledgePackIdsForDiscoveryProfile(profile);

  await ensureKnowledgeInstalled(root, packIds);

  const lifecycle = getLifecycleMeta(profile.lifecycleStage);
  const team = getTeamMeta(profile.teamModel);
  const custom = await readCustomDiscoveryContent(root, profile);

  const sections: string[] = [
    "# DNA Discovery Context",
    "",
    "_How this team shapes products before engineering. Load before research, UX, or opportunity work._",
    "",
    `**Lifecycle:** ${lifecycle.name} (\`${profile.lifecycleStage}\`)`,
    `**Team model:** ${team.name} (\`${profile.teamModel}\`)`,
    `**Processes:** ${profile.activeProcesses.join(", ") || "(none)"}`,
    `**Methods:** ${profile.activeMethods.join(", ") || "(none)"}`,
    `**Events:** ${profile.activeEvents.join(", ") || "(none)"}`,
    "",
  ];

  sections.push("## Behaviour\n");
  const behaviourPath = join(root, ".DNA", "behaviour", "discovery.behaviour.md");
  if (await fileExists(behaviourPath)) {
    sections.push(await readFile(behaviourPath, "utf-8"), "\n");
  }

  sections.push("## Knowledge\n");
  const knowledgeFiles = packIds.flatMap((packId) => [
    `${packId}/positioning.dna.md`,
    `${packId}/process.dna.md`,
    `${packId}/artifacts.dna.md`,
    `${packId}/events.dna.md`,
    `${packId}/dna-sync.dna.md`,
  ]);
  for (const kPath of knowledgeFiles) {
    const fullPath = join(root, ".DNA", "knowledge", kPath);
    if (await fileExists(fullPath)) {
      const content = await readFile(fullPath, "utf-8");
      sections.push(`### ${kPath}\n`, content, "\n");
    }
  }

  if (custom) {
    sections.push("## Custom profile\n", custom, "\n");
  }

  sections.push(
    "## Impressions (product intelligence)\n",
    "Read and update when discovery work completes:\n",
    `- \`${IMPRESSIONS_DIR}/product/discovery-log.md\``,
    `- \`${IMPRESSIONS_DIR}/product/opportunity-tree.md\``,
    `- \`${IMPRESSIONS_DIR}/product/assumptions-risks.md\``,
    `- \`${IMPRESSIONS_DIR}/product/research-insights.md\``,
    `- \`${IMPRESSIONS_DIR}/product/pmf-signals.md\``,
    "",
    "## AI instructions",
    "",
    "When shaping products or planning research:",
    "1. Match lifecycle stage and team model above",
    "2. Use method/process/event packs for study design and artifacts",
    "3. Sync findings with `dna sync discovery` — do not leave insights only in chat",
    "4. Hand off validated opportunities to `ai/feature-request.md` before coding",
    "5. Delivery methodology (`dna context methodology`) applies after handoff",
    "",
  );

  return sections.join("\n");
}
