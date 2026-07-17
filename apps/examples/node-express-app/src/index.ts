import express from "express";
import { dnaRuntime } from "@superhumaan/dna-by-humaan/runtime";

const PORT = process.env.PORT ?? 3456;

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

dnaRuntime.start({
  projectId: "node-express-example",
  projectRoot,
  environment: process.env.NODE_ENV ?? "development",
  release: process.env.GIT_SHA,
  github: { enabled: false },
  aiRepair: { enabled: false },
  onIssue: (issue) => {
    console.error("[DNA]", issue.severity, issue.title);
  },
});

const app = express();
app.use(
  createLabMiddleware({
    root: process.cwd(),
    // Only the lab.* fields are read by the middleware; cast the partial shape.
    config: {
      projectId: "dna-by-humaan",
      lab: { enabled: true, path: "/labs", requireAuthInProduction: true, openLocalWithoutAuth: true },
    } as Parameters<typeof createLabMiddleware>[0]["config"],
  }),
);
app.use(express.json());
app.use(dnaRuntime.express());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", dna: true });
});

app.get("/api/users", (_req, res) => {
  res.json([{ id: 1, name: "Alice" }]);
});

app.get("/api/error", () => {
  throw new Error("Intentional error for DNA runtime demo");
});

app.use(dnaRuntime.errorHandler());

app.listen(PORT, () => {
  console.log(`Express example running on http://localhost:${PORT}`);
  console.log("Try: curl http://localhost:3456/api/error");
});
