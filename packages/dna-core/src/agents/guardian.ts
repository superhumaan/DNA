import type { DnaConfig } from "@superhumaan/dna-config";
import {
  isIntegrationBranch,
  resolveGitBranchingStrategy,
  resolveIntegrationBranch,
} from "@superhumaan/dna-config";
import { GIT_GUARDIAN_DENIED, type GuardianDecision } from "./types.js";

export interface GuardianContext {
  currentBranch?: string | null;
  branchKnown?: boolean;
  config?: Pick<DnaConfig, "git"> | null;
}

function stripWrappers(command: string): string {
  return command
    .replace(/^\s*(?:sudo\s+)?/, "")
    .replace(/^(?:command\s+)?/, "")
    .trim();
}

function tokenize(command: string): string[] {
  return stripWrappers(command)
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/^['"]|['"]$/g, ""));
}

function hasFlag(tokens: string[], ...flags: string[]): boolean {
  return tokens.some((t) => flags.includes(t));
}

function compactedFlags(tokens: string[]): string[] {
  return tokens.filter((t) => t.startsWith("-"));
}

function hasShortFlag(tokens: string[], letter: string): boolean {
  return compactedFlags(tokens).some(
    (flag) => flag.startsWith("-") && !flag.startsWith("--") && flag.includes(letter),
  );
}

export function isDnaCommitCommand(command: string): boolean {
  const tokens = tokenize(command);
  const dnaIdx = tokens.findIndex((t) => t === "dna" || t.endsWith("/dna") || t.endsWith("/dna.js"));
  if (dnaIdx === -1) return false;
  return tokens[dnaIdx + 1] === "commit" || (tokens[dnaIdx + 1] === "agents" && tokens[dnaIdx + 2] === "commit");
}

export function isDnaGithubPushCommand(command: string): boolean {
  const tokens = tokenize(command);
  const dnaIdx = tokens.findIndex((t) => t === "dna" || t.endsWith("/dna") || t.endsWith("/dna.js"));
  if (dnaIdx === -1) return false;
  return tokens[dnaIdx + 1] === "github" && tokens[dnaIdx + 2] === "push";
}

export function isReadOnlyGitCommand(command: string): boolean {
  const tokens = tokenize(command);
  const gitIdx = tokens.findIndex((t) => t === "git" || t.endsWith("/git"));
  if (gitIdx === -1) return false;
  const sub = tokens[gitIdx + 1];
  return sub === "status" || sub === "diff" || sub === "log" || sub === "show" || sub === "rev-parse";
}

function isGitInvocation(command: string): boolean {
  const tokens = tokenize(command);
  return tokens.some((t) => t === "git" || t.endsWith("/git"));
}

function gitSubcommand(command: string): { sub: string; args: string[] } | null {
  const tokens = tokenize(command);
  const gitIdx = tokens.findIndex((t) => t === "git" || t.endsWith("/git"));
  if (gitIdx === -1) return null;
  const sub = tokens[gitIdx + 1] ?? "";
  return { sub, args: tokens.slice(gitIdx + 2) };
}

export function isBranchCreateCommand(command: string): boolean {
  const parsed = gitSubcommand(command);
  if (!parsed) return false;
  const { sub, args } = parsed;
  if (sub === "checkout" && (hasFlag(args, "-b", "-B") || hasFlag(args, "--orphan"))) return true;
  if (sub === "switch" && (hasFlag(args, "-c", "-C") || hasFlag(args, "--create"))) return true;
  if (sub === "worktree" && args[0] === "add") return true;
  if (sub === "branch") {
    const mutators = ["-d", "-D", "-m", "-M", "--delete", "--move", "--list", "-l", "-a", "-r", "-v", "--verbose"];
    if (hasFlag(args, ...mutators) || hasFlag(args, "--show-current")) return false;
    const positional = args.filter((a) => !a.startsWith("-"));
    return positional.length >= 1;
  }
  return false;
}

export function isStashCommand(command: string): boolean {
  const parsed = gitSubcommand(command);
  return parsed?.sub === "stash";
}

export function isRawGitAdd(command: string): boolean {
  const parsed = gitSubcommand(command);
  return parsed?.sub === "add";
}

export function isGitAddAll(command: string): boolean {
  const parsed = gitSubcommand(command);
  if (parsed?.sub !== "add") return false;
  const { args } = parsed;
  if (hasFlag(args, "-A", "--all", "--no-ignore-removal")) return true;
  if (args.includes(".")) return true;
  if (args.length === 0) return true;
  return false;
}

export function isRawGitCommit(command: string): boolean {
  if (isDnaCommitCommand(command)) return false;
  const parsed = gitSubcommand(command);
  return parsed?.sub === "commit";
}

export function isResetHard(command: string): boolean {
  const parsed = gitSubcommand(command);
  return parsed?.sub === "reset" && hasFlag(parsed.args, "--hard");
}

export function isCleanForce(command: string): boolean {
  const parsed = gitSubcommand(command);
  if (parsed?.sub !== "clean") return false;
  return hasFlag(parsed.args, "-f", "--force") || hasShortFlag(parsed.args, "f");
}

export function evaluateGitGuardian(command: string, ctx: GuardianContext = {}): GuardianDecision {
  const trimmed = command.trim();
  if (!trimmed) return { permission: "allow" };

  if (isDnaCommitCommand(trimmed) || isDnaGithubPushCommand(trimmed) || isReadOnlyGitCommand(trimmed)) {
    return { permission: "allow" };
  }

  if (!isGitInvocation(trimmed)) {
    return { permission: "allow" };
  }

  const config = ctx.config ?? null;
  const strategy = resolveGitBranchingStrategy(config);
  const expected = resolveIntegrationBranch(config);
  const branch = ctx.currentBranch ?? null;
  const branchKnown = ctx.branchKnown ?? Boolean(branch);
  const onTrunk = isIntegrationBranch(branch, config);
  const deny = (extra?: string): GuardianDecision => ({
    permission: "deny",
    reason: extra ?? GIT_GUARDIAN_DENIED,
    user_message: extra ?? GIT_GUARDIAN_DENIED,
    agent_message: `${GIT_GUARDIAN_DENIED} Expected branch: ${expected}.`,
  });

  if (isBranchCreateCommand(trimmed)) {
    if (strategy === "feature-branch") return { permission: "allow" };
    return deny();
  }

  const writeOp =
    isStashCommand(trimmed) ||
    isRawGitAdd(trimmed) ||
    isGitAddAll(trimmed) ||
    isRawGitCommit(trimmed) ||
    isResetHard(trimmed) ||
    isCleanForce(trimmed);

  if (!writeOp) return { permission: "allow" };

  if (onTrunk) return deny();

  // Off-trunk writes: deny only when the current branch is known and not integration.
  if (branchKnown && !onTrunk) return deny();

  return { permission: "allow" };
}

export function guardianAllowsCommand(command: string, ctx: GuardianContext = {}): boolean {
  return evaluateGitGuardian(command, ctx).permission === "allow";
}
