import { exec } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import type { DnaConfig, ScanResult } from "@superhumaan/dna-config";
import { fileExists, writeFileEnsured } from "../fs.js";
import { scanProject } from "../scanner.js";

const execAsync = promisify(exec);

export interface InstallDockerOptions {
  root: string;
  config: DnaConfig;
  scan?: ScanResult;
  skipIfExists?: boolean;
}

export interface InstallDockerResult {
  created: string[];
  skipped: string[];
}

export interface DockerBuildResult {
  success: boolean;
  imageTag: string;
  output: string;
  skipped: boolean;
  reason?: string;
}

function pmInstall(pm: string | undefined): string {
  switch (pm) {
    case "pnpm":
      return "corepack enable pnpm && pnpm install --frozen-lockfile";
    case "yarn":
      return "yarn install --frozen-lockfile";
    default:
      return "npm ci";
  }
}

function pmBuild(pm: string | undefined, scripts: Record<string, string>): string {
  if (scripts.build) {
    switch (pm) {
      case "pnpm":
        return "pnpm run build";
      case "yarn":
        return "yarn build";
      default:
        return "npm run build";
    }
  }
  return "echo 'no build step'";
}

function pmStart(pm: string | undefined, scripts: Record<string, string>): string {
  if (scripts.start) {
    switch (pm) {
      case "pnpm":
        return 'CMD ["pnpm", "start"]';
      case "yarn":
        return 'CMD ["yarn", "start"]';
      default:
        return 'CMD ["npm", "start"]';
    }
  }
  return 'CMD ["node", "dist/index.js"]';
}

export function generateDockerfile(scan: ScanResult): string {
  const pm = scan.packageManager ?? "npm";
  const lockCopy =
    pm === "pnpm"
      ? "COPY package.json pnpm-lock.yaml* ./"
      : pm === "yarn"
        ? "COPY package.json yarn.lock* ./"
        : "COPY package.json package-lock.json* ./";

  return `# DNA-generated multi-stage Dockerfile — constant build verification
# Rebuild: docker build -t dna-app:local .

FROM node:22-alpine AS deps
WORKDIR /app
${lockCopy}
RUN ${pmInstall(pm)}

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${pmBuild(pm, scan.scripts)}

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
COPY --from=build --chown=nodejs:nodejs /app ./
EXPOSE 3000
${pmStart(pm, scan.scripts)}
`;
}

export function generateDockerCompose(_projectName: string): string {
  return `# DNA-generated — local smoke test after every feature
services:
  app:
    build: .
    image: dna-app:local
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    # Override with .env for secrets — never commit real values
    env_file:
      - path: .env
        required: false
`;
}

export function generateDockerignore(): string {
  return `node_modules
dist
build
.git
.DNA/data
.DNA/reports
.DNA/credentials
coverage
*.md
!README.md
`;
}

export async function ensureDockerScript(
  root: string,
  _scan: ScanResult,
): Promise<string[]> {
  const pkgPath = join(root, "package.json");
  if (!(await fileExists(pkgPath))) return [];

  const updated: string[] = [];
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  const scripts = { ...(pkg.scripts ?? {}) };

  if (!scripts["docker:build"]) {
    scripts["docker:build"] = "docker build -t dna-app:local .";
    updated.push('package.json script "docker:build"');
  }
  if (!scripts["docker:verify"]) {
    scripts["docker:verify"] =
      "docker build -t dna-app:local . && docker run --rm dna-app:local node -e \"console.log('ok')\"";
    updated.push('package.json script "docker:verify"');
  }

  if (updated.length > 0) {
    pkg.scripts = scripts;
    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }

  return updated;
}

export async function installDockerScaffold(
  options: InstallDockerOptions,
): Promise<InstallDockerResult> {
  const { root, skipIfExists = true } = options;
  const scan = options.scan ?? (await scanProject(root));
  const created: string[] = [];
  const skipped: string[] = [];

  const dockerfilePath = join(root, "Dockerfile");
  if (skipIfExists && (await fileExists(dockerfilePath))) {
    skipped.push("Dockerfile (already exists)");
  } else {
    await writeFileEnsured(dockerfilePath, generateDockerfile(scan));
    created.push("Dockerfile");
  }

  const composePath = join(root, "docker-compose.yml");
  if (!(await fileExists(composePath))) {
    await writeFileEnsured(
      composePath,
      generateDockerCompose(options.config.projectName),
    );
    created.push("docker-compose.yml");
  }

  const ignorePath = join(root, ".dockerignore");
  if (!(await fileExists(ignorePath))) {
    await writeFileEnsured(ignorePath, generateDockerignore());
    created.push(".dockerignore");
  }

  const scriptUpdates = await ensureDockerScript(root, scan);
  created.push(...scriptUpdates);

  return { created, skipped };
}

export async function isDockerAvailable(): Promise<boolean> {
  try {
    await execAsync("docker version", { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

export async function runDockerBuild(
  root: string,
  imageTag = "dna-app:local",
): Promise<DockerBuildResult> {
  if (!(await fileExists(join(root, "Dockerfile")))) {
    return {
      success: false,
      imageTag,
      output: "",
      skipped: true,
      reason: "No Dockerfile — run `dna docker install` first",
    };
  }

  if (!(await isDockerAvailable())) {
    return {
      success: false,
      imageTag,
      output: "",
      skipped: true,
      reason: "Docker is not installed or not running",
    };
  }

  try {
    const { stdout, stderr } = await execAsync(`docker build -t ${imageTag} .`, {
      cwd: root,
      maxBuffer: 8 * 1024 * 1024,
      timeout: 600_000,
    });
    return {
      success: true,
      imageTag,
      output: (stdout + stderr).trim().slice(-4000),
      skipped: false,
    };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string; message?: string };
    return {
      success: false,
      imageTag,
      output: [e.stdout, e.stderr, e.message].filter(Boolean).join("\n").slice(-4000),
      skipped: false,
      reason: "docker build failed",
    };
  }
}
