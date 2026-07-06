import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

export async function writeFileEnsured(path: string, content: string): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, content, "utf-8");
}

export async function readJsonFile<T>(path: string): Promise<T | null> {
  if (!(await fileExists(path))) return null;
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(path: string, data: unknown): Promise<void> {
  await writeFileEnsured(path, JSON.stringify(data, null, 2) + "\n");
}

export function projectPath(root: string, ...segments: string[]): string {
  return join(root, ...segments);
}
