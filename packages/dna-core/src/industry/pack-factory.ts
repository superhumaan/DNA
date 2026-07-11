import type { KnowledgePack } from "@superhumaan/dna-config";
import { catalogPack } from "../marketplace/bundled-catalog-helpers.js";
import type { IndustrySectorDef } from "./types.js";
import { INDUSTRY_KNOWLEDGE_FILES } from "./types.js";

function sectorFilePath(sectorId: string, file: string): string {
  return `industries/${sectorId}/${file}`;
}

export function buildIndustrySectorPack(def: IndustrySectorDef): KnowledgePack {
  const files: Array<{ path: string; content: string }> = [
    {
      path: sectorFilePath(def.id, "overview.dna.md"),
      content: `# ${def.name} — Industry Overview\n\n${def.landscape}\n\n## When to install this pack\n\n${def.description}\n\nRun \`dna plan industry ${def.id}\` to activate for this project.`,
    },
    {
      path: sectorFilePath(def.id, "influencers.dna.md"),
      content: `# ${def.name} — Influencers & Standards\n\n${def.influencers}`,
    },
    {
      path: sectorFilePath(def.id, "tech-stack.dna.md"),
      content: `# ${def.name} — Tech Stack\n\n${def.techStack}`,
    },
    {
      path: sectorFilePath(def.id, "latest.dna.md"),
      content: `# ${def.name} — Latest Trends\n\n_Updated: 2026-07. Refresh via \`dna update\`._\n\n${def.latest}`,
    },
    {
      path: sectorFilePath(def.id, "practices.dna.md"),
      content: `# ${def.name} — Best Practices\n\n${def.practices}`,
    },
    {
      path: sectorFilePath(def.id, "regulation.dna.md"),
      content: `# ${def.name} — Regulation & Compliance\n\n${def.regulation}`,
    },
    {
      path: sectorFilePath(def.id, "agency-notes.dna.md"),
      content: `# ${def.name} — Agency Notes\n\n_For software agencies delivering client work in this sector._\n\n${def.agencyNotes}`,
    },
    {
      path: sectorFilePath(def.id, "ui-patterns.dna.md"),
      content: `# ${def.name} — UI Patterns\n\n${def.uiPatterns}`,
    },
  ];

  return catalogPack(
    `industries/${def.id}`,
    def.name,
    "industries",
    def.description,
    files,
    ["industry", def.id, ...(def.tags ?? [])],
  );
}

export function industryKnowledgePaths(sectorId: string): string[] {
  return INDUSTRY_KNOWLEDGE_FILES.map((file) => sectorFilePath(sectorId, file));
}

export function buildIndustryOverviewPack(sectors: IndustrySectorDef[]): KnowledgePack {
  const rows = sectors.map(
    (s) => `| ${s.name} | \`${s.id}\` | ${s.description} | \`dna plan industry ${s.id}\` |`,
  );

  const content = `# Industry Packs — Overview

DNA industry packs give agencies and product teams **domain fluency** when building for a specific sector.

Each pack includes: overview, influencers, tech stack, latest trends, practices, regulation, agency notes, and UI patterns.

## Sector catalog

| Sector | ID | Description | Activate |
| --- | --- | --- | --- |
${rows.join("\n")}

## How to use

1. Set active industry: \`dna plan industry <id>\`
2. Load context for AI: \`dna context industry\`
3. Pair with delivery archetype: \`dna delivery set --archetype agency\`
4. Install linked compliance/legal packs from each sector's \`regulation.dna.md\`

## Config

\`\`\`json
{
  "industry": {
    "active": "healthcare",
    "secondary": ["saas-b2b"],
    "clientName": "Acme Health"
  }
}
\`\`\`

Run \`dna doctor\` to verify industry pack is installed when \`industry.active\` is set.
`;

  return catalogPack(
    "industries/overview",
    "Industry Packs Overview",
    "industries",
    "Master index of DNA industry packs for agencies and vertical teams",
    [{ path: "industries/overview.dna.md", content }],
    ["industry", "overview", "agency"],
  );
}
