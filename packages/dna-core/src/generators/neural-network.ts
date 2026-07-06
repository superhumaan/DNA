import type { DnaConfig, NeuralNetwork } from "@humaan/dna-config";

const INTENTS: NeuralNetwork["intents"][string][] = [
  {
    intent: "build_frontend_component",
    description: "Create or modify a frontend UI component",
    requiredKnowledge: [
      "frameworks/react/positioning.dna.md",
      "frameworks/vite/positioning.dna.md",
      "disciplines/frontend/positioning.dna.md",
    ],
    requiredBehaviour: ["coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["occipitalLobe/ui-patterns.md", "hippocampus/recent-changes.md"],
    impressions: ["architecture/solution-architecture.md"],
    validationChecks: ["has_tests", "no_duplicate_components"],
  },
  {
    intent: "create_api_endpoint",
    description: "Create or modify a backend API endpoint",
    requiredKnowledge: [
      "frameworks/express/positioning.dna.md",
      "disciplines/backend/positioning.dna.md",
    ],
    requiredBehaviour: ["coding.behaviour.md", "security.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["parietalLobe/system-map.md", "prefrontalCortex/decisions.md"],
    impressions: ["architecture/data-flow.md", "security/security-baseline.md"],
    validationChecks: ["has_tests", "has_auth_check", "has_input_validation"],
  },
  {
    intent: "install_dependency",
    description: "Add a new package dependency",
    requiredKnowledge: ["languages/typescript/positioning.dna.md"],
    requiredBehaviour: ["coding.behaviour.md", "security.behaviour.md"],
    cellularMemory: ["parietalLobe/dependency-map.md"],
    impressions: ["architecture/solution-architecture.md"],
    validationChecks: ["no_duplicate_deps", "no_dangerous_deps"],
  },
  {
    intent: "build_pwa",
    description: "Implement PWA capabilities",
    requiredKnowledge: [
      "platforms/pwa/positioning.dna.md",
      "frameworks/vite/pwa-patterns.dna.md",
    ],
    requiredBehaviour: ["coding.behaviour.md", "documentation.behaviour.md"],
    cellularMemory: ["occipitalLobe/ui-patterns.md"],
    impressions: ["architecture/solution-architecture.md"],
    validationChecks: ["has_manifest", "has_service_worker"],
  },
  {
    intent: "implement_rbac",
    description:
      "Implement role-based access control with zero trust — permission matrix, API enforcement, route guards, menu/notification hiding",
    requiredKnowledge: [
      "security/rbac-fundamentals.dna.md",
      "security/zero-trust.dna.md",
      "security/ui-surface-checklist.dna.md",
      "disciplines/security/positioning.dna.md",
    ],
    requiredBehaviour: ["security.behaviour.md", "coding.behaviour.md", "testing.behaviour.md", "ai.behaviour.md"],
    cellularMemory: [
      "prefrontalCortex/rbac-permission-matrix.md",
      "prefrontalCortex/decisions.md",
      "amygdala/risks.md",
    ],
    impressions: ["security/security-baseline.md", "security/threat-model.md", "product/user-types.md"],
    validationChecks: [
      "rbac_permission_matrix_exists",
      "api_enforcement",
      "route_guards",
      "ui_surfaces_hidden",
      "role_verification_tests",
      "no_default_admin_for_all_users",
    ],
  },
  {
    intent: "add_authentication",
    description: "Add or modify authentication",
    requiredKnowledge: ["disciplines/security/positioning.dna.md"],
    requiredBehaviour: ["security.behaviour.md", "coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["amygdala/risks.md", "prefrontalCortex/decisions.md"],
    impressions: ["security/security-baseline.md", "security/threat-model.md"],
    validationChecks: ["has_auth_tests", "no_secrets_in_code"],
  },
  {
    intent: "write_tests",
    description: "Write or update tests",
    requiredKnowledge: ["disciplines/qa/positioning.dna.md"],
    requiredBehaviour: ["testing.behaviour.md"],
    cellularMemory: ["cerebellum/repeated-patterns.md"],
    impressions: ["qa/qa-strategy.md", "qa/test-plan.md"],
    validationChecks: ["tests_pass"],
  },
  {
    intent: "fix_runtime_error",
    description: "Investigate and fix a production runtime error",
    requiredKnowledge: ["disciplines/backend/positioning.dna.md"],
    requiredBehaviour: ["runtime.behaviour.md", "coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: [
      "amygdala/repeated-failures.md",
      "temporalLobe/previous-solutions.md",
      "hippocampus/recent-changes.md",
    ],
    impressions: ["devops/rollback-plan.md"],
    validationChecks: ["has_regression_test", "immune_system_review"],
  },
  {
    intent: "update_documentation",
    description: "Update project documentation or Impressions",
    requiredKnowledge: ["disciplines/solution-engineering/positioning.dna.md"],
    requiredBehaviour: ["documentation.behaviour.md"],
    cellularMemory: ["hippocampus/project-summary.md"],
    impressions: ["product/product-overview.md"],
    validationChecks: ["impressions_current"],
  },
  {
    intent: "improve_security",
    description: "Improve security posture",
    requiredKnowledge: ["disciplines/security/positioning.dna.md"],
    requiredBehaviour: ["security.behaviour.md"],
    cellularMemory: ["amygdala/risks.md"],
    impressions: ["security/security-baseline.md", "security/threat-model.md"],
    validationChecks: ["no_secrets_in_code", "has_env_example"],
  },
  {
    intent: "configure_ci_cd",
    description: "Configure CI/CD pipelines",
    requiredKnowledge: ["disciplines/devops/positioning.dna.md"],
    requiredBehaviour: ["coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["cerebellum/automation-learnings.md"],
    impressions: ["devops/deployment-model.md", "devops/environments.md"],
    validationChecks: ["ci_runs_tests"],
  },
  {
    intent: "create_mobile_feature",
    description: "Build mobile-specific features",
    requiredKnowledge: [
      "frameworks/react-native/positioning.dna.md",
      "disciplines/mobile-development/positioning.dna.md",
    ],
    requiredBehaviour: ["coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["occipitalLobe/ui-patterns.md"],
    impressions: ["architecture/solution-architecture.md"],
    validationChecks: ["has_mobile_tests"],
  },
  {
    intent: "review_architecture",
    description: "Review or update solution architecture",
    requiredKnowledge: ["disciplines/solution-architecture/positioning.dna.md"],
    requiredBehaviour: ["coding.behaviour.md", "documentation.behaviour.md"],
    cellularMemory: ["parietalLobe/system-map.md", "prefrontalCortex/decisions.md"],
    impressions: [
      "architecture/solution-architecture.md",
      "architecture/system-boundaries.md",
      "architecture/data-flow.md",
    ],
    validationChecks: ["architecture_documented"],
  },
  {
    intent: "investigate_bug",
    description: "Investigate a reported bug",
    requiredKnowledge: ["disciplines/qa/positioning.dna.md"],
    requiredBehaviour: ["coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: [
      "temporalLobe/previous-solutions.md",
      "amygdala/repeated-failures.md",
    ],
    impressions: ["qa/regression-risks.md"],
    validationChecks: ["has_reproduction_steps"],
  },
  {
    intent: "create_pr",
    description: "Create a pull request for completed work",
    requiredKnowledge: ["disciplines/solution-engineering/positioning.dna.md"],
    requiredBehaviour: ["ai.behaviour.md", "coding.behaviour.md", "testing.behaviour.md"],
    cellularMemory: ["hippocampus/recent-changes.md", "prefrontalCortex/next-actions.md"],
    impressions: ["release-notes/initial-release-notes.md"],
    validationChecks: ["validate_behaviour", "tests_pass", "no_secrets_in_diff"],
  },
];

export function generateNeuralNetwork(_config: DnaConfig): NeuralNetwork {
  const intents: NeuralNetwork["intents"] = {};
  for (const intent of INTENTS) {
    intents[intent.intent] = intent;
  }
  return {
    version: "0.1.0",
    intents,
  };
}

export function getIntentContext(
  neuralNetwork: NeuralNetwork,
  intentName: string,
): NeuralNetwork["intents"][string] | undefined {
  return neuralNetwork.intents[intentName];
}
