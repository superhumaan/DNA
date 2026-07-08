export type ContextTarget =
  | "cursor"
  | "claude"
  | "chatgpt"
  | "copilot"
  | "windsurf"
  | "gemini"
  | "backend"
  | "frontend"
  | "security"
  | "qa"
  | "devops"
  | "rbac"
  | "platform"
  | "compliance"
  | "multilingual"
  | "ivf"
  | "all";

export const TARGET_INTENTS: Record<ContextTarget, string[]> = {
  cursor: [
    "implement_feature",
    "build_frontend_component",
    "consolidate_shared_library",
    "build_list_report_page",
    "create_api_endpoint",
    "install_dependency",
    "create_pr",
  ],
  claude: ["build_frontend_component", "build_list_report_page", "create_api_endpoint", "fix_runtime_error", "create_pr"],
  chatgpt: ["review_architecture", "update_documentation", "investigate_bug"],
  copilot: ["build_frontend_component", "create_api_endpoint", "create_pr"],
  windsurf: ["build_frontend_component", "fix_runtime_error", "create_pr"],
  gemini: ["review_architecture", "update_documentation", "investigate_bug"],
  backend: ["create_api_endpoint", "fix_runtime_error", "configure_ci_cd"],
  frontend: [
    "implement_feature",
    "build_frontend_component",
    "consolidate_shared_library",
    "build_list_report_page",
    "build_pwa",
    "create_mobile_feature",
  ],
  security: ["implement_rbac", "add_authentication", "improve_security"],
  qa: ["implement_feature", "write_tests", "investigate_bug"],
  devops: ["configure_ci_cd", "fix_runtime_error"],
  rbac: ["implement_rbac"],
  platform: [
    "implement_feature",
    "implement_admin_portal",
    "implement_sso_bridge",
    "implement_feature_flags",
    "deploy_azure",
    "deploy_aws",
    "implement_google_directory",
    "implement_ai_governance",
    "implement_multi_tenant",
    "implement_rbac",
  ],
  compliance: [
    "implement_compliance_controls",
    "implement_rbac",
    "improve_security",
    "add_authentication",
  ],
  multilingual: [
    "communicate_in_user_language",
    "implement_multilingual",
    "translate_documentation",
    "update_documentation",
  ],
  ivf: [
    "review_architecture",
    "update_documentation",
    "consolidate_shared_library",
    "build_list_report_page",
    "implement_rbac",
    "improve_security",
    "configure_ci_cd",
    "fix_runtime_error",
  ],
  all: [],
};
