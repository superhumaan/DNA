export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function ok<T>(data: T): ParseResult<T> {
  return { success: true, data };
}

export function fail<T>(message: string): ParseResult<T> {
  return { success: false, error: { message } };
}

export function schema<T>(parseFn: (input: unknown) => ParseResult<T>) {
  return {
    parse(input: unknown): T {
      const result = parseFn(input);
      if (!result.success) throw new ValidationError(result.error.message);
      return result.data;
    },
    safeParse(input: unknown): ParseResult<T> {
      return parseFn(input);
    },
  };
}

function pathLabel(path: string): string {
  return path ? ` at ${path}` : "";
}

export function expectObject(value: unknown, path = ""): ParseResult<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return fail(`Expected object${pathLabel(path)}`);
  }
  return ok(value as Record<string, unknown>);
}

export function expectString(value: unknown, path = ""): ParseResult<string> {
  if (typeof value !== "string") return fail(`Expected string${pathLabel(path)}`);
  return ok(value);
}

export function expectNumber(value: unknown, path = ""): ParseResult<number> {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fail(`Expected number${pathLabel(path)}`);
  }
  return ok(value);
}

export function expectBoolean(value: unknown, path = ""): ParseResult<boolean> {
  if (typeof value !== "boolean") return fail(`Expected boolean${pathLabel(path)}`);
  return ok(value);
}

export function expectArray(value: unknown, path = ""): ParseResult<unknown[]> {
  if (!Array.isArray(value)) return fail(`Expected array${pathLabel(path)}`);
  return ok(value);
}

export function expectEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path = "",
): ParseResult<T> {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    return fail(`Expected one of ${allowed.join("|")}${pathLabel(path)}`);
  }
  return ok(value as T);
}

export function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "string" ? value : undefined;
}

export function optionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "boolean" ? value : undefined;
}

export function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}

export function withDefault<T>(value: T | undefined | null, defaultValue: T): T {
  return value === undefined || value === null ? defaultValue : value;
}

export function parseStringArray(value: unknown, path = ""): ParseResult<string[]> {
  const arr = expectArray(value, path);
  if (!arr.success) return arr;
  const out: string[] = [];
  for (let i = 0; i < arr.data.length; i++) {
    const item = expectString(arr.data[i], `${path}[${i}]`);
    if (!item.success) return item;
    out.push(item.data);
  }
  return ok(out);
}

export function parseEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path = "",
): ParseResult<T[]> {
  const arr = expectArray(value, path);
  if (!arr.success) return arr;
  const out: T[] = [];
  for (let i = 0; i < arr.data.length; i++) {
    const item = expectEnum(arr.data[i], allowed, `${path}[${i}]`);
    if (!item.success) return item;
    out.push(item.data);
  }
  return ok(out);
}

export function parseRecord(value: unknown, path = ""): ParseResult<Record<string, string>> {
  const obj = expectObject(value, path);
  if (!obj.success) return obj;
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj.data)) {
    const str = expectString(val, `${path}.${key}`);
    if (!str.success) return str;
    out[key] = str.data;
  }
  return ok(out);
}
