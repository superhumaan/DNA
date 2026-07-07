import { def, packsFromDefs } from "./bundled-catalog-pack-factory.js";

const G = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["gaming"]);

export const WAVE3_GAMING_XR_PACK_DEFS = [
  G("gaming/steam", "Steamworks", "PC game distribution and APIs", "Steam achievements, multiplayer, workshop.", "Steam Web API keys. Anti-cheat VAC awareness."),
  G("gaming/playfab", "PlayFab", "Azure game backend", "Live ops, leaderboards, multiplayer.", "Title ID per game. CloudScript server authority."),
  G("gaming/roblox", "Roblox", "UGC gaming platform", "Experiences on Roblox ecosystem.", "Roblox Studio. DataStore limits. COPPA if kids."),
  G("gaming/multiplayer-authoritative", "Authoritative Multiplayer", "Server-authoritative game networking", "Competitive multiplayer integrity.", "Client prediction. Lag compensation. Cheat detection server-side."),
  G("gaming/anti-cheat", "Anti-Cheat Patterns", "Cheat prevention strategies", "Online competitive games.", "Server validation. Obfuscation not sufficient alone. Report/ban pipelines."),
  G("gaming/epic-games-store", "Epic Games Store", "PC distribution alternative", "Epic Online Services integration.", "EOS for cross-play. Entitlement API."),
  G("xr/visionos", "visionOS / SwiftUI Spatial", "Apple spatial computing", "Vision Pro immersive apps.", "Volumes, immersive spaces. SharePlay optional."),
  G("xr/meta-quest-openxr", "Meta Quest & OpenXR", "VR headsets cross-vendor", "Standalone VR apps.", "OpenXR runtime. Hand tracking. Performance budgets."),
  G("xr/webxr", "WebXR", "VR/AR in the browser", "No-install immersive web.", "WebXR device API. Fallback for non-support."),
  G("xr/arkit-arcore", "ARKit & ARCore", "Mobile augmented reality", "AR on iOS/Android.", "Plane detection. Light estimation. Privacy — camera permission."),
  G("xr/8th-wall", "8th Wall", "Web AR platform", "Marketing AR without app install.", "SLAM in browser. Image targets."),
];

export const WAVE3_GAMING_XR_PACKS = packsFromDefs(WAVE3_GAMING_XR_PACK_DEFS);

const W = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["web3"]);

export const WAVE3_WEB3_IOT_PACK_DEFS = [
  W("web3/walletconnect", "WalletConnect", "Wallet connection protocol", "dApp auth without custodial keys.", "Sign sessions. Chain switching UX."),
  W("web3/hardhat-foundry", "Hardhat & Foundry", "Smart contract dev toolchains", "Ethereum contract development.", "Test on fork. Slither static analysis before deploy."),
  W("web3/base-polygon", "Base & Polygon L2", "Ethereum L2 scaling", "Lower gas dApps.", "Bridge risks documented. L2 sequencer assumptions."),
  W("web3/smart-contract-security", "Smart Contract Security", "Audit and secure Solidity", "Any on-chain value.", "Reentrancy guards. Access control. Timelocks on admin."),
  W("web3/ipfs-arweave", "IPFS & Arweave", "Decentralized storage", "NFT metadata, permanent archives.", "Pinning services. Content addressing. No PHI on public IPFS."),
  W("iot/coap", "CoAP", "Constrained device protocol", "Low-power IoT messaging.", "UDP-based. DTLS encryption. Observe pattern."),
  W("iot/azure-iot-hub", "Azure IoT Hub", "Microsoft IoT platform", "Enterprise IoT on Azure.", "Device twins. IoT Edge modules. DPS provisioning."),
  W("iot/esp32", "ESP32 & Embedded", "WiFi/BLE microcontrollers", "Hardware prototypes, sensors.", "OTA partition layout. Secure boot when production."),
  W("iot/ros", "ROS", "Robot Operating System", "Robotics software stack.", "ROS2 nodes. Nav2 for autonomy. Safety interlocks."),
  W("iot/opc-ua", "OPC-UA", "Industrial automation protocol", "Factory floor integrations.", "Certificate-based auth. Address space modeling."),
  W("iot/lorawan", "LoRaWAN", "Long-range low-power WAN", "Agriculture, smart city sensors.", "Join server. ADR data rate. Duty cycle limits."),
  W("iot/ota-firmware", "OTA Firmware Updates", "Secure device firmware delivery", "Connected hardware products.", "Signed images. Rollback partition. Staged rollout."),
  W("iot/digital-twins", "Digital Twins", "Virtual replicas of physical assets", "Industrial IoT, building management.", "Twin graph models. Telemetry ingestion. Simulation hooks."),
];

export const WAVE3_WEB3_IOT_PACKS = packsFromDefs(WAVE3_WEB3_IOT_PACK_DEFS);

const H = (id: string, name: string, desc: string, when: string, how: string, tags?: string[]) =>
  def(id, name, desc, when, how, tags ?? ["healthcare"]);

export const WAVE3_HEALTHCARE_EXTENDED_PACK_DEFS = [
  H("healthcare/mdr-eu", "EU MDR (Medical Devices)", "European medical device regulation", "Software as medical device in EU.", "CE marking path. Clinical evaluation. UDI registration."),
  H("healthcare/patient-portal", "Patient Portal UX", "HIPAA patient-facing applications", "MyChart-style consumer health apps.", "Minimum necessary display. Session timeout. Audit patient access."),
  H("healthcare/eprescribing-depth", "ePrescribing Depth", "EPCS and pharmacy routing", "Ambulatory prescribing workflows.", "DEA EPCS two-factor. NCPDP SCRIPT. Surescripts cert."),
  H("healthcare/clinical-ai", "Clinical AI Governance", "AI/ML in clinical workflows", "Ambient scribe, decision support.", "Human-in-the-loop. FDA SaMD classification. Bias monitoring."),
  H("healthcare/prior-auth", "Prior Authorization", "Payer approval workflows", "Specialty meds, procedures.", "Da Vinci PAS IG. X12 278. CoverMyMeds integration."),
  H("healthcare/lab-interfaces", "Laboratory Interfaces", "LIS result ingestion", "Lab results in EHR/portal.", "HL7 ORU. LOINC mapping. Critical result alerting."),
  H("healthcare/imaging-pacs", "PACS & Imaging Workflows", "Radiology integration beyond DICOM", "Viewer launch, worklists.", "DICOMweb WADO-RS. HL7 ORM for orders."),
  H("healthcare/billing-rcm", "Revenue Cycle Management", "Healthcare billing operations", "Claims, denials, patient statements.", "837 professional/institutional. Denial management workflows."),
  H("healthcare/hie-networks", "HIE & Carequality", "Health information exchange", "Cross-organization patient matching.", "Carequality/ eHealth Exchange. Patient consent tracking."),
  H("healthcare/cerner-millennium", "Cerner Millennium Depth", "Oracle Health inpatient workflows", "Hospital EHR deep integration.", "PowerChart embed. Discern analytics. MPage development."),
];

export const WAVE3_HEALTHCARE_EXTENDED_PACKS = packsFromDefs(WAVE3_HEALTHCARE_EXTENDED_PACK_DEFS);
