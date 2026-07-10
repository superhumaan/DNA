import type { PromptStemPack, PromptStemPackDef, PromptStemPackFile, StemGuidelines } from "./types.js";

function formatGuidelines(g: StemGuidelines): string {
  const lines = ["# Guidelines", ""];
  if (g.must.length) {
    lines.push("## MUST", ...g.must.map((x) => `- ${x}`), "");
  }
  if (g.should?.length) {
    lines.push("## SHOULD", ...g.should.map((x) => `- ${x}`), "");
  }
  if (g.never.length) {
    lines.push("## NEVER", ...g.never.map((x) => `- ${x}`), "");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function formatExpectations(items: string[]): string {
  return `# Expectations\n\n${items.map((x) => `- ${x}`).join("\n")}\n`;
}

function formatContext(loads: string[], cli: string[]): string {
  const lines = ["# Context to load", ""];
  if (loads.length) {
    lines.push("## DNA files", ...loads.map((x) => `- \`${x}\``), "");
  }
  if (cli.length) {
    lines.push("## DNA CLI", ...cli.map((x) => `- \`${x}\``), "");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function formatExamples(examples: PromptStemPackDef["examples"]): string {
  const blocks = examples.map(
    (ex, i) =>
      `## Example ${i + 1}\n\n**User:** ${ex.userSays}\n\n**Good response shape:**\n${ex.goodResponse}\n`,
  );
  return `# Examples\n\n${blocks.join("\n")}`;
}

function formatWorkflow(steps: string[]): string {
  return `# Workflow chain\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`;
}

function formatReadme(def: PromptStemPackDef): string {
  const slash = def.slash ? `\`/ ${def.slash}\`` : "*(no slash — paste copy variants)*";
  return `# ${def.name}

${def.summary}

- **Stem ID:** \`${def.id}\`
- **Category:** ${def.category}
- **Slash:** ${slash}
- **Catalog:** https://dna.humaan.app/intelligence#stem-${def.id}

## Files in this stem pack

| File | Purpose |
|------|---------|
| \`prompt.md\` | Full agent prompt — copy-paste or slash command body |
| \`guidelines.md\` | MUST / NEVER / SHOULD — non-negotiable behaviour |
| \`expectations.md\` | Output format and definition of done |
| \`context.md\` | DNA files and CLI commands to load/run |
| \`examples.md\` | Sample user asks and ideal response shapes |
${def.workflow?.length ? "| `workflow.md` | Chained next steps after this prompt |" : ""}

## Before executing

Read **all files** in this folder. The AI must follow guidelines and meet expectations — not improvise.
`;
}

export function buildStemPackFiles(def: PromptStemPackDef): PromptStemPackFile[] {
  const stemHeader = `> **DNA Prompt Stem:** \`${def.id}\` — read \`.DNA/stems/${def.id}/\` (all files) before proceeding.\n\n`;

  const files: PromptStemPackFile[] = [
    { path: "README.md", content: formatReadme(def) },
    { path: "prompt.md", content: stemHeader + def.prompt.trim() + "\n" },
    { path: "guidelines.md", content: formatGuidelines(def.guidelines) },
    { path: "expectations.md", content: formatExpectations(def.expectations) },
    { path: "context.md", content: formatContext(def.contextLoads, def.cliCommands) },
    { path: "examples.md", content: formatExamples(def.examples) },
  ];

  if (def.workflow?.length) {
    files.push({ path: "workflow.md", content: formatWorkflow(def.workflow) });
  }

  return files;
}

export function finalizeStemPack(def: PromptStemPackDef): PromptStemPack {
  return { ...def, files: buildStemPackFiles(def) };
}

export function stemInstallPrefix(id: string): string {
  return `.DNA/stems/${id}`;
}
