import chokidar from "chokidar";
import { join } from "node:path";
import { createLogger } from "./logger.js";
import { fileExists, writeJsonFile } from "./fs.js";
import { scanProject } from "./scanner.js";
import { generateNeuralNetwork } from "./generators/neural-network.js";
import { loadDnaConfig } from "./validator.js";
import { NEURAL_NETWORK_ALT, NEURAL_NETWORK_FILE } from "@humaan/dna-config";

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

const SOURCE_PATTERNS = ["src/**/*", "app/**/*", "lib/**/*", "packages/**/*"];
const DOC_PATTERNS = ["DNA/Impressions/**/*"];

export async function startWatch(options: WatchOptions): Promise<() => void> {
  const { root, onDrift } = options;

  const notify = (msg: string) => {
    log.info(msg);
    onDrift?.(msg);
  };

  const watcher = chokidar.watch(
    [...SOURCE_PATTERNS, ...DOC_PATTERNS].map((p) => join(root, p)),
    {
      ignored: /(node_modules|\.git|dist)/,
      persistent: true,
      ignoreInitial: true,
    },
  );

  watcher.on("change", async (filePath) => {
    const rel = filePath.replace(root + "/", "");
    notify(`File changed: ${rel}`);
    await updateRecentChanges(root, rel);

    const drift = await detectDocumentationDrift(root, rel);
    for (const w of drift) notify(`⚠ ${w}`);

    if (rel === "package.json") {
      const refreshed = await refreshNeuralNetworkIfNeeded(root);
      if (refreshed) notify("✓ neuralNetwork refreshed after stack change");
    }
  });

  watcher.on("add", async (filePath) => {
    const rel = filePath.replace(root + "/", "");
    notify(`File added: ${rel}`);
    await updateRecentChanges(root, rel);
  });

  notify("DNA watch mode started. Press Ctrl+C to stop.");
  return () => watcher.close();
}
