import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";

export function generateAiToolFiles(
  config: DnaConfig,
  answers: WizardAnswers,
): Record<string, string> {
  const files: Record<string, string> = {};
  const preamble = `# DNA by Humaan — AI Instructions

Before designing, building, testing, or documenting:

1. Read \`.DNA/neuralNetwork.json\` (or \`.DNA/neuralNetwork\`)
2. Load relevant \`.DNA/knowledge/\` packs
3. Read relevant \`.DNA/behaviour/\` files
4. Check \`.DNA/CellularMemory/\`
5. Check \`DNA/Impressions/\`

Project: **${config.projectName}**
${config.description ?? ""}

Run \`dna context <target>\` for focused context.
`;

  for (const tool of answers.aiTools) {
    switch (tool) {
      case "cursor":
        files[".cursor/rules/dna.mdc"] =
          `---\ndescription: DNA by Humaan project intelligence\nglobs: ["**/*"]\n---\n\n${preamble}`;
        break;
      case "claude_code":
        files["CLAUDE.md"] = preamble;
        break;
      case "chatgpt":
        files[".dna-chatgpt-context.md"] = preamble;
        break;
      case "github_copilot":
        files[".github/copilot-instructions.md"] = preamble;
        break;
      case "windsurf":
        files[".windsurfrules"] = preamble;
        break;
      case "gemini":
        files["GEMINI.md"] = preamble;
        break;
      case "multiple":
        files[".cursor/rules/dna.mdc"] =
          `---\ndescription: DNA by Humaan\nglobs: ["**/*"]\n---\n\n${preamble}`;
        files["CLAUDE.md"] = preamble;
        files[".github/copilot-instructions.md"] = preamble;
        break;
    }
  }

  return files;
}
