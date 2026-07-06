const SENSITIVE_PATTERNS = [
  /Bearer\s+[\w.-]+/gi,
  /api[_-]?key[=:]\s*[\w.-]+/gi,
  /password[=:]\s*\S+/gi,
  /token[=:]\s*[\w.-]+/gi,
  /authorization[=:]\s*\S+/gi,
  /cookie[=:]\s*\S+/gi,
];

export function redactSensitive(text: string): string {
  let result = text;
  for (const pattern of SENSITIVE_PATTERNS) {
    result = result.replace(pattern, "[REDACTED]");
  }
  return result;
}
