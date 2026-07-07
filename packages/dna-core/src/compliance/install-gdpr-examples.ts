import { join, dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { writeFileEnsured, fileExists } from "../fs.js";

/** Resolve bundled GDPR assets (monorepo package root or published CLI tarball). */
async function resolveGdprAssetsRoot(): Promise<string | null> {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "assets", "gdpr-reference");
    if (await fileExists(join(candidate, "manifest.json"))) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export interface GdprManifestDocument {
  slug: string;
  title: string;
  folder: string;
  folderLabel: string;
  type: "docx" | "xlsx";
  sourceFile: string;
  knowledgePath: string | null;
  bytes?: number;
  note?: string;
}

export interface GdprManifest {
  version: string;
  ingestedAt: string;
  sourcePath: string;
  documentCount: number;
  documents: GdprManifestDocument[];
}

/** Bundled reference docs (ingested from production GDPR pack) */
export async function getGdprAssetsRoot(): Promise<string> {
  const root = await resolveGdprAssetsRoot();
  if (!root) throw new Error("GDPR reference assets not found");
  return root;
}

export async function loadGdprManifest(): Promise<GdprManifest | null> {
  const path = join(await getGdprAssetsRoot(), "manifest.json");
  if (!(await fileExists(path))) return null;
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw) as GdprManifest;
}

export async function installGdprExamples(root: string): Promise<string[]> {
  const assetsRoot = await getGdprAssetsRoot();
  const manifest = await loadGdprManifest();
  if (!manifest) return [];

  const installed: string[] = [];

  for (const doc of manifest.documents) {
    if (!doc.knowledgePath) continue;
    const src = join(assetsRoot, doc.folder, `${doc.slug}.md`);
    if (!(await fileExists(src))) continue;
    const content = await readFile(src, "utf-8");
    const dest = join(root, ".DNA", "knowledge", doc.knowledgePath);
    await writeFileEnsured(dest, content);
    installed.push(`.DNA/knowledge/${doc.knowledgePath}`);
  }

  // Index file for AI navigation
  const indexPath = join(root, ".DNA", "knowledge", "compliance/gdpr/examples/INDEX.md");
  const index = buildExamplesIndex(manifest);
  await writeFileEnsured(indexPath, index);
  installed.push(".DNA/knowledge/compliance/gdpr/examples/INDEX.md");

  return installed;
}

function buildExamplesIndex(manifest: GdprManifest): string {
  const lines = [
    "# GDPR Reference Examples (UK GDPR required documents)",
    "",
    `_Ingested: ${manifest.ingestedAt} from \`${manifest.sourcePath}\`_`,
    "",
    "DNA uses these **scrubbed UK GDPR templates** when generating governance documents.",
    "Replace [Company Name], [Product Name], [Affiliate Entity] before publication.",
    "",
    "## Registers (Excel templates)",
    "",
    ...manifest.documents
      .filter((d) => d.type === "xlsx")
      .map((d) => `- ${d.title} — \`${d.sourceFile}\``),
    "",
  ];

  for (const folder of ["governance", "external", "technical", "ai"] as const) {
    const docs = manifest.documents.filter((d) => d.folder === folder && d.knowledgePath);
    if (!docs.length) continue;
    lines.push(`## ${folder}`, "");
    for (const d of docs) {
      lines.push(`- [${d.title}](${d.folder}/${d.slug}.md) (\`${d.slug}\`)`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function getGdprExampleContent(slug: string): Promise<string | null> {
  const manifest = await loadGdprManifest();
  const doc = manifest?.documents.find((d) => d.slug === slug);
  if (!doc?.knowledgePath) return null;
  const src = join(await getGdprAssetsRoot(), doc.folder, `${doc.slug}.md`);
  if (!(await fileExists(src))) return null;
  return readFile(src, "utf-8");
}

export async function listGdprExampleSlugs(): Promise<string[]> {
  const manifest = await loadGdprManifest();
  return manifest?.documents.filter((d) => d.knowledgePath).map((d) => d.slug) ?? [];
}
