import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const C = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["cloud"]);

export const WAVE4_CLOUD_INFRA_PACK_DEFS = [
  C("cloud/alibaba-cloud", "Alibaba Cloud", "APAC cloud — ECS, OSS, RDS", "China and APAC market entry.", "ICP compliance. RAM policies. Cross-border data rules."),
  C("cloud/tencent-cloud", "Tencent Cloud", "China cloud platform", "WeChat ecosystem, gaming in CN.", "CAM identity. COS object storage. CVM instances."),
  C("cloud/oracle-cloud", "Oracle Cloud Infrastructure", "OCI enterprise cloud", "Oracle DB workloads, enterprise lift-shift.", "Compartments. Vault secrets. FastConnect."),
  C("cloud/ibm-cloud", "IBM Cloud", "Enterprise hybrid cloud", "Mainframe integration, regulated industries.", "Resource groups. Cloud Pak patterns."),
  C("cloud/openshift", "Red Hat OpenShift", "Enterprise Kubernetes", "OpenShift on-prem or ROSA.", "Routes vs Ingress. SCC security. Operators."),
  C("cloud/rancher", "Rancher", "Multi-cluster K8s management", "Fleet of clusters across clouds.", "RKE2 provisioning. Central RBAC."),
  C("cloud/istio", "Istio", "Service mesh", "mTLS, traffic management, observability.", "Sidecar injection. VirtualServices. PeerAuthentication."),
  C("cloud/linkerd", "Linkerd", "Lightweight service mesh", "Simpler mesh than Istio.", "Proxy sidecar. Service profiles. mTLS default."),
  C("cloud/ansible", "Ansible", "Configuration management", "Server provisioning and config.", "Idempotent playbooks. Vault for secrets. Ansible Tower/AWX."),
  C("cloud/chef", "Chef", "Infrastructure automation", "Legacy enterprise config mgmt.", "Cookbooks. InSpec compliance. Prefer Ansible greenfield."),
  C("cloud/puppet", "Puppet", "Declarative config management", "Large fleet consistency.", "PuppetDB. Hiera data. Brownfield maintenance."),
  C("cloud/podman", "Podman", "Daemonless containers", "Rootless containers alternative to Docker.", "Podman compose. systemd units. CI without daemon."),
  C("cloud/buildkit", "BuildKit", "Advanced container builds", "Faster multi-stage image builds.", "Cache mounts. SSH agent forwarding. bake files."),
  C("cloud/aws-sam", "AWS SAM", "Serverless Application Model", "Lambda + API Gateway IaC.", "sam build/deploy. Local invoke. Nested stacks."),
  C("cloud/architect", "Architect (AWS)", "Serverless framework for AWS", "Node.js serverless patterns.", "Sandbox plugins. deploy.json per stage."),
  C("cloud/aws-api-gateway", "AWS API Gateway", "Managed API front door", "REST and HTTP APIs on AWS.", "Usage plans. WAF association. VPC links."),
  C("cloud/aws-secrets-manager", "AWS Secrets Manager", "Managed secrets rotation", "DB credential rotation.", "Lambda rotators. Cross-account access."),
  C("cloud/aws-kms", "AWS KMS", "Encryption key management", "Envelope encryption at rest.", "CMK policies. Key aliases per env."),
  C("cloud/aws-waf", "AWS WAF", "Web application firewall", "OWASP rule sets on ALB/CloudFront.", "Managed rule groups. Rate-based rules."),
  C("cloud/aws-eventbridge", "AWS EventBridge", "Event bus and scheduling", "Event-driven architectures.", "Schema registry. Pipes to targets. Scheduler cron."),
  C("cloud/aws-step-functions", "AWS Step Functions", "Workflow orchestration", "Visual state machines.", "Express vs Standard. Error handling Catch."),
  C("cloud/azure-container-apps", "Azure Container Apps", "Serverless containers on Azure", "Scale-to-zero on Azure.", "Dapr sidecar optional. Revision management."),
  C("cloud/azure-key-vault", "Azure Key Vault", "Secrets and keys on Azure", "Central secret store Azure.", "Managed identities. Soft delete + purge protection."),
  C("cloud/gcp-pubsub", "Google Cloud Pub/Sub", "Managed messaging", "Async decoupling on GCP.", "Ordering keys. Dead letter topics. Push subscriptions."),
  C("cloud/hashicorp-consul", "HashiCorp Consul", "Service discovery and mesh", "Multi-datacenter service catalog.", "Connect sidecars. Intentions policies."),
  C("cloud/nomad", "HashiCorp Nomad", "Workload orchestrator", "Simpler than K8s for mixed workloads.", "Job specs. Vault integration."),
  C("cloud/fastly", "Fastly", "Edge cloud and CDN", "Programmable edge, instant purge.", "VCL or Compute@Edge. Origin shielding."),
  C("cloud/fastly-compute", "Fastly Compute@Edge", "WASM edge compute", "Custom logic at CDN edge.", "Rust/JS WASM. KV stores at edge."),
  C("cloud/bare-metal-colo", "Bare Metal & Colocation", "Dedicated hardware patterns", "Low-latency, compliance isolation.", "IPMI out-of-band. Network cross-connects. DR site pairing."),
];

export const WAVE4_CLOUD_INFRA_PACKS = packsFromDefs(WAVE4_CLOUD_INFRA_PACK_DEFS);
