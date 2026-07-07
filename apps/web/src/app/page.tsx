import Link from "next/link";

const FEATURES = [
  {
    title: "Project intelligence",
    body: "Structured `.DNA/` context — behaviour rules, neural routing, and CellularMemory your AI tools actually read.",
  },
  {
    title: "Knowledge marketplace",
    body: "Curated packs for Next.js, RBAC, GDPR, Humaan production patterns. Install with one CLI command.",
  },
  {
    title: "Stack archetypes",
    body: "Approved system shapes so AI never mixes Next.js + Vite or Ghost + React in the same project.",
  },
  {
    title: "Runtime observer",
    body: "Classify errors with project context, optional GitHub issues, and AI-assisted repair workflows.",
  },
];

const STEPS = [
  { cmd: "git clone https://github.com/superhumaan/DNA.git", label: "Clone the monorepo" },
  { cmd: "pnpm dna:link", label: "Link the CLI" },
  { cmd: "dna init -y", label: "Initialize your project" },
  { cmd: "dna context cursor", label: "Feed your AI tool" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-dna-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74, 222, 154, 0.25), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-dna-accent">
            Open source · TypeScript
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1]">
            Git remembers your code.{" "}
            <span className="text-gradient">DNA remembers your system.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-dna-muted leading-relaxed">
            DNA by Humaan is a project brain, knowledge marketplace, and AI behaviour layer for modern
            teams. Sentry tells you what broke — DNA tells you why, remembers it, and helps fix it.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/marketplace"
              className="inline-flex items-center rounded-xl bg-dna-accent px-6 py-3 text-base font-semibold text-dna-bg hover:bg-emerald-300 transition-colors shadow-lg shadow-dna-glow"
            >
              Explore marketplace
            </Link>
            <a
              href="https://github.com/superhumaan/DNA"
              className="inline-flex items-center rounded-xl border border-dna-border bg-dna-surface px-6 py-3 text-base font-medium text-dna-text hover:border-dna-muted transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-12">What DNA is</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-dna-border bg-dna-surface/50 p-6 hover:border-dna-accent/30 transition-colors"
            >
              <h3 className="font-display text-lg font-semibold text-dna-text mb-2">{f.title}</h3>
              <p className="text-dna-muted text-sm leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-dna-border bg-dna-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Quick start</h2>
          <p className="text-dna-muted mb-10 max-w-xl">
            Initialize DNA in any TypeScript project. Knowledge packs install automatically for your
            stack archetype.
          </p>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={step.cmd}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-dna-border bg-dna-bg p-4"
              >
                <span className="text-xs font-mono text-dna-accent w-6">{String(i + 1).padStart(2, "0")}</span>
                <code className="flex-1 font-mono text-sm text-dna-text break-all">{step.cmd}</code>
                <span className="text-xs text-dna-muted sm:w-40">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Knowledge packs</h2>
        <p className="text-dna-muted max-w-lg mx-auto mb-8">
          Framework patterns, compliance checklists, and Humaan production guidance — installed into{" "}
          <code className="text-dna-accent text-sm">.DNA/knowledge/</code>
        </p>
        <Link
          href="/marketplace"
          className="inline-flex rounded-xl border border-dna-accent/50 px-6 py-3 text-dna-accent hover:bg-dna-accent/10 transition-colors font-medium"
        >
          dna.humaan.app/marketplace →
        </Link>
      </section>
    </>
  );
}
