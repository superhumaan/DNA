import { readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

export interface GlobOptions {
  cwd?: string;
  ignore?: string[];
  dot?: boolean;
  onlyFiles?: boolean;
  onlyDirectories?: boolean;
  absolute?: boolean;
}

function escapeRegex(char: string): string {
  return char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

function expandBraces(pattern: string): string[] {
  const start = pattern.indexOf("{");
  if (start === -1) return [pattern];
  const end = pattern.indexOf("}", start);
  if (end === -1) return [pattern];
  const prefix = pattern.slice(0, start);
  const suffix = pattern.slice(end + 1);
  const alts = pattern.slice(start + 1, end).split(",");
  return alts.flatMap((alt) => expandBraces(`${prefix}${alt}${suffix}`));
}

function globPatternToRegex(pattern: string): RegExp {
  const normalized = pattern.replace(/\\/g, "/").replace(/^\.\//, "");
  let regex = "^";
  let i = 0;

  while (i < normalized.length) {
    const ch = normalized[i]!;

    if (ch === "*") {
      if (normalized[i + 1] === "*") {
        regex += ".*";
        i += 2;
        if (normalized[i] === "/") i++;
        continue;
      }
      regex += "[^/]*";
      i++;
      continue;
    }

    if (ch === "?") {
      regex += "[^/]";
      i++;
      continue;
    }

    regex += escapeRegex(ch);
    i++;
  }

  regex += "$";
  return new RegExp(regex);
}

function normalizePattern(pattern: string): string {
  return pattern.replace(/\\/g, "/").replace(/^\.\//, "");
}

function shouldIgnore(relativePath: string, ignore: string[]): boolean {
  const normalized = relativePath.replace(/\\/g, "/");
  for (const rule of ignore) {
    const r = normalizePattern(rule);
    const nestedSegment = r.match(/^\*\*\/([^/*]+)\/\*\*$/);
    if (nestedSegment) {
      const segment = nestedSegment[1]!;
      if (
        normalized === segment ||
        normalized.startsWith(`${segment}/`) ||
        normalized.includes(`/${segment}/`)
      ) {
        return true;
      }
      continue;
    }
    if (r.endsWith("/**")) {
      const base = r.slice(0, -3);
      if (base.startsWith("**/")) {
        const segment = base.slice(3);
        if (
          normalized === segment ||
          normalized.startsWith(`${segment}/`) ||
          normalized.includes(`/${segment}/`)
        ) {
          return true;
        }
        continue;
      }
      if (normalized === base || normalized.startsWith(`${base}/`)) return true;
      continue;
    }
    if (r.includes("*")) {
      if (globPatternToRegex(r).test(normalized)) return true;
      continue;
    }
    if (normalized === r || normalized.startsWith(`${r}/`)) return true;
  }
  return false;
}

async function walk(
  dir: string,
  root: string,
  options: GlobOptions,
  patterns: RegExp[],
  results: string[],
): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!options.dot && entry.startsWith(".")) continue;
    const fullPath = join(dir, entry);
    const rel = relative(root, fullPath).replace(/\\/g, "/");

    if (shouldIgnore(rel, options.ignore ?? [])) continue;

    let entryStat;
    try {
      entryStat = await stat(fullPath);
    } catch {
      continue;
    }

    const isDir = entryStat.isDirectory();
    const isFile = entryStat.isFile();

    if (isFile && options.onlyDirectories) continue;

    const matches = patterns.some((re) => re.test(rel));
    if (matches) {
      if ((options.onlyFiles && isFile) || (options.onlyDirectories && isDir) || (!options.onlyFiles && !options.onlyDirectories)) {
        results.push(options.absolute ? fullPath : rel);
      }
    }

    if (isDir) {
      await walk(fullPath, root, options, patterns, results);
    }
  }
}

export async function glob(patterns: string | string[], options: GlobOptions = {}): Promise<string[]> {
  const root = resolve(options.cwd ?? process.cwd());
  const patternList = (Array.isArray(patterns) ? patterns : [patterns]).flatMap((p) =>
    expandBraces(normalizePattern(p)),
  );
  const regexes = patternList.map(globPatternToRegex);
  const results: string[] = [];
  await walk(root, root, options, regexes, results);
  return [...new Set(results)].sort();
}

export default glob;
