import type { AiRepairPlan, ClassifiedIssue } from "@humaan/dna-config";

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
    const branchName = `dna/fix/${issue.category}-${issue.id.slice(0, 8)}`;

    return {
      diagnosis: [
        `Mock diagnosis for ${issue.category} issue.`,
        `Summary: ${issue.summary}`,
        issue.suspectedCause ? `Likely cause: ${issue.suspectedCause}` : "",
        `Reviewed ${context.behaviour.length} Behaviour files and ${context.memory.length} memory files.`,
      ]
        .filter(Boolean)
        .join("\n"),
      confidence: issue.confidence,
      proposedChanges: [
        {
          file: "src/index.ts",
          description: "Add error handling for the failing code path",
          patch: `// DNA suggested fix for: ${issue.title}\ntry {\n  // existing code\n} catch (error) {\n  logger.error({ err: error }, '${issue.category}');\n  throw error;\n}`,
        },
      ],
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
        "- This PR was created by DNA AI repair",
        "- **Not auto-merged** — requires human review",
        "- Secrets were redacted before AI analysis",
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
        }),
      });

      if (!response.ok) {
        return new MockAiProvider().diagnose(issue, context);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content ?? "";

      return {
        diagnosis: content || issue.summary,
        confidence: issue.confidence,
        proposedChanges: [],
        branchName: `dna/fix/${issue.id.slice(0, 8)}`,
        prTitle: `[DNA] Fix: ${issue.title}`,
        prBody: content,
        testPlan: issue.testRecommendation ?? "Add regression test",
      };
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
          max_tokens: 2048,
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

      return {
        diagnosis: content || issue.summary,
        confidence: issue.confidence,
        proposedChanges: [],
        branchName: `dna/fix/${issue.id.slice(0, 8)}`,
        prTitle: `[DNA] Fix: ${issue.title}`,
        prBody: content,
        testPlan: issue.testRecommendation ?? "Add regression test",
      };
    } catch {
      return new MockAiProvider().diagnose(issue, context);
    }
  }
}

function buildRepairPrompt(issue: ClassifiedIssue, context: RepairContext): string {
  return [
    "You are DNA by Humaan AI repair. Diagnose this production issue and suggest a fix.",
    "Never suggest editing secrets. Always recommend tests. Never suggest auto-merge.",
    "",
    `Issue: ${issue.title}`,
    `Summary: ${issue.summary}`,
    `Category: ${issue.category}`,
    `Severity: ${issue.severity}`,
    "",
    "Behaviour context:",
    context.behaviour.join("\n---\n"),
    "",
    "Memory context:",
    context.memory.join("\n---\n"),
  ].join("\n");
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
