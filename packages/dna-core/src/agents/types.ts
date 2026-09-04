export const AGENT_TYPES = ["primary", "subagent"] as const;
export type AgentType = (typeof AGENT_TYPES)[number];

export const AGENT_STATUSES = ["active", "idle", "completed", "failed"] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

export interface AgentRecord {
  id: string;
  parent_id: string | null;
  type: AgentType;
  status: AgentStatus;
  task: string;
  started_at: string;
  heartbeat_at: string;
  branch: string | null;
  worktree: string | null;
  claimed_paths: string[];
  modified_paths: string[];
  last_commit: string | null;
}

export const READ_ONLY_SUBAGENT_TYPES = [
  "explore",
  "cursor-guide",
  "security-review",
  "bugbot",
  "ci-investigator",
] as const;

export type ReadOnlySubagentType = (typeof READ_ONLY_SUBAGENT_TYPES)[number];

export const GIT_GUARDIAN_DENIED =
  "DENIED BY DNA GIT GUARDIAN — trunk, expected branch, do not create/switch feature branches.";

export const COMMIT_GATE_FAILED =
  "DNA COMMIT GATE FAILED — must review diff, test, dna commit, verify status; do not abandon.";

export function conflictMessage(agentId: string, task: string, filePath: string): string {
  const taskBit = task.trim() ? `, task: ${task.trim()}` : "";
  return `DNA CONFLICT — file ${filePath} claimed by agent ${agentId}${taskBit}, work elsewhere / wait / coordinate.`;
}

export const LIVE_COORDINATION_HEADING = "DNA LIVE COORDINATION";

export interface GuardianDecision {
  permission: "allow" | "deny";
  reason?: string;
  user_message?: string;
  agent_message?: string;
}

export interface HookDecision {
  permission: "allow" | "deny";
  additional_context?: string;
  followup_message?: string;
  user_message?: string;
  agent_message?: string;
}

export interface AgentHookPayload {
  hook_event_name?: string;
  conversation_id?: string;
  generation_id?: string;
  session_id?: string;
  composer_mode?: string;
  cwd?: string;
  command?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  file_path?: string;
  subagent_type?: string;
  subagent_id?: string;
  is_isolated?: boolean;
  git_branch?: string;
  parent_conversation_id?: string;
}

export function isAgentType(value: string): value is AgentType {
  return (AGENT_TYPES as readonly string[]).includes(value);
}

export function isAgentStatus(value: string): value is AgentStatus {
  return (AGENT_STATUSES as readonly string[]).includes(value);
}

export function isReadOnlySubagentType(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return (READ_ONLY_SUBAGENT_TYPES as readonly string[]).includes(normalized);
}
