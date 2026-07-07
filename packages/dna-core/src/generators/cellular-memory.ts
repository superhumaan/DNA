import type { DnaConfig, WizardAnswers } from "@superhumaan/dna-config";

export function generateCellularMemory(
  config: DnaConfig,
  answers: WizardAnswers,
): Record<string, string> {
  const now = new Date().toISOString().split("T")[0];

  return {
    "hippocampus/recent-changes.md": `# Recent Changes

_Last updated: ${now}_

## Initial Setup

- DNA initialised on ${now}
- Project: ${config.projectName}
`,
    "hippocampus/project-summary.md": `# Project Summary

**${config.projectName}**

${config.description ?? "No description provided."}

## Stack

- Frontend: ${config.stack.frontend ?? "TBD"}
- Backend: ${config.stack.backend ?? "TBD"}
- Database: ${config.stack.database ?? "TBD"}
`,
    "prefrontalCortex/current-plan.md": `# Current Plan

## Active Focus

Initial project setup and MVP development.

## Stage

${config.stage}
`,
    "prefrontalCortex/next-actions.md": `# Next Actions

- [ ] Review generated Impressions documentation
- [ ] Configure CI/CD pipeline
- [ ] Set up test suite
- [ ] Install runtime observer if needed
`,
    "prefrontalCortex/decisions.md": `# Decisions

## ${now}: DNA Initialisation

- Accepted DNA recommendation: ${answers.acceptRecommendation ? "yes" : "no (custom stack)"}
- Compliance: ${answers.compliance}
- AI tools: ${answers.aiTools.join(", ") || "none"}
`,
    "amygdala/risks.md": `# Risks

_No risks recorded yet._
`,
    "amygdala/blockers.md": `# Blockers

_No blockers recorded yet._
`,
    "amygdala/repeated-failures.md": `# Repeated Failures

_No repeated failures recorded yet._
`,
    "cerebellum/repeated-patterns.md": `# Repeated Patterns

_Patterns will be learned as the project develops._
`,
    "cerebellum/automation-learnings.md": `# Automation Learnings

_CI/CD and automation learnings will be recorded here._
`,
    "temporalLobe/decision-history.md": `# Decision History

## ${now}

DNA project intelligence initialised.
`,
    "temporalLobe/previous-solutions.md": `# Previous Solutions

_Solutions to past issues will be recorded here._
`,
    "parietalLobe/system-map.md": `# System Map

## Components

- Frontend: ${config.stack.frontend ?? "TBD"}
- Backend: ${config.stack.backend ?? "TBD"}
- Database: ${config.stack.database ?? "TBD"}
`,
    "parietalLobe/dependency-map.md": `# Dependency Map

_Key dependencies will be mapped here as the project grows._
`,
    "occipitalLobe/ui-patterns.md": `# UI Patterns

_Define UI patterns and component conventions here._
`,
    "occipitalLobe/visual-standards.md": `# Visual Standards

_Define typography, colour, spacing standards here._
`,
  };
}
