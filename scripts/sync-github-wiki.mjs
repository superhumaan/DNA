#!/usr/bin/env node
/**
 * Sync docs/ to GitHub wiki (DNA.wiki git repo).
 * Creates Home.md, _Sidebar.md, and section pages.
 * Usage: pnpm run wiki:github-push
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'docs');
const wikiCloneDir = path.join(root, '.github-wiki');

const SECTIONS = [
  { dir: 'business', label: 'Business' },
  { dir: 'product', label: 'Product' },
  { dir: 'design', label: 'Design' },
  { dir: 'delivery', label: 'Delivery' },
  { dir: 'engineering', label: 'Engineering' },
  { dir: 'quality-assurance', label: 'Quality Assurance' },
];

function wikiPageName(relativePath) {
  return relativePath
    .replace(/\.mdx?$/, '')
    .split('/')
    .map((part) =>
      part
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('-'),
    )
    .join('-');
}

async function collectMarkdownFiles(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(full, rel)));
    } else if (/\.mdx?$/i.test(entry.name) && entry.name.toLowerCase() !== 'readme.md') {
      files.push(rel);
    }
  }
  return files.sort();
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\r?\n/, '');
}

function rewriteLinksForWiki(content) {
  return content
    .replace(/\]\(\.\.\/[^)]+\)/g, (match) => {
      const inner = match.slice(2, -1);
      const file = inner.split('/').pop()?.replace(/\.mdx?$/, '') ?? '';
      const page = wikiPageName(file);
      return `](${page})`;
    })
    .replace(/\]\(\.\/[^)]+\)/g, (match) => {
      const inner = match.slice(2, -1);
      const file = inner.split('/').pop()?.replace(/\.mdx?$/, '') ?? '';
      const page = wikiPageName(file);
      return `](${page})`;
    })
    .replace(/\]\(\.\.\/\.\.\/[^)]+\)/g, (match) => {
      const inner = match.slice(2, -1);
      const file = inner.split('/').pop()?.replace(/\.mdx?$/, '') ?? '';
      const page = wikiPageName(file);
      return `](${page})`;
    });
}

async function buildWikiPages() {
  await fs.mkdir(wikiCloneDir, { recursive: true });

  const pageMap = new Map();
  const sidebarLines = ['### Business'];

  for (const section of SECTIONS) {
    const sectionDir = path.join(docsDir, section.dir);
    try {
      await fs.stat(sectionDir);
    } catch {
      continue;
    }

    if (section.dir !== 'business') {
      sidebarLines.push('', `### ${section.label}`);
    }

    const files = await collectMarkdownFiles(sectionDir, section.dir);
    for (const rel of files) {
      const srcPath = path.join(docsDir, rel);
      let content = await fs.readFile(srcPath, 'utf8');
      content = stripFrontmatter(content);
      content = rewriteLinksForWiki(content);

      const pageName = wikiPageName(rel.replace(/\.mdx?$/, ''));
      const destPath = path.join(wikiCloneDir, `${pageName}.md`);
      await fs.writeFile(destPath, content.trim() + '\n', 'utf8');
      pageMap.set(pageName, rel);

      const title = path.basename(rel, path.extname(rel))
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      sidebarLines.push(`* [${title}](${pageName})`);
    }
  }

  const homeContent = `# DNA by Humaan Wiki

Project intelligence, runtime observation, and AI coordination for TypeScript teams.

| Resource | Link |
|----------|------|
| **Website** | [dna.humaan.app](https://dna.humaan.app) |
| **Marketplace** | [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) |
| **npm** | [@superhumaan/dna-by-humaan](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) |
| **Repository** | [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA) |

## Start here

* [Business strategy](Business-Business-Strategy)
* [Product concept](Product-Product-Concept)
* [Quick start](Engineering-Quick-Start)
* [CLI reference](Engineering-Cli-Reference)

## Sections

${SECTIONS.map((s) => `* **${s.label}** — see sidebar`).join('\n')}

---

Built by [Humaan](https://humaan.com) · [Superlite](https://superlite.ai) · MIT License
`;

  await fs.writeFile(path.join(wikiCloneDir, 'Home.md'), homeContent);
  await fs.writeFile(path.join(wikiCloneDir, '_Sidebar.md'), sidebarLines.join('\n') + '\n');

  console.log(`Built ${pageMap.size} wiki pages + Home + Sidebar`);
}

async function pushWiki() {
  const isGit = await fs.stat(path.join(wikiCloneDir, '.git')).then(() => true).catch(() => false);

  if (!isGit) {
    const clone = spawnSync(
      'git',
      ['clone', 'https://github.com/superhumaan/DNA.wiki.git', wikiCloneDir],
      { cwd: root, stdio: 'inherit' },
    );
    if (clone.status !== 0) {
      await fs.mkdir(wikiCloneDir, { recursive: true });
      spawnSync('git', ['init'], { cwd: wikiCloneDir, stdio: 'inherit' });
      spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/superhumaan/DNA.wiki.git'], {
        cwd: wikiCloneDir,
        stdio: 'inherit',
      });
    }
  }

  await buildWikiPages();

  spawnSync('git', ['add', '-A'], { cwd: wikiCloneDir, stdio: 'inherit' });
  const status = spawnSync('git', ['status', '--porcelain'], {
    cwd: wikiCloneDir,
    encoding: 'utf8',
  });
  if (!status.stdout?.trim()) {
    console.log('No wiki changes to push.');
    return;
  }

  spawnSync(
    'git',
    ['commit', '-m', 'Sync wiki from docs/ (Docusaurus structure)'],
    { cwd: wikiCloneDir, stdio: 'inherit' },
  );
  const push = spawnSync('git', ['push', '-u', 'origin', 'master'], {
    cwd: wikiCloneDir,
    stdio: 'inherit',
  });
  if (push.status !== 0) {
    spawnSync('git', ['push', '-u', 'origin', 'main'], {
      cwd: wikiCloneDir,
      stdio: 'inherit',
    });
  }
  console.log('GitHub wiki pushed: https://github.com/superhumaan/DNA/wiki');
}

pushWiki().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
