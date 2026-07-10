import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, writeJsonFile } from "../../fs.js";
import { buildStemPackFiles, finalizeStemPack, stemInstallPrefix } from "./builder.js";
import { PROMPT_STEM_DEFS } from "./catalog.js";
import { fetchIntelligenceCatalog, getBundledIntelligenceCatalog } from "./remote.js";
import type { IntelligenceStemPackEntry, PromptStemPack, PromptStemPackDef, StemCategory } from "./types.js";

const STEM_INDEX = ".DNA/stems/index.json";

export interface PromptStemSyncResult {
  paths: string[];
  source: "remote" | "bundled";
  catalogVersion: number;
  stemCount: number;
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

function stripStemHeader(copyPrompt: string): string {
  return copyPrompt.replace(/^> \*\*DNA Prompt Stem:.*\n\n/, "").trim();
}

function bundledPacks(): PromptStemPack[] {
  return PROMPT_STEM_DEFS.map(finalizeStemPack);
}

function getBundledStemPack(id: string): PromptStemPack | undefined {
  return bundledPacks().find((p) => p.id === id);
}

function examplesFromEntry(entry: IntelligenceStemPackEntry, bundled?: PromptStemPack) {
  if (bundled?.examples.length) return bundled.examples;
  return entry.copyVariants.slice(0, 2).map((userSays) => ({
    userSays,
    goodResponse: `Follow ${entry.name} guidelines and expectations in .DNA/stems/${entry.id}/`,
  }));
}

export function catalogEntryToDef(
  entry: IntelligenceStemPackEntry,
  bundled?: PromptStemPack,
): PromptStemPackDef {
  return {
    id: entry.id,
    name: entry.name,
    category: entry.category as StemCategory,
    slash: entry.slash,
    summary: entry.summary,
    tags: entry.tags,
    copyVariants: entry.copyVariants,
    prompt: stripStemHeader(entry.copyPrompt),
    guidelines: entry.guidelines,
    expectations: entry.expectations,
    contextLoads: entry.contextLoads,
    cliCommands: entry.cliCommands,
    examples: examplesFromEntry(entry, bundled),
    workflow: entry.workflow,
  };
}

function buildStemInstallFiles(
  entries: IntelligenceStemPackEntry[],
  config: DnaConfig,
  meta: { source: "remote" | "bundled"; catalogVersion: number },
): Record<string, string> {
  const files: Record<string, string> = {};
  const bundledById = new Map(bundledPacks().map((p) => [p.id, p]));
  const installed: Array<{ id: string; name: string; category: string; slash?: string; path: string; files: string[] }> =
    [];

  for (const entry of entries) {
    const bundled = bundledById.get(entry.id);
    const pack = finalizeStemPack(catalogEntryToDef(entry, bundled));
    const prefix = stemInstallPrefix(pack.id);

    for (const file of pack.files) {
      files[`${prefix}/${file.path}`] = file.content;
    }

    if (pack.slash) {
      const promptBody = pack.files.find((f) => f.path === "prompt.md")?.content ?? "";
      files[`.cursor/commands/${pack.slash}.md`] = promptBody;
      files[`.claude/commands/${pack.slash}.md`] =
        claudeFrontmatter(pack.summary, "[context or scope]") +
        promptBody.replace(/^> \*\*DNA Prompt Stem:.*\n\n/, "");
    }

    installed.push({
      id: pack.id,
      name: pack.name,
      category: pack.category,
      slash: pack.slash,
      path: prefix,
      files: pack.files.map((f) => f.path),
    });
  }

  const categoryLines = [...new Set(installed.map((p) => p.category))]
    .map((cat) => {
      const inCat = installed.filter((p) => p.category === cat);
      return `### ${cat}\n${inCat.map((p) => `- \`${p.id}\` — ${p.name}`).join("\n")}`;
    })
    .join("\n\n");

  files[".DNA/stems/README.md"] = `# DNA Prompt Stem Packs

**${config.projectName}** — ${installed.length} prompt stem packs (${meta.source} catalog v${meta.catalogVersion}).

Each stem pack is a **copy-paste prompt** plus **guidelines, expectations, context, and examples**.

Refresh: \`npx dna update\` or \`npx dna stems install\`

Copy-paste library: https://dna.humaan.app/intelligence#stem-library

## Catalog

${categoryLines}
`;

  files[STEM_INDEX] = JSON.stringify(
    {
      version: 1,
      catalogVersion: meta.catalogVersion,
      source: meta.source,
      syncedAt: new Date().toISOString(),
      count: installed.length,
      catalogUrl: "https://dna.humaan.app/intelligence#stem-library",
      packs: installed,
    },
    null,
    2,
  );

  return files;
}

/**
 * Download prompt stem packs from dna.humaan.app (fallback: bundled CLI catalog).
 * Called on init, doctor, update, and workbench install.
 */
export async function syncPromptStemPacks(
  root: string,
  config: DnaConfig,
  options: { preferRemote?: boolean } = {},
): Promise<PromptStemSyncResult> {
  const preferRemote = options.preferRemote !== false;
  const remote = preferRemote ? await fetchIntelligenceCatalog() : null;
  const bundled = getBundledIntelligenceCatalog();

  const entries = remote?.stemPacks?.length ? remote.stemPacks : bundled.stemPacks;
  const source: "remote" | "bundled" = remote ? "remote" : "bundled";
  const catalogVersion = remote?.version ?? bundled.version ?? 4;

  const files = buildStemInstallFiles(entries, config, { source, catalogVersion });
  const paths: string[] = [];

  for (const [relPath, content] of Object.entries(files)) {
    await writeFileEnsured(join(root, relPath), content);
    paths.push(relPath);
  }

  config.aiWorkbench = {
    enabled: config.aiWorkbench?.enabled !== false,
    lastSyncAt: new Date().toISOString(),
    catalogVersion,
    stemSource: source,
  };
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, ".DNA", "config.dna.json"), config);

  return {
    paths,
    source,
    catalogVersion,
    stemCount: entries.length,
  };
}
