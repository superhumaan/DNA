import { watch } from "node:fs";
import { join } from "node:path";
import { createLogger } from "./logger.js";
import { fileExists, writeJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { generateNeuralNetwork } from "./generators/neural-network.js";
import { loadDnaConfig } from "./validator.js";
import { NEURAL_NETWORK_ALT, NEURAL_NETWORK_FILE } from "@superhumaan/dna-config";

const log = createLogger("watch");

export interface WatchOptions {
  root: string;
  onDrift?: (message: string) => void;
}

async function updateRecentChanges(root: string, changedFile: string): Promise<void> {
  const memPath = join(root, ".DNA", "CellularMemory", "hippocampus", "recent-changes.md");
  if (!(await fileExists(memPath))) return;

  const now = new Date().toISOString();
  const entry = `- ${now}: Changed \`${changedFile}\`\n`;
  const { appendFile } = await import("node:fs/promises");
  await appendFile(memPath, entry, "utf-8");
}

async function refreshNeuralNetworkIfNeeded(root: string): Promise<boolean> {
  const config = await loadDnaConfig(root);
  if (!config) return false;

  const scan = await scanProject(root);
  const stackChanged =
    scan.frontend !== config.stack.frontend ||
    scan.backend !== config.stack.backend ||
    scan.database !== config.stack.database;

  if (!stackChanged) return false;

  config.stack = {
    ...config.stack,
    frontend: scan.frontend ?? config.stack.frontend,
    backend: scan.backend ?? config.stack.backend,
    database: scan.database ?? config.stack.database,
    packageManager: scan.packageManager ?? config.stack.packageManager,
  };
  config.updatedAt = new Date().toISOString();

  const neural = generateNeuralNetwork(config);
  await writeJsonFile(join(root, NEURAL_NETWORK_FILE), neural);
  await writeJsonFile(join(root, NEURAL_NETWORK_ALT), neural);
  await writeJsonFile(join(root, ".DNA/config.dna.json"), config);
  return true;
}

async function detectDocumentationDrift(root: string, changedFile: string): Promise<string[]> {
  const warnings: string[] = [];
  const archPaths = ["src/", "app/", "packages/", "lib/"];
  const isSource = archPaths.some((p) => changedFile.startsWith(p));

  if (isSource) {
    const scan = await scanProject(root);
    if (scan.missingDocs.length > 0) {
      warnings.push(
        `Documentation drift: ${scan.missingDocs.length} Impressions may be outdated after ${changedFile}`,
      );
    }
    warnings.push(`Consider updating DNA/Impressions/ after changing ${changedFile}`);
  }

  return warnings;
}

const WATCH_DIRS = ["src", "app", "lib", "packages", "DNA/Impressions"];

function shouldIgnorePath(filePath: string): boolean {
  return /(node_modules|\.git|\/dist\/|\/build\/|\/coverage\/)/.test(filePath);
}

export async function startWatch(options: WatchOptions): Promise<() => void> {
  const { root, onDrift } = options;
  const watchers: ReturnType<typeof watch>[] = [];
  const pending = new Map<string, ReturnType<typeof setTimeout>>();

  const notify = (msg: string) => {
    log.info(msg);
    onDrift?.(msg);
  };

  const handleEvent = (eventType: "change" | "add", filePath: string) => {
    if (shouldIgnorePath(filePath)) return;
    const rel = filePath.replace(root + "/", "").replace(root + "\\", "");
    const key = `${eventType}:${rel}`;
    const existing = pending.get(key);
    if (existing) clearTimeout(existing);
    pending.set(
      key,
      setTimeout(async () => {
        pending.delete(key);
        notify(eventType === "add" ? `File added: ${rel}` : `File changed: ${rel}`);
        await updateRecentChanges(root, rel);
        const drift = await detectDocumentationDrift(root, rel);
        for (const w of drift) notify(`⚠ ${w}`);
        if (rel === "package.json") {
          const refreshed = await refreshNeuralNetworkIfNeeded(root);
          if (refreshed) notify("✓ neuralNetwork refreshed after stack change");
        }
      }, 150),
    );
  };

  for (const dir of WATCH_DIRS) {
    const target = join(root, dir);
    if (!(await fileExists(target))) continue;
    try {
      const watcher = watch(target, { recursive: true }, (event, filename) => {
        if (!filename) return;
        const full = join(target, filename.toString());
        handleEvent(event === "rename" ? "add" : "change", full);
      });
      watchers.push(watcher);
    } catch {
      // fs.watch recursive may be unavailable on some platforms
    }
  }

  notify("DNA watch mode started. Press Ctrl+C to stop.");
  return () => {
    for (const w of watchers) w.close();
    for (const timer of pending.values()) clearTimeout(timer);
    pending.clear();
  };
}
