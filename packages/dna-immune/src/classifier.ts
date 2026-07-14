import { randomUUID } from "node:crypto";
import type { ClassifiedIssue, RuntimeEvent } from "@superhumaan/dna-config";
import { ISSUE_CATEGORIES, SEVERITY_LEVELS } from "@superhumaan/dna-config";
import type { ImmuneConfig } from "./immune-config.js";
import { loadImmuneConfig, DEFAULT_CLASSIFIERS } from "./immune-config.js";
import { checkBehaviourViolation } from "./behaviour-check.js";

let cachedConfig: ImmuneConfig | null = null;
let cachedRoot: string | null = null;

export async function getImmuneConfig(dnaRoot?: string): Promise<ImmuneConfig> {
  if (dnaRoot && dnaRoot !== cachedRoot) {
    cachedConfig = await loadImmuneConfig(dnaRoot);
    cachedRoot = dnaRoot;
  }
  if (!cachedConfig) {
    cachedConfig = await loadImmuneConfig(dnaRoot ?? ".DNA");
  }
  return cachedConfig;
}

export function resetImmuneCache(): void {
  cachedConfig = null;
  cachedRoot = null;
}

function matchCategory(
  message: string,
  type: RuntimeEvent["type"],
  classifiers: ImmuneConfig["classifiers"],
): {
  category: (typeof ISSUE_CATEGORIES)[number];
  discipline: string;
} {
  for (const rule of classifiers) {
    if (new RegExp(rule.pattern, "i").test(message)) {
      return { category: rule.category, discipline: rule.discipline };
    }
  }

  if (type === "slow_request") return { category: "performance", discipline: "backend" };
  if (type === "repeated_error") return { category: "runtime_error", discipline: "backend" };
  if (type === "memory_spike") return { category: "performance", discipline: "devops" };
  if (type === "third_party_response") return { category: "dependency", discipline: "backend" };

  return { category: "unknown", discipline: "backend" };
}

function determineSeverity(
  event: RuntimeEvent,
  category: (typeof ISSUE_CATEGORIES)[number],
  immuneConfig: ImmuneConfig,
  repeatCount?: number,
): (typeof SEVERITY_LEVELS)[number] {
  for (const rule of immuneConfig.rules) {
    if (ruleMatches(event, rule, repeatCount)) {
      return rule.severity;
    }
  }

  if (event.type === "uncaught_exception" || event.type === "unhandled_rejection") {
    return "critical";
  }
  if (event.type === "repeated_error") return "high";
  if (event.statusCode && event.statusCode >= 502) return "high";
  if (event.statusCode && event.statusCode >= 500) return "high";
  if (event.type === "slow_request" && (event.durationMs ?? 0) > 5000) return "high";
  if (event.type === "slow_request") return "medium";
  if (category === "auth" && event.statusCode && [401, 403].includes(event.statusCode)) {
    return "medium";
  }
  if (event.type === "memory_spike") return "medium";
  return "low";
}

function ruleMatches(
  event: RuntimeEvent,
  rule: ImmuneConfig["rules"][number],
  repeatCount = 0,
): boolean {
  const cond = rule.condition;
  if (cond.includes("uncaught_exception") && event.type === "uncaught_exception") return true;
  if (cond.includes("memory_spike") && event.type === "memory_spike") return true;
  if (cond.includes("duration_ms") && event.type === "slow_request") {
    const threshold = parseInt(cond.match(/>\s*(\d+)/)?.[1] ?? "3000", 10);
    return (event.durationMs ?? 0) > threshold;
  }
  if (cond.includes("count >=")) {
    const threshold = parseInt(cond.match(/count\s*>=\s*(\d+)/)?.[1] ?? "3", 10);
    if (repeatCount < threshold) return false;
    if (cond.includes("status_code == 500") && event.statusCode && event.statusCode >= 500) {
      return true;
    }
    if (
      cond.includes("[401, 403]") &&
      event.statusCode &&
      [401, 403].includes(event.statusCode)
    ) {
      return true;
    }
  }
  if (cond.includes("status_code == 500") && event.statusCode === 500) return true;
  if (cond.includes("status_code >= 502") && event.statusCode && event.statusCode >= 502) {
    return true;
  }
  if (cond.includes("[401, 403]") && event.statusCode && [401, 403].includes(event.statusCode)) {
    return true;
  }
  return false;
}

function stackTraceSummary(stack?: string): string | undefined {
  if (!stack) return undefined;
  return stack.split("\n").slice(0, 5).join("\n");
}

export interface ClassifyOptions {
  repeated?: boolean;
  behaviourViolation?: boolean;
  dnaRoot?: string;
  repeatCount?: number;
}

export async function classifyIssue(
  event: RuntimeEvent,
  options: ClassifyOptions = {},
): Promise<ClassifiedIssue> {
  const immuneConfig = await getImmuneConfig(options.dnaRoot);
  const { category, discipline } = matchCategory(event.message, event.type, immuneConfig.classifiers);
  const severity = determineSeverity(event, category, immuneConfig, options.repeatCount);
  const confidence = category === "unknown" ? 0.4 : 0.75;

  const behaviourViolation =
    options.behaviourViolation ??
    (options.dnaRoot ? await checkBehaviourViolation(options.dnaRoot, event) : false);

  const repeated =
    options.repeated ??
    (event.type === "repeated_error" || (options.repeatCount ?? 0) >= 3);

  const title =
    event.endpoint != null
      ? `${severity.toUpperCase()}: ${event.type} on ${event.method ?? "GET"} ${event.endpoint}`
      : `${severity.toUpperCase()}: ${event.type} — ${event.message.slice(0, 80)}`;

  return {
    id: randomUUID(),
    eventId: event.id,
    severity,
    category,
    discipline,
    behaviourViolation,
    repeated,
    projectRisk: severity === "critical" || severity === "high" ? "elevated" : "normal",
    confidence,
    title,
    summary: event.message,
    suspectedCause: inferSuspectedCause(event, category),
    relevantBehaviour: inferBehaviour(category),
    relevantMemory: inferMemory(category, repeated),
    suggestedFix: inferSuggestedFix(category),
    testRecommendation: inferTestRecommendation(category),
    reproductionNotes: event.endpoint
      ? `Request: ${event.method ?? "GET"} ${event.endpoint} returned ${event.statusCode ?? "error"}`
      : undefined,
    endpoint: event.endpoint,
    stackTraceSummary: stackTraceSummary(event.stack),
  };
}

/** Sync classify using cached/default config — for tests */
export function classifyIssueSync(
  event: RuntimeEvent,
  options: ClassifyOptions = {},
): ClassifiedIssue {
  const immuneConfig = cachedConfig ?? {
    rules: [],
    classifiers: DEFAULT_CLASSIFIERS,
    autoIssueSeverities: new Set(["high", "critical"]),
  };
  const { category, discipline } = matchCategory(event.message, event.type, immuneConfig.classifiers);
  const severity = determineSeverity(event, category, immuneConfig);

  return {
    id: randomUUID(),
    eventId: event.id,
    severity,
    category,
    discipline,
    behaviourViolation: options.behaviourViolation ?? false,
    repeated: options.repeated ?? false,
    projectRisk: severity === "critical" || severity === "high" ? "elevated" : "normal",
    confidence: 0.75,
    title: `${severity.toUpperCase()}: ${event.message.slice(0, 80)}`,
    summary: event.message,
    relevantBehaviour: inferBehaviour(category),
    relevantMemory: inferMemory(category),
    endpoint: event.endpoint,
    stackTraceSummary: stackTraceSummary(event.stack),
  };
}

export function shouldAutoCreateIssue(
  issue: ClassifiedIssue,
  immuneConfig: ImmuneConfig,
): boolean {
  return immuneConfig.autoIssueSeverities.has(issue.severity);
}

function inferSuspectedCause(
  event: RuntimeEvent,
  category: (typeof ISSUE_CATEGORIES)[number],
): string {
  if (category === "deployment") {
    if (event.statusCode && event.statusCode >= 502) {
      return "Origin server unreachable, crashed, or misconfigured — gateway/proxy returned bad response";
    }
    return "Deployment, hosting, or infrastructure misconfiguration";
  }
  if (category === "database") return "Database connection or query failure";
  if (category === "auth") return "Authentication or authorization misconfiguration";
  if (category === "performance") return `Slow response (${event.durationMs ?? "?"}ms)`;
  if (category === "dependency") return "Missing or incompatible dependency";
  return "Unhandled error in application code";
}

function inferBehaviour(category: (typeof ISSUE_CATEGORIES)[number]): string[] {
  const map: Partial<Record<(typeof ISSUE_CATEGORIES)[number], string[]>> = {
    runtime_error: ["runtime.behaviour.md", "coding.behaviour.md"],
    security_risk: ["security.behaviour.md"],
    performance: ["runtime.behaviour.md"],
    auth: ["security.behaviour.md", "runtime.behaviour.md"],
    database: ["coding.behaviour.md", "runtime.behaviour.md"],
    deployment: ["runtime.behaviour.md", "reasoning.behaviour.md"],
  };
  return map[category] ?? ["runtime.behaviour.md", "reasoning.behaviour.md"];
}

function inferMemory(category: (typeof ISSUE_CATEGORIES)[number], repeated?: boolean): string[] {
  const memory = ["hippocampus/recent-changes.md"];
  if (repeated) memory.push("amygdala/repeated-failures.md");
  if (category === "deployment") memory.push("temporalLobe/previous-solutions.md");
  if (category === "auth") memory.push("amygdala/risks.md");
  if (category === "database") memory.push("parietalLobe/system-map.md");
  return memory;
}

function inferSuggestedFix(category: (typeof ISSUE_CATEGORIES)[number]): string {
  if (category === "deployment") {
    return [
      "Verify origin process is running and listening on the correct port",
      "Add or fix /health endpoint and container health checks",
      "Check deploy logs, env vars, upstream URL, and timeout settings",
      "Confirm Cloudflare/proxy points to a live origin — 502 means gateway cannot reach host",
    ].join("; ");
  }
  if (category === "database") return "Check database connection string and network access";
  if (category === "auth") return "Review authentication middleware and token validation";
  if (category === "performance") return "Profile endpoint and add caching or query optimisation";
  if (category === "dependency") return "Verify dependency is installed and import path is correct";
  return "Add error handling and regression test for this code path";
}

function inferTestRecommendation(category: (typeof ISSUE_CATEGORIES)[number]): string {
  if (category === "auth") return "Add integration tests for auth failure scenarios";
  if (category === "performance") return "Add performance benchmark or load test";
  if (category === "database") return "Add integration test with database mock";
  return "Add unit test reproducing this error condition";
}
