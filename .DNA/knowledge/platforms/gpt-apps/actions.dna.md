# GPT Actions — API Design

## OpenAPI requirements
- HTTPS only, valid TLS
- OAuth or API key auth documented in schema
- Idempotent where possible; clear error bodies (no stack traces)

## Security
- Verify OpenAI request signatures where supported
- Rate limit per user/session
- Scope Actions to least data necessary
- Log invocations — never log full prompts with PII

Run `dna context chatgpt` for behaviour files when editing GPT-facing APIs.
