import type { AgentRecord } from "./types.js";
import { conflictMessage } from "./types.js";

export function normalizeClaimPath(filePath: string): string {
  return filePath
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "")
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");
}

export function pathsOverlap(a: string, b: string): boolean {
  const left = normalizeClaimPath(a);
  const right = normalizeClaimPath(b);
  if (!left || !right) return false;
  if (left === right) return true;
  return left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
}

export function agentHoldsPath(agent: AgentRecord, filePath: string): boolean {
  const target = normalizeClaimPath(filePath);
  return agent.claimed_paths.some((claimed) => pathsOverlap(claimed, target));
}

export interface ClaimConflict {
  agent: AgentRecord;
  path: string;
  message: string;
}

export function findClaimConflict(
  agents: AgentRecord[],
  filePath: string,
  exceptAgentId?: string,
): ClaimConflict | null {
  const target = normalizeClaimPath(filePath);
  if (!target) return null;
  for (const agent of agents) {
    if (exceptAgentId && agent.id === exceptAgentId) continue;
    if (agent.status !== "active") continue;
    if (!agentHoldsPath(agent, target)) continue;
    return {
      agent,
      path: target,
      message: conflictMessage(agent.id, agent.task, target),
    };
  }
  return null;
}

export function mergeUniquePaths(existing: string[], incoming: string[]): string[] {
  const seen = new Set(existing.map(normalizeClaimPath).filter(Boolean));
  const out = [...seen];
  for (const path of incoming) {
    const normalized = normalizeClaimPath(path);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

export function isAgentFresh(agent: AgentRecord, heartbeatTtlSeconds: number, now = Date.now()): boolean {
  const at = Date.parse(agent.heartbeat_at);
  if (Number.isNaN(at)) return false;
  return now - at <= heartbeatTtlSeconds * 1000;
}

export function activeAgents(agents: AgentRecord[], heartbeatTtlSeconds: number, now = Date.now()): AgentRecord[] {
  return agents.filter((agent) => agent.status === "active" && isAgentFresh(agent, heartbeatTtlSeconds, now));
}
