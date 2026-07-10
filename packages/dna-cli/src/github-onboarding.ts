import type { DnaConfig } from "@superhumaan/dna-config";
import { DNA_CONFIG_FILE } from "@superhumaan/dna-config";
import {
  detectGitHubRemote,
  loginWithWebFlow,
  resolveGitHubToken,
} from "@superhumaan/dna-github";
import { writeJsonFile } from "@superhumaan/dna-core";
import { join } from "node:path";

export interface OnboardingGitHubResult {
  connected: boolean;
  owner?: string;
  repo?: string;
  username?: string;
  message: string;
}

/**
 * During onboarding: browser login + auto-connect repo from git remote.
 */
export async function connectGitHubDuringOnboarding(
  root: string,
  config: DnaConfig,
  options?: { onStatus?: (msg: string) => void; skipLogin?: boolean },
): Promise<OnboardingGitHubResult> {
  const log = options?.onStatus ?? (() => {});

  if (!config.github?.enabled) {
    return { connected: false, message: "GitHub integration disabled" };
  }

  let username: string | undefined;

  if (!options?.skipLogin) {
    const existing = await resolveGitHubToken();
    if (!existing) {
      log("\n🔗 GitHub — sign in with your browser (one time)\n");
      log("DNA needs repo access to push features and run CI. No tokens to copy.\n");
      try {
        const login = await loginWithWebFlow({ onStatus: log });
        username = login.username;
        log(`\n✓ Signed in as @${username}\n`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { connected: false, message: `GitHub login skipped: ${msg}` };
      }
    } else {
      username = existing.username;
    }
  }

  const remote = await detectGitHubRemote(root);
  if (remote) {
    config.github = {
      ...config.github,
      enabled: true,
      owner: remote.owner,
      repo: remote.repo,
      authenticated: !!username || !!(await resolveGitHubToken())?.token,
    };
    config.updatedAt = new Date().toISOString();
    await writeJsonFile(join(root, DNA_CONFIG_FILE), config);
    return {
      connected: true,
      owner: remote.owner,
      repo: remote.repo,
      username,
      message: `Connected ${remote.owner}/${remote.repo}`,
    };
  }

  config.github = { ...config.github, enabled: true, authenticated: !!username };
  config.updatedAt = new Date().toISOString();
  await writeJsonFile(join(root, DNA_CONFIG_FILE), config);

  return {
    connected: !!username,
    username,
    message: username
      ? "Signed in — add a GitHub remote and DNA auto-connects on next `dna doctor`"
      : "No git remote yet — add origin after creating a repo on GitHub",
  };
}
