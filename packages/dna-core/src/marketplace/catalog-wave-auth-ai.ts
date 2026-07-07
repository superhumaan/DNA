import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const A = (id: string, name: string, desc: string, when: string, how: string) =>
  def(id, name, desc, when, how, ["auth"]);

export const AUTH_PACK_DEFS = [
  A("auth/clerk", "Clerk", "Modern auth for Next.js/React", "Default DNA auth for Next SaaS.", "Middleware protection. Organizations for B2B. Webhooks for user sync."),
  A("auth/auth0", "Auth0", "Enterprise identity (Okta)", "Complex SSO, rules, actions.", "Universal login. Action scripts for claims. Rate limit APIs."),
  A("auth/okta", "Okta", "Enterprise IdP", "Workforce identity, SSO hub.", "SAML/OIDC apps. SCIM provisioning."),
  A("auth/keycloak", "Keycloak", "Self-hosted IdP", "On-prem/regulated SSO.", "Realms per tenant. Theme customization."),
  A("auth/workos", "WorkOS", "Enterprise SSO for startups", "SAML/SCIM without building yourself.", "Admin portal embed. Directory sync."),
  A("auth/stytch", "Stytch", "Passwordless and MFA API", "Magic links, OTP, passkeys.", "Session tokens. B2B SSO add-on."),
  A("auth/supabase-auth", "Supabase Auth", "Postgres-backed auth", "Supabase stack projects.", "RLS ties auth to data. JWT secret rotation."),
  A("auth/firebase-auth", "Firebase Authentication", "Google mobile/web auth", "Firebase apps.", "Security rules + App Check."),
  A("auth/webauthn-passkeys", "WebAuthn & Passkeys", "Phishing-resistant authentication", "Consumer and enterprise passwordless.", "Credential storage. Recovery flows mandatory."),
  A("auth/saml-oidc", "SAML & OIDC Enterprise", "Enterprise federation patterns", "B2B SSO integrations.", "Metadata exchange. Clock skew tolerance. Attribute mapping."),
  A("auth/scim", "SCIM Provisioning", "Automated user lifecycle", "Enterprise directory sync.", "IdP → app user create/update/deactivate. Idempotent."),
  A("auth/hashicorp-vault", "HashiCorp Vault", "Secrets management", "Dynamic secrets, encryption.", "Policies per service. Auto-unseal cloud KMS."),
  A("auth/doppler", "Doppler", "Secrets manager SaaS", "Team secret sync to deploy.", "Service tokens per env. CLI in CI."),
  A("auth/1password-secrets", "1Password Secrets Automation", "Enterprise secrets", "Ops teams on 1Password.", "Connect server for K8s."),
];

export const AUTH_PACKS = packsFromDefs(AUTH_PACK_DEFS);

const I = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["ai"]);

export const AI_PACK_DEFS = [
  I("ai/openai", "OpenAI API", "GPT-4o, embeddings, assistants", "General LLM default.", "Server-side only. Structured outputs. Retry with backoff."),
  I("ai/anthropic", "Anthropic Claude", "Claude models API", "Long context, safety-focused.", "Messages API. Tool use. Prompt caching."),
  I("ai/google-gemini", "Google Gemini", "Gemini via AI Studio / Vertex", "Google ecosystem, multimodal.", "Vertex for enterprise. Safety settings."),
  I("ai/azure-openai", "Azure OpenAI", "OpenAI on Azure", "Enterprise HIPAA/BAA path.", "Private endpoints. Content filtering. Regional deployment."),
  I("ai/aws-bedrock", "AWS Bedrock", "Multi-model AWS gateway", "Claude, Llama on AWS.", "IAM auth. Guardrails. Model access policies."),
  I("ai/vercel-ai-sdk", "Vercel AI SDK", "Streaming UI for LLMs", "Next.js chat and tools.", "streamText, generateObject with Zod. Provider abstraction."),
  I("ai/langchain", "LangChain", "LLM application framework", "Chains, agents, loaders.", "LCEL pipelines. LangSmith tracing optional."),
  I("ai/langgraph", "LangGraph", "Stateful agent workflows", "Multi-step agents with checkpoints.", "Human-in-the-loop nodes. Persistence layer."),
  I("ai/llamaindex", "LlamaIndex", "RAG data framework", "Document ingestion and retrieval.", "Index types per data. Query engines."),
  I("ai/huggingface", "Hugging Face", "Models hub and inference", "Open models, embeddings, spaces.", "Inference endpoints. Model cards for license."),
  I("ai/ollama", "Ollama", "Local LLM runtime", "Dev offline, air-gapped.", "Pull models locally. Not production scale."),
  I("ai/rag-patterns", "RAG Patterns", "Retrieval-augmented generation", "Knowledge bases for AI apps.", "Chunking, hybrid search, rerankers, eval sets."),
  I("ai/ai-evals", "AI Evaluations", "Quality measurement for LLM apps", "Prevent regressions.", "Golden datasets. LLM-as-judge cautiously. Braintrust/LangSmith."),
  I("ai/crewai", "CrewAI", "Multi-agent orchestration", "Role-based agent teams.", "Task delegation. Limit autonomy in prod."),
  I("ai/replicate", "Replicate", "Hosted model API", "Image/audio models without GPU ops.", "Version pins. Webhook on completion."),
  I("ai/modal", "Modal", "GPU serverless", "Custom model hosting.", "Python functions on GPU. Cold start tuning."),
  I("ai/elevenlabs", "ElevenLabs", "Voice synthesis API", "TTS for apps.", "Voice cloning legal review. Stream audio."),
  I("ai/deepgram", "Deepgram", "Speech-to-text API", "Transcription at scale.", "Nova models. Diarization. HIPAA tier."),
  I("ai/whisper-api", "Whisper / STT APIs", "Speech recognition patterns", "Meeting notes, clinical ambient (regulated).", "Segment timestamps. PHI BAA if clinical."),
  I("ai/braintrust", "Braintrust", "AI eval and logging platform", "Experiment tracking.", "Log prompts/responses redacted. Score functions."),
  I("ai/langsmith", "LangSmith", "LangChain observability", "Trace LLM chains.", "PII scrubbing before export."),
  I("ai/guardrails", "AI Guardrails", "Output validation and safety", "Block policy violations.", "NeMo, Guardrails AI, custom validators."),
];

export const AI_PACKS = packsFromDefs(AI_PACK_DEFS);
