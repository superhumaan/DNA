import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function writeJsonFile(path: string, data: unknown): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
