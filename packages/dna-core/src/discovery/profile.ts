import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { DEFAULT_DISCOVERY_PROFILE, DNA_CONFIG_FILE } from "@superhumaan/dna-config";
import { readFile } from "node:fs/promises";
import { fileExists, writeFileEnsured, writeJsonFile } from "../fs.js";
import { loadDnaConfig } from "../validator.js";
import { ensureKnowledgeInstalled } from "../marketplace/ensure.js";
import {
  getLifecycleMeta,
  getTeamMeta,
  knowledgePackIdsForDiscoveryProfile,
  parseCsvDiscoveryIds,
  parseEventInput,
  parseLifecycleInput,
  parseMethodInput,
  parseProcessInput,
  parseTeamInput,
  resolveDiscoveryProfile,
  type DiscoveryProfile,
} from "./catalog.js";
import { discoveryBehaviourMarkdown } from "./behaviour.js";

export interface SetDiscoveryOptions {
  root: string;
  lifecycleStage?: string;
  teamModel?: string;
  processes?: string;
  methods?: string;
  events?: string;
}

export interface DiscoveryShowResult {
  profile: DiscoveryProfile;
  lifecycleName: string;
  teamName: string;
  knowledgePacks: string[];
  customProfileExists: boolean;
}

export function formatDiscoveryProfileSummary(result: DiscoveryShowResult): string {
  const { profile } = result;
  const lines = [
    "# Discovery Profile",
    "",
    `**Lifecycle:** ${result.lifecycleName} (\`${profile.lifecycleStage}\`)`,
    `**Team model:** ${result.teamName} (\`${profile.teamModel}\`)`,
    `**Processes:** ${profile.activeProcesses.join(", ") || "(none)"}`,
    `**Methods:** ${profile.activeMethods.join(", ") || "(none)"}`,
    `**Events:** ${profile.activeEvents.join(", ") || "(none)"}`,
    `**Custom profile:** ${profile.customProfile}${result.customProfileExists ? "" : " (not created yet)"}`,
    "",
    "**Knowledge packs:**",
    ...result.knowledgePacks.map((p) => `- ${p}`),
    "",
    "Run `dna context discovery` before product shaping, research, or UX work.",
  ];
  return lines.join("\n");
}

export async function showDiscoveryProfile(root: string): Promise<DiscoveryShowResult> {
  const config = await loadDnaConfig(root);
  const profile = resolveDiscoveryProfile(config);
  const customPath = join(root, profile.customProfile);
  return {
    profile,
    lifecycleName: getLifecycleMeta(profile.lifecycleStage).name,
    teamName: getTeamMeta(profile.teamModel).name,
    knowledgePacks: knowledgePackIdsForDiscoveryProfile(profile),
    customProfileExists: await fileExists(customPath),
  };
}

export async function setDiscoveryProfile(options: SetDiscoveryOptions): Promise<DiscoveryShowResult> {
  const config = (await loadDnaConfig(options.root))!;
  const existing = resolveDiscoveryProfile(config);

  const lifecycleStage = options.lifecycleStage
    ? parseLifecycleInput(options.lifecycleStage)
    : existing.lifecycleStage;
  const teamModel = options.teamModel ? parseTeamInput(options.teamModel) : existing.teamModel;
  const activeProcesses = options.processes
    ? parseCsvDiscoveryIds(options.processes, parseProcessInput)
    : existing.activeProcesses;
  const activeMethods = options.methods
    ? parseCsvDiscoveryIds(options.methods, parseMethodInput)
    : existing.activeMethods;
  const activeEvents = options.events
    ? parseCsvDiscoveryIds(options.events, parseEventInput)
    : existing.activeEvents;

  const discovery: NonNullable<DnaConfig["discovery"]> = {
    lifecycleStage,
    teamModel,
    activeProcesses,
    activeMethods,
    activeEvents,
    customProfile: existing.customProfile,
  };

  const updated: DnaConfig = {
    ...config,
    discovery,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(join(options.root, DNA_CONFIG_FILE), updated);

  const profile = resolveDiscoveryProfile(updated);
  await ensureKnowledgeInstalled(options.root, knowledgePackIdsForDiscoveryProfile(profile));

  const behaviourPath = join(options.root, ".DNA", "behaviour", "discovery.behaviour.md");
  await writeFileEnsured(behaviourPath, discoveryBehaviourMarkdown(updated));

  const customPath = join(options.root, profile.customProfile);
  if (!(await fileExists(customPath))) {
    await writeFileEnsured(customPath, buildCustomDiscoveryTemplate(profile, updated));
  }

  return showDiscoveryProfile(options.root);
}

function buildCustomDiscoveryTemplate(profile: DiscoveryProfile, config: DnaConfig): string {
  const lifecycle = getLifecycleMeta(profile.lifecycleStage);
  const team = getTeamMeta(profile.teamModel);
  return `# Discovery Profile — ${config.projectName}

_Organisation-specific discovery overrides. DNA loads this after discovery packs._

## Lifecycle

- **Stage:** ${lifecycle.name}
- **Team model:** ${team.name}

## Active practices

**Processes:** ${profile.activeProcesses.join(", ") || "(none)"}
**Methods:** ${profile.activeMethods.join(", ") || "(none)"}
**Events:** ${profile.activeEvents.join(", ") || "(none)"}

## Research conventions

- Participant recruitment channel: _(e.g. customer panel, UserInterviews.com, sales intros)_
- Consent / privacy: _(link to policy; GDPR if EU participants)_
- Insight repository: _(Dovetail, Notion, or DNA Impressions only)_
- Readout cadence: _(e.g. weekly triad, bi-weekly stakeholder)_

## Opportunity prioritisation

- Framework: _(OST, RICE, ICE, WSJF)_
- Who decides bets: _(role / forum)_
- Definition of "validated enough to build": _(e.g. 3 interviews + prototype test)_

## Handoff to engineering

- Trigger: _(e.g. assumption test passed, PMF signal threshold)_
- Artifact: update \`ai/feature-request.md\` + \`DNA/Impressions/product/opportunity-tree.md\`
`;
}

export async function readCustomDiscoveryContent(
  root: string,
  profile: DiscoveryProfile,
): Promise<string | null> {
  const path = join(root, profile.customProfile);
  if (!(await fileExists(path))) return null;
  return readFile(path, "utf-8");
}

export function defaultDiscoveryBlock(): DnaConfig["discovery"] {
  return {
    lifecycleStage: DEFAULT_DISCOVERY_PROFILE.lifecycleStage,
    teamModel: DEFAULT_DISCOVERY_PROFILE.teamModel,
    activeProcesses: [...DEFAULT_DISCOVERY_PROFILE.activeProcesses],
    activeMethods: [],
    activeEvents: [],
    customProfile: DEFAULT_DISCOVERY_PROFILE.customProfile,
  };
}
