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

const WIKI_REMOTE = 'https://github.com/superhumaan/DNA.wiki.git';

function wikiToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const gh = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
  if (gh.status === 0) return gh.stdout.trim();
  return '';
}

function wikiRemoteUrl() {
  const token = wikiToken();
  if (!token) return WIKI_REMOTE;
  return WIKI_REMOTE.replace('https://', `https://x-access-token:${token}@`);
}

function runGit(args, cwd = wikiCloneDir) {
  return spawnSync('git', args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
    },
  });
}

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
    await fs.rm(wikiCloneDir, { recursive: true, force: true });
    const clone = runGit(['clone', wikiRemoteUrl(), wikiCloneDir], root);
    if (clone.status !== 0) {
      console.error('');
      console.error('GitHub wiki repo does not exist yet.');
      console.error('Create the first page manually: https://github.com/superhumaan/DNA/wiki/_new');
      console.error('Title: Home · Body: DNA wiki bootstrap · Then re-run: pnpm run wiki:github-push');
      console.error('');
      process.exit(1);
    }
  } else {
    runGit(['remote', 'set-url', 'origin', wikiRemoteUrl()]);
  }

  await buildWikiPages();

  runGit(['add', '-A']);
  const status = spawnSync('git', ['status', '--porcelain'], {
    cwd: wikiCloneDir,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  if (!status.stdout?.trim()) {
    console.log('No wiki changes to push.');
    return;
  }

  runGit(['commit', '-m', 'Sync wiki from docs/ (Docusaurus structure)']);

  const branch =
    spawnSync('git', ['symbolic-ref', '--short', 'HEAD'], {
      cwd: wikiCloneDir,
      encoding: 'utf8',
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    }).stdout?.trim() || 'master';

  const push = runGit(['push', '-u', 'origin', branch]);
  if (push.status !== 0 && branch === 'master') {
    runGit(['push', '-u', 'origin', 'main']);
  }
  console.log('GitHub wiki pushed: https://github.com/superhumaan/DNA/wiki');
}

pushWiki().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
