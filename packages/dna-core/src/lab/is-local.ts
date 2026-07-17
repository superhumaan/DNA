export function hostFromRequest(req: { headers?: Record<string, string | string[] | undefined> }): string {
  // Prefer proxy host — edge gateways set X-Forwarded-Host while Node still sees the internal Host.
  const raw = req.headers?.["x-forwarded-host"] ?? req.headers?.host;
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
  // Environment labels are not a trust boundary. A public preview commonly
  // runs with NODE_ENV=development, and treating that as local would bypass
  // all Lab authentication. Only a literal loopback Host may use local mode.
  return isLocalHost(host);
}
