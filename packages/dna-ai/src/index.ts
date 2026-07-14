import type { AiRepairPlan, ClassifiedIssue } from "@superhumaan/dna-config";
import {
  parseRepairResponse,
  buildStructuredRepairPromptSuffix,
} from "./patch-parser.js";

export interface AiProvider {
  name: string;
  diagnose(issue: ClassifiedIssue, context: RepairContext): Promise<AiRepairPlan>;
}

export interface RepairContext {
  behaviour: string[];
  memory: string[];
  codeSnippets: Array<{ file: string; content: string }>;
  neuralNetworkIntent?: string;
}

export interface AiProviderConfig {
  provider: "mock" | "openai" | "anthropic";
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export function createAiProvider(config: AiProviderConfig): AiProvider {
  switch (config.provider) {
    case "openai":
      return new OpenAiCompatibleProvider(config);
    case "anthropic":
      return new AnthropicCompatibleProvider(config);
    case "mock":
    default:
      return new MockAiProvider();
  }
}

class MockAiProvider implements AiProvider {
  name = "mock";

  async diagnose(issue: ClassifiedIssue, context: RepairContext): Promise<AiRepairPlan> {
    const branchName = `dna/fix/${issue.fingerprint ?? issue.category}-${issue.id.slice(0, 8)}`;
    const isGateway =
      issue.category === "deployment" || /HTTP 50[234]|bad gateway/i.test(issue.summary);

    const benign =
      /EPIPE|ECONNRESET|ECONNABORTED|ERR_STREAM_DESTROYED|write after end/i.test(issue.summary) ||
      /EPIPE|ECONNRESET/i.test(issue.title);

    // Never invent file patches for noise, or invent src/index.ts when no file is known.
    const proposedChanges: AiRepairPlan["proposedChanges"] = benign
      ? []
      : isGateway
        ? [
            {
              file: "src/health.ts",
              description: "Health check endpoint for gateway probes",
              patch: [
                "// DNA gateway repair",
                "export function healthHandler() {",
                "  return { status: 'ok', timestamp: new Date().toISOString() };",
                "}",
              ].join("\n"),
            },
          ]
        : [];

    return {
      diagnosis: [
        `Mock diagnosis for ${issue.category} issue.`,
        `Summary: ${issue.summary}`,
        benign
          ? "Benign socket disconnect (EPIPE/ECONNRESET) — no code change; filter at runtime."
          : "",
        issue.suspectedCause ? `Likely cause: ${issue.suspectedCause}` : "",
        issue.isBlocker ? "BLOCKER — repeat threshold exceeded." : "",
        proposedChanges.length === 0
          ? "Mock provider does not invent code patches — configure a real AI provider or fix manually."
          : "",
        `Reviewed ${context.behaviour.length} Behaviour files and ${context.memory.length} memory files.`,
      ]
        .filter(Boolean)
        .join("\n"),
      confidence: issue.confidence,
      proposedChanges,
      branchName,
      prTitle: `[DNA] Fix: ${issue.title}`,
      prBody: [
        "## DNA AI Repair (Mock)",
        "",
        "### Diagnosis",
        issue.summary,
        "",
        "### Suggested Fix",
        issue.suggestedFix ?? "Review error handling",
        "",
        "### Test Plan",
        issue.testRecommendation ?? "Add regression test",
        "",
        "### Safety",
        "- This PR was created by DNA aggressive repair",
        "- **Not auto-merged** — requires human review",
        "",
        `Confidence: ${(issue.confidence * 100).toFixed(0)}%`,
      ].join("\n"),
      testPlan: issue.testRecommendation ?? "Add unit test covering this error path",
    };
  }
}

class OpenAiCompatibleProvider implements AiProvider {
  name = "openai";
  constructor(private config: AiProviderConfig) {}

  async diagnose(issue: ClassifiedIssue, context: RepairContext): Promise<AiRepairPlan> {
    const endpoint = this.config.endpoint ?? "https://api.openai.com/v1/chat/completions";
    const model = this.config.model ?? "gpt-4o-mini";

    if (!this.config.apiKey) {
      return new MockAiProvider().diagnose(issue, context);
    }

    const prompt = buildRepairPrompt(issue, context);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        return new MockAiProvider().diagnose(issue, context);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content ?? "";

      return parseStructuredPlan(content, issue) ?? new MockAiProvider().diagnose(issue, context);
    } catch {
      return new MockAiProvider().diagnose(issue, context);
    }
  }
}

class AnthropicCompatibleProvider implements AiProvider {
  name = "anthropic";
  constructor(private config: AiProviderConfig) {}

  async diagnose(issue: ClassifiedIssue, context: RepairContext): Promise<AiRepairPlan> {
    const endpoint = this.config.endpoint ?? "https://api.anthropic.com/v1/messages";
    const model = this.config.model ?? "claude-3-5-haiku-20241022";

    if (!this.config.apiKey) {
      return new MockAiProvider().diagnose(issue, context);
    }

    const prompt = buildRepairPrompt(issue, context);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        return new MockAiProvider().diagnose(issue, context);
      }

      const data = (await response.json()) as {
        content?: Array<{ text?: string }>;
      };
      const content = data.content?.[0]?.text ?? "";

      return parseStructuredPlan(content, issue) ?? new MockAiProvider().diagnose(issue, context);
    } catch {
      return new MockAiProvider().diagnose(issue, context);
    }
  }
}

function parseStructuredPlan(content: string, issue: ClassifiedIssue): AiRepairPlan | null {
  const parsed = parseRepairResponse(content);
  if (!parsed?.proposedChanges?.length && !parsed?.diagnosis) return null;

  return {
    diagnosis: parsed.diagnosis ?? issue.summary,
    confidence: parsed.confidence ?? issue.confidence,
    proposedChanges: parsed.proposedChanges ?? [],
    branchName: parsed.branchName ?? `dna/fix/${issue.fingerprint ?? issue.id.slice(0, 8)}`,
    prTitle: parsed.prTitle ?? `[DNA] Fix: ${issue.title}`,
    prBody: parsed.prBody ?? parsed.diagnosis ?? issue.summary,
    testPlan: parsed.testPlan ?? issue.testRecommendation ?? "Add regression test",
  };
}

function buildRepairPrompt(issue: ClassifiedIssue, context: RepairContext): string {
  return [
    "You are DNA by Humaan aggressive repair. Diagnose this production issue and produce applicable code patches.",
    "Never suggest editing secrets. Always include tests in testPlan. Never suggest auto-merge.",
    issue.isBlocker ? "This is a BLOCKER — repeat threshold exceeded. You MUST propose concrete code changes." : "",
    "",
    `Issue: ${issue.title}`,
    `Summary: ${issue.summary}`,
    `Category: ${issue.category}`,
    `Severity: ${issue.severity}`,
    issue.fingerprint ? `Fingerprint: ${issue.fingerprint}` : "",
    issue.repeatCount != null ? `Repeat count: ${issue.repeatCount}` : "",
    issue.suspectedCause ? `Suspected cause: ${issue.suspectedCause}` : "",
    issue.suggestedFix ? `Suggested fix: ${issue.suggestedFix}` : "",
    "",
    "Behaviour context:",
    context.behaviour.join("\n---\n"),
    "",
    "Memory context:",
    context.memory.join("\n---\n"),
    "",
    "Code snippets:",
    context.codeSnippets.map((s) => `### ${s.file}\n${s.content}`).join("\n\n"),
    buildStructuredRepairPromptSuffix(),
  ]
    .filter(Boolean)
    .join("\n");
}

export async function runRepairWorkflow(
  provider: AiProvider,
  issue: ClassifiedIssue,
  context: RepairContext,
): Promise<AiRepairPlan> {
  return provider.diagnose(issue, context);
}

export { executeRepairWorkflow } from "./orchestrator.js";
export type { ExecuteRepairOptions, ExecuteRepairResult } from "./orchestrator.js";
export { parseRepairResponse, applyPatches, buildStructuredRepairPromptSuffix } from "./patch-parser.js";
export { gatewayRepairPlaybook } from "./gateway-playbook.js";
