import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const INSTALL_ID_PATH = join(homedir(), ".config", "dna", "install-id");

export async function getInstallId(): Promise<string> {
  try {
    const existing = await readFile(INSTALL_ID_PATH, "utf-8");
    const id = existing.trim();
    if (id) return id;
  } catch {
    // first run
  }

  const id = randomUUID();
  await mkdir(join(homedir(), ".config", "dna"), { recursive: true });
  await writeFile(INSTALL_ID_PATH, `${id}\n`, { mode: 0o600 });
  return id;
}

export function hashFingerprint(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}
