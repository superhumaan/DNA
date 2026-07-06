import type { DnaConfig } from "@humaan/dna-config";

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

export function generateKnowledgePacks(config: DnaConfig): Record<string, string> {
  const entries: KnowledgeEntry[] = [
    ...langPack("typescript", "ts"),
    ...langPack("javascript", "js"),
    ...langPack("python", "py"),
    ...langPack("go", "go"),
    ...langPack("php", "php"),
    ...langPack("java", "java"),
    ...langPack("csharp", "cs"),
    ...langPack("swift", "swift"),
    ...langPack("kotlin", "kt"),
    ...frameworkPack("react"),
    ...frameworkPack("vite", ["pwa-patterns"]),
    ...frameworkPack("nextjs"),
    ...frameworkPack("express"),
    ...frameworkPack("fastify"),
    ...frameworkPack("nestjs"),
    ...frameworkPack("vue"),
    ...frameworkPack("svelte"),
    ...frameworkPack("react-native"),
    ...frameworkPack("flutter"),
    disciplinePack("solution-architecture"),
    disciplinePack("backend"),
    disciplinePack("frontend"),
    disciplinePack("security"),
    disciplinePack("devops"),
    disciplinePack("prompt-engineering"),
    disciplinePack("solution-engineering"),
    disciplinePack("mobile-development"),
    disciplinePack("qa"),
    platformPack("pwa"),
    platformPack("web-app"),
    platformPack("mobile-app"),
    platformPack("api"),
    platformPack("b2b-saas"),
    platformPack("enterprise-system"),
    platformPack("multi-tenant-saas"),
  ];

  // Prioritise stack-specific packs
  const stack = config.stack;
  if (stack.frontend) {
    const fw = stack.frontend === "next" ? "nextjs" : stack.frontend;
    entries.push({
      path: `frameworks/${fw}/project-active.dna.md`,
      content: `# Active Framework: ${fw}\n\nThis is the project's primary frontend framework.\n`,
    });
  }

  const result: Record<string, string> = {};
  for (const entry of entries) {
    result[entry.path] = entry.content;
  }
  return result;
}
