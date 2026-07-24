import { join } from "node:path";
import { rm } from "node:fs/promises";
import type { DnaConfig } from "@superhumaan/dna-config";
import { fileExists } from "../../fs.js";
import { PROMPT_STEM_DEFS } from "./catalog.js";
import { finalizeStemPack, stemInstallPrefix } from "./builder.js";
import { syncPromptStemPacks } from "./sync.js";
import type { IntelligenceStemPackEntry, PromptStemPack, StemCategory } from "./types.js";

export * from "./types.js";
export { PROMPT_STEM_DEFS } from "./catalog.js";
export * from "./sync.js";
export * from "./remote.js";

const STEM_INDEX = ".DNA/stems/index.json";

export function getPromptStemPacks(): PromptStemPack[] {
  return PROMPT_STEM_DEFS.map(finalizeStemPack);
}

export function getPromptStemPack(id: string): PromptStemPack | undefined {
  return getPromptStemPacks().find((p) => p.id === id);
}

export function listPromptStemPackIds(): string[] {
  return PROMPT_STEM_DEFS.map((p) => p.id);
}

export function promptStemPacksByCategory(): Map<StemCategory, PromptStemPack[]> {
  const map = new Map<StemCategory, PromptStemPack[]>();
  for (const pack of getPromptStemPacks()) {
    const list = map.get(pack.category) ?? [];
    list.push(pack);
    map.set(pack.category, list);
  }
  return map;
}

function claudeFrontmatter(description: string, hint?: string): string {
  return [
    "---",
    `description: ${description}`,
    hint ? `argument-hint: ${hint}` : null,
    "allowed-tools: Bash(npx:*), Bash(dna:*), Read, Grep, Glob, Edit, Write",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Install paths for all stem packs */
export function getPromptStemInstallPaths(): string[] {
  const paths: string[] = [STEM_INDEX];
  for (const pack of getPromptStemPacks()) {
    const prefix = stemInstallPrefix(pack.id);
    for (const file of pack.files) {
      paths.push(`${prefix}/${file.path}`);
    }
    if (pack.slash) {
      paths.push(`.cursor/commands/${pack.slash}.md`);
      paths.push(`.claude/commands/${pack.slash}.md`);
    }
  }
  paths.push(".DNA/stems/README.md");
  return paths;
}

export function generatePromptStemPackFiles(config: DnaConfig): Record<string, string> {
  const files: Record<string, string> = {};
  const packs = getPromptStemPacks();

  for (const pack of packs) {
    const prefix = stemInstallPrefix(pack.id);
    for (const file of pack.files) {
      files[`${prefix}/${file.path}`] = file.content;
    }

    if (pack.slash) {
      const cursorCmd = pack.files.find((f) => f.path === "prompt.md")?.content ?? "";
      files[`.cursor/commands/${pack.slash}.md`] = cursorCmd;
      files[`.claude/commands/${pack.slash}.md`] =
        claudeFrontmatter(pack.summary, "[context or scope]") + cursorCmd.replace(/^> \*\*DNA Prompt Stem:.*\n\n/, "");
    }
  }

  const byCategory = promptStemPacksByCategory();
  const categoryLines = [...byCategory.entries()]
    .map(([cat, list]) => `### ${cat}\n${list.map((p) => `- \`${p.id}\` — ${p.name}`).join("\n")}`)
    .join("\n\n");

  files[".DNA/stems/README.md"] = `# DNA Prompt Stem Packs

**${config.projectName}** — ${packs.length} prompt stem packs installed by DNA Workbench.

Each stem pack is a **copy-paste prompt** plus **guidelines, expectations, context, and examples** so the AI sticks to the workflow.

## Structure per stem

\`.DNA/stems/<id>/\`
- \`prompt.md\` — full agent prompt
- \`guidelines.md\` — MUST / NEVER / SHOULD
- \`expectations.md\` — output format and definition of done
- \`context.md\` — DNA files and CLI commands
- \`examples.md\` — sample exchanges

## Catalog

${categoryLines}

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

Refresh: \`npx dna workbench install\` or \`npx dna stems install\`
`;

  files[STEM_INDEX] = JSON.stringify(
    {
      version: 1,
      count: packs.length,
      catalogUrl: "https://dna.humaan.app/intelligence#stem-library",
      packs: packs.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        slash: p.slash,
        path: stemInstallPrefix(p.id),
        files: p.files.map((f) => f.path),
      })),
    },
    null,
    2,
  );

  return files;
}

export async function installPromptStemPacks(root: string, config: DnaConfig): Promise<string[]> {
  const result = await syncPromptStemPacks(root, config);
  return result.paths;
}

export async function uninstallPromptStemPacks(root: string): Promise<string[]> {
  const stemsRoot = join(root, ".DNA", "stems");
  if (await fileExists(stemsRoot)) {
    await rm(stemsRoot, { recursive: true, force: true });
    return [".DNA/stems/"];
  }
  return [];
}

export function intelligenceStemPackEntries(): IntelligenceStemPackEntry[] {
  return getPromptStemPacks().map((pack) => {
    const promptFile = pack.files.find((f) => f.path === "prompt.md");
    return {
      id: pack.id,
      name: pack.name,
      category: pack.category,
      slash: pack.slash,
      summary: pack.summary,
      tags: pack.tags,
      copyVariants: pack.copyVariants,
      copyPrompt: promptFile?.content ?? pack.prompt,
      guidelines: pack.guidelines,
      expectations: pack.expectations,
      contextLoads: pack.contextLoads,
      cliCommands: pack.cliCommands,
      files: pack.files.map((f) => f.path),
      workflow: pack.workflow,
    };
  });
}

export const STEM_CATEGORY_LABELS: Record<StemCategory, { label: string; description: string }> = {
  session: { label: "Session", description: "Bootstrap, context, health checks" },
  analysis: { label: "Analysis", description: "Understand codebase, gaps, audits" },
  features: { label: "Features", description: "Plan and ship through agent loop" },
  "agent-loop": { label: "Agent loop", description: "Per-role feature factory prompts — PA, SA, BE, FE, UX, QA, ship" },
  quality: { label: "Quality", description: "Gates, scans, pre-push review" },
  compliance: { label: "Compliance", description: "GDPR, HIPAA, documents, engineering" },
  legal: { label: "Legal", description: "Jurisdiction law, banking, healthcare, IP, legal advisor" },
  debug: { label: "Debug", description: "Runtime issues, AI repair" },
  docs: { label: "Documentation", description: "Impressions sync and generation" },
  ivf: { label: "IVF", description: "Brownfield integration and shared library" },
  delivery: { label: "Delivery", description: "Docker, GitHub, CI" },
  methodology: { label: "Methodology", description: "Tickets, specs, and org delivery models" },
  discovery: { label: "Discovery", description: "Product research, UX, PMF, and opportunity shaping" },
  strategy: {
    label: "Strategy",
    description:
      "Golden Circle, canvases, North Star, OKRs, KPIs, product intelligence (diagnose/SWOT/competitors/upgrades), initiatives, features, and Now/Next/Later roadmaps",
  },
  marketplace: { label: "Marketplace", description: "Search and install knowledge packs" },
  memory: { label: "Memory", description: "CellularMemory export and import" },
};
