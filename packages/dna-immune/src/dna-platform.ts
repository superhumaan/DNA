import type { ClassifiedIssue, FeedbackSource, RuntimeEvent } from "@superhumaan/dna-config";

const DNA_STACK_PATTERNS = [
  /@superhumaan\/dna/i,
  /node_modules[/\\]@superhumaan[/\\]dna/i,
  /packages[/\\]dna-/i,
  /dna-cli[/\\]dist/i,
  /dna-by-humaan/i,
];

const DNA_MESSAGE_PATTERNS = [
  /\.DNA[/\\]/i,
  /config\.dna\.json/i,
  /dna (doctor|init|update|quality|github|runtime)/i,
  /DNA not installed/i,
  /neuralNetwork\.json/i,
  /CellularMemory/i,
  /immuneSystem/i,
  /knowledge pack/i,
  /marketplace catalog/i,
];

const DNA_COMMAND_PREFIXES = [
  "dna ",
  "npx dna ",
  "pnpm dna ",
  "npm exec dna ",
];

export interface DnaPlatformCheck {
  message: string;
  stack?: string;
  command?: string;
  source?: FeedbackSource;
  issue?: ClassifiedIssue;
  event?: RuntimeEvent;
}

function stackLooksDna(stack?: string): boolean {
  if (!stack) return false;
  return DNA_STACK_PATTERNS.some((pattern) => pattern.test(stack));
}

function messageLooksDna(message: string): boolean {
  return DNA_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function commandLooksDna(command?: string): boolean {
  if (!command) return false;
  return DNA_COMMAND_PREFIXES.some((prefix) => command.trimStart().startsWith(prefix));
}

/**
 * Returns true when the failure likely originates in DNA itself (CLI, doctor, runtime
 * middleware, or bundled packages) — not the user's application code.
 */
export function isDnaPlatformIssue(input: DnaPlatformCheck): boolean {
  if (input.source === "cli" || input.source === "doctor" || input.source === "manual") {
    return true;
  }

  if (commandLooksDna(input.command)) {
    return true;
  }

  if (stackLooksDna(input.stack) || stackLooksDna(input.issue?.stackTraceSummary)) {
    return true;
  }

  if (messageLooksDna(input.message)) {
    return true;
  }

  if (input.issue?.category === "ai_bad_behaviour") {
    return true;
  }

  if (input.event?.stack && stackLooksDna(input.event.stack)) {
    return true;
  }

  return false;
}

export function shouldReportUpstream(
  input: DnaPlatformCheck,
  autoReport: "off" | "dna-only" | "all",
): boolean {
  if (autoReport === "off") return false;
  if (autoReport === "all") return true;
  return isDnaPlatformIssue(input);
}
