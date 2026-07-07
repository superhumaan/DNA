import type { KnowledgePack } from "@superhumaan/dna-config";
import { applyMaturityTag, type PackMaturity } from "./catalog-maturity.js";

function finalizeTags(id: string, tags: string[], maturity?: PackMaturity): string[] {
  const withMaturity = applyMaturityTag(tags, id);
  if (!maturity) return withMaturity;
  return [...withMaturity.filter((t) => t !== "legacy" && t !== "mainstream" && t !== "emerging"), maturity];
}

export function pack(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  description: string,
  files: Array<{ path: string; content: string }>,
  maturity?: PackMaturity,
): KnowledgePack {
  const tags = finalizeTags(id, [category, id.split("/").pop() ?? id], maturity);
  return {
    id,
    name,
    version: "1.0.0",
    description,
    category,
    channel: "stable",
    tags,
    files: files.map((f) => ({ path: f.path, content: f.content })),
    minDnaVersion: "0.1.0",
    publishedAt: "2026-01-01T00:00:00.000Z",
  };
}

/** Foundational delivery-surface packs — mobile, PWA, desktop, extensions, GPT apps, etc. */
export function stemPack(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  description: string,
  files: Array<{ path: string; content: string }>,
): KnowledgePack {
  const base = pack(id, name, category, description, files);
  return { ...base, tags: [...base.tags, "stem"] };
}

/** Broad marketplace packs — languages, CMS, browsers, methodologies, modern frameworks */
export function catalogPack(
  id: string,
  name: string,
  category: KnowledgePack["category"],
  description: string,
  files: Array<{ path: string; content: string }>,
  extraTags: string[] = [],
  maturity?: PackMaturity,
): KnowledgePack {
  const base = pack(id, name, category, description, files, maturity);
  const tags = finalizeTags(id, [...base.tags.filter((t) => t !== "legacy" && t !== "mainstream" && t !== "emerging"), "catalog", ...extraTags], maturity);
  return { ...base, tags };
}

export function languagePack(
  id: string,
  name: string,
  ext: string,
  ecosystem: string,
  conventions: string,
): KnowledgePack {
  return catalogPack(
    `languages/${id}`,
    name,
    "languages",
    `${name} language patterns and idioms for DNA projects`,
    [
      {
        path: `languages/${id}/positioning.dna.md`,
        content: `# ${name} — Positioning

Primary or secondary language for this project. Follow idiomatic ${name} conventions.

## Extensions
\`.${ext}\`

## Ecosystem
${ecosystem}
`,
      },
      {
        path: `languages/${id}/conventions.dna.md`,
        content: `# ${name} — Conventions

${conventions}
`,
      },
      {
        path: `languages/${id}/checklist.dna.md`,
        content: `# ${name} — Checklist

- [ ] Formatter and linter run in CI
- [ ] Type checking on public APIs
- [ ] Dependency lockfile committed
- [ ] Security audit for ecosystem packages
`,
      },
    ],
    ["language", id],
  );
}
