import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const C = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["cloud"]);

export const CLOUD_PACK_DEFS = [
  C("cloud/aws-overview", "AWS Overview", "Amazon Web Services platform patterns", "Default enterprise cloud. Multi-account landing zone.", "Organizations, SCPs, IAM Identity Center. Tagging strategy. Data HQ per region."),
  C("cloud/aws-ecs", "AWS ECS", "Container orchestration on AWS", "Docker without Kubernetes complexity.", "Fargate vs EC2. Task defs. ALB target groups."),
  C("cloud/aws-eks", "AWS EKS", "Managed Kubernetes on AWS", "K8s standard at scale.", "IRSA for pod IAM. Cluster autoscaler. GuardDuty."),
  C("cloud/aws-lambda", "AWS Lambda", "Serverless functions", "Event-driven, API via Function URLs/API Gateway.", "Cold starts, memory tuning. DLQ. X-Ray tracing."),
  C("cloud/aws-rds", "AWS RDS / Aurora", "Managed relational databases", "Postgres/MySQL in AWS.", "Aurora global DB for DR. Multi-AZ. Parameter groups."),
  C("cloud/aws-s3", "AWS S3", "Object storage", "Assets, backups, data lake.", "Versioning, lifecycle, SSE-KMS. Block public access."),
  C("cloud/aws-cloudfront", "AWS CloudFront", "CDN and edge", "Static assets, API caching.", "Signed URLs. WAF association."),
  C("cloud/aws-cognito", "AWS Cognito", "User pools and identity", "AWS-native auth.", "User pools + hosted UI. JWT validation in API."),
  C("cloud/aws-ses", "AWS SES", "Transactional email", "High volume email on AWS.", "Domain verification, DKIM, bounce handling."),
  C("cloud/gcp-overview", "Google Cloud Platform", "GCP platform patterns", "BigQuery/ML strength, Firebase synergy.", "Projects, folders, org policies. Workload Identity."),
  C("cloud/gcp-cloud-run", "Cloud Run", "Serverless containers", "Scale-to-zero HTTP services.", "Concurrency settings. VPC connector for private DB."),
  C("cloud/gcp-gke", "GKE", "Google Kubernetes Engine", "Managed K8s.", "Autopilot vs Standard. Binary Authorization."),
  C("cloud/gcp-bigquery", "GCP BigQuery", "Analytics warehouse", "Serverless SQL analytics.", "Slots, reservations, row-level security."),
  C("cloud/gcp-firebase", "Firebase Platform", "Mobile/web BaaS on GCP", "Startups, mobile backends.", "Security rules. App Check. Blaze plan production."),
  C("cloud/cloudflare-overview", "Cloudflare", "Edge platform — CDN, Workers, Zero Trust", "Global edge first architecture.", "DNS, proxy orange-cloud, WAF rules."),
  C("cloud/cloudflare-workers", "Cloudflare Workers", "Edge serverless", "Low-latency APIs worldwide.", "Durable Objects for state. KV for config."),
  C("cloud/cloudflare-r2", "Cloudflare R2", "S3-compatible object storage", "Egress-free object storage.", "Public buckets + Workers access."),
  C("cloud/cloudflare-d1", "Cloudflare D1", "Edge SQLite", "Lightweight edge SQL.", "Not replacement for primary OLTP."),
  C("cloud/fly-io", "Fly.io", "Global app platform", "Run containers close to users.", "Machines, volumes, WireGuard private network."),
  C("cloud/railway", "Railway", "Developer PaaS", "Quick deploy Node/Postgres.", "Projects per env. Private networking."),
  C("cloud/render", "Render", "Managed PaaS", "Web services, cron, Postgres.", "Blueprint.yaml infra as code."),
  C("cloud/digitalocean", "DigitalOcean", "SMB cloud", "Droplets, DOKS, managed DB.", "Spaces for S3-like storage."),
  C("cloud/terraform", "Terraform / OpenTofu", "Infrastructure as code", "Declarative cloud resources.", "Remote state locking. Module versioning."),
  C("cloud/pulumi", "Pulumi", "IaC with real languages", "TypeScript/Python infra.", "Stack per env. Secret encryption."),
  C("cloud/kubernetes", "Kubernetes", "Container orchestration", "Portable K8s patterns.", "Namespaces, HPA, PDB, network policies."),
  C("cloud/docker", "Docker", "Container packaging", "Local dev and CI images.", "Multi-stage builds. Non-root USER."),
  C("cloud/helm", "Helm", "Kubernetes package manager", "Chart-based deploys.", "Values per env. Chart museum or OCI."),
  C("cloud/argocd", "Argo CD", "GitOps continuous delivery", "K8s sync from git.", "App of apps. Rollback via git revert."),
  C("cloud/github-actions", "GitHub Actions", "CI/CD on GitHub", "DNA default CI.", "OIDC to cloud — no long-lived keys. Reusable workflows."),
  C("cloud/gitlab-ci", "GitLab CI", "Integrated DevOps platform", "Self-hosted or SaaS pipelines.", ".gitlab-ci.yml. Runners autoscale."),
  C("cloud/circleci", "CircleCI", "CI platform", "Docker-first pipelines.", "Contexts for secrets. Orbs."),
  C("cloud/sst", "SST", "Serverless IaC for AWS", "TypeScript infra for Lambda/Next.", "Live dev. Ion version migration."),
  C("cloud/serverless-framework", "Serverless Framework", "Multi-cloud serverless deploy", "Lambda + API Gateway YAML.", "Plugin ecosystem."),
  C("cloud/azure-overview", "Microsoft Azure", "Azure platform (extend DNA stack pack)", "Enterprise Microsoft shops.", "Entra ID, Key Vault, Container Apps — see cloud/azure.dna.md in dna-stack."),
];

export const CLOUD_PACKS = packsFromDefs(CLOUD_PACK_DEFS);
