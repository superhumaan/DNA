const SECRET_PATTERNS = [
  /(?:api[_-]?key|token|secret|password|authorization)\s*[:=]\s*['"]?[\w-]{8,}/gi,
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /ghp_[A-Za-z0-9]{20,}/g,
  /gho_[A-Za-z0-9]{20,}/g,
  /sk-[A-Za-z0-9]{20,}/g,
];

const PATH_HOME = homedirPattern();

function homedirPattern(): RegExp {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "/home/user";
  const escaped = home.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "g");
}

export function sanitizeText(text: string): string {
  let result = text.replace(PATH_HOME, "~");
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, "[REDACTED]");
  }
  return result.slice(0, 8000);
}

export function sanitizeStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  const lines = sanitizeText(stack)
    .split("\n")
    .filter((line) => !line.includes("node:internal"))
    .slice(0, 20);
  return lines.join("\n");
}

export function topStackFrame(stack?: string): string | undefined {
  if (!stack) return undefined;
  const frame = stack
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("at "));
  return frame ? sanitizeText(frame) : undefined;
}
