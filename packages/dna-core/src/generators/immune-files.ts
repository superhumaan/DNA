export function generateImmuneSystem(): Record<string, string> {
  return {
    "rules.json": JSON.stringify(
      {
        version: "0.1.0",
        rules: [
          {
            id: "gateway_error",
            condition: "status_code >= 502 && count >= 3 in 5m",
            category: "deployment",
            severity: "high",
          },
          {
            id: "repeated_500",
            condition: "status_code == 500 && count >= 3 in 5m",
            category: "runtime_error",
            severity: "high",
          },
          {
            id: "slow_endpoint",
            condition: "duration_ms > 3000",
            category: "performance",
            severity: "medium",
          },
          {
            id: "auth_failure_spike",
            condition: "status_code in [401, 403] && count >= 10 in 5m",
            category: "auth",
            severity: "high",
          },
          {
            id: "uncaught_exception",
            condition: "type == uncaught_exception",
            category: "runtime_error",
            severity: "critical",
          },
          {
            id: "memory_spike",
            condition: "type == memory_spike",
            category: "performance",
            severity: "medium",
          },
        ],
      },
      null,
      2,
    ),
    "severity-model.json": JSON.stringify(
      {
        version: "0.1.0",
        levels: {
          low: { description: "Informational, no immediate action", autoIssue: false },
          medium: { description: "Should be addressed in next sprint", autoIssue: false },
          high: { description: "Requires prompt attention", autoIssue: true },
          critical: { description: "Production impact, immediate action", autoIssue: true },
        },
      },
      null,
      2,
    ),
    "issue-classifier.json": JSON.stringify(
      {
        version: "0.1.0",
        classifiers: [
          { pattern: "ECONNREFUSED|ETIMEDOUT", category: "database", discipline: "backend" },
          { pattern: "JWT|token|unauthorized", category: "auth", discipline: "security" },
          { pattern: "timeout|slow", category: "performance", discipline: "backend" },
          { pattern: "Cannot find module", category: "dependency", discipline: "devops" },
          { pattern: "validation|ZodError", category: "runtime_error", discipline: "backend" },
          {
            pattern: "HTTP 502|HTTP 503|HTTP 504|Bad gateway|bad gateway",
            category: "deployment",
            discipline: "devops",
          },
          { pattern: "ECONNRESET|upstream|gateway", category: "deployment", discipline: "devops" },
        ],
      },
      null,
      2,
    ),
  };
}
