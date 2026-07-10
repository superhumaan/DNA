import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, fileExists } from "../../fs.js";
import { loadDnaConfig } from "../../validator.js";

export interface GenerateAuditLoggingOptions {
  root: string;
  feature?: string;
}

export interface GenerateAuditLoggingResult {
  created: string[];
  skipped: string[];
  planPath: string;
}

function auditDir(root: string): string {
  return join(root, "src", "audit");
}

export async function generateAuditLoggingScaffold(
  options: GenerateAuditLoggingOptions,
): Promise<GenerateAuditLoggingResult> {
  const config = (await loadDnaConfig(options.root)) ?? null;
  if (!config) {
    throw new Error("DNA not installed. Run `dna init` first.");
  }

  const created: string[] = [];
  const skipped: string[] = [];
  const base = auditDir(options.root);
  const feature = options.feature ?? "default";

  const files: Record<string, string> = {
    "types.ts": generateTypes(config),
    "store.ts": generateStore(config),
    "middleware.ts": generateMiddleware(config),
    "routes.ts": generateRoutes(config),
    "index.ts": generateIndex(),
  };

  for (const [name, content] of Object.entries(files)) {
    const path = join(base, name);
    if (await fileExists(path)) {
      skipped.push(relativePath(options.root, path));
      continue;
    }
    await writeFileEnsured(path, content);
    created.push(relativePath(options.root, path));
  }

  const envExample = join(options.root, ".env.audit.example");
  if (!(await fileExists(envExample))) {
    await writeFileEnsured(envExample, generateEnvExample(config));
    created.push(relativePath(options.root, envExample));
  } else {
    skipped.push(relativePath(options.root, envExample));
  }

  const planPath = join(options.root, ".DNA", "plans", `audit-logging-${feature}.md`);
  await writeFileEnsured(planPath, generatePlan(config, feature, created));

  return { created, skipped, planPath };
}

function relativePath(root: string, path: string): string {
  return path.startsWith(root) ? path.slice(root.length + 1) : path;
}

function generateTypes(config: DnaConfig): string {
  return `/** DNA-generated audit logging types — ${config.projectName} */

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "admin";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail?: string;
  tenantId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditQuery {
  tenantId?: string;
  actorId?: string;
  action?: AuditAction;
  resource?: string;
  from?: string;
  to?: string;
  limit?: number;
}
`;
}

function generateStore(config: DnaConfig): string {
  return `/** Append-only audit store — wire to your database in production */
import type { AuditEvent, AuditQuery } from "./types.js";

const events: AuditEvent[] = [];

export async function appendAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">): Promise<AuditEvent> {
  const record: AuditEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  events.push(record);
  // TODO: persist to ${config.stack.database ?? "your database"}
  return record;
}

export async function queryAuditEvents(query: AuditQuery = {}): Promise<AuditEvent[]> {
  let result = [...events];
  if (query.tenantId) result = result.filter((e) => e.tenantId === query.tenantId);
  if (query.actorId) result = result.filter((e) => e.actorId === query.actorId);
  if (query.action) result = result.filter((e) => e.action === query.action);
  if (query.resource) result = result.filter((e) => e.resource === query.resource);
  if (query.from) result = result.filter((e) => e.timestamp >= query.from!);
  if (query.to) result = result.filter((e) => e.timestamp <= query.to!);
  result.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return result.slice(0, query.limit ?? 100);
}
`;
}

function generateMiddleware(config: DnaConfig): string {
  const backend = config.stack.backend ?? "express";
  if (backend === "fastify") {
    return `import type { FastifyRequest, FastifyReply } from "fastify";
import { appendAuditEvent } from "./store.js";

export async function auditHook(
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown,
): Promise<void> {
  if (request.method === "GET") return;
  const user = (request as { user?: { id?: string; email?: string } }).user;
  await appendAuditEvent({
    actorId: user?.id ?? "anonymous",
    actorEmail: user?.email,
    action: request.method === "POST" ? "create" : request.method === "DELETE" ? "delete" : "update",
    resource: request.url,
    ipAddress: request.ip,
    userAgent: request.headers["user-agent"],
  });
}
`;
  }

  return `import type { Request, Response, NextFunction } from "express";
import { appendAuditEvent } from "./store.js";

export function auditMiddleware(resource: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.on("finish", () => {
      if (req.method === "GET" || res.statusCode >= 400) return;
      const user = (req as { user?: { id?: string; email?: string } }).user;
      void appendAuditEvent({
        actorId: user?.id ?? "anonymous",
        actorEmail: user?.email,
        action: req.method === "POST" ? "create" : req.method === "DELETE" ? "delete" : "update",
        resource,
        resourceId: req.params?.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      });
    });
    next();
  };
}
`;
}

function generateRoutes(_config: DnaConfig): string {
  return `/** Admin audit log API — protect with RBAC in production */
import { queryAuditEvents } from "./store.js";
import type { AuditQuery } from "./types.js";

export async function listAuditEvents(query: AuditQuery) {
  return queryAuditEvents(query);
}

// Wire into your router:
// app.get("/api/admin/audit", requireAdmin, async (req, res) => {
//   res.json(await listAuditEvents(req.query));
// });
`;
}

function generateIndex(): string {
  return `export * from "./types.js";
export * from "./store.js";
export * from "./middleware.js";
export * from "./routes.js";
`;
}

function generateEnvExample(config: DnaConfig): string {
  return `# Audit logging — ${config.projectName}
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=365
AUDIT_EXPORT_ALLOWLIST=admin,compliance
`;
}

function generatePlan(config: DnaConfig, feature: string, created: string[]): string {
  return `# Audit Logging Scaffold — ${config.projectName}

_Generated by \`dna generate feature audit-logging\`_

## Files created

${created.map((f) => `- \`${f}\``).join("\n")}

## Next steps

1. Wire \`auditMiddleware\` or \`auditHook\` into your ${config.stack.backend ?? "server"} routes
2. Replace in-memory store with ${config.stack.database ?? "persistent"} table (append-only)
3. Add admin UI tab for audit log search + CSV export
4. Document in \`DNA/Impressions/security/audit-logging.md\`
5. Run \`dna validate\` and add RBAC gate (\`dna plan rbac\`)

## Reference

- Platform catalog: \`audit-logging\`
- Knowledge: \`platforms/dna/audit.dna.md\`
- Feature: ${feature}
`;
}
