# Security Policy

DNA by Humaan is an open-source project intelligence platform: CLI tooling, a runtime observer, GitHub automation, a knowledge-pack marketplace, and AI-assisted repair for TypeScript teams. We take security seriously and welcome responsible disclosure from researchers, customers, and the community.

This policy covers the **DNA monorepo** ([superhumaan/DNA](https://github.com/superhumaan/DNA)), published npm packages, and closely related first-party surfaces. It does **not** replace your own organisation's security programme for projects scaffolded or managed by DNA.

---

## Table of contents

- [Supported versions](#supported-versions)
- [Scope and architecture](#scope-and-architecture)
- [Reporting a vulnerability](#reporting-a-vulnerability)
- [In scope](#in-scope)
- [Out of scope](#out-of-scope)
- [Research guidelines](#research-guidelines)
- [Severity and response timelines](#severity-and-response-timelines)
- [Disclosure and safe harbour](#disclosure-and-safe-harbour)
- [Recognition](#recognition)
- [How we secure DNA](#how-we-secure-dna)
- [Supply chain and package integrity](#supply-chain-and-package-integrity)
- [Credential and secret handling](#credential-and-secret-handling)
- [Data handling and privacy](#data-handling-and-privacy)
- [Security guidance for DNA users](#security-guidance-for-dna-users)
- [Security updates](#security-updates)
- [Related repositories](#related-repositories)
- [Questions](#questions)

---

## Supported versions

Security fixes are applied to the **latest release** on npm. Development builds on `main` may receive fixes before the next tagged release; we recommend staying on published releases for production use.

| Package | Registry | Supported |
| ------- | -------- | --------- |
| `@superhumaan/dna-by-humaan` (CLI + runtime) | [npm](https://www.npmjs.com/package/@superhumaan/dna-by-humaan) | `0.4.x` (latest) |
| `@superhumaan/dna-core` | npm | Same release train as CLI |
| `@superhumaan/dna-github` | npm | Same release train as CLI |
| `@superhumaan/dna-runtime` | npm | Same release train as CLI |
| `@superhumaan/dna-immune` | npm | Same release train as CLI |
| `@superhumaan/dna-ai` | npm | Same release train as CLI |
| `@superhumaan/dna-config` | npm | Same release train as CLI |
| `@superhumaan/dna-templates` | npm | Same release train as CLI |
| `@superhumaan/dna-docs` | npm | Same release train as CLI |
| Any version `< 0.1.0` | — | **No** |

Check your installed version:

```bash
dna --version
# or
npm ls @superhumaan/dna-by-humaan
```

---

## Scope and architecture

DNA spans local developer tooling, optional cloud-adjacent services, and generated project artifacts. The table below maps components to their security relevance.

| Component | Location | Security-sensitive behaviour |
| --------- | -------- | ---------------------------- |
| **CLI** | `packages/dna-cli` | Scaffolds projects, runs doctor/validate, orchestrates marketplace installs, compliance generation, IVF analysis |
| **Core** | `packages/dna-core` | Generators (CI, Docker, git hooks, feature factory), marketplace catalog, quality analysis, onboarding |
| **Config** | `packages/dna-config` | Zod schemas and constants governing project configuration |
| **Runtime observer** | `packages/dna-runtime` | Captures errors and HTTP events in consumer apps; persists to `.DNA/runtime/` |
| **Immune system** | `packages/dna-immune` | Classifies runtime issues; may trigger GitHub issues or AI repair |
| **GitHub integration** | `packages/dna-github` | OAuth device flow, token storage, push automation, issue/PR workflows |
| **AI repair** | `packages/dna-ai` | Orchestrates automated repair workflows using project context |
| **Marketplace** | Bundled + [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace) | 768+ knowledge packs installed into `.DNA/knowledge/` |
| **Web UI** | [superhumaan/DNA-Web](https://github.com/superhumaan/DNA-Web) | Landing page, marketplace UI, hosted catalog API |
| **Generated artifacts** | Consumer repos | CI workflows, Dockerfiles, git hooks, behaviour rules, compliance templates |

DNA maintains two worlds in managed projects:

- **`.DNA/`** — machine-readable intelligence (behaviour, memory, runtime events, plans)
- **`DNA/Impressions/`** — human-facing documentation (product, architecture, security, compliance)

---

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.** Public disclosure before we have had a chance to investigate puts users at risk.

### Preferred channels

1. **GitHub private vulnerability reporting (preferred)**  
   [Report a vulnerability](https://github.com/superhumaan/DNA/security/advisories/new) on this repository's Security tab.

2. **Email**  
   Send details to [security@humaan.com](mailto:security@humaan.com) with the subject line `DNA Security Report`.

For issues specific to the hosted web application or marketplace API, you may also report via the same channels and note **DNA-Web** in the subject or body. We coordinate across repositories when needed.

### What to include

The more detail you provide, the faster we can triage and reproduce.

| Field | Examples |
| ----- | -------- |
| **Summary** | One-paragraph description of the vulnerability |
| **Impact** | What an attacker could achieve (RCE, token theft, data exposure, etc.) |
| **Affected component** | CLI, runtime, GitHub auth, marketplace, generator, DNA-Web, etc. |
| **Steps to reproduce** | Commands, config files, minimal project setup |
| **Proof of concept** | Code, screenshots, or logs (redact third-party secrets) |
| **DNA version** | Output of `dna --version` or `npm ls @superhumaan/dna-by-humaan` |
| **Node.js version** | Output of `node --version` |
| **Operating system** | e.g. macOS 15, Ubuntu 24.04, Windows 11 |
| **Suggested fix** | Optional — we welcome it but do not require it |
| **Credit preference** | Name/handle for advisory credit, or request anonymity |

### Report template

```text
Subject: DNA Security Report — [short title]

Summary:
[What is the vulnerability?]

Component:
[e.g. dna-github OAuth flow / runtime redaction / marketplace install]

Impact:
[What can an attacker do?]

Steps to reproduce:
1.
2.
3.

Environment:
- DNA version:
- Node.js version:
- OS:

Proof of concept:
[Attach or describe]

Credit:
[Your name/handle, or "anonymous"]
```

### What happens after you report

1. **Acknowledgement** — we confirm receipt.
2. **Triage** — we reproduce, assess severity, and identify affected versions.
3. **Remediation** — we develop and test a fix on a private branch.
4. **Release** — we publish a patched npm release and GitHub Security Advisory.
5. **Disclosure** — coordinated public disclosure after users can update (see [Disclosure and safe harbour](#disclosure-and-safe-harbour)).

We will keep you informed of progress. If you prefer to remain anonymous, say so in your report.

---

## In scope

The following classes of vulnerability are **in scope** when they affect DNA tooling, published packages, first-party services, or unsafe DNA defaults in generated artifacts.

### Critical impact

- Remote code execution (RCE) in the CLI, runtime, or install/generation pipeline
- Arbitrary command execution via malicious marketplace packs, templates, or IVF output without explicit user action
- Sandbox escape or privilege escalation beyond the invoking user's OS permissions
- Authentication bypass in DNA-managed GitHub or web flows

### Credential and secret exposure

- Leakage of `GITHUB_TOKEN`, OAuth tokens, or credentials stored in `~/.config/dna/`
- Writing secrets to `.DNA/runtime/` events, logs, GitHub issues, or AI repair payloads without redaction
- Insecure transmission of tokens (e.g. logged in CI output, embedded in generated workflow files by default)
- Token scope escalation beyond declared `repo`, `workflow`, `read:org` usage

### GitHub integration

- Flaws in OAuth device flow, token refresh, or credential file permissions (expected: directory `0700`, file `0600`)
- Unsafe git push URL construction exposing tokens in remotes, logs, or error messages
- Unauthorised repository access, issue creation, or workflow modification

### Runtime observer

- Failure to redact sensitive patterns (Bearer tokens, API keys, passwords, cookies) before persistence
- Path traversal or arbitrary file write via `.DNA/runtime/` or runtime DB storage
- Exfiltration of stack traces or request bodies containing PII beyond what the user configured

### Marketplace and supply chain

- Integrity failures in bundled or remote catalog metadata (tampered pack contents, signature bypass)
- Install path traversal allowing writes outside `.DNA/knowledge/`
- Malicious default content in bundled STEM, compliance, or platform packs distributed by Humaan

### Generators and scaffolding

- Unsafe defaults in generated CI/CD, Docker, git hooks, or feature-factory templates that expose secrets or disable security controls without opt-in
- `dna init`, `dna ivf`, or `dna plan` output that embeds credentials, private keys, or hardcoded tokens
- Doctor/validate false negatives that silently approve known-dangerous configurations

### AI-assisted features

- Prompt injection leading to execution of attacker-controlled shell commands via DNA repair workflows
- Unauthorised disclosure of repository contents, `.DNA/` memory, or private GitHub data to external AI providers beyond documented behaviour

### Web and API (DNA-Web)

- Vulnerabilities in [dna.humaan.app](https://dna.humaan.app) or the marketplace API hosted from [superhumaan/DNA-Web](https://github.com/superhumaan/DNA-Web)  
  Report via the same channels; we route to the appropriate maintainers.

---

## Out of scope

The following are generally **out of scope** unless they demonstrate a flaw in DNA itself (not merely in a consumer project or upstream dependency):

| Category | Notes |
| -------- | ----- |
| **Third-party dependencies** | Issues already tracked by public advisories (npm, GitHub Advisory Database). Report upstream; we will still update when fixes are available. |
| **Consumer project code** | Application logic in repos scaffolded by DNA, unless caused by unsafe DNA defaults or generated templates. |
| **Misconfiguration by users** | Committing `.env` files, disabling security features, or granting excessive GitHub token scopes. |
| **Social engineering** | Phishing, impersonation, or physical attacks against Humaan staff or users. |
| **Denial of service** | DoS against Humaan infrastructure, npm registry, or GitHub APIs without demonstrated impact on DNA package integrity. |
| **Theoretical hardening** | Missing headers, CSP, or defence-in-depth with no demonstrated exploit path against DNA tooling. |
| **Rate limiting** | On marketplace or web APIs, unless bypass leads to another in-scope impact. |
| **AI model behaviour** | Hallucinations, incorrect compliance advice, or bad code suggestions from external LLMs — unless DNA tooling executes them unsafely. |
| **End-user compliance** | Whether a generated GDPR/HIPAA/ISO template satisfies your legal obligations — DNA provides coordination tooling, not legal advice. |

If you are unsure whether something is in scope, report it anyway. We would rather receive a borderline report than miss a real issue.

---

## Research guidelines

We support good-faith security research. Please follow these rules:

### Do

- Test against your own installations, forks, or local environments.
- Use minimal proof-of-concept code to demonstrate impact.
- Allow reasonable time for remediation before public disclosure.
- Redact third-party secrets, PII, and customer data from reports.
- Stop testing when you have confirmed the vulnerability.

### Do not

- Access, modify, or delete data belonging to other users or Humaan production systems without authorisation.
- Perform destructive testing (data wipe, service disruption, resource exhaustion) against shared infrastructure.
- Spam reports, use automated scanners without manual validation, or submit duplicate reports for known issues.
- Exploit a vulnerability beyond what is necessary to demonstrate it.
- Publicly disclose before we have published a fix or agreed on a disclosure date.

---

## Severity and response timelines

We assess severity using [CVSS v3.1](https://www.first.org/cvss/) where applicable, combined with exploitability and blast radius in the DNA ecosystem.

| Severity | CVSS (guide) | Examples | Target response |
| -------- | ------------ | -------- | --------------- |
| **Critical** | 9.0–10.0 | RCE, credential theft at scale, supply-chain compromise | Acknowledge ≤ 1 business day; fix or mitigation ≤ 7 calendar days |
| **High** | 7.0–8.9 | Significant auth bypass, secret leakage in defaults, path traversal with write | Acknowledge ≤ 3 business days; fix ≤ 30 calendar days |
| **Medium** | 4.0–6.9 | Limited information disclosure, incomplete redaction, defence bypass requiring unusual config | Acknowledge ≤ 3 business days; fix ≤ 90 calendar days |
| **Low** | 0.1–3.9 | Minor information leak, low-impact hardening gap with exploit path | Acknowledge ≤ 5 business days; fix in next planned release |

Timelines are targets, not guarantees. Critical issues are prioritised above all other work. We will communicate delays and provide interim mitigations when a full fix takes longer.

---

## Disclosure and safe harbour

### Coordinated disclosure

We ask reporters to:

1. Report privately through the channels above.
2. Allow us **90 days** from acknowledgement to release a fix (we may agree on a shorter or longer window depending on severity and complexity).
3. Avoid public disclosure, blog posts, or social media posts until a fix is available — unless we agree otherwise or disclosure is required by law.

When a fix is ready, we publish a [GitHub Security Advisory](https://github.com/superhumaan/DNA/security/advisories) with credit to the reporter (unless you request anonymity) and update [CHANGELOG.md](./CHANGELOG.md).

### Safe harbour

We support responsible disclosure. We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service disruption.
- Give us reasonable time to investigate and remediate before public disclosure.
- Do not exploit the issue beyond what is needed to demonstrate it.
- Comply with the [Research guidelines](#research-guidelines) above.

This safe harbour applies to research conducted in accordance with this policy. It does not authorise access to systems or data you do not own or have permission to test.

---

## Recognition

We are grateful to security researchers who help keep DNA safe. With your permission, we will:

- Credit you in the GitHub Security Advisory.
- Mention your handle in the CHANGELOG security section for significant findings.

We do not currently operate a paid bug bounty programme. If that changes, we will update this policy.

---

## How we secure DNA

We follow security practices appropriate for open-source developer tooling and Humaan's broader secure SDLC.

| Practice | Implementation |
| -------- | -------------- |
| **Dependency management** | npm lockfiles, automated advisory monitoring, timely dependency updates |
| **CI/CD** | GitHub Actions on every push: DNA CI (advisory quality gates) and DNA Preview (after CI passes) — `.github/workflows/dna-ci.yml` |
| **Publish pipeline** | Controlled npm publish workflow (`.github/workflows/publish-npm.yml`) |
| **Static analysis** | ESLint, TypeScript strict mode, quality patterns in feature factory |
| **Secret scanning** | Behaviour rules and validators flag hardcoded secrets; generated projects include `no_secrets_in_code` checks |
| **Least privilege** | GitHub OAuth scopes limited to `repo`, `workflow`, `read:org` |
| **Credential storage** | Local credentials written with restrictive filesystem permissions |
| **Runtime redaction** | Sensitive patterns redacted before persistence in runtime events |
| **Supply chain** | Packages published under the `@superhumaan` npm scope from this repository |

---

## Supply chain and package integrity

### Verify what you install

Always install DNA from official sources:

```bash
npm install @superhumaan/dna-by-humaan
# or
pnpm add @superhumaan/dna-by-humaan
```

Confirm the package scope and publisher on [npmjs.com](https://www.npmjs.com/package/@superhumaan/dna-by-humaan). The canonical source repository is [github.com/superhumaan/DNA](https://github.com/superhumaan/DNA).

### Marketplace packs

Knowledge packs install into `.DNA/knowledge/` from:

1. The hosted catalog at [dna.humaan.app/marketplace](https://dna.humaan.app/marketplace)
2. A bundled offline catalog in `@superhumaan/dna-by-humaan` when remote is unavailable

Review pack contents after install, especially in regulated environments. Report supply-chain or integrity issues through the reporting channels above.

### Reporting supply-chain concerns

In scope: tampered npm tarballs, compromised publish credentials, malicious bundled catalog entries, or MITM attacks against the marketplace API that alter pack content.

### Supply-chain transparency (Socket.dev / security scanners)

`@superhumaan/dna-by-humaan` is a **developer CLI and runtime observer**, not a passive config library. Security scanners (including [Socket.dev](https://socket.dev/npm/package/@superhumaan/dna-by-humaan)) may flag the following behaviours — all are **documented and intentional**:

| Scanner alert | Why it exists | When it runs |
| ------------- | ------------- | -------------- |
| **Network access** | Marketplace catalog, intelligence stems, GitHub OAuth, optional AI repair | `dna marketplace *`, `dna github login`, `dna ai repair` (with API keys) |
| **Shell access** | GitHub CLI integration, Docker builds, quality gates | `dna github login`, `dna docker build`, `dna quality report` |
| **Filesystem access** | Scaffolds `.DNA/`, writes runtime events, installs knowledge packs | `dna init`, `dna doctor`, runtime observer |
| **Environment variables** | Reads `GITHUB_TOKEN`, `DNA_*` overrides, AI provider keys | GitHub auth, marketplace URL overrides, AI repair |

**Not shipped:** install scripts (`preinstall` / `postinstall`), telemetry packages, recursive self-dependencies, or third-party **production** npm dependencies on `@superhumaan/dna-by-humaan` (v0.4.5+). The published tarball bundles internal implementations for CLI parsing, config validation, file globbing, git, GitHub REST, logging, and file watching. Optional **peer** dependencies (`express`, `fastify`, `@nestjs/common`) are declared for runtime middleware adapters only — your app already installs the framework you use.

#### Network endpoints (first-party)

| Endpoint | Command(s) | Data sent |
| -------- | ---------- | --------- |
| `https://dna.humaan.app/marketplace/api/v1/catalog` | `dna marketplace list/search/install` | Channel preference only |
| `https://dna.humaan.app/intelligence/api/v1/catalog` | `dna update`, `dna doctor` (stem sync) | None (GET) |
| `https://dna.humaan.app/api/v1/feedback` | `dna feedback report`, runtime auto-report, `dna feedback sync` | Sanitized DNA-platform error metadata only (no secrets, no file contents) — **opt-in, `dna-only` default** |
| `https://api.github.com/user` | `dna github login` | OAuth bearer token |
| `https://github.com/login/device/code` | `dna github login` | OAuth client id + scopes |
| `https://github.com/login/oauth/access_token` | `dna github login` | Device code (polling) |
| `https://api.openai.com/v1/chat/completions` | `dna ai repair` | Issue context (redacted) — **only when configured** |
| `https://api.anthropic.com/v1/messages` | `dna ai repair` | Issue context (redacted) — **only when configured** |

Offline fallbacks: bundled `assets/marketplace-catalog.json` and `assets/intelligence-catalog.json` when remote catalogs are unreachable.

Published releases use [npm provenance](https://docs.npmjs.com/generating-provenance-statements) from GitHub Actions. Verify integrity:

```bash
npm view @superhumaan/dna-by-humaan --json | jq '.dist.integrity'
```

Report unexpected network destinations or install-time behaviour through the [reporting channels](#reporting-a-vulnerability) above.

#### Third-party framework alerts (e.g. Next.js)

Socket may flag **optional framework peer dependencies** (`express`, `fastify`, `@nestjs/common`) when reviewing DNA's package metadata. These peers apply only when you wire runtime middleware; DNA does not install them automatically.

A common example is **obfuscated code in `next`** — Vercel ships pre-compiled, minified React Server Components bundles. Static analyzers classify this as obfuscated; it is normal production build output, not a DNA supply-chain compromise.

DNA's Next.js runtime adapter uses duck-typed request interfaces and does **not** import `next` at install time. Next.js projects already declare `next` in their own `package.json`; DNA generates middleware snippets that run in the consumer app.

---

## Credential and secret handling

DNA interacts with credentials in several places. Researchers and users should understand the expected behaviour.

| Location | Purpose | Expected protections |
| -------- | ------- | -------------------- |
| `GITHUB_TOKEN` / `GH_TOKEN` env vars | CI and local GitHub API access | Never logged by DNA; user-managed rotation |
| `DNA_FEEDBACK_TOKEN` env var | Maintainer ingest to `superhumaan/DNA` issues | Never in config files; maintainer-only |
| `~/.config/dna/github-credentials.json` | Persisted OAuth / device-flow token | Directory `0700`, file `0600` |
| `~/.config/dna/install-id` | Anonymous upstream feedback fingerprint | UUID only — no email or hostname |
| `.DNA/config.dna.json` | Project configuration | Must not contain secrets; use env vars |
| `.DNA/runtime/events.jsonl` | Runtime event log | Sensitive patterns redacted before write |
| Generated `.github/workflows/` | CI/CD | Secrets referenced via `${{ secrets.* }}`, not inline values |

If you discover credentials written to an unexpected location, or redaction bypassed, that is **in scope**.

---

## Data handling and privacy

### Local-first by default

DNA is designed to run primarily on developer machines and in consumer project repos. Runtime events, cellular memory, and knowledge packs stay in `.DNA/` unless you explicitly enable integrations (e.g. GitHub issue creation, AI repair).

### Runtime redaction

The runtime observer applies pattern-based redaction before persisting messages and stack traces:

- Bearer tokens
- API keys
- Passwords
- Generic `token=` / `authorization=` / `cookie=` values

Redaction is not a guarantee against all PII or custom secret formats. Report gaps where sensitive data persists in `.DNA/runtime/` or exported GitHub issues.

### Compliance templates

DNA ships scrubbed GDPR and compliance document templates with `[Company Name]` / `[Product Name]` placeholders. These are **templates for your organisation** — not Humaan processing your data. See [compliance tiers](docs/product/compliance-tiers.md) for how DNA coordinates compliance implementation.

### AI repair and external providers

When AI repair is enabled, project context may be sent to configured AI providers. Understand your provider's data handling before enabling this in production or with sensitive codebases.

---

## Security guidance for DNA users

These steps reduce risk in projects managed by DNA:

```bash
# Verify installation health
dna doctor
dna validate

# Check for quality/security patterns
dna quality report

# Keep DNA updated
npm update @superhumaan/dna-by-humaan
# or
dna update
```

**Recommendations:**

- Pin DNA to semver ranges and review CHANGELOG before major upgrades.
- Never commit `.env`, `github-credentials.json`, or tokens in `.DNA/`.
- Use fine-grained GitHub tokens or OIDC in CI instead of long-lived PATs where possible.
- Review generated CI, Docker, and git-hook files before merging — especially in regulated environments.
- Keep `github.enabled` and `aiRepair.enabled` off in runtime until you understand data flows.
- Run `dna marketplace install` only for packs you trust; audit `.DNA/knowledge/` in sensitive repos.
- Add `dna doctor` and `dna validate` to your CI pipeline (see [CI/CD docs](docs/engineering/ci-cd.md)).

---

## Security updates

When we fix a vulnerability:

1. A [GitHub Security Advisory](https://github.com/superhumaan/DNA/security/advisories) is published with severity, affected versions, and remediation steps.
2. A patched release is published to npm under `@superhumaan/dna-by-humaan` (and sibling packages as needed).
3. The fix is noted in [CHANGELOG.md](./CHANGELOG.md).

**Subscribe to advisories:** watch this repository's Security Advisories or enable GitHub security alerts for your projects that depend on DNA.

**After an advisory:** upgrade to the latest npm release and re-run `dna doctor` in affected projects.

---

## Related repositories

| Repository | Relationship |
| ---------- | ------------ |
| [superhumaan/DNA](https://github.com/superhumaan/DNA) | Core monorepo — this policy |
| [superhumaan/DNA-Web](https://github.com/superhumaan/DNA-Web) | Web UI and marketplace API — report via same channels |
| Consumer projects | Your responsibility — DNA provides tooling, not ongoing security operations |

---

## Questions

| Topic | Channel |
| ----- | ------- |
| **Security vulnerabilities** | [Private advisory](https://github.com/superhumaan/DNA/security/advisories/new) or [security@humaan.com](mailto:security@humaan.com) |
| **General bugs and features** | [GitHub Issues](https://github.com/superhumaan/DNA/issues) |
| **Product enquiries** | [dna.humaan.app](https://dna.humaan.app) |
| **Documentation** | [docs/](docs/) in this repository |

---

*Last updated: July 2026*
