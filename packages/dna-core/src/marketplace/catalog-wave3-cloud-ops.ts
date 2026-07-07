import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const C = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["cloud"]);

export const WAVE3_CLOUD_OPS_PACK_DEFS = [
  C("cloud/aws-dr-playbook", "AWS Disaster Recovery", "RDS failover, S3 replication, Route53", "Multi-AZ and cross-region DR on AWS.", "RTO/RPO targets documented. Aurora global DB. S3 CRR. Run game days quarterly."),
  C("cloud/gcp-dr-playbook", "GCP Disaster Recovery", "Cloud SQL HA, dual-region GCS, Cloud DNS", "GCP multi-region resilience.", "Regional GKE clusters. Cloud SQL cross-region replicas. Dual-region buckets."),
  C("cloud/azure-dr-playbook", "Azure Disaster Recovery", "Geo-redundant storage, ASR, Traffic Manager", "Azure enterprise DR.", "Availability zones + paired regions. ASR for VM failover. Key Vault geo-replication."),
  C("cloud/heroku", "Heroku", "Legacy PaaS", "Brownfield Rails/Node on Heroku.", "Dynos, add-ons. Migrate plan to Render/Fly for greenfield."),
  C("cloud/flux", "Flux CD", "GitOps for Kubernetes", "Git-native K8s delivery.", "HelmRelease resources. Image automation."),
  C("cloud/kustomize", "Kustomize", "K8s config overlays", "Env-specific manifests without templating.", "bases + overlays per env. Patches strategic merge."),
  C("cloud/caprover", "CapRover", "Self-hosted PaaS", "Docker on VPS PaaS.", "One-click apps. Let's Encrypt. Not for regulated PHI primary."),
  C("cloud/coolify", "Coolify", "Self-hosted Heroku alternative", "OSS PaaS on own servers.", "Docker compose deploy. Backup strategy required."),
  C("cloud/bitbucket-pipelines", "Bitbucket Pipelines", "Atlassian CI/CD", "Teams on Bitbucket Cloud.", "YAML pipelines. OIDC to AWS."),
  C("cloud/buildkite", "Buildkite", "Agent-based CI", "Large monorepos, custom agents.", "Pipeline plugins. Dynamic pipelines."),
  C("cloud/backstage", "Backstage", "Developer portal", "Service catalog, docs, scaffolding.", "Software templates. TechDocs. Plugin ecosystem."),
  C("cloud/multicloud-finops", "Multi-Cloud & FinOps", "Cost governance across clouds", "Avoid surprise egress and sprawl.", "Tagging standards. Reserved capacity. Unit economics per feature."),
  C("cloud/wasm-edge", "WASM on Edge", "WebAssembly at CDN edge", "Ultra-low latency compute.", "Fastly Compute, Cloudflare Workers WASM. Limited runtime APIs."),
  C("devtools/pnpm", "pnpm", "Fast monorepo package manager", "DNA monorepo default.", "workspace: protocol. strict peer deps. catalog in pnpm-workspace."),
  C("devtools/changesets", "Changesets", "Monorepo versioning", "Independent package releases.", "changeset files per PR. Version bump CI."),
  C("devtools/semantic-release", "semantic-release", "Automated semver releases", "Conventional commits → npm publish.", "Plugins per package manager. GitHub releases."),
  C("devtools/github-packages", "GitHub Packages", "Container and npm registry", "Private packages on GitHub.", "GHCR for Docker. GITHUB_TOKEN in Actions."),
  C("testing/gatling", "Gatling", "Load testing (Scala DSL)", "High-scale performance tests.", "Injection profiles. Reports in CI artifacts."),
  C("testing/locust", "Locust", "Python load testing", "Distributed load from Python.", "Headless mode in CI. Threshold on failure ratio."),
  C("testing/pact", "Pact", "Contract testing", "Consumer-driven API contracts.", "Broker for version matrix. Can-i-deploy gate."),
  C("testing/chaos-engineering", "Chaos Engineering", "Resilience testing in prod-like envs", "Validate DR and failover.", "Litmus/Gremlin. Start with non-prod. Blast radius controls."),
  C("testing/owasp-zap", "OWASP ZAP", "Dynamic application security testing", "CI security scans.", "Baseline scan on PR. Authenticated scan in staging."),
  C("testing/percy", "Percy / Chromatic", "Visual regression testing", "UI drift detection.", "Snapshot on PR. Approve in dashboard."),
  C("observability/statuspage", "Statuspage", "Public status communication", "Incident transparency.", "Component mapping. Subscriber notifications."),
  C("observability/better-uptime", "Better Uptime", "Uptime monitoring", "Synthetic checks global.", "Heartbeat monitors. Escalation policies."),
  C("observability/opsgenie", "Opsgenie", "Atlassian on-call", "Alert routing and schedules.", "Integrations with monitoring stack. On-call rotations."),
  C("observability/lightstep", "ServiceNow Lightstep", "Observability (ex-Lightstep)", "Tracing at scale.", "OpenTelemetry native. Change awareness."),
];

export const WAVE3_CLOUD_OPS_PACKS = packsFromDefs(WAVE3_CLOUD_OPS_PACK_DEFS);
