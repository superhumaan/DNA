import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const wikiDir = path.join(rootDir, '.local-wiki');
const wikiDocsDir = path.join(wikiDir, 'docs');
const wikiStaticDir = path.join(wikiDir, 'static');

const TOP_LEVEL_SECTIONS = [
  'business',
  'product',
  'design',
  'delivery',
  'engineering',
  'quality-assurance',
];

async function ensureWikiExists() {
  try {
    const stat = await fs.stat(wikiDir);
    if (!stat.isDirectory()) throw new Error();
  } catch {
    throw new Error('Local wiki not found. Run `pnpm run wiki:init` first.');
  }
}

function cleanTitle(raw) {
  return raw
    .replace(/\s*—\s*DNA\s*by\s*Humaan/gi, '')
    .replace(/\s*—\s*DNA/gi, '')
    .replace(/\s*\(internal\)/gi, '')
    .trim();
}

function yamlScalar(value) {
  const s = String(value);
  if (!/[:#"'&*!?<>@[\]{},|]/.test(s) && !s.includes('\n')) {
    return s;
  }
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function filenameToTitle(filename) {
  const base = filename.replace(/\.mdx?$/, '');
  return base
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bGdpr\b/g, 'GDPR')
    .replace(/\bSrs\b/g, 'SRS')
    .replace(/\bIvf\b/g, 'IVF')
    .replace(/\bRbac\b/g, 'RBAC')
    .replace(/\bCi\b/g, 'CI')
    .replace(/\bCd\b/g, 'CD');
}

async function removeLegacyWikiDocs() {
  const legacy = [
    'tutorial-basics',
    'tutorial-extras',
    'intro.mdx',
    'readme.md',
  ];
  for (const name of legacy) {
    await fs.rm(path.join(wikiDocsDir, name), { recursive: true, force: true });
  }
}

async function syncDocsTree() {
  for (const section of TOP_LEVEL_SECTIONS) {
    const src = path.join(rootDir, 'docs', section);
    const dest = path.join(wikiDocsDir, section);
    try {
      const stat = await fs.stat(src);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }
    await fs.rm(dest, { recursive: true, force: true });
    await fs.cp(src, dest, { recursive: true });
  }
}

async function rewriteDocLinks(dir = wikiDocsDir) {
  const linkMap = new Map([
    ['./getting-started.md', '../engineering/quick-start.md'],
    ['./concepts.md', '../product/domain-model-and-glossary.md'],
    ['./platform.md', '../product/platform-catalog.md'],
    ['./marketplace.md', '../product/marketplace.md'],
    ['./compliance.md', '../product/compliance-tiers.md'],
    ['./ivf.md', '../delivery/features/brownfield-ivf.md'],
    ['./rbac.md', '../delivery/features/rbac-and-zero-trust.md'],
    ['./runtime.md', '../runtime-observer.md'],
    ['./integrations.md', '../integrations.md'],
    ['./cli-reference.md', '../cli-reference.md'],
    ['./development.md', '../local-development.md'],
    ['./naming.md', '../../design/naming-conventions.md'],
    ['./README.md', '../../README.md'],
    ['./testing-strategy.md', '../testing-strategy.md'],
    ['./local-wiki.md', '../../LOCAL_WIKI.md'],
  ]);

  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await rewriteDocLinks(full);
      continue;
    }
    if (!/\.mdx?$/i.test(entry.name)) continue;

    let content = await fs.readFile(full, 'utf8');
    for (const [from, to] of linkMap) {
      content = content.split(`](${from}`).join(`](${to}`);
      content = content.split(`](${from}#`).join(`](${to}#`);
    }
    content = content.replace(/\]\(\.\.\/\.\.\/CHANGELOG\.md\)/g, '](https://github.com/superhumaan/DNA/blob/main/CHANGELOG.md)');
    content = content.replace(/\]\(\.\.\/CHANGELOG\.md\)/g, '](https://github.com/superhumaan/DNA/blob/main/CHANGELOG.md)');
    content = content.replace(/\]\(\.\.\/\.\.\/CONTRIBUTING\.md\)/g, '](https://github.com/superhumaan/DNA/blob/main/CONTRIBUTING.md)');
    content = content.replace(/\]\(\.\.\/\.\.\/TEAM-TESTING\.md\)/g, '](https://github.com/superhumaan/DNA/blob/main/TEAM-TESTING.md)');
    await fs.writeFile(full, content, 'utf8');
  }
}

async function normalizeWikiDocTitles(dir = wikiDocsDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await normalizeWikiDocTitles(full);
      continue;
    }
    if (!/\.mdx?$/i.test(entry.name)) continue;

    let content = await fs.readFile(full, 'utf8');
    let body = content;
    let existingFm = {};

    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (fmMatch) {
      body = content.slice(fmMatch[0].length);
      for (const line of fmMatch[1].split('\n')) {
        const m = line.match(/^(\w+):\s*(.+)$/);
        if (m) existingFm[m[1]] = m[2].trim();
      }
    }

    const h1Match = body.match(/^#\s+(.+)$/m);
    let title = h1Match ? cleanTitle(h1Match[1]) : filenameToTitle(entry.name);
    if (!title || title.toLowerCase() === 'readme') title = filenameToTitle(entry.name);

    body = body.replace(/^#\s+.+$/m, `# ${title}`);

    const fmLines = ['---'];
    if (existingFm.slug) fmLines.push(`slug: ${existingFm.slug}`);
    if (existingFm.sidebar_position) fmLines.push(`sidebar_position: ${existingFm.sidebar_position}`);
    fmLines.push(`title: ${yamlScalar(title)}`);
    fmLines.push('---', '', body.trimStart(), '');

    await fs.writeFile(full, fmLines.join('\n'), 'utf8');
  }
}

async function setWikiHomeDoc() {
  const homeDoc = path.join(wikiDocsDir, 'business', 'business-strategy.md');
  try {
    let content = await fs.readFile(homeDoc, 'utf8');
    content = content.replace(/^---[\s\S]*?---\r?\n/, '');
    const fm = [
      '---',
      'slug: /',
      'sidebar_position: 1',
      `title: ${yamlScalar('Business strategy')}`,
      '---',
      '',
      content.trimStart(),
      '',
    ];
    await fs.writeFile(homeDoc, fm.join('\n'), 'utf8');
  } catch {
    // business section missing
  }
}

async function embedCiReports() {
  const latestWiki = path.join(wikiDocsDir, 'quality-assurance/test-results/latest.md');
  const historyWiki = path.join(wikiDocsDir, 'quality-assurance/test-results/historical.md');

  let latestBody = '_No CI report yet. Run `pnpm test`._';
  try {
    latestBody = await fs.readFile(
      path.join(rootDir, 'docs/quality-assurance/test-results/latest.md'),
      'utf8',
    );
  } catch {
    // keep placeholder
  }
  await fs.writeFile(latestWiki, latestBody, 'utf8');

  let historyBody = '_No historical reports._';
  try {
    historyBody = await fs.readFile(
      path.join(rootDir, 'docs/quality-assurance/test-results/historical.md'),
      'utf8',
    );
  } catch {
    // keep placeholder
  }
  await fs.writeFile(historyWiki, historyBody, 'utf8');
}

async function writeWikiTheme() {
  const tokensSrc = path.join(rootDir, 'scripts/wiki-assets/dna-tokens.css');
  const tokensDest = path.join(wikiDir, 'src/css/dna-tokens.css');
  const cssSrc = path.join(rootDir, 'scripts/wiki-assets/dna-wiki.css');
  const cssDest = path.join(wikiDir, 'src/css/custom.css');

  await fs.mkdir(path.dirname(tokensDest), { recursive: true });
  await fs.copyFile(tokensSrc, tokensDest);
  await fs.copyFile(cssSrc, cssDest);

  const configPath = path.join(wikiDir, 'docusaurus.config.ts');
  let config = await fs.readFile(configPath, 'utf8');

  config = config.replace(/title: '[^']*'/, "title: 'DNA by Humaan'");
  config = config.replace(
    /tagline: '[^']*'/,
    "tagline: 'Project intelligence for TypeScript teams'",
  );

  config = config.replace(
    /colorMode:\s*\{[^}]*\}/,
    `colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    }`,
  );

  config = config.replace(/navbar:\s*\{[^}]*title: '[^']*'/, "navbar: {\n      title: 'DNA'");
  config = config.replace(/label: 'Docs'/, "label: 'Documentation'");
  config = config.replace(/label: 'Tutorial'/, "label: 'Documentation'");
  config = config.replace(/copyright: `[^`]*`/, 'copyright: `DNA by Humaan · MIT`');

  if (!config.includes('fonts.googleapis.com/css2?family=Inter')) {
    config = config.replace(
      /baseUrl: '\/',\n/,
      `baseUrl: '/',\n\n  stylesheets: [\n    {\n      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',\n      type: 'text/css',\n    },\n  ],\n`,
    );
  }

  if (!config.includes("onBrokenLinks: 'warn'")) {
    config = config.replace(/onBrokenLinks:\s*'[^']*'/, "onBrokenLinks: 'warn'");
  }
    config = config.replace(/projectName: '[^']*'/, "projectName: 'DNA'");
  }
  if (!config.includes("organizationName: 'superhumaan'")) {
    config = config.replace(/organizationName: '[^']*'/, "organizationName: 'superhumaan'");
  }

  await fs.writeFile(configPath, config, 'utf8');
}

async function writeSidebars() {
  const sidebar = `// Generated by scripts/sync-local-wiki.mjs — do not edit in .local-wiki
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  wikiSidebar: [
    {
      type: 'category',
      label: 'Business',
      items: [{ type: 'autogenerated', dirName: 'business' }],
    },
    {
      type: 'category',
      label: 'Product',
      items: [{ type: 'autogenerated', dirName: 'product' }],
    },
    {
      type: 'category',
      label: 'Design',
      items: [{ type: 'autogenerated', dirName: 'design' }],
    },
    {
      type: 'category',
      label: 'Delivery',
      items: [{ type: 'autogenerated', dirName: 'delivery' }],
    },
    {
      type: 'category',
      label: 'Engineering',
      items: [{ type: 'autogenerated', dirName: 'engineering' }],
    },
    {
      type: 'category',
      label: 'Quality Assurance',
      items: [{ type: 'autogenerated', dirName: 'quality-assurance' }],
    },
  ],
};

export default sidebars;
`;

  await fs.writeFile(path.join(wikiDir, 'sidebars.ts'), sidebar, 'utf8');
  await patchDocusaurusConfig();
}

async function patchDocusaurusConfig() {
  const docusaurusConfig = path.join(wikiDir, 'docusaurus.config.ts');
  const indexPage = path.join(wikiDir, 'src/pages/index.tsx');
  try {
    let config = await fs.readFile(docusaurusConfig, 'utf8');
    if (config.includes('sidebarPath:')) {
      config = config.replace(/sidebarPath:\s*'[^']+'/, "sidebarPath: './sidebars.ts'");
    }
    config = config.replace(/sidebarId:\s*'[^']+'/g, "sidebarId: 'wikiSidebar'");
    await fs.writeFile(docusaurusConfig, config, 'utf8');
  } catch {
    return;
  }

  const indexRedirect = `import {Redirect} from '@docusaurus/router';

/** Wiki home — all content lives under /docs/ */
export default function Home() {
  return <Redirect to="/docs/" />;
}
`;
  try {
    await fs.mkdir(path.dirname(indexPage), { recursive: true });
    await fs.writeFile(indexPage, indexRedirect, 'utf8');
  } catch {
    // ignore
  }
}

async function main() {
  await ensureWikiExists();
  await fs.mkdir(wikiDocsDir, { recursive: true });
  await fs.mkdir(wikiStaticDir, { recursive: true });

  await removeLegacyWikiDocs();
  await syncDocsTree();
  await rewriteDocLinks();
  await normalizeWikiDocTitles();
  await setWikiHomeDoc();
  await embedCiReports();
  await writeSidebars();
  await writeWikiTheme();

  console.log('Local wiki synced: Business, Product, Design, Delivery, Engineering, QA.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
