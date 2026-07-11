import { glob } from "../glob.js";
import { readFile } from "node:fs/promises";
import { relative } from "node:path";

export interface SurfaceItem {
  type: "route" | "api" | "menu" | "notification" | "page";
  path: string;
  source: string;
  line?: number;
}

export interface SurfaceInventory {
  routes: SurfaceItem[];
  apis: SurfaceItem[];
  menus: SurfaceItem[];
  notifications: SurfaceItem[];
  pages: SurfaceItem[];
}

const SOURCE_GLOB = ["**/*.{ts,tsx,js,jsx,vue}"];
const IGNORE = ["**/node_modules/**", "**/dist/**", "**/.DNA/**", "**/DNA/**"];

const ROUTE_PATTERNS = [
  /path:\s*["'`]([^"'`]+)["'`]/g,
  /<Route[^>]+path=["']([^"']+)["']/g,
  /createBrowserRouter|createRoutesFromElements/,
];

const API_PATTERNS = [
  /\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/g,
  /app\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/g,
];

const MENU_PATTERNS = [
  /menuItems|navItems|sidebarItems|navigationItems|NAV_ITEMS|MENU_ITEMS/g,
  /label:\s*["'`]([^"'`]+)["'`].*?(?:path|href|to):/gs,
];

const NOTIFICATION_PATTERNS = [
  /notifications?|NotificationCenter|toast|useNotification/gi,
];

const NEXT_PAGE_PATTERN = /apps?\/([a-zA-Z0-9_[\]/]+)\/(page|route)\.(tsx|ts|jsx|js)/;

function addUnique(items: SurfaceItem[], item: SurfaceItem, max = 80): void {
  if (items.length >= max) return;
  if (items.some((i) => i.path === item.path && i.source === item.source)) return;
  items.push(item);
}

export async function scanSurfaceInventory(root: string): Promise<SurfaceInventory> {
  const inventory: SurfaceInventory = {
    routes: [],
    apis: [],
    menus: [],
    notifications: [],
    pages: [],
  };

  const files = await glob(SOURCE_GLOB, { cwd: root, ignore: IGNORE, absolute: true });

  for (const file of files) {
    const rel = relative(root, file);
    let content: string;
    try {
      content = await readFile(file, "utf-8");
    } catch {
      continue;
    }

    const nextMatch = rel.match(NEXT_PAGE_PATTERN);
    if (nextMatch) {
      addUnique(inventory.pages, {
        type: "page",
        path: `/${nextMatch[1].replace(/\/page$/, "").replace(/\/route$/, "")}`,
        source: rel,
      });
    }

    for (const pattern of ROUTE_PATTERNS) {
      if (pattern.global) {
        let m: RegExpExecArray | null;
        const re = new RegExp(pattern.source, pattern.flags);
        while ((m = re.exec(content)) !== null && inventory.routes.length < 80) {
          const path = m[1];
          if (path && path.startsWith("/")) {
            addUnique(inventory.routes, { type: "route", path, source: rel });
          }
        }
      }
    }

    for (const pattern of API_PATTERNS) {
      let m: RegExpExecArray | null;
      const re = new RegExp(pattern.source, pattern.flags);
      while ((m = re.exec(content)) !== null && inventory.apis.length < 80) {
        const path = m[2] ?? m[1];
        if (path) {
          addUnique(inventory.apis, { type: "api", path, source: rel });
        }
      }
    }

    for (const pattern of MENU_PATTERNS) {
      if (pattern.test(content)) {
        addUnique(inventory.menus, {
          type: "menu",
          path: rel,
          source: rel,
        });
      }
    }

    for (const pattern of NOTIFICATION_PATTERNS) {
      if (pattern.test(content)) {
        addUnique(inventory.notifications, {
          type: "notification",
          path: rel,
          source: rel,
        });
      }
    }
  }

  return inventory;
}

export function formatInventorySummary(inventory: SurfaceInventory): string {
  const lines = [
    `Routes: ${inventory.routes.length}`,
    `API endpoints: ${inventory.apis.length}`,
    `Menu/nav files: ${inventory.menus.length}`,
    `Notification surfaces: ${inventory.notifications.length}`,
    `App pages: ${inventory.pages.length}`,
  ];
  return lines.join("\n");
}
