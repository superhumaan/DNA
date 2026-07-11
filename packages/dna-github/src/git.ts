import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface GitStatusFile {
  path: string;
}

export interface GitStatus {
  current: string | null;
  files: GitStatusFile[];
  modified: string[];
  created: string[];
  staged: string[];
}

export interface GitRemote {
  name: string;
  refs: { fetch?: string; push?: string };
}

export interface GitConfigResult {
  value: string | null;
}

export class Git {
  constructor(private readonly root: string) {}

  async checkIsRepo(): Promise<boolean> {
    try {
      await this.run(["rev-parse", "--git-dir"]);
      return true;
    } catch {
      return false;
    }
  }

  async status(): Promise<GitStatus> {
    const { stdout } = await this.run(["status", "--porcelain", "-b"]);
    const lines = stdout.split("\n").filter(Boolean);
    const modified: string[] = [];
    const created: string[] = [];
    const staged: string[] = [];
    const files: GitStatusFile[] = [];
    let current: string | null = null;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        const branchPart = line.slice(3).split("...")[0]?.trim() ?? "";
        current = branchPart.replace(/^branch\.head /, "") || branchPart || null;
        if (current?.startsWith("No commits")) current = null;
        continue;
      }
      if (line.length < 4) continue;
      const indexStatus = line.slice(0, 2);
      const path = line.slice(3).trim();
      files.push({ path });
      const workTree = indexStatus[1];
      const index = indexStatus[0];
      if (workTree === "?" || workTree === "A") created.push(path);
      else if (workTree === "M" || workTree === "D") modified.push(path);
      if (index !== " " && index !== "?") staged.push(path);
    }

    if (!current) {
      try {
        const branch = await this.run(["rev-parse", "--abbrev-ref", "HEAD"]);
        const name = branch.stdout.trim();
        current = name === "HEAD" ? null : name;
      } catch {
        current = null;
      }
    }

    return { current, files, modified, created, staged };
  }

  async getRemotes(verbose = false): Promise<GitRemote[]> {
    const args = verbose ? ["remote", "-v"] : ["remote"];
    const { stdout } = await this.run(args);
    if (!verbose) {
      return stdout
        .split("\n")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ name, refs: {} }));
    }

    const remotes = new Map<string, GitRemote>();
    for (const line of stdout.split("\n").filter(Boolean)) {
      const match = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
      if (!match) continue;
      const [, name, url, kind] = match;
      const existing = remotes.get(name) ?? { name, refs: {} };
      if (kind === "fetch") existing.refs.fetch = url;
      if (kind === "push") existing.refs.push = url;
      remotes.set(name, existing);
    }
    return [...remotes.values()];
  }

  async getConfig(key: string): Promise<GitConfigResult> {
    try {
      const { stdout } = await this.run(["config", "--get", key]);
      return { value: stdout.trim() || null };
    } catch {
      return { value: null };
    }
  }

  async addConfig(
    key: string,
    value: string,
    _append = false,
    scope: "local" | "global" | "system" = "local",
  ): Promise<void> {
    await this.run(["config", `--${scope}`, key, value]);
  }

  async add(paths: string | string[]): Promise<void> {
    const list = Array.isArray(paths) ? paths : [paths];
    if (!list.length) return;
    await this.run(["add", "--", ...list]);
  }

  async commit(message: string): Promise<void> {
    await this.run(["commit", "-m", message]);
  }

  async push(remote: string, branch: string, extra: string[] = []): Promise<void> {
    await this.run(["push", ...extra, remote, branch]);
  }

  async checkoutLocalBranch(name: string): Promise<void> {
    await this.run(["checkout", "-b", name]);
  }

  async checkout(target: string | string[]): Promise<void> {
    const args = Array.isArray(target) ? target : [target];
    await this.run(["checkout", ...args]);
  }

  async fetch(remote: string, branch: string): Promise<void> {
    await this.run(["fetch", remote, branch]);
  }

  async diff(args: string[]): Promise<string> {
    const { stdout } = await this.run(["diff", ...args]);
    return stdout;
  }

  async branchLocal(): Promise<{ all: string[] }> {
    const { stdout } = await this.run(["branch", "--format=%(refname:short)"]);
    return {
      all: stdout
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean),
    };
  }

  private async run(args: string[]): Promise<{ stdout: string; stderr: string }> {
    return execFileAsync("git", args, {
      cwd: this.root,
      maxBuffer: 10 * 1024 * 1024,
      encoding: "utf-8",
    });
  }
}

export function git(root: string): Git {
  return new Git(root);
}
