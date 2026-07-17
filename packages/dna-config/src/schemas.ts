import {
  AI_PROVIDERS,
  AI_TOOLS,
  COMPANY_ARCHETYPES,
  COMPLIANCE_OPTIONS,
  DELIVERY_METHODOLOGIES,
  DISCOVERY_EVENTS,
  DISCOVERY_LIFECYCLE_STAGES,
  DISCOVERY_METHODS,
  DISCOVERY_PROCESSES,
  DISCOVERY_TEAM_MODELS,
  DOC_SYSTEMS,
  FEEDBACK_AUTO_MODES,
  INDUSTRY_SECTORS,
  ISSUE_CATEGORIES,
  PROJECT_STAGES,
  SEVERITY_LEVELS,
  TICKET_SYSTEMS,
  WORK_HIERARCHY_LEVELS,
} from "./constants.js";
import {
  expectArray,
  expectBoolean,
  expectEnum,
  expectNumber,
  expectObject,
  expectString,
  fail,
  ok,
  optionalBoolean,
  optionalNumber,
  optionalString,
  parseEnumArray,
  parseRecord,
  parseStringArray,
  schema,
  withDefault,
  type ParseResult,
} from "./validate.js";

function parseStack(value: unknown): ParseResult<{
  archetype?: string;
  frontend?: string;
  bundler?: string;
  backend?: string;
  database?: string;
  platform?: string;
  hosting?: string;
  testing?: string;
  packageManager?: string;
}> {
  if (value === undefined) return ok({});
  const obj = expectObject(value, "stack");
  if (!obj.success) return obj;
  return ok({
    archetype: optionalString(obj.data.archetype),
    frontend: optionalString(obj.data.frontend),
    bundler: optionalString(obj.data.bundler),
    backend: optionalString(obj.data.backend),
    database: optionalString(obj.data.database),
    platform: optionalString(obj.data.platform),
    hosting: optionalString(obj.data.hosting),
    testing: optionalString(obj.data.testing),
    packageManager: optionalString(obj.data.packageManager),
  });
}

function parseDnaConfig(input: unknown): ParseResult<DnaConfig> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;

  const projectId = expectString(d.projectId, "projectId");
  if (!projectId.success) return projectId;
  const projectName = expectString(d.projectName, "projectName");
  if (!projectName.success) return projectName;
  const createdAt = expectString(d.createdAt, "createdAt");
  if (!createdAt.success) return createdAt;
  const updatedAt = expectString(d.updatedAt, "updatedAt");
  if (!updatedAt.success) return updatedAt;

  const stack = parseStack(d.stack);
  if (!stack.success) return stack;

  const compliance = d.compliance === undefined
    ? ok("none" as const)
    : expectEnum(d.compliance, COMPLIANCE_OPTIONS, "compliance");
  if (!compliance.success) return compliance;

  const stage = d.stage === undefined
    ? ok("new" as const)
    : expectEnum(d.stage, PROJECT_STAGES, "stage");
  if (!stage.success) return stage;

  const aiTools = d.aiTools === undefined
    ? ok([] as (typeof AI_TOOLS)[number][])
    : parseEnumArray(d.aiTools, AI_TOOLS, "aiTools");
  if (!aiTools.success) return aiTools;

  const knowledgePacks = d.knowledgePacks === undefined
    ? ok([] as string[])
    : parseStringArray(d.knowledgePacks, "knowledgePacks");
  if (!knowledgePacks.success) return knowledgePacks;

  const platformFeatures = d.platformFeatures === undefined
    ? ok([] as string[])
    : parseStringArray(d.platformFeatures, "platformFeatures");
  if (!platformFeatures.success) return platformFeatures;

  let github: DnaConfig["github"];
  if (d.github !== undefined) {
    const gh = expectObject(d.github, "github");
    if (!gh.success) return gh;
    github = {
      enabled: withDefault(optionalBoolean(gh.data.enabled), true),
      owner: optionalString(gh.data.owner),
      repo: optionalString(gh.data.repo),
      authenticated: optionalBoolean(gh.data.authenticated),
    };
  }

  let ai: DnaConfig["ai"];
  if (d.ai !== undefined) {
    const aiObj = expectObject(d.ai, "ai");
    if (!aiObj.success) return aiObj;
    const provider = aiObj.data.provider === undefined
      ? ok("mock" as const)
      : expectEnum(aiObj.data.provider, AI_PROVIDERS, "ai.provider");
    if (!provider.success) return provider;
    let repair: NonNullable<DnaConfig["ai"]>["repair"];
    if (aiObj.data.repair !== undefined) {
      const repairObj = expectObject(aiObj.data.repair, "ai.repair");
      if (!repairObj.success) return repairObj;
      const minRepeatForRepair = repairObj.data.minRepeatForRepair === undefined
        ? ok(3)
        : expectNumber(repairObj.data.minRepeatForRepair, "ai.repair.minRepeatForRepair");
      if (!minRepeatForRepair.success) return minRepeatForRepair;
      const minRepeatForBlocker = repairObj.data.minRepeatForBlocker === undefined
        ? ok(5)
        : expectNumber(repairObj.data.minRepeatForBlocker, "ai.repair.minRepeatForBlocker");
      if (!minRepeatForBlocker.success) return minRepeatForBlocker;
      repair = {
        enabled: withDefault(optionalBoolean(repairObj.data.enabled), true),
        autoPr: withDefault(optionalBoolean(repairObj.data.autoPr), true),
        requireReview: withDefault(optionalBoolean(repairObj.data.requireReview), true),
        aggressive: withDefault(optionalBoolean(repairObj.data.aggressive), true),
        minRepeatForRepair: minRepeatForRepair.data,
        minRepeatForBlocker: minRepeatForBlocker.data,
        forceAgentLoop: withDefault(optionalBoolean(repairObj.data.forceAgentLoop), true),
        dedupeIssues: withDefault(optionalBoolean(repairObj.data.dedupeIssues), true),
        retryOpenRepairs: withDefault(optionalBoolean(repairObj.data.retryOpenRepairs), true),
      };
    }
    ai = {
      enabled: withDefault(optionalBoolean(aiObj.data.enabled), true),
      provider: provider.data,
      model: optionalString(aiObj.data.model),
      endpoint: optionalString(aiObj.data.endpoint),
      repair,
    };
  }

  let runtime: DnaConfig["runtime"];
  if (d.runtime !== undefined) {
    const rt = expectObject(d.runtime, "runtime");
    if (!rt.success) return rt;
    const storage =
      rt.data.storage === undefined
        ? ok("json" as const)
        : expectEnum(
            rt.data.storage,
            ["json", "jsonl", "sqlite"] as const,
            "runtime.storage",
          );
    if (!storage.success) return storage;
    runtime = {
      enabled: withDefault(optionalBoolean(rt.data.enabled), true),
      environment: optionalString(rt.data.environment),
      // `sqlite` was the historical label for the atomic JSON document stored
      // at runtime.db. Accept old configs, but expose the truthful canonical name.
      storage: storage.data === "sqlite" ? "json" : storage.data,
      watchBackend: withDefault(optionalBoolean(rt.data.watchBackend), true),
      watchFrontend: withDefault(optionalBoolean(rt.data.watchFrontend), true),
    };
  }

  let ci: DnaConfig["ci"];
  if (d.ci !== undefined) {
    const ciObj = expectObject(d.ci, "ci");
    if (!ciObj.success) return ciObj;
    const previewProvider = ciObj.data.previewProvider === undefined
      ? ok("vercel" as const)
      : expectEnum(ciObj.data.previewProvider, ["vercel", "netlify"] as const, "ci.previewProvider");
    if (!previewProvider.success) return previewProvider;
    const coverageThreshold = ciObj.data.coverageThreshold === undefined
      ? ok(80)
      : expectNumber(ciObj.data.coverageThreshold, "ci.coverageThreshold");
    if (!coverageThreshold.success) return coverageThreshold;
    ci = {
      enabled: withDefault(optionalBoolean(ciObj.data.enabled), true),
      strict: withDefault(optionalBoolean(ciObj.data.strict), false),
      coverageThreshold: coverageThreshold.data,
      perFileCoverage: withDefault(optionalBoolean(ciObj.data.perFileCoverage), true),
      owasp: withDefault(optionalBoolean(ciObj.data.owasp), true),
      pushToPreview: withDefault(optionalBoolean(ciObj.data.pushToPreview), true),
      previewProvider: previewProvider.data,
      previewBranch: optionalString(ciObj.data.previewBranch),
    };
  }

  let featureFactory: DnaConfig["featureFactory"];
  if (d.featureFactory !== undefined) {
    const ff = expectObject(d.featureFactory, "featureFactory");
    if (!ff.success) return ff;
    featureFactory = {
      enabled: withDefault(optionalBoolean(ff.data.enabled), true),
    };
  }

  let aiWorkbench: DnaConfig["aiWorkbench"];
  if (d.aiWorkbench !== undefined) {
    const wb = expectObject(d.aiWorkbench, "aiWorkbench");
    if (!wb.success) return wb;
    const stemSource = wb.data.stemSource === undefined
      ? undefined
      : expectEnum(wb.data.stemSource, ["remote", "bundled"] as const, "aiWorkbench.stemSource");
    if (stemSource && !stemSource.success) return stemSource;
    aiWorkbench = {
      enabled: withDefault(optionalBoolean(wb.data.enabled), true),
      lastSyncAt: optionalString(wb.data.lastSyncAt),
      catalogVersion: optionalNumber(wb.data.catalogVersion),
      stemSource: stemSource?.success ? stemSource.data : undefined,
    };
  }

  let delivery: DnaConfig["delivery"];
  if (d.delivery !== undefined) {
    const del = expectObject(d.delivery, "delivery");
    if (!del.success) return del;
    const methodology = del.data.methodology === undefined
      ? ok("dna-default" as const)
      : expectEnum(del.data.methodology, DELIVERY_METHODOLOGIES, "delivery.methodology");
    if (!methodology.success) return methodology;
    const companyArchetype = del.data.companyArchetype === undefined
      ? ok("none" as const)
      : expectEnum(del.data.companyArchetype, COMPANY_ARCHETYPES, "delivery.companyArchetype");
    if (!companyArchetype.success) return companyArchetype;
    const ticketSystem = del.data.ticketSystem === undefined
      ? ok("github" as const)
      : expectEnum(del.data.ticketSystem, TICKET_SYSTEMS, "delivery.ticketSystem");
    if (!ticketSystem.success) return ticketSystem;
    const docSystem = del.data.docSystem === undefined
      ? ok("impressions" as const)
      : expectEnum(del.data.docSystem, DOC_SYSTEMS, "delivery.docSystem");
    if (!docSystem.success) return docSystem;
    const hierarchy = del.data.hierarchy === undefined
      ? ok(["feature", "story", "task"] as (typeof WORK_HIERARCHY_LEVELS)[number][])
      : parseEnumArray(del.data.hierarchy, WORK_HIERARCHY_LEVELS, "delivery.hierarchy");
    if (!hierarchy.success) return hierarchy;
    const ceremonies = del.data.ceremonies === undefined
      ? ok([] as string[])
      : parseStringArray(del.data.ceremonies, "delivery.ceremonies");
    if (!ceremonies.success) return ceremonies;
    delivery = {
      methodology: methodology.data,
      companyArchetype: companyArchetype.data,
      ticketSystem: ticketSystem.data,
      docSystem: docSystem.data,
      hierarchy: hierarchy.data,
      ceremonies: ceremonies.data,
      customProfile: optionalString(del.data.customProfile) ?? ".DNA/delivery/profile.md",
    };
  }

  let discovery: DnaConfig["discovery"];
  if (d.discovery !== undefined) {
    const disc = expectObject(d.discovery, "discovery");
    if (!disc.success) return disc;
    const lifecycleStage =
      disc.data.lifecycleStage === undefined
        ? ok("ideation" as const)
        : expectEnum(disc.data.lifecycleStage, DISCOVERY_LIFECYCLE_STAGES, "discovery.lifecycleStage");
    if (!lifecycleStage.success) return lifecycleStage;
    const teamModel =
      disc.data.teamModel === undefined
        ? ok("none" as const)
        : expectEnum(disc.data.teamModel, DISCOVERY_TEAM_MODELS, "discovery.teamModel");
    if (!teamModel.success) return teamModel;
    const activeProcesses =
      disc.data.activeProcesses === undefined
        ? ok(["continuous-discovery"] as (typeof DISCOVERY_PROCESSES)[number][])
        : parseEnumArray(disc.data.activeProcesses, DISCOVERY_PROCESSES, "discovery.activeProcesses");
    if (!activeProcesses.success) return activeProcesses;
    const activeMethods =
      disc.data.activeMethods === undefined
        ? ok([] as (typeof DISCOVERY_METHODS)[number][])
        : parseEnumArray(disc.data.activeMethods, DISCOVERY_METHODS, "discovery.activeMethods");
    if (!activeMethods.success) return activeMethods;
    const activeEvents =
      disc.data.activeEvents === undefined
        ? ok([] as (typeof DISCOVERY_EVENTS)[number][])
        : parseEnumArray(disc.data.activeEvents, DISCOVERY_EVENTS, "discovery.activeEvents");
    if (!activeEvents.success) return activeEvents;
    discovery = {
      lifecycleStage: lifecycleStage.data,
      teamModel: teamModel.data,
      activeProcesses: activeProcesses.data,
      activeMethods: activeMethods.data,
      activeEvents: activeEvents.data,
      customProfile: optionalString(disc.data.customProfile) ?? ".DNA/discovery/profile.md",
    };
  }

  let industry: DnaConfig["industry"];
  if (d.industry !== undefined) {
    const ind = expectObject(d.industry, "industry");
    if (!ind.success) return ind;
    const active =
      ind.data.active === undefined || ind.data.active === null
        ? ok(undefined)
        : expectEnum(ind.data.active, INDUSTRY_SECTORS, "industry.active");
    if (!active.success) return active;
    const secondary =
      ind.data.secondary === undefined
        ? ok([] as (typeof INDUSTRY_SECTORS)[number][])
        : parseEnumArray(ind.data.secondary, INDUSTRY_SECTORS, "industry.secondary");
    if (!secondary.success) return secondary;
    industry = {
      active: active.data,
      secondary: secondary.data,
      clientName: optionalString(ind.data.clientName),
    };
  }

  let lab: DnaConfig["lab"];
  if (d.lab !== undefined) {
    const labObj = expectObject(d.lab, "lab");
    if (!labObj.success) return labObj;
    lab = {
      enabled: withDefault(optionalBoolean(labObj.data.enabled), true),
      path: withDefault(optionalString(labObj.data.path), "/labs"),
      requireAuthInProduction: withDefault(optionalBoolean(labObj.data.requireAuthInProduction), true),
      openLocalWithoutAuth: withDefault(optionalBoolean(labObj.data.openLocalWithoutAuth), true),
    };
  }

  let feedback: DnaConfig["feedback"];
  if (d.feedback !== undefined) {
    const fb = expectObject(d.feedback, "feedback");
    if (!fb.success) return fb;
    const autoReport = fb.data.autoReport === undefined
      ? ok("dna-only" as const)
      : expectEnum(fb.data.autoReport, FEEDBACK_AUTO_MODES, "feedback.autoReport");
    if (!autoReport.success) return autoReport;
    feedback = {
      enabled: withDefault(optionalBoolean(fb.data.enabled), true),
      upstream: withDefault(optionalBoolean(fb.data.upstream), true),
      autoReport: autoReport.data,
      includeSuggestedFix: withDefault(optionalBoolean(fb.data.includeSuggestedFix), true),
      endpoint: optionalString(fb.data.endpoint),
    };
  }

  return ok({
    version: withDefault(optionalString(d.version), "0.1.0"),
    projectId: projectId.data,
    projectName: projectName.data,
    description: optionalString(d.description),
    createdAt: createdAt.data,
    updatedAt: updatedAt.data,
    stack: stack.data,
    compliance: compliance.data,
    stage: stage.data,
    aiTools: aiTools.data,
    autoUpdate: withDefault(optionalBoolean(d.autoUpdate), true),
    channel: (() => {
      if (d.channel === undefined) return "stable" as const;
      const parsed = expectEnum(d.channel, ["stable", "beta", "nightly"] as const, "channel");
      return parsed.success ? parsed.data : ("stable" as const);
    })(),
    knowledgePacks: knowledgePacks.data,
    github,
    ai,
    runtime,
    ci,
    featureFactory,
    aiWorkbench,
    delivery,
    discovery,
    industry,
    lab,
    feedback,
    platformFeatures: platformFeatures.data,
  });
}

function parseWizardAnswers(input: unknown): ParseResult<WizardAnswers> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;

  const projectDescription = expectString(d.projectDescription, "projectDescription");
  if (!projectDescription.success) return projectDescription;
  const acceptRecommendation = expectBoolean(d.acceptRecommendation, "acceptRecommendation");
  if (!acceptRecommendation.success) return acceptRecommendation;
  const aiTools = parseEnumArray(d.aiTools, AI_TOOLS, "aiTools");
  if (!aiTools.success) return aiTools;
  const compliance = expectEnum(d.compliance, COMPLIANCE_OPTIONS, "compliance");
  if (!compliance.success) return compliance;
  const stage = expectEnum(d.stage, PROJECT_STAGES, "stage");
  if (!stage.success) return stage;

  const platformFeatures = d.platformFeatures === undefined
    ? ok([] as string[])
    : parseStringArray(d.platformFeatures, "platformFeatures");
  if (!platformFeatures.success) return platformFeatures;

  let customStack: WizardAnswers["customStack"];
  if (d.customStack !== undefined) {
    const cs = expectObject(d.customStack, "customStack");
    if (!cs.success) return cs;
    customStack = {
      frontend: optionalString(cs.data.frontend),
      backend: optionalString(cs.data.backend),
      database: optionalString(cs.data.database),
      platform: optionalString(cs.data.platform),
      hosting: optionalString(cs.data.hosting),
      testing: optionalString(cs.data.testing),
    };
  }

  return ok({
    projectName: optionalString(d.projectName),
    projectDescription: projectDescription.data,
    appPlatform: (() => {
      if (d.appPlatform === undefined) return undefined;
      const parsed = expectEnum(d.appPlatform, ["web", "mobile", "desktop", "cms"] as const, "appPlatform");
      return parsed.success ? parsed.data : undefined;
    })(),
    platformFeatures: platformFeatures.data,
    acceptRecommendation: acceptRecommendation.data,
    customStack,
    aiTools: aiTools.data,
    compliance: compliance.data,
    stage: stage.data,
    installRuntime: withDefault(optionalBoolean(d.installRuntime), true),
    installFeatureFactory: withDefault(optionalBoolean(d.installFeatureFactory), true),
    installCi: withDefault(optionalBoolean(d.installCi), true),
    configureGithub: withDefault(optionalBoolean(d.configureGithub), true),
    configureAi: withDefault(optionalBoolean(d.configureAi), true),
  });
}

function parseImpressionsDrift(input: unknown): ParseResult<ImpressionsDrift> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const score = expectNumber(d.score, "score");
  if (!score.success) return score;
  const level = expectEnum(d.level, ["ok", "warning", "critical"] as const, "level");
  if (!level.success) return level;
  const findingsArr = expectArray(d.findings, "findings");
  if (!findingsArr.success) return findingsArr;
  const findings: ImpressionsDrift["findings"] = [];
  for (let i = 0; i < findingsArr.data.length; i++) {
    const f = expectObject(findingsArr.data[i], `findings[${i}]`);
    if (!f.success) return f;
    const category = expectEnum(f.data.category, ["stack", "docs", "architecture", "staleness"] as const, `findings[${i}].category`);
    if (!category.success) return category;
    const message = expectString(f.data.message, `findings[${i}].message`);
    if (!message.success) return message;
    const weight = expectNumber(f.data.weight, `findings[${i}].weight`);
    if (!weight.success) return weight;
    findings.push({ category: category.data, message: message.data, weight: weight.data });
  }
  const missingDocs = expectNumber(d.missingDocs, "missingDocs");
  if (!missingDocs.success) return missingDocs;
  const stackMismatches = parseStringArray(d.stackMismatches, "stackMismatches");
  if (!stackMismatches.success) return stackMismatches;
  return ok({
    score: score.data,
    level: level.data,
    findings,
    missingDocs: missingDocs.data,
    stackMismatches: stackMismatches.data,
  });
}

function parseScanResult(input: unknown): ParseResult<ScanResult> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const ciCd = d.ciCd === undefined ? ok([] as string[]) : parseStringArray(d.ciCd, "ciCd");
  if (!ciCd.success) return ciCd;
  const envFiles = d.envFiles === undefined ? ok([] as string[]) : parseStringArray(d.envFiles, "envFiles");
  if (!envFiles.success) return envFiles;
  const docs = d.docs === undefined ? ok([] as string[]) : parseStringArray(d.docs, "docs");
  if (!docs.success) return docs;
  const aiRules = d.aiRules === undefined ? ok([] as string[]) : parseStringArray(d.aiRules, "aiRules");
  if (!aiRules.success) return aiRules;
  const securityRisks = d.securityRisks === undefined ? ok([] as string[]) : parseStringArray(d.securityRisks, "securityRisks");
  if (!securityRisks.success) return securityRisks;
  const missingDocs = d.missingDocs === undefined ? ok([] as string[]) : parseStringArray(d.missingDocs, "missingDocs");
  if (!missingDocs.success) return missingDocs;
  const dependencies = d.dependencies === undefined ? ok([] as string[]) : parseStringArray(d.dependencies, "dependencies");
  if (!dependencies.success) return dependencies;
  const scripts = d.scripts === undefined ? ok({} as Record<string, string>) : parseRecord(d.scripts, "scripts");
  if (!scripts.success) return scripts;

  let impressionsDrift: ScanResult["impressionsDrift"];
  if (d.impressionsDrift !== undefined) {
    const drift = parseImpressionsDrift(d.impressionsDrift);
    if (!drift.success) return drift;
    impressionsDrift = drift.data;
  }

  return ok({
    packageManager: optionalString(d.packageManager),
    frontend: optionalString(d.frontend),
    backend: optionalString(d.backend),
    database: optionalString(d.database),
    testFramework: optionalString(d.testFramework),
    ciCd: ciCd.data,
    docker: withDefault(optionalBoolean(d.docker), false),
    envFiles: envFiles.data,
    docs: docs.data,
    aiRules: aiRules.data,
    securityRisks: securityRisks.data,
    missingDocs: missingDocs.data,
    missingTests: withDefault(optionalBoolean(d.missingTests), false),
    dependencies: dependencies.data,
    scripts: scripts.data,
    hasDna: withDefault(optionalBoolean(d.hasDna), false),
    fileCount: withDefault(optionalNumber(d.fileCount), 0),
    hasPackageJson: withDefault(optionalBoolean(d.hasPackageJson), false),
    hasSourceCode: withDefault(optionalBoolean(d.hasSourceCode), false),
    impressionsDrift,
  });
}

function parseNeuralNetworkIntent(input: unknown): ParseResult<NeuralNetworkIntent> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const intent = expectString(d.intent, "intent");
  if (!intent.success) return intent;
  const description = expectString(d.description, "description");
  if (!description.success) return description;
  const requiredKnowledge = parseStringArray(d.requiredKnowledge, "requiredKnowledge");
  if (!requiredKnowledge.success) return requiredKnowledge;
  const requiredBehaviour = parseStringArray(d.requiredBehaviour, "requiredBehaviour");
  if (!requiredBehaviour.success) return requiredBehaviour;
  const cellularMemory = parseStringArray(d.cellularMemory, "cellularMemory");
  if (!cellularMemory.success) return cellularMemory;
  const impressions = parseStringArray(d.impressions, "impressions");
  if (!impressions.success) return impressions;
  const validationChecks = parseStringArray(d.validationChecks, "validationChecks");
  if (!validationChecks.success) return validationChecks;
  return ok({
    intent: intent.data,
    description: description.data,
    requiredKnowledge: requiredKnowledge.data,
    requiredBehaviour: requiredBehaviour.data,
    cellularMemory: cellularMemory.data,
    impressions: impressions.data,
    validationChecks: validationChecks.data,
  });
}

function parseNeuralNetwork(input: unknown): ParseResult<NeuralNetwork> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const version = expectString(d.version, "version");
  if (!version.success) return version;
  const intentsObj = expectObject(d.intents, "intents");
  if (!intentsObj.success) return intentsObj;
  const intents: Record<string, NeuralNetworkIntent> = {};
  for (const [key, val] of Object.entries(intentsObj.data)) {
    const parsed = parseNeuralNetworkIntent(val);
    if (!parsed.success) return fail(`Invalid intent ${key}: ${parsed.error.message}`);
    intents[key] = parsed.data;
  }
  return ok({ version: version.data, intents });
}

function parseKnowledgePack(input: unknown): ParseResult<KnowledgePack> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const id = expectString(d.id, "id");
  if (!id.success) return id;
  const name = expectString(d.name, "name");
  if (!name.success) return name;
  const version = expectString(d.version, "version");
  if (!version.success) return version;
  const description = expectString(d.description, "description");
  if (!description.success) return description;
  const category = expectEnum(
    d.category,
    [
      "languages",
      "frameworks",
      "platforms",
      "disciplines",
      "methodologies",
      "discovery",
      "compliance",
      "legal",
      "industries",
    ] as const,
    "category",
  );
  if (!category.success) return category;
  const channel = d.channel === undefined
    ? ok("stable" as const)
    : expectEnum(d.channel, ["stable", "beta", "nightly"] as const, "channel");
  if (!channel.success) return channel;
  const tags = d.tags === undefined ? ok([] as string[]) : parseStringArray(d.tags, "tags");
  if (!tags.success) return tags;
  const filesArr = expectArray(d.files, "files");
  if (!filesArr.success) return filesArr;
  const files: KnowledgePack["files"] = [];
  for (let i = 0; i < filesArr.data.length; i++) {
    const f = expectObject(filesArr.data[i], `files[${i}]`);
    if (!f.success) return f;
    const path = expectString(f.data.path, `files[${i}].path`);
    if (!path.success) return path;
    files.push({
      path: path.data,
      url: optionalString(f.data.url),
      content: optionalString(f.data.content),
    });
  }
  return ok({
    id: id.data,
    name: name.data,
    version: version.data,
    description: description.data,
    category: category.data,
    channel: channel.data,
    tags: tags.data,
    files,
    minDnaVersion: optionalString(d.minDnaVersion),
    publishedAt: optionalString(d.publishedAt),
  });
}

function parseMarketplaceCatalog(input: unknown): ParseResult<MarketplaceCatalog> {
  const obj = expectObject(input);
  if (!obj.success) return obj;
  const d = obj.data;
  const version = expectString(d.version, "version");
  if (!version.success) return version;
  const channel = expectEnum(d.channel, ["stable", "beta", "nightly"] as const, "channel");
  if (!channel.success) return channel;
  const updatedAt = expectString(d.updatedAt, "updatedAt");
  if (!updatedAt.success) return updatedAt;
  const packsArr = expectArray(d.packs, "packs");
  if (!packsArr.success) return packsArr;
  const packs: KnowledgePack[] = [];
  for (let i = 0; i < packsArr.data.length; i++) {
    const pack = parseKnowledgePack(packsArr.data[i]);
    if (!pack.success) return fail(`Invalid pack[${i}]: ${pack.error.message}`);
    packs.push(pack.data);
  }
  const source = d.source === undefined
    ? undefined
    : expectEnum(d.source, ["remote", "bundled"] as const, "source");
  if (source && !source.success) return source;
  return ok({
    version: version.data,
    channel: channel.data,
    updatedAt: updatedAt.data,
    source: source?.success ? source.data : undefined,
    marketplaceUrl: optionalString(d.marketplaceUrl),
    packs,
  });
}

// --- Exported types ---

export interface DnaConfig {
  version: string;
  projectId: string;
  projectName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  stack: {
    archetype?: string;
    frontend?: string;
    bundler?: string;
    backend?: string;
    database?: string;
    platform?: string;
    hosting?: string;
    testing?: string;
    packageManager?: string;
  };
  compliance: (typeof COMPLIANCE_OPTIONS)[number];
  stage: (typeof PROJECT_STAGES)[number];
  aiTools: (typeof AI_TOOLS)[number][];
  autoUpdate: boolean;
  channel: "stable" | "beta" | "nightly";
  knowledgePacks: string[];
  github?: {
    enabled: boolean;
    owner?: string;
    repo?: string;
    authenticated?: boolean;
  };
  ai?: {
    enabled: boolean;
    provider: (typeof AI_PROVIDERS)[number];
    model?: string;
    endpoint?: string;
    repair?: AiRepairConfig;
  };
  runtime?: {
    enabled: boolean;
    environment?: string;
    storage: "json" | "jsonl";
    watchBackend: boolean;
    watchFrontend: boolean;
  };
  ci?: {
    enabled: boolean;
    strict: boolean;
    coverageThreshold: number;
    perFileCoverage: boolean;
    owasp: boolean;
    pushToPreview: boolean;
    previewProvider: "vercel" | "netlify";
    previewBranch?: string;
  };
  impressions?: {
    driftWarningThreshold?: number;
    driftCriticalThreshold?: number;
  };
  memory?: {
    teamRegistry?: string;
    syncOnPush?: boolean;
  };
  featureFactory?: { enabled: boolean };
  delivery?: {
    methodology: (typeof DELIVERY_METHODOLOGIES)[number];
    companyArchetype: (typeof COMPANY_ARCHETYPES)[number];
    ticketSystem: (typeof TICKET_SYSTEMS)[number];
    docSystem: (typeof DOC_SYSTEMS)[number];
    hierarchy: (typeof WORK_HIERARCHY_LEVELS)[number][];
    ceremonies: string[];
    customProfile?: string;
  };
  industry?: {
    active?: (typeof INDUSTRY_SECTORS)[number];
    secondary?: (typeof INDUSTRY_SECTORS)[number][];
    clientName?: string;
  };
  discovery?: {
    lifecycleStage: (typeof DISCOVERY_LIFECYCLE_STAGES)[number];
    teamModel: (typeof DISCOVERY_TEAM_MODELS)[number];
    activeProcesses: (typeof DISCOVERY_PROCESSES)[number][];
    activeMethods: (typeof DISCOVERY_METHODS)[number][];
    activeEvents: (typeof DISCOVERY_EVENTS)[number][];
    customProfile?: string;
  };
  aiWorkbench?: {
    enabled: boolean;
    lastSyncAt?: string;
    catalogVersion?: number;
    stemSource?: "remote" | "bundled";
  };
  feedback?: {
    enabled: boolean;
    upstream: boolean;
    autoReport: (typeof FEEDBACK_AUTO_MODES)[number];
    includeSuggestedFix: boolean;
    endpoint?: string;
  };
  lab?: {
    enabled: boolean;
    path: string;
    requireAuthInProduction: boolean;
    openLocalWithoutAuth: boolean;
  };
  platformFeatures: string[];
}

export type FeedbackSource = "cli" | "doctor" | "runtime" | "manual";

export interface FeedbackPayload {
  id: string;
  fingerprint: string;
  timestamp: string;
  source: FeedbackSource;
  dnaVersion: string;
  nodeVersion: string;
  platform: string;
  installId: string;
  projectId: string;
  command?: string;
  message: string;
  stack?: string;
  severity: (typeof SEVERITY_LEVELS)[number];
  category: string;
  suggestedFix?: string;
  reproductionNotes?: string;
}

export type DnaConfigInput = Partial<DnaConfig> & Pick<DnaConfig, "projectId" | "projectName" | "createdAt" | "updatedAt">;

export interface WizardAnswers {
  projectName?: string;
  projectDescription: string;
  appPlatform?: "web" | "mobile" | "desktop" | "cms";
  platformFeatures: string[];
  acceptRecommendation: boolean;
  customStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    platform?: string;
    hosting?: string;
    testing?: string;
  };
  aiTools: (typeof AI_TOOLS)[number][];
  compliance: (typeof COMPLIANCE_OPTIONS)[number];
  stage: (typeof PROJECT_STAGES)[number];
  installRuntime: boolean;
  installFeatureFactory: boolean;
  installCi: boolean;
  configureGithub: boolean;
  configureAi: boolean;
}

export type WizardAnswersInput = Partial<WizardAnswers>;

export interface ImpressionsDrift {
  score: number;
  level: "ok" | "warning" | "critical";
  findings: Array<{
    category: "stack" | "docs" | "architecture" | "staleness";
    message: string;
    weight: number;
  }>;
  missingDocs: number;
  stackMismatches: string[];
}

export interface ScanResult {
  packageManager?: string;
  frontend?: string;
  backend?: string;
  database?: string;
  hosting?: string;
  testFramework?: string;
  ciCd: string[];
  docker: boolean;
  envFiles: string[];
  docs: string[];
  aiRules: string[];
  securityRisks: string[];
  missingDocs: string[];
  missingTests: boolean;
  dependencies: string[];
  scripts: Record<string, string>;
  hasDna: boolean;
  fileCount: number;
  hasPackageJson: boolean;
  hasSourceCode: boolean;
  impressionsDrift?: ImpressionsDrift;
}

export interface Recommendation {
  solution: string[];
  stack: DnaConfig["stack"];
  testing: string[];
  security: string[];
  documentation: string[];
  runtime: string[];
  aiDevelopment: string[];
}

export interface NeuralNetworkIntent {
  intent: string;
  description: string;
  requiredKnowledge: string[];
  requiredBehaviour: string[];
  cellularMemory: string[];
  impressions: string[];
  validationChecks: string[];
}

export interface NeuralNetwork {
  version: string;
  intents: Record<string, NeuralNetworkIntent>;
}

export interface RuntimeStackFrame {
  filename?: string;
  function?: string;
  lineno?: number;
  colno?: number;
  inApp?: boolean;
}

export interface RuntimeBreadcrumb {
  timestamp: string;
  category: string;
  message: string;
  level?: "info" | "warning" | "error" | "debug";
  data?: Record<string, unknown>;
}

export interface RuntimeRequestSnapshot {
  url?: string;
  method?: string;
  statusCode?: number;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  bodySnippet?: string;
}

export interface RuntimeEvent {
  id: string;
  timestamp: string;
  type:
    | "uncaught_exception"
    | "unhandled_rejection"
    | "request_error"
    | "slow_request"
    | "repeated_error"
    | "memory_spike"
    | "third_party_response";
  message: string;
  stack?: string;
  frames?: RuntimeStackFrame[];
  breadcrumbs?: RuntimeBreadcrumb[];
  contexts?: Record<string, Record<string, unknown>>;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  request?: RuntimeRequestSnapshot;
  user?: { id?: string; email?: string; username?: string };
  endpoint?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  environment?: string;
  release?: string;
  requestId?: string;
  responseBody?: string;
  upstream?: string;
  provider?: string;
  source?: "server" | "browser" | "ci" | "outbound";
  sampled?: boolean;
  fingerprint?: string;
}

export interface AiRepairConfig {
  enabled: boolean;
  autoPr: boolean;
  requireReview: boolean;
  aggressive?: boolean;
  minRepeatForRepair?: number;
  minRepeatForBlocker?: number;
  forceAgentLoop?: boolean;
  dedupeIssues?: boolean;
  retryOpenRepairs?: boolean;
}

export interface FingerprintRecord {
  fingerprint: string;
  repeatCount: number;
  firstSeen: string;
  lastSeen: string;
  repairAttempts: number;
  repairStatus: "pending" | "attempted" | "failed" | "resolved";
  githubIssueNumber?: number;
  endpoint?: string;
  statusCode?: number;
  message: string;
  category: string;
  isBlocker: boolean;
}

export interface ClassifiedIssue {
  id: string;
  eventId: string;
  severity: (typeof SEVERITY_LEVELS)[number];
  category: (typeof ISSUE_CATEGORIES)[number];
  discipline: string;
  behaviourViolation: boolean;
  repeated: boolean;
  projectRisk: string;
  confidence: number;
  title: string;
  summary: string;
  suspectedCause?: string;
  relevantBehaviour: string[];
  relevantMemory: string[];
  suggestedFix?: string;
  testRecommendation?: string;
  reproductionNotes?: string;
  endpoint?: string;
  stackTraceSummary?: string;
  fingerprint?: string;
  repeatCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  repairAttempts?: number;
  repairStatus?: FingerprintRecord["repairStatus"];
  isBlocker?: boolean;
  githubIssueNumber?: number;
  /** Latest rich event envelope for Lab detail (Sentry-depth). */
  latestEvent?: RuntimeEvent;
}

/** Resolved repair config with all aggressive-loop defaults applied. */
export function resolveRepairConfig(ai?: DnaConfig["ai"]): Required<AiRepairConfig> {
  const repair = ai?.repair;
  return {
    enabled: ai?.enabled !== false && repair?.enabled !== false,
    autoPr: repair?.autoPr !== false,
    requireReview: repair?.requireReview !== false,
    aggressive: repair?.aggressive !== false,
    minRepeatForRepair: repair?.minRepeatForRepair ?? 3,
    minRepeatForBlocker: repair?.minRepeatForBlocker ?? 5,
    forceAgentLoop: repair?.forceAgentLoop !== false,
    dedupeIssues: repair?.dedupeIssues !== false,
    retryOpenRepairs: repair?.retryOpenRepairs !== false,
  };
}

export interface GitHubIssuePayload {
  title: string;
  body: string;
  labels: string[];
}

export interface AiRepairPlan {
  diagnosis: string;
  confidence: number;
  proposedChanges: Array<{
    file: string;
    description: string;
    patch?: string;
    search?: string;
    replace?: string;
  }>;
  branchName: string;
  prTitle: string;
  prBody: string;
  testPlan: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    code: string;
    message: string;
    severity: "error" | "warning" | "info";
  }>;
}

export interface KnowledgePack {
  id: string;
  name: string;
  version: string;
  description: string;
  category:
    | "languages"
    | "frameworks"
    | "platforms"
    | "disciplines"
    | "methodologies"
    | "discovery"
    | "compliance"
    | "legal"
    | "industries";
  channel: "stable" | "beta" | "nightly";
  tags: string[];
  files: Array<{ path: string; url?: string; content?: string }>;
  minDnaVersion?: string;
  publishedAt?: string;
}

export interface MarketplaceCatalog {
  version: string;
  channel: "stable" | "beta" | "nightly";
  updatedAt: string;
  source?: "remote" | "bundled";
  marketplaceUrl?: string;
  packs: KnowledgePack[];
}

export interface MarketplaceUpdateResult {
  cliVersion: string;
  channel: string;
  catalogSource: "remote" | "bundled";
  installed: string[];
  updatesAvailable: Array<{
    id: string;
    installedVersion?: string;
    latestVersion: string;
  }>;
  newPacks: string[];
  /** Packs re-installed / content-refreshed by `dna update` (empty when check-only). */
  refreshed?: string[];
  /** Foundation packs newly ensured during update. */
  foundationInstalled?: string[];
  /** Packs that failed to refresh. */
  failed?: Array<{ packId: string; error: string }>;
  /** When true, updates were applied (not just reported). */
  applied?: boolean;
}

export interface CliUpgradeCheckResult {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  skipped: boolean;
  skipReason?: string;
  installed: boolean;
  installMode?: "project" | "global";
  message?: string;
}

// --- Schema exports (zod-compatible API) ---

export const DnaConfigSchema = schema(parseDnaConfig);
export const WizardAnswersSchema = schema(parseWizardAnswers);
export const ImpressionsDriftSchema = schema(parseImpressionsDrift);
export const ScanResultSchema = schema(parseScanResult);
export const NeuralNetworkSchema = schema(parseNeuralNetwork);
export const MarketplaceCatalogSchema = schema(parseMarketplaceCatalog);

// Types for schemas that are type-only (no runtime parsing needed yet)
export const RecommendationSchema = schema((input: unknown) => ok(input as Recommendation));
export const NeuralNetworkIntentSchema = schema(parseNeuralNetworkIntent);
export const RuntimeEventSchema = schema((input: unknown) => ok(input as RuntimeEvent));
export const ClassifiedIssueSchema = schema((input: unknown) => ok(input as ClassifiedIssue));
export const GitHubIssuePayloadSchema = schema((input: unknown) => ok(input as GitHubIssuePayload));
export const AiRepairPlanSchema = schema((input: unknown) => ok(input as AiRepairPlan));
export const ValidationResultSchema = schema((input: unknown) => ok(input as ValidationResult));
export const KnowledgePackSchema = schema(parseKnowledgePack);
export const KnowledgePackFileSchema = schema((input: unknown) => ok(input as KnowledgePack["files"][number]));
export const MarketplaceUpdateResultSchema = schema((input: unknown) => ok(input as MarketplaceUpdateResult));
