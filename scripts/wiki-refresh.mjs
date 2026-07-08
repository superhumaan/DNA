#!/usr/bin/env node
/**
 * Kill local wiki dev server → sync docs → restart in background.
 * Usage: pnpm run wiki:refresh
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wikiDir = path.join(root, '.local-wiki');
const pidFile = path.join(wikiDir, '.wiki-dev.pid');
const logFile = path.join(wikiDir, '.wiki-dev.log');
const WIKI_PORT = Number(process.env.WIKI_PORT || 3000);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function killPid(pid) {
  if (!pid || Number.isNaN(pid)) return;
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    return;
  }
  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // already dead
  }
}

function killPort(port) {
  const r = spawnSync('lsof', ['-ti', `:${port}`], { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout?.trim()) return;
  for (const pid of r.stdout.trim().split(/\s+/)) {
    killPid(Number(pid));
  }
}

function killWikiProcesses() {
  if (fs.existsSync(pidFile)) {
    const pid = Number(fs.readFileSync(pidFile, 'utf8').trim());
    killPid(pid);
    fs.rmSync(pidFile, { force: true });
  }
  killPort(WIKI_PORT);
  spawnSync('pkill', ['-f', `${wikiDir}.*docusaurus start`], { stdio: 'ignore' });
}

async function syncWiki() {
  const r = spawnSync('node', ['scripts/sync-local-wiki.mjs'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function startWikiBackground() {
  if (!fs.existsSync(wikiDir)) {
    console.error('Missing .local-wiki — run: pnpm run wiki:init');
    process.exit(1);
  }

  fs.mkdirSync(wikiDir, { recursive: true });
  const out = fs.openSync(logFile, 'a');
  const child = spawn('npm', ['run', 'start', '--prefix', wikiDir], {
    cwd: root,
    detached: true,
    stdio: ['ignore', out, out],
    env: { ...process.env, PORT: String(WIKI_PORT) },
  });
  child.unref();
  fs.writeFileSync(pidFile, String(child.pid));
  console.log(`Wiki dev server started (pid ${child.pid})`);
  console.log(`  URL:  http://localhost:${WIKI_PORT}/docs/`);
  console.log(`  Log:  ${path.relative(root, logFile)}`);
}

async function main() {
  const killOnly = process.argv.includes('--kill-only');

  console.log('Stopping wiki dev server…');
  killWikiProcesses();
  await sleep(400);

  if (killOnly) {
    console.log('Wiki dev server stopped.');
    return;
  }

  console.log('Syncing wiki…');
  await syncWiki();

  console.log('Starting wiki dev server in background…');
  startWikiBackground();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
