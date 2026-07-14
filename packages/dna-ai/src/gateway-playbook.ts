import type { ClassifiedIssue } from "@superhumaan/dna-config";
import type { AiRepairPlan } from "@superhumaan/dna-config";

export function gatewayRepairPlaybook(issue: ClassifiedIssue): AiRepairPlan["proposedChanges"] {
  const isGateway =
    issue.category === "deployment" ||
    /HTTP 50[234]|bad gateway/i.test(issue.summary) ||
    /502|503|504/.test(issue.summary);

  if (!isGateway) return [];

  return [
    {
      file: "src/health.ts",
      description: "Add health check endpoint for gateway/load balancer probes",
      patch: [
        "// DNA gateway repair — health endpoint for origin probes",
        "export function registerHealthRoute(app: { get: (path: string, handler: () => void) => void }) {",
        "  app.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }));",
        "}",
      ].join("\n"),
    },
    {
      file: "Dockerfile",
      description: "Ensure container exposes correct port and has HEALTHCHECK",
      search: "EXPOSE",
      replace: "EXPOSE 3000\nHEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1",
    },
  ];
}
