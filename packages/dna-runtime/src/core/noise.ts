/**
 * Benign process/socket errors that are normal when clients disconnect mid-response.
 * Must not escalate to Lab issues, GitHub, or AI repair.
 */
const BENIGN_CODES = new Set([
  "EPIPE",
  "ECONNRESET",
  "ECONNABORTED",
  "ERR_STREAM_DESTROYED",
  "ERR_STREAM_WRITE_AFTER_END",
]);

const BENIGN_MESSAGE =
  /\b(write EPIPE|EPIPE|ECONNRESET|ECONNABORTED|ERR_STREAM_DESTROYED|write after end)\b/i;

export function isBenignRuntimeError(error: unknown): boolean {
  if (error == null) return false;

  if (typeof error === "object") {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string" && BENIGN_CODES.has(code)) return true;
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && BENIGN_MESSAGE.test(message)) return true;
  }

  if (typeof error === "string" && BENIGN_MESSAGE.test(error)) return true;
  return false;
}

export function isBenignRuntimeMessage(message: string): boolean {
  return BENIGN_MESSAGE.test(message);
}
