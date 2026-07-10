import { exec } from "node:child_process";
import { mkdir, readFile, writeFile, chmod } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/** Scopes DNA needs for push, CI, and issue/PR automation */
export const GITHUB_SCOPES = ["repo", "workflow", "read:org"] as const;

export interface GitHubCredentials {
  token: string;
  username?: string;
  scopes?: string[];
  obtainedAt: string;
  method: "env" | "stored" | "gh_cli" | "device_flow";
}

export interface GitHubLoginResult {
  credentials: GitHubCredentials;
  username: string;
}

const CREDENTIALS_DIR = join(homedir(), ".config", "dna");
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, "github-credentials.json");

import { DNA_OAUTH_CLIENT_ID, isPlaceholderClientId } from "./oauth-config.js";

function resolveClientId(): string {
  return process.env.DNA_GITHUB_CLIENT_ID ?? DNA_OAUTH_CLIENT_ID;
}

export function getTokenFromEnv(): string | undefined {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
}

export async function loadStoredCredentials(): Promise<GitHubCredentials | null> {
  try {
    const raw = await readFile(CREDENTIALS_FILE, "utf-8");
    const creds = JSON.parse(raw) as GitHubCredentials;
    if (creds.token) return creds;
  } catch {
    // not logged in
  }
  return null;
}

async function saveCredentials(creds: GitHubCredentials): Promise<void> {
  await mkdir(CREDENTIALS_DIR, { recursive: true, mode: 0o700 });
  await writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 });
  try {
    await chmod(CREDENTIALS_FILE, 0o600);
  } catch {
    // windows
  }
}

async function tokenFromGhCli(): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync("gh auth token", { timeout: 5000 });
    const token = stdout.trim();
    return token.length > 0 ? token : undefined;
  } catch {
    return undefined;
  }
}

async function isGhCliInstalled(): Promise<boolean> {
  try {
    await execAsync("gh --version", { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function fetchGitHubUser(token: string): Promise<string> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = (await res.json()) as { login: string };
  return data.login;
}

async function openBrowser(url: string): Promise<void> {
  const platform = process.platform;
  const cmd =
    platform === "darwin"
      ? `open "${url}"`
      : platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  try {
    await execAsync(cmd);
  } catch {
    // user can open manually
  }
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

async function requestDeviceCode(clientId: string): Promise<DeviceCodeResponse> {
  const res = await fetch("https://github.com/login/device/code", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      scope: GITHUB_SCOPES.join(" "),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Device code request failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<DeviceCodeResponse>;
}

async function pollDeviceToken(
  clientId: string,
  deviceCode: string,
  interval: number,
  expiresIn: number,
): Promise<string> {
  const deadline = Date.now() + expiresIn * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, interval * 1000));

    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        device_code: deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      }),
    });

    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
      interval?: number;
    };

    if (data.access_token) return data.access_token;
    if (data.error === "authorization_pending") continue;
    if (data.error === "slow_down" && data.interval) {
      interval = data.interval;
      continue;
    }
    if (data.error) throw new Error(`GitHub auth failed: ${data.error}`);
  }
  throw new Error("GitHub device flow timed out — try again");
}

/**
 * Browser-based GitHub login via `gh auth login` (preferred) or OAuth device flow.
 */
export async function loginWithWebFlow(options?: {
  onStatus?: (message: string) => void;
  force?: boolean;
}): Promise<GitHubLoginResult> {
  const log = options?.onStatus ?? (() => {});

  if (!options?.force) {
    const existing = await resolveGitHubToken();
    if (existing) {
      const username = await fetchGitHubUser(existing.token);
      return { credentials: existing, username };
    }
  }

  if (await isGhCliInstalled()) {
    log("Opening GitHub in your browser via GitHub CLI...");
    log("Complete the login in the browser window.");
    try {
      await execAsync(
        `gh auth login --web --git-protocol https --scopes ${GITHUB_SCOPES.join(",")}`,
        { timeout: 300_000 },
      );
      const token = await tokenFromGhCli();
      if (token) {
        const username = await fetchGitHubUser(token);
        const creds: GitHubCredentials = {
          token,
          username,
          scopes: [...GITHUB_SCOPES],
          obtainedAt: new Date().toISOString(),
          method: "gh_cli",
        };
        await saveCredentials(creds);
        return { credentials: creds, username };
      }
    } catch {
      log("GitHub CLI login incomplete — trying device flow...");
    }
  }

  const clientId = resolveClientId();
  if (isPlaceholderClientId(clientId) && !process.env.DNA_GITHUB_CLIENT_ID) {
    throw new Error(
      "GitHub login requires GitHub CLI (`brew install gh`) or DNA_GITHUB_CLIENT_ID for device flow.\n" +
        "Install gh and run: dna github login\n" +
        "Maintainers: run ./scripts/setup-github-oauth-app.sh to register the first-party OAuth app.",
    );
  }

  log("Requesting device code...");
  const device = await requestDeviceCode(clientId);

  log(`\nOpen: ${device.verification_uri}`);
  log(`Code:  ${device.user_code}\n`);
  await openBrowser(`${device.verification_uri}`);

  log("Waiting for you to authorize in the browser...");
  const token = await pollDeviceToken(
    clientId,
    device.device_code,
    device.interval,
    device.expires_in,
  );

  const username = await fetchGitHubUser(token);
  const creds: GitHubCredentials = {
    token,
    username,
    scopes: [...GITHUB_SCOPES],
    obtainedAt: new Date().toISOString(),
    method: "device_flow",
  };
  await saveCredentials(creds);
  return { credentials: creds, username };
}

export async function resolveGitHubToken(): Promise<GitHubCredentials | null> {
  const envToken = getTokenFromEnv();
  if (envToken) {
    return {
      token: envToken,
      obtainedAt: new Date().toISOString(),
      method: "env",
    };
  }

  const stored = await loadStoredCredentials();
  if (stored) return stored;

  const ghToken = await tokenFromGhCli();
  if (ghToken) {
    return {
      token: ghToken,
      obtainedAt: new Date().toISOString(),
      method: "gh_cli",
    };
  }

  return null;
}

export async function requireGitHubToken(): Promise<string> {
  const creds = await resolveGitHubToken();
  if (creds) return creds.token;
  const { credentials } = await loginWithWebFlow();
  return credentials.token;
}
