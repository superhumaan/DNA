import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { writeFileEnsured, fileExists } from "../../fs.js";
import { loadDnaConfig } from "../../validator.js";

export interface CodegenResult {
  created: string[];
  skipped: string[];
  planPath: string;
}

export interface CodegenOptions {
  root: string;
  feature?: string;
}

function rel(root: string, path: string): string {
  return path.startsWith(root) ? path.slice(root.length + 1) : path;
}

async function writeScaffold(
  root: string,
  baseDir: string,
  files: Record<string, string>,
): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = [];
  const skipped: string[] = [];
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, baseDir, name);
    if (await fileExists(path)) {
      skipped.push(rel(root, path));
      continue;
    }
    await writeFileEnsured(path, content);
    created.push(rel(root, path));
  }
  return { created, skipped };
}

async function ensureConfig(root: string): Promise<DnaConfig> {
  const config = await loadDnaConfig(root);
  if (!config) throw new Error("DNA not installed. Run `dna init` first.");
  return config;
}

export async function generateSsoScaffold(options: CodegenOptions): Promise<CodegenResult> {
  const config = await ensureConfig(options.root);
  const feature = options.feature ?? "sso";
  const { created, skipped } = await writeScaffold(options.root, "src/auth/sso", {
    "types.ts": `/** SSO types — ${config.projectName} */
export type SsoProvider = "google" | "okta" | "auth0";

export interface SsoProfile {
  provider: SsoProvider;
  subject: string;
  email: string;
  name?: string;
  tenantId?: string;
}
`,
    "providers.ts": `import type { SsoProfile, SsoProvider } from "./types.js";

export interface SsoProviderAdapter {
  id: SsoProvider;
  authorizeUrl(state: string): string;
  exchangeCode(code: string): Promise<SsoProfile>;
}

/** Wire Google / Okta / Auth0 SDKs here */
export const ssoProviders: Partial<Record<SsoProvider, SsoProviderAdapter>> = {};
`,
    "middleware.ts": `import type { Request, Response, NextFunction } from "express";

export function requireSsoSession(req: Request, res: Response, next: NextFunction): void {
  if (!(req as Request & { ssoUser?: unknown }).ssoUser) {
    res.status(401).json({ error: "SSO session required" });
    return;
  }
  next();
}
`,
    "routes.ts": `import { Router } from "express";

export const ssoRouter = Router();

ssoRouter.get("/login/:provider", (_req, res) => {
  res.status(501).json({ error: "Wire provider authorizeUrl" });
});

ssoRouter.get("/callback", (_req, res) => {
  res.status(501).json({ error: "Wire provider exchangeCode" });
});
`,
    "index.ts": `export * from "./types.js";
export * from "./providers.js";
export * from "./middleware.js";
export * from "./routes.js";
`,
  });

  const planPath = join(options.root, ".DNA", "plans", `sso-${feature}.md`);
  await writeFileEnsured(
    planPath,
    `# SSO Scaffold — ${config.projectName}\n\nProviders: Google, Okta, Auth0\n\nSee \`integrations/sso-bridge.dna.md\`.\n`,
  );

  return { created, skipped, planPath };
}

export async function generateMultiTenantScaffold(options: CodegenOptions): Promise<CodegenResult> {
  const config = await ensureConfig(options.root);
  const feature = options.feature ?? "multi-tenant";
  const { created, skipped } = await writeScaffold(options.root, "src/tenant", {
    "types.ts": `export interface TenantContext {
  tenantId: string;
  slug: string;
  plan?: string;
}
`,
    "middleware.ts": `import type { Request, Response, NextFunction } from "express";
import type { TenantContext } from "./types.js";

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

/** Resolve tenant from subdomain, header, or JWT claim */
export function tenantMiddleware(req: Request, res: Response, next: NextFunction): void {
  const tenantId = (req.headers["x-tenant-id"] as string | undefined) ?? req.subdomains?.[0];
  if (!tenantId) {
    res.status(400).json({ error: "Tenant required" });
    return;
  }
  req.tenant = { tenantId, slug: tenantId };
  next();
}
`,
    "isolation.ts": `/** Row-level isolation helper — add tenantId to all queries */
export function withTenantScope<T extends Record<string, unknown>>(tenantId: string, query: T): T & { tenantId: string } {
  return { ...query, tenantId };
}
`,
    "index.ts": `export * from "./types.js";
export * from "./middleware.js";
export * from "./isolation.js";
`,
  });

  const planPath = join(options.root, ".DNA", "plans", `multi-tenant-${feature}.md`);
  await writeFileEnsured(
    planPath,
    `# Multi-tenant Scaffold — ${config.projectName}\n\nIsolation: row-level tenantId column + middleware.\n`,
  );
  return { created, skipped, planPath };
}

export async function generateFeatureFlagsScaffold(options: CodegenOptions): Promise<CodegenResult> {
  const config = await ensureConfig(options.root);
  const feature = options.feature ?? "feature-flags";
  const { created, skipped } = await writeScaffold(options.root, "src/feature-flags", {
    "types.ts": `export type FlagProvider = "env" | "launchdarkly" | "unleash";

export interface FlagContext {
  userId?: string;
  tenantId?: string;
  attributes?: Record<string, string>;
}
`,
    "client.ts": `import type { FlagContext } from "./types.js";

const envFlags: Record<string, boolean> = {};

export function isFeatureEnabled(flag: string, context: FlagContext = {}): boolean {
  void context;
  const envKey = \`FEATURE_\${flag.toUpperCase().replace(/[^A-Z0-9]/g, "_")}\`;
  if (process.env[envKey] !== undefined) return process.env[envKey] === "true";
  return envFlags[flag] ?? false;
}

export function setFeatureFlag(flag: string, enabled: boolean): void {
  envFlags[flag] = enabled;
}
`,
    "middleware.ts": `import type { Request, Response, NextFunction } from "express";
import { isFeatureEnabled } from "./client.js";

export function requireFeature(flag: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const tenantId = req.tenant?.tenantId;
    if (!isFeatureEnabled(flag, { tenantId, userId: (req as Request & { userId?: string }).userId })) {
      res.status(404).json({ error: "Feature not available" });
      return;
    }
    next();
  };
}
`,
    "index.ts": `export * from "./types.js";
export * from "./client.js";
export * from "./middleware.js";
`,
  });

  const planPath = join(options.root, ".DNA", "plans", `feature-flags-${feature}.md`);
  await writeFileEnsured(
    planPath,
    `# Feature Flags Scaffold — ${config.projectName}\n\nEnv-based flags with LaunchDarkly/Unleash extension points.\n`,
  );
  return { created, skipped, planPath };
}

export async function generateGradualRolloutScaffold(options: CodegenOptions): Promise<CodegenResult> {
  const config = await ensureConfig(options.root);
  const feature = options.feature ?? "gradual-rollout";
  const { created, skipped } = await writeScaffold(options.root, "src/rollout", {
    "types.ts": `export interface RolloutRule {
  feature: string;
  percentage: number;
  tenantAllowlist?: string[];
}
`,
    "engine.ts": `import type { RolloutRule } from "./types.js";
import { isFeatureEnabled } from "../feature-flags/client.js";

const rules: RolloutRule[] = [];

export function configureRollout(rule: RolloutRule): void {
  const idx = rules.findIndex((r) => r.feature === rule.feature);
  if (idx >= 0) rules[idx] = rule;
  else rules.push(rule);
}

function bucket(userId: string, feature: string): number {
  let hash = 0;
  const key = \`\${feature}:\${userId}\`;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 100;
  return hash;
}

export function isRolledOut(feature: string, opts: { userId?: string; tenantId?: string }): boolean {
  if (isFeatureEnabled(feature, opts)) return true;
  const rule = rules.find((r) => r.feature === feature);
  if (!rule) return false;
  if (opts.tenantId && rule.tenantAllowlist?.includes(opts.tenantId)) return true;
  if (!opts.userId) return false;
  return bucket(opts.userId, feature) < rule.percentage;
}
`,
    "index.ts": `export * from "./types.js";
export * from "./engine.js";
`,
  });

  const planPath = join(options.root, ".DNA", "plans", `gradual-rollout-${feature}.md`);
  await writeFileEnsured(
    planPath,
    `# Gradual Rollout Scaffold — ${config.projectName}\n\nPer-tenant + percentage rollout. Pair with feature-flags scaffold.\n`,
  );
  return { created, skipped, planPath };
}

export const PLATFORM_CODEGEN_FEATURES = [
  "audit-logging",
  "sso",
  "multi-tenant",
  "feature-flags",
  "gradual-rollout",
] as const;

export type PlatformCodegenFeature = (typeof PLATFORM_CODEGEN_FEATURES)[number];

export function isPlatformCodegenFeature(id: string): id is PlatformCodegenFeature {
  return (PLATFORM_CODEGEN_FEATURES as readonly string[]).includes(id);
}
