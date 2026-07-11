import { relative } from "node:path";
import {
  createBranch,
  createPullRequest,
  detectGitHubRemote,
  git,
  requireGitHubToken,
} from "@superhumaan/dna-github";
import { loadDnaConfig } from "../validator.js";
import { detectImpressionsDrift, formatImpressionsDriftReport } from "./drift.js";
import { scanProject } from "../scanner.js";
import { generateImpressionsSyncPlan, type ImpressionsSyncPlanResult } from "./sync-plan.js";

export interface OpenImpressionsSyncPrOptions {
  root: string;
  draft?: boolean;
}

export interface OpenImpressionsSyncPrResult extends ImpressionsSyncPlanResult {
  prUrl?: string;
  branch?: string;
}

export async function openImpressionsSyncDraftPr(
  options: OpenImpressionsSyncPrOptions,
): Promise<OpenImpressionsSyncPrResult> {
  const planResult = await generateImpressionsSyncPlan({ root: options.root, openPr: true });
  const config = await loadDnaConfig(options.root);
  if (!config?.github?.enabled) {
    return planResult;
  }

  const remote = await detectGitHubRemote(options.root);
  if (!remote) {
    return planResult;
  }

  const token = await requireGitHubToken();
  const ghConfig = {
    token,
    owner: config.github.owner ?? remote.owner,
    repo: config.github.repo ?? remote.repo,
  };

  const branch = `dna/impressions-sync-${Date.now()}`;
  const g = git(options.root);
  if (!(await g.checkIsRepo())) {
    return planResult;
  }

  const base = (await g.status()).current ?? "main";
  await createBranch(ghConfig, branch, base);
  await g.checkoutLocalBranch(branch);
  const relPlan = relative(options.root, planResult.planPath);
  await g.add([relPlan]);
  await g.commit("docs: DNA impressions sync plan");

  const tokenRemote =
    remote.remoteUrl.startsWith("git@")
      ? remote.remoteUrl
      : remote.remoteUrl.replace(
          /https:\/\/github\.com\//,
          `https://x-access-token:${token}@github.com/`,
        );
  await g.push(tokenRemote, branch, ["--set-upstream"]);

  const scan = await scanProject(options.root);
  const drift = await detectImpressionsDrift(options.root, scan);
  const body = [
    "## Impressions drift sync",
    "",
    formatImpressionsDriftReport(drift),
    "",
    `Plan: \`${relPlan}\``,
    "",
    "_Draft PR opened by `dna scan --open-pr` — review before merging._",
  ].join("\n");

  const pr = await createPullRequest(ghConfig, {
    title: `docs: sync Impressions (drift ${drift.score}/100)`,
    body,
    head: branch,
    base,
    draft: options.draft ?? true,
  });

  return { ...planResult, prUrl: pr.url, branch };
}
