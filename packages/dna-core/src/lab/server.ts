import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { DNA_LAB_API_PREFIX, DNA_LAB_DEFAULT_PATH } from "@superhumaan/dna-config";
import { LAB_INSTALL_SNIPPET } from "@superhumaan/dna-templates";
import { fileExists, writeFileEnsured } from "../fs.js";
import {
  LAB_SESSION_COOKIE,
  clearSessionCookie,
  completeLogin,
  completeRegistration,
  invalidateSessionCache,
  parseCookies,
  resolveLabAuth,
  sessionCookieHeader,
  startLoginOtp,
  startRegisterOtp,
} from "./auth.js";
import { collectLabIssueEvents, getLabData, recordRelease } from "./collect.js";
import { LAB_CLIENT_JS, LAB_CSS, LAB_HTML } from "./assets.js";
import { hostFromRequest, isLocalLabRequest } from "./is-local.js";
import {
  markLocalPairingVerified,
  readLocalPairing,
  verifyPairingCallbackSignature,
} from "./pairing.js";
import {
  postPairingCallback,
  registerPairingOnProduction,
  verifyPairingCode,
} from "./pairing.js";
import {
  LabStateConfigError,
  LabStateUnavailableError,
  pingLabStore,
  resolveLabStorageConfig,
  upsertSourceMapMeta,
} from "./storage.js";
import type { LabStateBackend } from "./types.js";
import { newId } from "./crypto.js";

export interface LabServerOptions {
  root: string;
  config?: DnaConfig | null;
  labPath?: string;
  secureCookies?: boolean;
}

export interface LabStateTopology {
  supported: boolean;
  instanceCount: number;
  backend: LabStateBackend;
  reason?: string;
}

/**
 * Lab auth/pairing/release state defaults to an atomic local file (one process).
 * Multi-instance is supported only when a shared Redis adapter is fully
 * configured via DNA_LAB_STATE_BACKEND=redis plus URL/token/key. Malformed
 * shared config fails closed. File + declared replicas still fail closed.
 */
export function resolveLabStateTopology(
  env: NodeJS.ProcessEnv = process.env,
): LabStateTopology {
  const declared = Number(env.DNA_LAB_INSTANCE_COUNT ?? env.WEB_CONCURRENCY ?? "1");
  const instanceCount = Number.isFinite(declared) && declared > 0 ? Math.floor(declared) : 1;
  const storage = resolveLabStorageConfig(env);

  if (storage.kind === "invalid") {
    return {
      supported: false,
      instanceCount,
      backend: storage.backend,
      reason: storage.reason,
    };
  }

  if (storage.kind === "redis") {
    return {
      supported: true,
      instanceCount,
      backend: "shared-redis",
    };
  }

  if (instanceCount > 1) {
    return {
      supported: false,
      instanceCount,
      backend: "single-instance-file",
      reason:
        "DNA Lab file state supports one application instance. Configure DNA_LAB_STATE_BACKEND=redis with DNA_LAB_REDIS_URL, DNA_LAB_REDIS_TOKEN, and DNA_LAB_REDIS_KEY for multi-instance, or use one replica/sticky deployment.",
    };
  }
  return { supported: true, instanceCount: 1, backend: "single-instance-file" };
}

type Req = IncomingMessage & { body?: unknown };
type Res = ServerResponse;

/**
 * Document CSP for /labs HTML — must override host helmet API CSP (default-src 'none').
 * Allows Cloudflare Web Analytics when the zone injects static.cloudflareinsights.com.
 */
export const LAB_DOCUMENT_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://kit.fontawesome.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://kit.fontawesome.com",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://kit.fontawesome.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com https://ka-f.fontawesome.com https://ka-p.fontawesome.com",
  "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://kit.fontawesome.com https://ka-f.fontawesome.com https://ka-p.fontawesome.com https://cloudflareinsights.com https://static.cloudflareinsights.com",
  "img-src 'self' data:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

export function applyLabDocumentHeaders(res: ServerResponse): void {
  res.setHeader("Content-Security-Policy", LAB_DOCUMENT_CSP);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function fontAwesomeKitTags(): string {
  const kitId = process.env.VITE_FONTAWESOME_KIT_ID || process.env.FONTAWESOME_KIT_ID || "";
  if (!kitId.trim()) return "";
  return [
    '  <link rel="preconnect" href="https://kit.fontawesome.com" crossorigin />',
    '  <link rel="preconnect" href="https://ka-p.fontawesome.com" crossorigin />',
    `  <script src="https://kit.fontawesome.com/${kitId.trim()}.js" defer crossorigin="anonymous"></script>`,
  ].join("\n");
}

export function buildLabHtml(apiPrefix: string): string {
  return LAB_HTML.replace("__LAB_CSS_INLINE__", LAB_CSS)
    .replace("__LAB_JS_PATH__", `${apiPrefix}/client.js`)
    .replace("</head>", `${fontAwesomeKitTags()}\n</head>`);
}

/** Max JSON body accepted by Lab POST endpoints (auth, pairing, releases). */
export const LAB_MAX_BODY_BYTES = 64 * 1024;

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > LAB_MAX_BODY_BYTES) {
      const err = new Error("Request body too large");
      (err as Error & { statusCode?: number }).statusCode = 413;
      throw err;
    }
    chunks.push(buf);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    return {};
  }
}

function sendJson(
  res: Res,
  status: number,
  body: unknown,
  headers?: Record<string, string>,
  method?: string,
): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
    ...headers,
  });
  res.end(method === "HEAD" ? undefined : payload);
}

function sendText(
  res: Res,
  status: number,
  body: string,
  contentType: string,
  headers?: Record<string, string>,
  method?: string,
): void {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    ...headers,
  });
  res.end(method === "HEAD" ? undefined : body);
}

function notFound(res: Res): void {
  sendJson(res, 404, { error: "Not found" });
}

function unauthorized(res: Res): void {
  sendJson(res, 401, { error: "Unauthorized" });
}

export function resolveLabPath(config?: DnaConfig | null): string {
  const path = config?.lab?.path ?? DNA_LAB_DEFAULT_PATH;
  return path.startsWith("/") ? path : `/${path}`;
}

export function labApiPrefix(): string {
  return DNA_LAB_API_PREFIX;
}

export async function handleLabRequest(
  req: Req,
  res: Res,
  options: LabServerOptions,
  next?: () => void,
): Promise<boolean> {
  try {
    return await handleLabRequestInner(req, res, options, next);
  } catch (err) {
    if (err instanceof LabStateUnavailableError || err instanceof LabStateConfigError) {
      const topology = resolveLabStateTopology();
      sendJson(res, 503, {
        error: err.message,
        instanceCount: topology.instanceCount,
        backend: topology.backend,
      });
      return true;
    }
    throw err;
  }
}

async function handleLabRequestInner(
  req: Req,
  res: Res,
  options: LabServerOptions,
  next?: () => void,
): Promise<boolean> {
  const labPath = resolveLabPath(options.config);
  const apiPrefix = labApiPrefix();
  const url = new URL(req.url ?? "/", "http://local");
  const pathname = url.pathname;
  const host = hostFromRequest(req);
  const localMode = isLocalLabRequest(host, {
    openLocalWithoutAuth: options.config?.lab?.openLocalWithoutAuth !== false,
    nodeEnv: options.config?.runtime?.environment ?? process.env.NODE_ENV,
  });

  const isLabPage = pathname === labPath || pathname.startsWith(`${labPath}/`);
  const isLabApi = pathname.startsWith(apiPrefix);
  if (!isLabPage && !isLabApi) {
    return false;
  }

  const topology = resolveLabStateTopology();
  if (!topology.supported) {
    sendJson(res, 503, {
      error: "Unsupported DNA Lab deployment topology",
      reason: topology.reason,
      instanceCount: topology.instanceCount,
      backend: topology.backend,
    });
    return true;
  }

  if (isLabPage) {
    applyLabDocumentHeaders(res);
  }

  const isGetOrHead = req.method === "GET" || req.method === "HEAD";

  if (isGetOrHead && pathname === `${apiPrefix}/client.js`) {
    sendText(res, 200, LAB_CLIENT_JS, "application/javascript; charset=utf-8", undefined, req.method);
    return true;
  }

  if (isGetOrHead && pathname === `${apiPrefix}/styles.css`) {
    sendText(res, 200, LAB_CSS, "text/css; charset=utf-8", undefined, req.method);
    return true;
  }

  if (isGetOrHead && pathname === `${apiPrefix}/health`) {
    try {
      await pingLabStore(options.root);
      sendJson(
        res,
        200,
        {
          ok: true,
          stateBackend: topology.backend,
          instanceCount: topology.instanceCount,
        },
        undefined,
        req.method,
      );
    } catch (err) {
      const message =
        err instanceof LabStateUnavailableError || err instanceof LabStateConfigError
          ? err.message
          : "DNA Lab state backend is unreachable.";
      sendJson(
        res,
        503,
        {
          ok: false,
          stateBackend: topology.backend,
          instanceCount: topology.instanceCount,
          error: message,
        },
        undefined,
        req.method,
      );
    }
    return true;
  }

  const publicApi =
    pathname === `${apiPrefix}/bootstrap` ||
    pathname === `${apiPrefix}/pairing/init` ||
    pathname.startsWith(`${apiPrefix}/pairing/status/`) ||
    pathname === `${apiPrefix}/pairing/callback` ||
    pathname === `${apiPrefix}/pairing/verify` ||
    pathname === `${apiPrefix}/auth/otp` ||
    pathname === `${apiPrefix}/auth/login` ||
    pathname === `${apiPrefix}/auth/register`;

  const auth = await resolveLabAuth(options.root, req, localMode);

  if ((isLabPage || isLabApi) && !localMode && !auth.authenticated && !publicApi) {
    if (isLabApi) {
      unauthorized(res);
      return true;
    }
    // HTML shell still served — client shows login / pairing
  }

  if (isGetOrHead && pathname === `${apiPrefix}/bootstrap`) {
    const { DNA_LAB_GATEWAY_PUBLIC_PATHS } = await import("@superhumaan/dna-config");
    sendJson(
      res,
      200,
      {
        localMode,
        authenticated: auth.authenticated,
        user: auth.user ? { name: auth.user.name, email: auth.user.email } : undefined,
        labPath,
        pairing: {
          mode: "paste-verify",
          gatewayPublicPaths: [...DNA_LAB_GATEWAY_PUBLIC_PATHS],
        },
      },
      undefined,
      req.method,
    );
    return true;
  }

  if (isGetOrHead && pathname.startsWith(`${apiPrefix}/pairing/status/`)) {
    const pairingId = pathname.slice(`${apiPrefix}/pairing/status/`.length);
    const { findLabPairing } = await import("./storage.js");
    const pairing = await findLabPairing(options.root, pairingId);
    sendJson(res, 200, { verified: Boolean(pairing?.verified) }, undefined, req.method);
    return true;
  }

  if (req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = (await readJsonBody(req)) as Record<string, unknown>;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode ?? 400;
      sendJson(res, status, { error: err instanceof Error ? err.message : "Bad request" });
      return true;
    }

    if (pathname === `${apiPrefix}/pairing/init`) {
      const result = await registerPairingOnProduction(options.root, {
        pairingId: String(body.pairingId ?? ""),
        codeHash: String(body.codeHash ?? ""),
        projectId: String(body.projectId ?? "app"),
        callbackUrl: body.callbackUrl ? String(body.callbackUrl) : undefined,
      });
      sendJson(res, result.ok ? 200 : 400, result);
      return true;
    }

    if (pathname === `${apiPrefix}/pairing/verify`) {
      const pairingId = String(body.pairingId ?? "");
      const code = String(body.code ?? "");
      const result = await verifyPairingCode(options.root, pairingId, code);
      if (result.ok && result.callbackUrl && result.callbackCodeHash) {
        await postPairingCallback(
          result.callbackUrl,
          { pairingId, verified: true },
          result.callbackCodeHash,
        );
      }
      sendJson(res, result.ok ? 200 : 400, {
        ok: result.ok,
        error: result.error,
        message: result.ok ? "Pairing verified — create your account" : result.error,
      });
      return true;
    }

    if (pathname === `${apiPrefix}/pairing/callback`) {
      const pairingId = String(body.pairingId ?? "");
      const callbackBody = { pairingId, verified: body.verified === true };
      const signatureHeader = req.headers["x-dna-lab-signature"];
      const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
      const localPairing = await readLocalPairing(options.root);
      const valid =
        localPairing?.pairingId === pairingId &&
        verifyPairingCallbackSignature(localPairing.codeHash, callbackBody, signature);
      if (!valid) {
        unauthorized(res);
        return true;
      }
      if (callbackBody.verified) {
        await markLocalPairingVerified(options.root);
      }
      sendJson(res, 200, { ok: true, pairingId });
      return true;
    }

    if (pathname === `${apiPrefix}/auth/otp`) {
      const email = String(body.email ?? "");
      const purpose = body.purpose === "register" ? "register" : "login";
      let devOtp = "";
      if (purpose === "login") {
        const r = await startLoginOtp(options.root, email);
        if (r.error) {
          sendJson(res, 400, { error: r.error });
          return true;
        }
        devOtp = r.otp;
      } else {
        const r = await startRegisterOtp(options.root, email);
        devOtp = r.otp;
      }
      sendJson(res, 200, {
        ok: true,
        devOtp:
          localMode &&
          process.env.NODE_ENV !== "production" &&
          options.config?.runtime?.environment !== "production"
            ? devOtp
            : undefined,
        message: "OTP generated",
      });
      return true;
    }

    if (pathname === `${apiPrefix}/auth/login`) {
      const result = await completeLogin(
        options.root,
        String(body.email ?? ""),
        String(body.password ?? ""),
        String(body.otp ?? ""),
      );
      if (!result.ok) {
        sendJson(res, 400, { error: result.error });
        return true;
      }
      const secure = options.secureCookies ?? !localMode;
      sendJson(
        res,
        200,
        { ok: true },
        { "Set-Cookie": sessionCookieHeader(result.sessionId!, secure) },
      );
      return true;
    }

    if (pathname === `${apiPrefix}/auth/register`) {
      const result = await completeRegistration(options.root, {
        pairingId: String(body.pairingId ?? ""),
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        password: String(body.password ?? ""),
        otp: String(body.otp ?? ""),
      });
      if (!result.ok) {
        sendJson(res, 400, { error: result.error });
        return true;
      }
      const secure = options.secureCookies ?? !localMode;
      sendJson(
        res,
        200,
        { ok: true },
        { "Set-Cookie": sessionCookieHeader(result.sessionId!, secure) },
      );
      return true;
    }

    if (pathname === `${apiPrefix}/auth/logout`) {
      const secure = options.secureCookies ?? !localMode;
      const cookieHeader = Array.isArray(req.headers?.cookie)
        ? req.headers.cookie[0]
        : req.headers?.cookie;
      const sessionId = parseCookies(cookieHeader)[LAB_SESSION_COOKIE];
      if (sessionId) invalidateSessionCache(sessionId);
      sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie(secure) });
      return true;
    }

    if (pathname === `${apiPrefix}/releases` && !localMode && !auth.authenticated) {
      unauthorized(res);
      return true;
    }

    if (pathname === `${apiPrefix}/releases`) {
      await recordRelease(options.root, {
        version: String(body.version ?? "unknown"),
        gitSha: body.gitSha ? String(body.gitSha) : process.env.GIT_SHA,
        environment: body.environment ? String(body.environment) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
      });
      sendJson(res, 200, { ok: true });
      return true;
    }

    if (pathname === `${apiPrefix}/sourcemaps`) {
      if (!localMode && !auth.authenticated) {
        unauthorized(res);
        return true;
      }
      const releaseId = String(body.releaseId ?? "");
      const file = String(body.file ?? "");
      await upsertSourceMapMeta(options.root, {
        id: newId(),
        releaseId,
        file,
        uploadedAt: new Date().toISOString(),
        sizeBytes: Number(body.sizeBytes ?? 0),
      });
      sendJson(res, 200, { ok: true });
      return true;
    }
  }

  if (isGetOrHead && pathname === `${apiPrefix}/data`) {
    if (!localMode && !auth.authenticated) {
      unauthorized(res);
      return true;
    }
    const { data, etag } = await getLabData(options.root);
    // Poll-friendly caching: revalidate every request but answer unchanged
    // payloads with a cheap 304 so 100s of pollers cost near nothing.
    const cacheHeaders = { ETag: etag, "Cache-Control": "private, max-age=0, must-revalidate" };
    const ifNoneMatch = req.headers["if-none-match"];
    const clientEtag = Array.isArray(ifNoneMatch) ? ifNoneMatch[0] : ifNoneMatch;
    if (clientEtag && clientEtag === etag) {
      res.writeHead(304, cacheHeaders);
      res.end();
      return true;
    }
    sendJson(res, 200, data, cacheHeaders, req.method);
    return true;
  }

  const issueEventsPrefix = `${apiPrefix}/issues/`;
  if (
    isGetOrHead &&
    pathname.startsWith(issueEventsPrefix) &&
    pathname.endsWith("/events")
  ) {
    if (!localMode && !auth.authenticated) {
      unauthorized(res);
      return true;
    }
    const encodedIssueId = pathname.slice(issueEventsPrefix.length, -"/events".length);
    let issueId: string;
    try {
      issueId = decodeURIComponent(encodedIssueId);
    } catch {
      sendJson(res, 400, { error: "Invalid issue ID" });
      return true;
    }
    if (!issueId || issueId.length > 256) {
      sendJson(res, 400, { error: "Invalid issue ID" });
      return true;
    }
    const events = await collectLabIssueEvents(options.root, issueId);
    sendJson(res, 200, { events }, undefined, req.method);
    return true;
  }

  if (isGetOrHead && isLabPage) {
    const html = buildLabHtml(apiPrefix);
    sendText(
      res,
      200,
      html,
      "text/html; charset=utf-8",
      { "Content-Security-Policy": LAB_DOCUMENT_CSP },
      req.method,
    );
    return true;
  }

  if (isLabApi) {
    notFound(res);
    return true;
  }

  if (next) next();
  return false;
}

export async function ensureLabAssets(root: string): Promise<string[]> {
  const actions: string[] = [];
  const { ensureLabStore } = await import("./storage.js");
  const store = await ensureLabStore(root);
  if (store.created) actions.push(store.path);

  const snippetPath = join(root, ".DNA", "lab", "install-snippet.ts");
  const snippetExisted = await fileExists(snippetPath);
  await writeFileEnsured(snippetPath, LAB_INSTALL_SNIPPET);
  if (!snippetExisted) actions.push(".DNA/lab/install-snippet.ts");

  const { DNA_LAB_GATEWAY_ALLOWLIST_FILE } = await import("@superhumaan/dna-config");
  const { GATEWAY_PUBLIC_PATHS_MARKDOWN } = await import("./gateway-allowlist.js");
  const gatewayPath = join(root, DNA_LAB_GATEWAY_ALLOWLIST_FILE);
  const gatewayExisted = await fileExists(gatewayPath);
  await writeFileEnsured(gatewayPath, GATEWAY_PUBLIC_PATHS_MARKDOWN);
  if (!gatewayExisted) actions.push(DNA_LAB_GATEWAY_ALLOWLIST_FILE);

  return actions;
}

export function formatLabMountMessage(labPath: string, host: string): string {
  return [
    "DNA Lab mounted",
    `  UI:  ${host}${labPath}`,
    `  API: ${host}${labApiPrefix()}`,
    "  Local: no login required",
    "  Production: pair with npx dna register lab --url <your-deploy-url>",
  ].join("\n");
}
