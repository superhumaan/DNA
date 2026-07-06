import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { mkdir } from "node:fs/promises";

export async function appendJsonl(path: string, data: unknown): Promise<void> {
  await mkdir(join(path, ".."), { recursive: true });
  await appendFile(path, JSON.stringify(data) + "\n", "utf-8");
}

export async function readJsonl<T>(path: string): Promise<T[]> {
  try {
    const raw = await readFile(path, "utf-8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch {
    return [];
  }
}
