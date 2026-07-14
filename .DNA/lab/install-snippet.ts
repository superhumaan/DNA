// DNA Lab — production observability at /labs
// Auto-wired by dna init, dna doctor, dna update, and dna lab install:
//   • Express ESM / Fastify: createLabMiddleware on your API server
//   • Express CJS: .DNA/lab/express-wire.cjs (dynamic import — lab is ESM-only)
//   • Vite dev: proxy /labs + /api/dna/labs to the same target as /api
//   • Vercel: rewrites /labs → API origin before SPA fallback
// import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

// Express ESM (mount after helmet / configureExpress, before SPA fallback):
// app.use(createLabMiddleware({ root: process.cwd() }));

// Express CJS — never require("@superhumaan/dna-by-humaan/lab"):
// const { dnaLabMiddleware } = require("../.DNA/lab/express-wire.cjs");
// app.use(dnaLabMiddleware());

// Local dev: http://localhost:<vite-port>/labs — proxied to API (no login)
// Standalone: npx dna lab serve --port 3200
// Production: https://your-app.com/labs — pair with npx dna register lab
