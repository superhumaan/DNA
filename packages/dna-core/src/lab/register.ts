import { loadDnaConfig } from "../validator.js";
import {
  initLocalPairing,
  pollPairingStatus,
  pushPairingToProduction,
  readLocalPairing,
} from "./pairing.js";

export interface RegisterLabOptions {
  root: string;
  productionUrl: string;
  callbackPort?: number;
  projectId?: string;
}

export interface RegisterLabResult {
  pairingId: string;
  code: string;
  expiresAt: string;
  pairingFile: string;
  productionUrl: string;
  pushedToProduction: boolean;
  pushError?: string;
  verified?: boolean;
  message: string;
}

export async function runRegisterLab(options: RegisterLabOptions): Promise<RegisterLabResult> {
  const config = await loadDnaConfig(options.root);
  const projectId = options.projectId ?? config?.projectId ?? config?.projectName ?? "app";
  const productionUrl = options.productionUrl.replace(/\/$/, "");

  const pairing = await initLocalPairing({
    root: options.root,
    productionUrl,
    projectId,
    callbackPort: options.callbackPort,
  });

  const push = await pushPairingToProduction(productionUrl, {
    pairingId: pairing.pairingId,
    codeHash: pairing.codeHash,
    projectId,
    callbackUrl: pairing.callbackUrl,
  });

  let message = [
    "DNA Lab pairing code generated.",
    "",
    `Pairing ID: ${pairing.pairingId}`,
    "",
    "148-digit code (paste at production /labs → Create account):",
    pairing.code,
    "",
    `Expires: ${pairing.expiresAt}`,
    `Saved: ${pairing.pairingFile}`,
  ].join("\n");

  if (!push.ok) {
    message += `\n\nWarning: could not reach production (${push.error ?? push.status}). Deploy /labs first, then re-run.`;
  } else {
    message += "\n\nProduction notified. Paste the code in your browser to verify.";
  }

  return {
    pairingId: pairing.pairingId,
    code: pairing.code,
    expiresAt: pairing.expiresAt,
    pairingFile: pairing.pairingFile,
    productionUrl,
    pushedToProduction: push.ok,
    pushError: push.error,
    message,
  };
}

export async function waitForPairingVerification(
  root: string,
  productionUrl: string,
  pairingId: string,
  timeoutMs = 15 * 60 * 1000,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const local = await readLocalPairing(root);
    if (local?.verified) return true;
    const remote = await pollPairingStatus(productionUrl, pairingId);
    if (remote.verified) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}
