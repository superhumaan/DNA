import type { DnaConfig } from "@superhumaan/dna-config";
import { getArchetype } from "../stack/catalog.js";

type KnowledgeEntry = { path: string; content: string };

function langPack(name: string, ext: string): KnowledgeEntry[] {
  return [
    {
      path: `languages/${name}/positioning.dna.md`,
      content: `# ${name.charAt(0).toUpperCase() + name.slice(1)} — Positioning\n\nPrimary language for this project. Follow idiomatic ${name} conventions.\n\n## Extensions\n\n.${ext}\n`,
    },
  ];
}

function frameworkPack(name: string, extras: string[] = []): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [
    {
      path: `frameworks/${name}/positioning.dna.md`,
      content: `# ${name} — Positioning\n\nFramework knowledge pack for ${name}. Use official patterns and avoid anti-patterns.\n`,
    },
    {
      path: `frameworks/${name}/anti-patterns.dna.md`,
      content: `# ${name} — Anti-patterns\n\n- Do not bypass framework conventions\n- Do not mix incompatible state management patterns\n- Do not ignore framework security recommendations\n`,
    },
    {
      path: `frameworks/${name}/testing.dna.md`,
      content: `# ${name} — Testing\n\nFollow project testing Behaviour. Write tests alongside feature code.\n`,
    },
  ];
  for (const extra of extras) {
    entries.push({
      path: `frameworks/${name}/${extra}.dna.md`,
      content: `# ${name} — ${extra.replace(/-/g, " ")}\n\nSee official ${name} documentation for patterns.\n`,
    });
  }
  return entries;
}

function disciplinePack(name: string): KnowledgeEntry {
  return {
    path: `disciplines/${name}/positioning.dna.md`,
    content: `# ${name.replace(/-/g, " ")} — Discipline\n\nDiscipline knowledge for ${name}. Consult Behaviour files for project-specific rules.\n`,
  };
}

function platformPack(name: string): KnowledgeEntry {
  return {
    path: `platforms/${name}/positioning.dna.md`,
    content: `# ${name.replace(/-/g, " ")} — Platform\n\nPlatform patterns and constraints for ${name}.\n`,
  };
}

const DISCIPLINE_NAMES = [
  "solution-architecture",
  "backend",
  "frontend",
  "security",
  "devops",
  "prompt-engineering",
  "solution-engineering",
  "qa",
] as const;

function frameworksForArchetype(archetypeId: string): KnowledgeEntry[] {
  const arch = getArchetype(archetypeId);
  const entries: KnowledgeEntry[] = [];
  const fe = arch?.layers.frontend ?? ["react"];
  const be = arch?.layers.backend ?? ["express"];
  const bundler = arch?.layers.bundler ?? ["vite"];

  if (fe.includes("react") || fe.includes("react-native")) entries.push(...frameworkPack("react"));
  if (fe.includes("vue")) entries.push(...frameworkPack("vue"));
  if (fe.includes("svelte")) entries.push(...frameworkPack("svelte"));
  if (fe.includes("next")) entries.push(...frameworkPack("nextjs"));
  if (fe.includes("react-native")) entries.push(...frameworkPack("react-native"));
  if (bundler.includes("vite")) entries.push(...frameworkPack("vite", ["pwa-patterns"]));
  if (be.includes("express")) entries.push(...frameworkPack("express"));
  if (be.includes("fastify")) entries.push(...frameworkPack("fastify"));
  if (be.includes("nestjs")) entries.push(...frameworkPack("nestjs"));
  if (fe.includes("flutter")) entries.push(...frameworkPack("flutter"));

  return entries;
}

function platformsForArchetype(archetypeId: string, config: DnaConfig): KnowledgeEntry[] {
  const arch = getArchetype(archetypeId);
  const entries: KnowledgeEntry[] = [];
  const platform = (config.stack.platform ?? "").toLowerCase();

  if (arch?.platform === "mobile") {
    entries.push(platformPack("mobile-app"));
    entries.push(disciplinePack("mobile-development"));
    return entries;
  }
  if (arch?.platform === "cms") {
    entries.push(platformPack("web-app"));
    return entries;
  }

  entries.push(platformPack("web-app"), platformPack("api"));
  if (platform.includes("saas") || platform.includes("b2b") || arch?.id === "vercel-supabase") {
    entries.push(platformPack("b2b-saas"), platformPack("multi-tenant-saas"));
  }
  if (platform.includes("pwa")) entries.push(platformPack("pwa"));

  return entries;
}

function languagesForArchetype(archetypeId: string): KnowledgeEntry[] {
  const arch = getArchetype(archetypeId);
  const langs = arch?.layers.language ?? ["typescript", "javascript"];
  const entries: KnowledgeEntry[] = [];
  const langMap: Record<string, string> = {
    typescript: "ts",
    javascript: "js",
    python: "py",
    go: "go",
    php: "php",
    java: "java",
    csharp: "cs",
    swift: "swift",
    kotlin: "kt",
  };
  for (const lang of langs) {
    const ext = langMap[lang];
    if (ext) entries.push(...langPack(lang, ext));
  }
  return entries;
}

export function generateKnowledgePacks(config: DnaConfig): Record<string, string> {
  const archetypeId = config.stack.archetype ?? "react-vite-api";
  const arch = getArchetype(archetypeId);

  const entries: KnowledgeEntry[] = [
    ...languagesForArchetype(archetypeId),
    ...frameworksForArchetype(archetypeId),
    ...DISCIPLINE_NAMES.map((d) => disciplinePack(d)),
    ...platformsForArchetype(archetypeId, config),
  ];

  if (config.stack.frontend) {
    const fwName = config.stack.frontend === "next" ? "nextjs" : config.stack.frontend;
    entries.push({
      path: `frameworks/${fwName}/project-active.dna.md`,
      content: `# Active Framework: ${fwName}\n\nArchetype: **${arch?.name ?? archetypeId}**\n\nThis is the project's primary frontend. Do not add excluded technologies from the stack archetype.\n`,
    });
  }

  const result: Record<string, string> = {};
  for (const entry of entries) {
    result[entry.path] = entry.content;
  }
  return result;
}
