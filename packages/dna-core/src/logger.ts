type LogLevel = "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";

const LEVELS: Record<LogLevel, number> = {
  silent: 0,
  fatal: 10,
  error: 20,
  warn: 30,
  info: 40,
  debug: 50,
  trace: 60,
};

function currentLevel(): LogLevel {
  const raw = process.env.DNA_LOG_LEVEL ?? "silent";
  return raw in LEVELS ? (raw as LogLevel) : "silent";
}

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] <= LEVELS[currentLevel()] && currentLevel() !== "silent";
}

function write(level: LogLevel, args: unknown[], module?: string): void {
  if (!shouldLog(level)) return;
  const prefix = module ? `[${module}] ` : "";
  const method = level === "error" || level === "fatal" ? "error" : level === "warn" ? "warn" : "log";
  console[method](prefix, ...args);
}

export interface Logger {
  fatal: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  trace: (...args: unknown[]) => void;
  child: (bindings: { module?: string }) => Logger;
}

function createLoggerInstance(module?: string): Logger {
  return {
    fatal: (...args) => write("fatal", args, module),
    error: (...args) => write("error", args, module),
    warn: (...args) => write("warn", args, module),
    info: (...args) => write("info", args, module),
    debug: (...args) => write("debug", args, module),
    trace: (...args) => write("trace", args, module),
    child: (bindings) => createLoggerInstance(bindings.module ?? module),
  };
}

export const logger = createLoggerInstance();

export function createLogger(name: string): Logger {
  return logger.child({ module: name });
}
