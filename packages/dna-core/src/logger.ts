import pino from "pino";

export const logger = pino({
  level: process.env.DNA_LOG_LEVEL ?? "silent",
});

export function createLogger(name: string) {
  return logger.child({ module: name });
}
