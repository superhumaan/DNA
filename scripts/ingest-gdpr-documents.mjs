#!/usr/bin/env node
/**
 * Ingest GDPR .docx reference documents into DNA knowledge assets.
 *
 * Usage:
 *   node scripts/ingest-gdpr-documents.mjs [sourceDir]
 *
 * Source resolution: CLI arg → DNA_GDPR_SOURCE_DOCS → ~/Downloads/GDPR Documents
 * Output: packages/dna-core/assets/gdpr-reference/
 */
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from "node:fs";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { scrubGdprText } from "./scrub-gdpr-branding.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DEFAULT_SOURCE = join(homedir(), "Downloads", "GDPR Documents");
const OUT_ROOT = join(REPO_ROOT, "packages", "dna-core", "assets", "gdpr-reference");

const FOLDER_MAP = {
  "Governance & Compliance": "governance",
  "External - Customer-Facing Documents": "external",
  "Technical - Operational Evidence Documents": "technical",
  "AI-Specific Documentation": "ai",
  Documents: "registers",
};

const PYTHON_EXTRACT = `
import zipfile, re, sys, xml.etree.ElementTree as ET
from pathlib import Path

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def docx_to_markdown(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read('word/document.xml')
    root = ET.fromstring(xml)
    lines = []
    for p in root.iter(W + 'p'):
        parts = []
        for t in p.iter(W + 't'):
            if t.text: parts.append(t.text)
            if t.tail: parts.append(t.tail)
        text = ''.join(parts).strip()
        if text:
            lines.append(text)
    # Heuristic headings: short ALL CAPS or title-like first lines
    md = []
    for i, line in enumerate(lines):
        if i < 3 and len(line) < 80 and line.isupper():
            md.append('## ' + line.title())
        elif line.endswith(':') and len(line) < 60:
            md.append('### ' + line.rstrip(':'))
        else:
            md.append(line)
        md.append('')
    return '\\n'.join(md).strip()

path = Path(sys.argv[1])
print(docx_to_markdown(path))
`;

function slugify(name) {
  return basename(name, ".docx")
    .replace(/ \(Template\)/gi, "")
    .replace(/\.xlsx$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function walkDocx(dir, base = dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      entries.push(...walkDocx(full, base));
    } else if (name.endsWith(".docx")) {
      entries.push({
        full,
        rel: relative(base, full),
        folder: relative(base, dirname(full)),
        fileName: name,
        slug: slugify(name),
        type: "docx",
      });
    } else if (name.endsWith(".xlsx")) {
      entries.push({
        full,
        rel: relative(base, full),
        folder: relative(base, dirname(full)),
        fileName: name,
        slug: slugify(name),
        type: "xlsx",
      });
    }
  }
  return entries;
}

function extractDocxMarkdown(path) {
  try {
    return execFileSync("python3", ["-c", PYTHON_EXTRACT, path], {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (e) {
    console.warn(`  ⚠ Could not extract: ${path}`);
    return `_Extraction failed for ${basename(path)}. Open source .docx directly._`;
  }
}

const source = process.argv[2] ?? process.env.DNA_GDPR_SOURCE_DOCS?.trim() ?? DEFAULT_SOURCE;

if (!existsSync(source)) {
  console.error(`Source not found: ${source}`);
  process.exit(1);
}

console.log(`Ingesting GDPR documents from:\n  ${source}\n→ ${OUT_ROOT}\n`);

const files = walkDocx(source);
const manifest = {
  version: "1.0.0",
  ingestedAt: new Date().toISOString(),
  sourcePath: source,
  documentCount: files.length,
  documents: [],
};

let extracted = 0;

for (const file of files) {
  const folderKey = FOLDER_MAP[file.folder] ?? file.folder.toLowerCase().replace(/\s+/g, "-");
  const outDir = join(OUT_ROOT, folderKey);
  mkdirSync(outDir, { recursive: true });

  const entry = {
    slug: file.slug === "soli-platform-dpia" ? "platform-dpia" : file.slug,
    title: scrubGdprText(basename(file.fileName, file.type === "docx" ? ".docx" : ".xlsx")),
    folder: folderKey,
    folderLabel: file.folder,
    type: file.type,
    sourceFile: file.rel,
  };

  if (file.type === "docx") {
    const body = extractDocxMarkdown(file.full);
    const md = [
      `# ${scrubGdprText(entry.title)}`,
      "",
      scrubGdprText(
        "_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._",
      ),
      "",
      `**Source file:** \`${file.rel}\` (structure reference only)`,
      "",
      "---",
      "",
      scrubGdprText(body),
      "",
    ].join("\n");

    const outPath = join(outDir, `${entry.slug}.md`);
    writeFileSync(outPath, md, "utf-8");
    entry.knowledgePath = `compliance/gdpr/examples/${folderKey}/${file.slug}.md`;
    entry.bytes = Buffer.byteLength(md, "utf-8");
    extracted += 1;
    console.log(`✓ ${folderKey}/${file.slug}.md`);
  } else {
    entry.knowledgePath = null;
    entry.note = "Excel register template — use structure from audit readiness checklist";
    console.log(`• ${folderKey}/${file.slug} (xlsx register)`);
  }

  manifest.documents.push(entry);
}

mkdirSync(OUT_ROOT, { recursive: true });
writeFileSync(join(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");

console.log(`\nDone: ${extracted} markdown files, ${files.length - extracted} registers indexed`);
console.log(`Manifest: packages/dna-core/assets/gdpr-reference/manifest.json`);
console.log("Run: node scripts/scrub-gdpr-branding.mjs  (if re-ingesting from branded source)");
