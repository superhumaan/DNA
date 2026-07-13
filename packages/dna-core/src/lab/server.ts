import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import type { DnaConfig } from "@superhumaan/dna-config";
import { DNA_LAB_API_PREFIX, DNA_LAB_DEFAULT_PATH } from "@superhumaan/dna-config";
import { LAB_INSTALL_SNIPPET } from "@superhumaan/dna-templates";
import { fileExists, writeFileEnsured } from "../fs.js";
import {
  clearSessionCookie,
  completeLogin,
  completeRegistration,
  resolveLabAuth,
  sessionCookieHeader,
  startLoginOtp,
  startRegisterOtp,
} from "./auth.js";
import { collectLabData, recordRelease } from "./collect.js";
import { LAB_CLIENT_JS, LAB_CSS, LAB_HTML } from "./assets.js";
import { hostFromRequest, isLocalLabRequest } from "./is-local.js";
import { markLocalPairingVerified } from "./pairing.js";
import {
  postPairingCallback,
  registerPairingOnProduction,
  verifyPairingCode,
} from "./pairing.js";
import { upsertSourceMapMeta } from "./storage.js";
import { newId } from "./crypto.js";

export interface LabServerOptions {
  root: string;
  config?: DnaConfig | null;
  labPath?: string;
  secureCookies?: boolean;
}

type Req = IncomingMessage & { body?: unknown };
type Res = ServerResponse;

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    return {};
  }
}

function sendJson(res: Res, status: number, body: unknown, headers?: Record<string, string>): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function sendText(res: Res, status: number, body: string, contentType: string): void {
  res.writeHead(status, { "Content-Type": contentType, "Cache-Control": "no-store" });
  res.end(body);
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

  if (req.method === "GET" && pathname === `${apiPrefix}/client.js`) {
    sendText(res, 200, LAB_CLIENT_JS, "application/javascript; charset=utf-8");
    return true;
  }

  if (req.method === "GET" && pathname === `${apiPrefix}/styles.css`) {
    sendText(res, 200, LAB_CSS, "text/css; charset=utf-8");
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
    // HTML shell still served — client shows login
  }

  if (req.method === "GET" && pathname === `${apiPrefix}/bootstrap`) {
    sendJson(res, 200, {
      localMode,
      authenticated: auth.authenticated,
      user: auth.user ? { name: auth.user.name, email: auth.user.email } : undefined,
      labPath,
    });
    return true;
  }

  if (req.method === "POST") {
    const body = (await readJsonBody(req)) as Record<string, unknown>;

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
      if (result.ok && result.callbackUrl) {
        await postPairingCallback(result.callbackUrl, { pairingId, verified: true });
      }
      sendJson(res, result.ok ? 200 : 400, {
        ...result,
        message: result.ok ? "Pairing verified — create your account" : result.error,
      });
      return true;
    }

    if (pathname === `${apiPrefix}/pairing/callback`) {
      const pairingId = String(body.pairingId ?? "");
      if (body.verified) {
        await markLocalPairingVerified(options.root);
      }
      sendJson(res, 200, { ok: true, pairingId });
      return true;
    }

    if (pathname.startsWith(`${apiPrefix}/pairing/status/`)) {
      const pairingId = pathname.slice(`${apiPrefix}/pairing/status/`.length);
      const { findLabPairing } = await import("./storage.js");
      const pairing = await findLabPairing(options.root, pairingId);
      sendJson(res, 200, { verified: Boolean(pairing?.verified) });
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
        devOtp: process.env.NODE_ENV !== "production" ? devOtp : undefined,
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

  if (req.method === "GET" && pathname === `${apiPrefix}/data`) {
    if (!localMode && !auth.authenticated) {
      unauthorized(res);
      return true;
    }
    const data = await collectLabData(options.root);
    sendJson(res, 200, data);
    return true;
  }

  if (req.method === "GET" && isLabPage) {
    const html = LAB_HTML.replace("__LAB_JS_PATH__", `${apiPrefix}/client.js`);
    sendText(res, 200, html, "text/html; charset=utf-8");
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
