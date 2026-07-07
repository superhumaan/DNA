import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const I = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["ai"]);

export const WAVE3_AI_PACK_DEFS = [
  I("ai/semantic-kernel", "Semantic Kernel", "Microsoft agent framework", ".NET and Python enterprise agents.", "Plugins as functions. Planners with human approval."),
  I("ai/autogen", "AutoGen", "Multi-agent conversation framework", "Research and automation agents.", "Agent roles. Termination conditions. Cost caps."),
  I("ai/cursor-ide", "Cursor IDE AI", "AI-native code editor patterns", "DNA context targets Cursor rules.", ".cursor/rules. @codebase context. Agent mode guardrails."),
  I("ai/windsurf", "Windsurf IDE AI", "Cascade agentic IDE", "Alternative AI IDE integration.", "Flows and memories. MCP tool connections."),
  I("ai/assemblyai", "AssemblyAI", "Speech intelligence API", "Transcription + understanding.", "LeMUR LLM on transcripts. PII redaction option."),
  I("ai/stable-diffusion", "Stable Diffusion APIs", "Image generation integration", "Creative and marketing assets.", "Content policy. Model license compliance."),
  I("ai/mlflow", "MLflow", "ML experiment tracking", "Traditional ML ops.", "Model registry. Tracking URI per env."),
  I("ai/feast", "Feast", "Feature store", "ML feature serving.", "Offline/online store sync. Feature versioning."),
  I("ai/prompt-injection-defense", "Prompt Injection Defense", "LLM security patterns", "Any user-facing AI feature.", "Input/output filtering. Tool allowlists. Separate system/user channels."),
  I("ai/runpod", "RunPod", "GPU cloud for inference", "Self-serve GPU workloads.", "Serverless endpoints. Volume mounts for models."),
  I("ai/weights-biases", "Weights & Biases", "ML experiment platform", "Training run visualization.", "W&B artifacts. Team workspaces."),
  I("ai/apple-intelligence", "Apple Intelligence", "On-device Apple ML", "iOS 18+ privacy-preserving AI.", "App Intents. Private Cloud Compute disclosure."),
  I("ai/nvidia-nim", "NVIDIA NIM", "Inference microservices", "Self-hosted LLM inference.", "Triton containers. GPU sizing guides."),
  I("ai/mistral", "Mistral AI", "European LLM provider", "EU data residency option.", "API compatible patterns. Mixtral routing."),
  I("ai/cohere", "Cohere", "Enterprise NLP and RAG", "Embeddings and rerank APIs.", "Rerank for RAG quality. Multilingual embed."),
];

export const WAVE3_AI_PACKS = packsFromDefs(WAVE3_AI_PACK_DEFS);
