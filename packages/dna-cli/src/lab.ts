export {
  createLabMiddleware,
  createLabFastifyPlugin,
  handleLabRequest,
  ensureLabAssets,
  formatLabMountMessage,
  resolveLabPath,
  labApiPrefix,
  collectLabData,
  startLabServer,
  formatLabStart,
  runRegisterLab,
  runRegisterLabWithCallback,
  verifyPairingCode,
  initLocalPairing,
  pushPairingToProduction,
} from "@superhumaan/dna-core";

export type { LabServerOptions, LabDashboardOptions, RegisterLabOptions, RegisterLabResult } from "@superhumaan/dna-core";
