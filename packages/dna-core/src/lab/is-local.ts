export function hostFromRequest(req: { headers?: Record<string, string | string[] | undefined> }): string {
  const raw = req.headers?.host ?? req.headers?.["x-forwarded-host"];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

export function isLocalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "0.0.0.0";
}

export function isLocalLabRequest(
  host: string,
  options?: { openLocalWithoutAuth?: boolean; nodeEnv?: string },
): boolean {
  if (options?.openLocalWithoutAuth === false) return false;
  if (isLocalHost(host)) return true;
  if ((options?.nodeEnv ?? process.env.NODE_ENV) === "development") return true;
  return false;
}
