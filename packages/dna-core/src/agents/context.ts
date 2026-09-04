import type { DnaConfig } from "@superhumaan/dna-config";
import { resolveIntegrationBranch, resolveGitBranchingStrategy } from "@superhumaan/dna-config";
import { LIVE_COORDINATION_HEADING } from "./types.js";
import { listAgents, resolveHeartbeatTtl } from "./registry.js";
import { activeAgents } from "./claims.js";

export async function formatLiveCoordination(
  root: string,
  config?: Pick<DnaConfig, "agents" | "git"> | null,
): Promise<string> {
  const ttl = resolveHeartbeatTtl(config);
  const agents = await listAgents(root);
  const live = activeAgents(agents, ttl);
  const expected = resolveIntegrationBranch(config);
  const strategy = resolveGitBranchingStrategy(config);

  const lines = [
    `# ${LIVE_COORDINATION_HEADING}`,
    "",
    "DNA is the agent coordination control plane. Register, claim paths, heartbeat, and commit through DNA.",
    "",
    `- Integration branch: \`${expected}\` (strategy: ${strategy})`,
    `- Heartbeat TTL: ${ttl}s`,
    `- Live agents: ${live.length}`,
    "",
    "Rules:",
    "- Stay on the integration branch. Do not create or switch feature branches.",
    "- Claim files before writing. A DNA CONFLICT deny means another live agent holds the path.",
    "- Never `git add .`, `git add -A`, or raw `git commit`. Use `dna commit`.",
    "- Isolated coding subagents are denied. Explore/review isolated subagents are allowed.",
    "- A dirty tree at stop is a DNA COMMIT GATE FAILED — review, test, `dna commit`, verify status.",
    "",
  ];

  if (live.length === 0) {
    lines.push("_No live agents registered yet._");
    return lines.join("\n");
  }

  lines.push("| id | type | task | branch | claimed |");
  lines.push("|----|------|------|--------|---------|");
  for (const agent of live) {
    const claims = agent.claimed_paths.length ? agent.claimed_paths.join("<br>") : "—";
    lines.push(
      `| ${agent.id} | ${agent.type} | ${agent.task || "—"} | ${agent.branch ?? "—"} | ${claims} |`,
    );
  }
  return lines.join("\n");
}
