import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LAB_CLIENT_JS, LAB_CSS } from "./assets.js";
import { getLabRuntimeIdentity, type LabRuntimeIdentity } from "./package-info.js";

export type LabUiAssetSource = "disk" | "embedded";

export interface LabUiAssets {
  js: string;
  css: string;
  source: LabUiAssetSource;
  jsMtimeMs: number | null;
  cssMtimeMs: number | null;
  jsPath: string | null;
  cssPath: string | null;
}

const cache: LabUiAssets = {
  js: LAB_CLIENT_JS,
  css: LAB_CSS,
  source: "embedded",
  jsMtimeMs: null,
  cssMtimeMs: null,
  jsPath: null,
  cssPath: null,
};

function readIfChanged(
  path: string,
  prevMtime: number | null,
  prevBody: string,
): { body: string; mtimeMs: number } | null {
  if (!existsSync(path)) return null;
  try {
    const st = statSync(path);
    if (prevMtime !== null && st.mtimeMs === prevMtime) {
      return { body: prevBody, mtimeMs: st.mtimeMs };
    }
    return { body: readFileSync(path, "utf8"), mtimeMs: st.mtimeMs };
  } catch {
    return null;
  }
}

/**
 * Prefer on-disk `dist/lab-ui/{client.js,styles.css}` from the active DNA package.
 * After `npm i` replaces those files, the next Lab request picks up the new UI without
 * guessing which Node process still holds an old in-memory string.
 * Falls back to embedded bundle constants when disk files are missing (older installs).
 */
export function resolveLabUiAssets(identity?: LabRuntimeIdentity): LabUiAssets {
  const id = identity ?? getLabRuntimeIdentity();
  if (!id.packagePath || id.packagePath === "(unresolved)") {
    cache.js = LAB_CLIENT_JS;
    cache.css = LAB_CSS;
    cache.source = "embedded";
    cache.jsMtimeMs = null;
    cache.cssMtimeMs = null;
    cache.jsPath = null;
    cache.cssPath = null;
    return cache;
  }

  const uiDir = join(id.packagePath, "dist", "lab-ui");
  const jsPath = join(uiDir, "client.js");
  const cssPath = join(uiDir, "styles.css");

  const js = readIfChanged(jsPath, cache.jsPath === jsPath ? cache.jsMtimeMs : null, cache.js);
  const css = readIfChanged(cssPath, cache.cssPath === cssPath ? cache.cssMtimeMs : null, cache.css);

  if (js || css) {
    if (js) {
      cache.js = js.body;
      cache.jsMtimeMs = js.mtimeMs;
      cache.jsPath = jsPath;
    }
    if (css) {
      cache.css = css.body;
      cache.cssMtimeMs = css.mtimeMs;
      cache.cssPath = cssPath;
    }
    cache.source = "disk";
    return cache;
  }

  cache.js = LAB_CLIENT_JS;
  cache.css = LAB_CSS;
  cache.source = "embedded";
  cache.jsMtimeMs = null;
  cache.cssMtimeMs = null;
  cache.jsPath = null;
  cache.cssPath = null;
  return cache;
}

/** Write embedded UI next to the package so local/dev installs always have disk files. */
export function ensureLabUiDiskAssets(packagePath: string): { jsPath: string; cssPath: string } {
  const uiDir = join(packagePath, "dist", "lab-ui");
  mkdirSync(uiDir, { recursive: true });
  const jsPath = join(uiDir, "client.js");
  const cssPath = join(uiDir, "styles.css");
  if (!existsSync(jsPath)) writeFileSync(jsPath, LAB_CLIENT_JS, "utf8");
  if (!existsSync(cssPath)) writeFileSync(cssPath, LAB_CSS, "utf8");
  return { jsPath, cssPath };
}

/** Test helper — reset mtime cache between cases. */
export function resetLabUiAssetCacheForTests(): void {
  cache.js = LAB_CLIENT_JS;
  cache.css = LAB_CSS;
  cache.source = "embedded";
  cache.jsMtimeMs = null;
  cache.cssMtimeMs = null;
  cache.jsPath = null;
  cache.cssPath = null;
}
