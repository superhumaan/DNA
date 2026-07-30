export {
  detectSkeletor,
  loadSkeletorKit,
  loadSkeletorSettings,
  skeletorFleetBridgePath,
  skeletorKitManifestPath,
  skeletorPrefsDir,
  skeletorSettingsPath,
  type SkeletorDetection,
  type SkeletorKitManifest,
  type SkeletorSettingsSlice,
} from "./detect.js";
export {
  isSkeletorPullEnabled,
  loadSkeletorFleetBridge,
  pullSkeletorData,
  type SkeletorBridgeAnalytics,
  type SkeletorBridgeProject,
  type SkeletorFleetBridge,
  type SkeletorPullResult,
} from "./pull.js";
export { formatSkeletorContextSection, formatSkeletorStatus } from "./format.js";
export { feedSkeletorToAi, SKELETOR_FLEET_MEMORY_REL } from "./feed.js";
