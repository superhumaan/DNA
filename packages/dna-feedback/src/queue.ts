import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { FeedbackPayload } from "@superhumaan/dna-config";
import { DNA_FEEDBACK_QUEUE } from "@superhumaan/dna-config";
import { ensureDir } from "./fs.js";

export async function enqueueFeedback(
  projectRoot: string,
  payload: FeedbackPayload,
): Promise<string> {
  const queuePath = join(projectRoot, DNA_FEEDBACK_QUEUE);
  await ensureDir(join(projectRoot, ".DNA", "data"));
  await appendFile(queuePath, `${JSON.stringify(payload)}\n`, "utf-8");
  return queuePath;
}

export async function readFeedbackQueue(projectRoot: string): Promise<FeedbackPayload[]> {
  const queuePath = join(projectRoot, DNA_FEEDBACK_QUEUE);
  try {
    const raw = await readFile(queuePath, "utf-8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as FeedbackPayload);
  } catch {
    return [];
  }
}

export async function writeFeedbackQueue(
  projectRoot: string,
  items: FeedbackPayload[],
): Promise<void> {
  const queuePath = join(projectRoot, DNA_FEEDBACK_QUEUE);
  if (items.length === 0) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(queuePath, "", "utf-8");
    return;
  }
  const content = items.map((item) => JSON.stringify(item)).join("\n") + "\n";
  const { writeFile } = await import("node:fs/promises");
  await writeFile(queuePath, content, "utf-8");
}
