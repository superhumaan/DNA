# AI Output Validation Procedure

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI Output Validation Procedure.docx`

---

AI Output Validation Procedure

## Uk Gdpr

Validation steps

Pre-call (before Azure OpenAI)

1. Authenticate and resolve tenantId

2. Token quota and cost check — abort if insufficient

3. Input appropriateness / policy screen — abort if fail (no model call)

Server-side (after model response)

4. Output appropriateness screen

5. Validate JSON schema if applicable

6. Enforce max_tokens and detect truncation

7. Sanitise HTML/markdown before browser render

8. Return error if validation fails after one retry

9. Persist only cleaned final content user saves — never raw completion or user prompt

Client-side

Present as editable draft

Warn on empty or anomalously short responses

Log validation failures in telemetry (no content)

_Template — customize confidentiality and ownership statements for your organisation before distribution._
