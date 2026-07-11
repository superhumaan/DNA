import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import {
  getArchetypeMeta,
  getMethodologyMeta,
  knowledgePackIdsForProfile,
  resolveDeliveryProfile,
} from "./catalog.js";
import { readCustomProfileContent } from "./profile.js";

export { deliveryBehaviourMarkdown } from "./behaviour.js";

export async function generateMethodologyContext(root: string): Promise<string> {
  const config = await loadDnaConfig(root);
  const profile = resolveDeliveryProfile(config);
  const packIds = knowledgePackIdsForProfile(profile);

  await ensureKnowledgeInstalled(root, packIds);

  const meta = getMethodologyMeta(profile.methodology);
  const archetype = getArchetypeMeta(profile.companyArchetype);
  const custom = await readCustomProfileContent(root, profile);

  const sections: string[] = [
    "# DNA Methodology Context",
    "",
    "_How this team plans, documents, and tickets work. Load before creating tickets or specs._",
    "",
    `**Methodology:** ${meta.name} (\`${profile.methodology}\`)`,
    `**Archetype:** ${archetype.name} (\`${profile.companyArchetype}\`)`,
    `**Ticket system:** ${profile.ticketSystem}`,
    `**Doc system:** ${profile.docSystem}`,
    `**Hierarchy:** ${profile.hierarchy.join(" → ")}`,
    `**Ceremonies:** ${profile.ceremonies.join(", ") || "(none)"}`,
    "",
  ];

  sections.push("## Behaviour\n");
  const behaviourPath = join(root, ".DNA", "behaviour", "delivery.behaviour.md");
  if (await fileExists(behaviourPath)) {
    sections.push(await readFile(behaviourPath, "utf-8"), "\n");
  }

  sections.push("## Knowledge\n");
  const knowledgeFiles = [
    ...packIds.flatMap((packId) => [
      `${packId}/positioning.dna.md`,
      `${packId}/hierarchy.dna.md`,
      `${packId}/artifacts.dna.md`,
      `${packId}/ceremonies.dna.md`,
      `${packId}/ticket-templates.dna.md`,
      `${packId}/document-templates.dna.md`,
      `${packId}/practices.dna.md`,
    ]),
  ];
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
    "## AI instructions",
    "",
    "When creating tickets or documents:",
    "1. Use the hierarchy above — never default to GitHub issues unless ticketSystem is github",
    "2. Match field names and sections from ticket/document templates",
    "3. Apply company archetype tone and approval patterns",
    "4. Code delivery still follows DNA quality gates (lint, test, coverage, docker, push)",
    "",
  );

  return sections.join("\n");
}
