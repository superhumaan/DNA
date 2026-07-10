export interface AiProviderInfo {
  id: "openai" | "anthropic" | "mock";
  name: string;
  envVar?: string;
  defaultModel: string;
  defaultEndpoint: string;
  description: string;
}

export const AI_PROVIDER_CATALOG: AiProviderInfo[] = [
  {
    id: "openai",
    name: "OpenAI",
    envVar: "OPENAI_API_KEY",
    defaultModel: "gpt-4o-mini",
    defaultEndpoint: "https://api.openai.com/v1/chat/completions",
    description: "GPT models for AI repair diagnosis and suggested fixes.",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    envVar: "ANTHROPIC_API_KEY",
    defaultModel: "claude-3-5-haiku-20241022",
    defaultEndpoint: "https://api.anthropic.com/v1/messages",
    description: "Claude models for AI repair diagnosis and suggested fixes.",
  },
  {
    id: "mock",
    name: "Mock (local testing)",
    defaultModel: "n/a",
    defaultEndpoint: "n/a",
    description: "Canned responses — no API key, no external calls. For dry-runs only.",
  },
];

export function isRealAiProvider(provider?: string): boolean {
  return provider === "openai" || provider === "anthropic";
}

export function formatAiConnectGuide(current?: {
  enabled?: boolean;
  provider?: string;
  model?: string;
}): string {
  const lines = [
    "DNA AI Connect",
    "==============",
    "",
    "Connect a real AI provider for `dna ai repair` — diagnoses runtime issues and opens reviewable PRs.",
    "",
  ];

  if (current?.enabled) {
    const label = isRealAiProvider(current.provider)
      ? current.provider
      : "not connected (mock default)";
    lines.push(`Current: ${label}${current.model ? ` · model ${current.model}` : ""}`, "");
  }

  lines.push("Supported providers", "");

  for (const provider of AI_PROVIDER_CATALOG) {
    lines.push(`  ${provider.id}`, `    ${provider.description}`);
    if (provider.envVar) {
      lines.push(`    Env var: ${provider.envVar}`);
    }
    lines.push(`    Default model: ${provider.defaultModel}`);
    if (provider.id !== "mock") {
      lines.push(
        `    Connect: dna ai connect --provider ${provider.id}`,
        `    Custom model: dna ai connect --provider ${provider.id} --model <name>`,
      );
    } else {
      lines.push(`    Testing only: dna ai connect --provider mock`);
    }
    lines.push("");
  }

  lines.push(
    "After connecting",
    "  export OPENAI_API_KEY=sk-...     # or ANTHROPIC_API_KEY",
    "  dna ai repair --file issue.json --dry-run",
    "  dna ai repair --file issue.json  # creates branch + PR (never auto-merged)",
    "",
    "Safety",
    "  · Secrets are redacted before AI analysis",
    "  · PRs always require human review",
    "  · DNA never auto-merges or deploys",
  );

  return lines.join("\n");
}
