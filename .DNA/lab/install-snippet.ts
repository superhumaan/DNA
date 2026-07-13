// DNA Lab — production observability at /labs
import { createLabMiddleware } from "@superhumaan/dna-by-humaan/lab";

// Express (mount after body parser, before routes):
// app.use(createLabMiddleware({ root: process.cwd() }));

// Local: http://localhost:PORT/labs — no login
// Production: https://your-app.com/labs — sign in after npx dna register lab
