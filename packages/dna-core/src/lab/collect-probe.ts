import { DNA_LAB_API_PREFIX } from "@superhumaan/dna-config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileExists } from "../fs.js";
import { loadDnaConfig } from "../validator.js";

export interface LabProbeCall {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ok: boolean;
  message: string;
  responsePreview: string;
  timestamp: string;
}

export interface LabProbeStore {
  lastProbeAt: string | null;
  results: LabProbeCall[];
}

const DEFAULT_TTL_HOURS = 5;

function probePath(root: string): string {
  return join(root, ".DNA", "data", "lab-probe.json");
}

export async function readProbeStore(root: string): Promise<LabProbeStore> {
  const path = probePath(root);
  if (!(await fileExists(path))) return { lastProbeAt: null, results: [] };
  try {
    const raw = JSON.parse(await readFile(path, "utf8")) as LabProbeStore;
    return {
      lastProbeAt: raw.lastProbeAt ?? null,
      results: Array.isArray(raw.results) ? raw.results : [],
    };
  } catch {
    return { lastProbeAt: null, results: [] };
  }
}

async function writeProbeStore(root: string, store: LabProbeStore): Promise<void> {
  const path = probePath(root);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2), "utf8");
}

function ttlHours(config: Awaited<ReturnType<typeof loadDnaConfig>>): number {
  const lab = (config as { lab?: { probeTtlHours?: number } } | null)?.lab;
  const n = lab?.probeTtlHours;
  return typeof n === "number" && n > 0 ? n : DEFAULT_TTL_HOURS;
}

export function probeIsFresh(lastProbeAt: string | null, ttlH: number): boolean {
  if (!lastProbeAt) return false;
  const t = new Date(lastProbeAt).getTime();
  if (!Number.isFinite(t)) return false;
  return Date.now() - t < ttlH * 60 * 60 * 1000;
}

async function probeUrl(method: string, url: string, pathLabel: string): Promise<LabProbeCall> {
  const started = Date.now();
  const id = `probe-${started}-${pathLabel.replace(/\\W+/g, "-").slice(0, 40)}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { Accept: "application/json" },
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
    });
    const text = await res.text().catch(() => "");
    return {
      id,
      method,
      path: pathLabel,
      statusCode: res.status,
      durationMs: Date.now() - started,
      ok: res.status >= 200 && res.status < 400,
      message: res.statusText || (res.ok ? "ok" : "error"),
      responsePreview: text.slice(0, 280),
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      id,
      method,
      path: pathLabel,
      statusCode: 0,
      durationMs: Date.now() - started,
      ok: false,
      message: err instanceof Error ? err.message : "probe failed",
      responsePreview: "",
      timestamp: new Date().toISOString(),
    };
  }
}

const inflight = new Map<string, Promise<{ skipped: boolean; store: LabProbeStore; ttlHours: number }>>();

/**
 * Visit-gated API probes. Runs at most once per TTL (default 5h).
 * Targets Lab self routes on loopback — not continuous monitoring.
 */
export async function runLabProbesIfStale(
  root: string,
  opts?: { force?: boolean; baseUrl?: string; port?: number },
): Promise<{ skipped: boolean; store: LabProbeStore; ttlHours: number }> {
  const existing = inflight.get(root);
  if (existing) return existing;

  const work = (async () => {
    const config = await loadDnaConfig(root);
    const ttl = ttlHours(config);
    const store = await readProbeStore(root);
    if (!opts?.force && probeIsFresh(store.lastProbeAt, ttl)) {
      return { skipped: true, store, ttlHours: ttl };
    }

    const port = opts?.port || Number(process.env.DNA_LAB_PORT || process.env.PORT || 3200);
    const base = (opts?.baseUrl || `http://127.0.0.1:${port}`).replace(/\/$/, "");
    const api = `${base}${DNA_LAB_API_PREFIX}`;

    const targets: Array<[string, string, string]> = [
      ["GET", `${api}/health`, `${DNA_LAB_API_PREFIX}/health`],
      ["GET", `${api}/bootstrap`, `${DNA_LAB_API_PREFIX}/bootstrap`],
      ["GET", `${api}/installs`, `${DNA_LAB_API_PREFIX}/installs`],
      ["HEAD", `${base}/labs`, "/labs"],
    ];

    const results: LabProbeCall[] = [];
    for (const [method, url, label] of targets) {
      results.push(await probeUrl(method, url, label));
    }

    const next: LabProbeStore = {
      lastProbeAt: new Date().toISOString(),
      results,
    };
    await writeProbeStore(root, next);
    return { skipped: false, store: next, ttlHours: ttl };
  })().finally(() => {
    inflight.delete(root);
  });

  inflight.set(root, work);
  return work;
}
